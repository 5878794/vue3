import guid from "@/components/fn/guid";

interface sendOptType{
  runType:string,
  fnName:string,
  data:string,
  resolve?:(data:any)=>void | null,
  reject?:(data:any)=>void | null,
  callback?:(data:any)=>void | null,
  isTest?:boolean,
  getIframeOffset?:boolean
}
interface CatchType{
  [key:string]:any
}
interface sendDataType{
  type: string,
  runType: string,
  id: string,
  fnName: string,
  data: string
}
interface backDataType{
  type: string,
  fnName: string,
  id: string,
  data: string
}

const getDomOffset = (dom:HTMLElement) => {
  let left:number = dom.offsetLeft;
  let top:number = dom.offsetTop;
  const width = dom.offsetWidth;
  const height = dom.offsetHeight;
  let parentDom:any = dom.offsetParent;
  while (parentDom !== null) {
    top += parentDom.offsetTop;
    left += parentDom.offsetLeft;
    parentDom = parentDom.offsetParent;
  }

  return { width, height, x: left, y: top }
}
const catchData:CatchType = {};

const iframePostMessage = {
  hasInit: false,
  init() {
    if (this.hasInit) { return; }
    this.hasInit = true;
    window.addEventListener('message', async (e:any) => {
      const rs = e.data;

      if (rs.type === 'ZXTD_iframe_send') {
        // 主窗口接收到请求
        await this.parentHandlerMessage(rs);
      } else if (rs.type === 'ZXTD_iframe_back') {
        // iframe接收到回执
        this.iframeHandlerData(rs);
      }
    }, false)
  },
  // iframe 发送
  postMessageToTop(opt:sendOptType) {
    const id = this.catchAndSaveSendOpt(opt);
    const data = this.createSendOpt(id, opt);

    window.parent.postMessage(data, '*');
  },
  // iframe 缓存发送数据
  catchAndSaveSendOpt(opt:sendOptType) {
    const id = guid();
    const data = {
      runType: opt.runType,
      id: id,
      fnName: opt.fnName,
      data: opt.data,
      isTest: opt.isTest,
      resolve: opt.resolve,
      reject: opt.resolve,
      callback: opt.callback,
      getIframeOffset: opt.getIframeOffset
    }
    catchData[id] = data;

    return id;
  },
  // iframe 生成发送到父窗口的数据
  createSendOpt(id:string, opt:sendOptType) {
    return {
      type: 'ZXTD_iframe_send',
      runType: opt.runType,
      id: id,
      fnName: opt.fnName,
      data: opt.data
    }
  },
  // 主窗口收到数据
  async parentHandlerMessage(rs:sendDataType) {
    const { runType, id, fnName, data } = rs;

    if (runType === 'run') {
      const runFn = this.parentGetRunFn(fnName, runType);
      if (runFn) {
        const backData = await runFn(data);
        this.parentPostMessageToIframe(id, JSON.stringify(backData), fnName);
      }
    } else if (runType === 'callback') {
      const runFn = this.parentGetRunFn(fnName, runType);
      if (runFn) {
        runFn(data, (data:any) => {
          this.parentPostMessageToIframe(id, JSON.stringify(data), fnName);
        })
      }
    } else if (runType === 'test') {
      const runFn = this.parentGetRunFn(fnName, runType);
      this.parentPostMessageToIframe(id, JSON.stringify(!!(runFn)), fnName);
    } else if (runType === 'offset') {
      this.parentBackOffset(id)
    }
  },
  // 主窗口获取运行的函数
  parentGetRunFn(fnName:string, runType:string) {
    // 处理fnName含有.的情况  运行的是对象下的方法
    const fnNames = fnName.split('.');
    let isFind = true;
    let runObj:any = window;
    for (let i = 0, l = fnNames.length; i < l; i++) {
      const thisName = fnNames[i];
      runObj = runObj[thisName];
      if (!runObj) {
        isFind = false;
        if (runType !== 'test') {
          console.warn('iframe 调用主窗口函数：' + fnName + ' 不存在！！！');
        }
        break;
      }
    }

    return (isFind) ? runObj : null;
  },
  // 主窗口发信息到iframe
  parentPostMessageToIframe(id:string, data:string, fnName:string) {
    const iframe:any = document.getElementsByTagName('iframe');
    for (let i = 0, l = iframe.length; i < l; i++) {
      const content = iframe[i].contentWindow;
      const backData = {
        type: 'ZXTD_iframe_back',
        fnName: fnName,
        id: id,
        data: data
      }
      content.postMessage(backData, '*');
    }
  },
  // 主窗口返回iframe的offset
  parentBackOffset(id:string) {
    const iframe:any = document.getElementsByTagName('iframe');
    for (let i = 0, l = iframe.length; i < l; i++) {
      const content = iframe[i].contentWindow;
      const data = JSON.stringify(getDomOffset(iframe[i]));
      const backData = {
        type: 'ZXTD_iframe_back',
        fnName: '',
        id: id,
        data: data
      }
      content.postMessage(backData, '*');
    }
  },
  // iframe处理回执
  iframeHandlerData(rs:backDataType) {
    const { id, data } = rs;
    const catchRs = catchData[id];
    if (!catchRs) { return; }

    const backData = (data) ? JSON.parse(data) : data;

    if (catchRs.runType === 'run') {
      catchRs.resolve(backData);
      delete catchData[id]
    } else if (catchRs.runType === 'callback') {
      catchRs.callback(backData);
    } else if (catchRs.runType === 'test') {
      catchRs.resolve(backData);
      delete catchData[id]
    } else if (catchRs.runType === 'offset') {
      catchRs.resolve(backData);
      delete catchData[id]
    }
  }
};
iframePostMessage.init();

// 调用的函数只能有1个参数
export const runParent = (fnName:string, data:any) => {
  return new Promise((resolve, reject) => {
    iframePostMessage.postMessageToTop({
      runType: 'run',
      fnName,
      data: JSON.parse(JSON.stringify(data)),
      resolve,
      reject
    })
  })
}

// 调用的函数参数必须是  (data,callback)
export const runParentCallBack = (fnName:string, data:any, callback:(data:any)=>void) => {
  iframePostMessage.postMessageToTop({
    runType: 'callback',
    fnName,
    data: JSON.parse(JSON.stringify(data)),
    callback
  });
}

// 测试父级是否有这个函数
export const runParentTest = (fnName:string) => {
  return new Promise((resolve, reject) => {
    iframePostMessage.postMessageToTop({
      runType: 'test',
      fnName,
      data: '',
      resolve,
      reject
    })
  })
}

// 获取父级iframe位置
export const getIframeOffset = () => {
  return new Promise((resolve, reject) => {
    iframePostMessage.postMessageToTop({
      runType: 'offset',
      fnName: '',
      data: '',
      resolve,
      reject
    })
  })
}
