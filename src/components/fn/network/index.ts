import Ajax,{plugin} from './ajax';
import Socket from './socket';
import downloadFn,{downloadUrlObjType} from './ajax/donwloadFile'
import {onBeforeUnmount, getCurrentInstance} from 'vue'
import {apiFunctionType, apiType} from "./ajax/index.type";

const socketForPageObj:any = {};

/**
 * 网络请求层  包含 ajax、c、websocket
 * */
const Network = {
  //TODO socket 发送暂未处理

  /**
   * 获取请求类型
   *
   *  @param {string} command 请求接口的参数   web|  c|
   *  @return {Ajax} 返回Ajax实列
   * */
  request(command:string){
    if(command.indexOf('web|')===0){
      const api = command.replace('web|','');

      const ajaxObj:any = new Ajax({
        api:api
      });

      for(let [fnName,fn] of Object.entries(plugin)){
        ajaxObj[fnName] = fn;
      }

      return ajaxObj;
    }else if(command.indexOf('c|') === 0){

    }else{
      throw 'network 不识别的指令 ：'+ command;
    }
  },


  /**
   * 创建一次性api 对象 （自动request）
   * */
  createApiFunction(apiObj:apiType={}){
    const api:apiFunctionType = {};
    for(let [key,obj] of Object.entries(apiObj)){
      const mode = obj.mode || 'ajax';
      const url = obj.url;
      const type = obj.type;
      if(mode === 'ajax'){
        api[key] = new Ajax({
          method:type,
          url:url
        })
      }
      //TODO c
    }
    return api;
  },

  /**
   * 添加事件监听
   *
   * @param {string} command 请求接口的参数    socket  c|
   * @param {Function} Function 回调函数
   * */
  addEventListener(command:string,fn:Function){
    if(command.indexOf('socket') === 0){
      const uid = getCurrentInstance()?.uid;
      if(uid && !socketForPageObj[uid]){
        socketForPageObj[uid] = new Socket({
          onMessage(rs){
            fn(rs);
          }
        });
      }
      onBeforeUnmount(()=>{
        if(uid && socketForPageObj[uid]){
          socketForPageObj[uid].disconnect();
          delete socketForPageObj[uid];
        }
      })
    }else if(command.indexOf('c|') === 0){

    }else{
      throw 'network 不识别的指令 ：'+ command;
    }
  },


  /**
   * 文件下载
   *
   * @example
   * // filename 不带后缀名
   * Network.downLoadFile([{url:'',name:'filename'}])
   * */
  async downLoadFile(urls:downloadUrlObjType[]){
    await downloadFn(urls);
  }
}


export default {
  Ajax:Ajax,
  Socket:Socket,
  request(command:string){
    return Network.request(command);
  },
  addEventListener(command:string,fn:Function){
    Network.addEventListener(command,fn);
  },
  async downLoadFile(urls:downloadUrlObjType[]){
    await Network.downLoadFile(urls);
  },
  createApiFunction(apiObj:apiType){
    return Network.createApiFunction(apiObj);
  }
}
