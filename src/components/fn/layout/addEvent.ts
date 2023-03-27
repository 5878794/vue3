// 拖动事件处理
import Decorator from '../decoratorClass';

const drtParam = {
  time: 0
};

class LayoutAddEvent {
  private readonly id: string;
  private readonly setting: any;
  private readonly layout: HTMLElement;
  private readonly body: HTMLElement;
  private mouseDownFn: any;
  private mouseMoveFn: any;
  private mouseEndFn: any;
  private mouseLeaveFn: any;
  private clickOk: boolean;
  private readonly objs: any;
  private slotId: any;
  private effectObjs: any;
  private effectDOms: any;
  private startPoint: number[];
  private layoutWidth: number;
  private layoutHeight: number;
  private readonly defaultMinWidth: string;
  private readonly defaultMinHeight: string;
  private readonly emit: any;
  private readonly lineBgColor: string; // 滑条未hover颜色
  private readonly lineHoverBgColor: string;
  private lineObj: any; // 滑条dom
  private catchOjbs: string; // 全屏前的备份数据
  private isFullScreen: boolean;

  constructor(param: any) {
    this.emit = param.emit;
    this.id = param.id;
    this.setting = param.props.setting;
    this.lineBgColor = param.scaleLineColor;
    this.lineHoverBgColor = param.scaleLineHoverColor;
    this.layout = document.getElementById(this.id)!;
    this.body = document.body;
    this.clickOk = false;
    this.layoutWidth = 0;
    this.layoutHeight = 0;
    this.defaultMinWidth = param.defaultMinWidth + 'px'; // 容器最小宽高
    this.defaultMinHeight = param.defaultMinHeight + 'px';
    this.catchOjbs = '';
    this.isFullScreen = false;

    this.objs = this.handlerData(); // 根据id获取容器属性  由setting转换

    this.startPoint = [];
    this.addEvent();
  }

  // 获取容器宽高
  private getLayoutSize() {
    return {
      width: this.layout.offsetWidth,
      height: this.layout.offsetHeight
    }
  }

  // 获取最小值 px会转换成百分比
  private getObjMinSize(objWidth: any, objHeight: any) {
    objWidth = objWidth || this.defaultMinWidth;
    objHeight = objHeight || this.defaultMinHeight;
    const {width, height} = this.getLayoutSize();
    let minWidth, minHeight;

    // 判断传入的是否是%单位  不是按px处理
    if (objWidth.substr(objWidth.length - 1) !== '%') {
      minWidth = parseFloat(objWidth) / width;
    } else {
      minWidth = parseFloat(objWidth) / 100;
    }

    if (objHeight.substr(objHeight.length - 1) !== '%') {
      minHeight = parseFloat(objHeight) / height;
    } else {
      minHeight = parseFloat(objHeight) / 100;
    }

    return {minWidth, minHeight};
  }

  // 数据处理方便获取对象
  private handlerData() {
    const backData: any = {};
    const slotObj: any = {};

    const fn = (list: any, id: string, dir: string) => {
      const childrenIds: string[] = [];
      list.map((rs: any) => {
        childrenIds.push(rs.id);
      })
      list.map((rs: any) => {
        backData[rs.id] = rs;
        backData[rs.id].parentId = id;
        backData[rs.id].effectIds = childrenIds;
        backData[rs.id].parentDir = dir;
        backData[rs.id].width = parseFloat(rs.width) / 100;
        backData[rs.id].height = parseFloat(rs.height) / 100;
        const {minWidth, minHeight} = this.getObjMinSize(rs.minWidth, rs.minHeight);
        backData[rs.id].minHeight = minHeight;
        backData[rs.id].minWidth = minWidth;

        const n = childrenIds.indexOf(rs.id) - 1;
        const temp = JSON.parse(JSON.stringify(childrenIds));
        backData[rs.id].handerIds = temp.splice(n, 2);

        if (rs.slotName) {
          slotObj[rs.slotName] = rs.id;
        }

        if (rs.children && rs.children.length > 0) {
          fn(rs.children, rs.id, rs.dir);
        }
      })
    }

    const setting = JSON.parse(JSON.stringify(this.setting));
    fn(setting.children, 'root', setting.dir);

    this.slotId = slotObj;

    return backData;
  }

  private addEvent() {
    this.layout.addEventListener('mousedown', this.mouseDownFn = (e: MouseEvent) => {
      this.mouseDown(e)
    }, false)
    this.layout.addEventListener('mouseleave', this.mouseLeaveFn = (e: MouseEvent) => {
      this.mouseEnd(e)
    }, false)
    this.body.addEventListener('mousemove', this.mouseMoveFn = (e: MouseEvent) => {
      this.mouseMove(e)
    }, false)
    this.body.addEventListener('mouseup', this.mouseEndFn = (e: MouseEvent) => {
      this.mouseEnd(e)
    }, false)
  }

  private getPoint(e: MouseEvent) {
    return [e.pageX, e.pageY];
  }

  private mouseDown(e: MouseEvent) {
    // e.preventDefault();
    e.stopPropagation();
    const target: EventTarget = e.target!;
    const className = (target as HTMLElement).className || '';
    let id = (target as HTMLElement).id;

    id = id.replace('__layout__', '');
    if (typeof className === 'string' && className.indexOf('__drag_div__') > -1) {
      // 设置滑条背景色为hover颜色
      this.lineObj = document.getElementById(id);
      this.lineObj.style.setProperty('--bg', this.lineHoverBgColor);

      this.clickOk = true;
      this.mouseDownHandler(e, id);
    }
  }

  private mouseDownHandler(e: MouseEvent, id: string) {
    // 容器增加 鼠标hover效果
    const cursor = (this.objs[id].parentDir === 'col') ? 'e-resize' : 'n-resize';
    this.layout.style.cursor = cursor;

    this.effectObjs = this.objs[id];

    // 获取当前容器宽高
    const {width, height} = this.getLayoutSize();
    this.layoutWidth = width;
    this.layoutHeight = height;

    // 获取受影响的dom
    this.effectDOms = {};
    this.effectObjs.effectIds.map((rs: any) => {
      this.effectDOms[rs] = document.getElementById(rs)
    })
    // 保存点
    this.startPoint = this.getPoint(e);
  }

  private mouseMove(e: MouseEvent) {
    if (!this.clickOk) {
      return;
    }
    const [x, y] = this.getPoint(e);
    const dir = this.effectObjs.parentDir;
    if (dir === 'row') {
      // 只移动height
      let move = y - this.startPoint[1];
      // 计算移动的距离相比容器的百分比
      move = move / this.layoutHeight
      const moveIds = this.getNeedHandlerDom(move, 'height');
      if (!moveIds || moveIds.length !== 2) {
        return;
      }
      this.mouseMoveHandler(move, moveIds, 'height');
      this.startPoint = [x, y];
      this.refreshMoveParam('height');
    } else {
      // 只移动width
      let move = x - this.startPoint[0];
      // 计算移动的距离相比容器的百分比
      move = move / this.layoutWidth;
      const moveIds = this.getNeedHandlerDom(move, 'width');
      if (!moveIds || moveIds.length !== 2) {
        return;
      }
      this.mouseMoveHandler(move, moveIds, 'width');
      this.startPoint = [x, y];
      this.refreshMoveParam('width');
    }
  }

  // 获取要处理的dom
  private getNeedHandlerDom(move: number, type: string) {
    const minSize = (type === 'width') ? 'minWidth' : 'minHeight';
    // 获取需要处理的dom
    const thisId = this.effectObjs.id;
    const allIds = JSON.parse(JSON.stringify(this.effectObjs.effectIds));
    const n = allIds.indexOf(thisId) + 1;

    let ids;
    if (move <= 0) {
      // 向上 向左 取前面的
      ids = allIds.splice(0, n);
    } else {
      // 向下 取后面的
      ids = allIds.splice(n - 2);
      if (ids.length === 1) {
        // 后面没有 补一个前面的
        ids.unshift(allIds[allIds.length - 1])
      }
    }

    const newIds = [];
    //  添加当前的id

    if (move <= 0) {
      newIds.push(thisId);
      // 获取该id之前的元素
      ids = ids.splice(0, ids.length - 1);
      ids.reverse();
    } else {
      newIds.push(ids[0])
      // 删除第一个
      ids.shift();
    }

    const idsLength = ids.length;
    for (let i = 0, l = idsLength; i < l; i++) {
      // 不能移动就停止搜索
      if (!this.objs[ids[i]].scale) {
        break;
      }
      const _domId = ids[i];
      const _dom = this.effectDOms[_domId];
      // 判断当前dom+移动后的 是否小于等于 他的最小高度
      const _size = parseFloat(_dom.style[type]) / 100;
      const _minSize = this.objs[_domId][minSize];
      if (_size.toFixed(3) > _minSize.toFixed(3)) {
        newIds.push(_domId);
        break;
      }
    }

    // 没有找到 添加ids 第一个
    if (newIds.length === 1) {
      newIds.push(ids[0])
    }

    // 数组反向
    if (move <= 0) {
      newIds.reverse();
    }

    return newIds;
  }

  // 处理 row 的子元素的拖动
  private mouseMoveHandler(move: number, moveIds: string[], type: string) {
    const minSize = (type === 'width') ? 'minWidth' : 'minHeight';
    const handlerObjs = this.effectDOms;
    const obj1 = this.objs[moveIds[0]];
    const obj2 = this.objs[moveIds[1]];
    const obj1Dom = handlerObjs[moveIds[0]];
    const obj2Dom = handlerObjs[moveIds[1]];
    const obj1Size = parseFloat(obj1Dom.style[type]) / 100;
    const obj2Size = parseFloat(obj2Dom.style[type]) / 100;
    const total = obj1Size + obj2Size;

    let nowSize1 = obj1[type] + move;
    let nowSize2 = obj2[type] - move;

    if (move < 0) {
      // 向上

      // 由于使用的百分比 小数取3位判断是否相等及赋值最小值
      if (nowSize1.toFixed(3) === obj1[minSize].toFixed(3)) {
        nowSize1 = obj1[minSize];
      }
      nowSize1 = (nowSize1 <= obj1[minSize]) ? obj1[minSize] : nowSize1;
      nowSize2 = total - nowSize1;
    } else {
      // 向下
      if (nowSize2.toFixed(3) === obj2[minSize].toFixed(3)) {
        nowSize2 = obj2[minSize];
      }
      nowSize2 = (nowSize2 <= obj2[minSize]) ? obj2[minSize] : nowSize2;
      nowSize1 = total - nowSize2;
    }

    obj1Dom.style[type] = nowSize1 * 100 + '%';
    obj2Dom.style[type] = nowSize2 * 100 + '%';
  }

  private mouseEnd(e: MouseEvent) {
    if (!this.clickOk) {
      return;
    }
    this.clickOk = false;
    this.emitFn1();
    this.layout.style.cursor = 'default';
    this.lineObj.style.setProperty('--bg', this.lineBgColor);
  }

  // 保存移动值
  private refreshMoveParam(type: string) {
    const moveDom = this.effectObjs.effectIds;
    moveDom.map((id: string) => {
      this.objs[id][type] = parseFloat(this.effectDOms[id].style[type]) / 100;
    })

    this.emitFn();
  }

  // 移动过程中节流触发
  // @Decorator.throttle(drtParam)
  private emitFn() {
    this.emitFn1();
  }

  // 立即执行的
  private emitFn1() {
    this.emit(this.getLayout());
  }

  // 获取元素相对页面位置
  private getElementOffset(dom: HTMLElement) {
    let left: number = dom.offsetLeft;
    let top: number = dom.offsetTop;
    const width = dom.offsetWidth;
    const height = dom.offsetHeight;
    let parentDom: any = dom.offsetParent;
    while (parentDom !== null) {
      top += parentDom.offsetTop;
      left += parentDom.offsetLeft;
      parentDom = parentDom.offsetParent;
    }

    return {width, height, left, top}
  }

  /**
   * @description 获取当前布局
   * @returns {[key: string]: {left:number, top:number, height:number, width:number}}
   */
  getLayout() {
    const backData: any = {};
    for (const [id, rs] of Object.entries(this.objs)) {
      const dom: HTMLElement = document.getElementById(id)!;
      const slotName = (rs as any).slotName;
      const key = slotName || id;
      backData[key] = this.getElementOffset(dom);
    }
    return backData
  }

  // 滑动关闭一个容器到最小值
  async hideSlot(slotName: string) {
    const id = this.slotId[slotName];
    const otherId = this.hideGetOtherSlot(id, slotName);

    if (!otherId) {
      return;
    }
    const type = (this.objs[id].parentDir === 'col') ? 'width' : 'height';
    // 缓存关闭前的窗口大小
    const oldType = (this.objs[id].parentDir === 'col') ? 'oldWidth' : 'oldHeight';
    this.objs[id][oldType] = this.objs[id][type];

    await this.hideAnimateRun(id, otherId);

    let fn: any;
    this.effectDOms[id].addEventListener('transitionend', fn = () => {
      this.refreshMoveParam(type);
      this.removeAnimateClass(this.effectDOms[id]);
      this.removeAnimateClass(this.effectDOms[otherId]);
      this.effectDOms[id].removeEventListener('transitionend', fn, false);
    }, false)
  }

  // 滑动打开关闭的容器到之前的状态
  async showSlot(slotName: string) {
    const id = this.slotId[slotName];
    const otherId = this.showGetOtherSlot(id, slotName) || [];
    const type = (this.objs[id].parentDir === 'col') ? 'width' : 'height';
    if (otherId.length === 0) {
      return;
    }

    const finalId = this.getShowFinalRs(id, otherId);
    await this.AnimateRun(finalId);

    let fn: any;
    this.effectDOms[id].addEventListener('transitionend', fn = () => {
      this.refreshMoveParam(type);
      finalId.map((rs: any) => {
        this.removeAnimateClass(this.effectDOms[rs.id]);
      })
      this.effectDOms[id].removeEventListener('transitionend', fn, false);
    }, false)
  }

  // 在组件内全屏一个窗口
  async fullComponent(slotName: string) {
    // if (this.catchOjbs) {
    //   // 已存在缓存数据 说明还是全屏状态
    //   return;
    // }

    if (this.isFullScreen) {
      return;
    }
    this.isFullScreen = true;

    const id = this.slotId[slotName];
    if (!id) {
      console.warn('slot名未找到！');
      return;
    }

    // 备份
    this.catchOjbs = JSON.parse(JSON.stringify(this.objs));

    // 所有窗口设置最小化
    const backData: any = {};
    for (const [_id, val] of Object.entries(this.objs)) {
      backData[_id] = {
        id: _id,
        width: 0,
        height: 0
      }
    }

    // 设置全屏的
    backData[id].width = 1;
    backData[id].height = 1;
    // 设置父级窗口
    let parentDomId: any = this.objs[id].parentId;
    while (parentDomId !== null && parentDomId !== 'root') {
      backData[parentDomId].width = 1;
      backData[parentDomId].height = 1;
      parentDomId = this.objs[parentDomId].parentId;
    }

    const backData1 = [];
    for (const [key, val] of Object.entries(backData)) {
      backData1.push(val);
    }

    await this.runObjsSetting(backData, backData1, id);

    // 屏蔽拖动条
    const items: any = document.getElementsByClassName('__drag_div__  ');
    for (let i = 0, l = items.length; i < l; i++) {
      items[i].style.display = 'none';
    }
  }

  // 全屏返回
  async fullComponentBack() {
    if (!this.isFullScreen) {
      return;
    }
    this.isFullScreen = false;

    // 还原设置
    const backData: any = {};
    for (const [_id, val] of Object.entries(this.catchOjbs)) {
      backData[_id] = {
        id: _id,
        width: (val as any).width,
        height: (val as any).height
      }
    }

    const backData1: any = [];
    for (const [key, val] of Object.entries(backData)) {
      backData1.push(val);
    }

    await this.runObjsSetting(backData, backData1, backData1[0].id);

    // 显示拖动条
    const items: any = document.getElementsByClassName('__drag_div__  ');
    for (let i = 0, l = items.length; i < l; i++) {
      items[i].style.display = 'block';
    }
  }

  // 运行objs的配置
  private async runObjsSetting(backData: any, backData1: any, id: string) {
    await this.AnimateRun(backData1);

    let fn: any;
    const tempDom = document.getElementById(id);

    let isRun = false;
    const callback = () => {
      for (const [_id, rs] of Object.entries(this.objs)) {
        (rs as any).width = backData[_id].width;
        (rs as any).height = backData[_id].height;
        this.removeAnimateClass(document.getElementById(_id)!)
      }
      tempDom!.removeEventListener('transitionend', fn, false);
      this.emitFn();
    }

    tempDom!.addEventListener('transitionend', fn = () => {
      if (!isRun) {
        callback();
        isRun = true;
      }
    }, false)
    // 修复 transitionend 有时候不触发的情况
    setTimeout(() => {
      if (!isRun) {
        callback();
        isRun = true;
      }
    }, 400)
  }

  // 滑动关闭时查找另一个需要放大slot的id
  private hideGetOtherSlot(id: string, slotName: string) {
    // 判断有无这个slot
    if (!id) {
      console.warn('未找到要最小化的id');
      return;
    }

    // 判断是否能最小化这个slot
    const obj = this.objs[id];
    if (!obj.scale) {
      console.warn(`slot名为${slotName}设置是不能改变大小！`);
      return;
    }

    // 获取另一个需要放大的slot
    const effectIds = obj.effectIds;
    const n = effectIds.indexOf(id);
    const type = (obj.parentDir === 'col') ? 'width' : 'height';
    let otherId = '';
    // 先向后查找
    for (let i = n + 1, l = effectIds.length; i < l; i++) {
      const nowObj = this.objs[effectIds[i]];
      if (nowObj.scale && nowObj[type] !== 0) {
        otherId = effectIds[i];
        break;
      }
    }
    // 未找到向前查找
    if (!otherId) {
      for (let i = n - 1; i >= 0; i--) {
        const nowObj = this.objs[effectIds[i]];
        if (nowObj.scale && nowObj[type] !== 0) {
          otherId = effectIds[i];
          break;
        }
      }
    }
    // 未找到
    if (!otherId) {
      console.warn('没有找到能放大的slot,取消最小化！');
      return;
    }

    this.effectObjs = obj;
    this.effectDOms = {};
    this.effectObjs.effectIds.map((rs: any) => {
      this.effectDOms[rs] = document.getElementById(rs)
    })

    return otherId;
  }

  // 滑动打开时查找多个需要放大slot的id
  private showGetOtherSlot(id: string, slotName: string) {
    // 判断有无这个slot
    if (!id) {
      console.warn('未找到要最大化的id');
      return;
    }

    // 判断是否能最小化这个slot
    const obj = this.objs[id];
    if (!obj.scale) {
      console.warn(`slot名为${slotName}设置是不能改变大小！`);
      return;
    }

    // 判断当前窗口是否是最小化状态
    const type = (obj.parentDir === 'col') ? 'width' : 'height';
    const minType = (obj.parentDir === 'col') ? 'minWidth' : 'minHeight';
    if (obj[type].toFixed(4) !== obj[minType].toFixed(4)) {
      console.warn(`slot名为${slotName} 不是最小化状态！`);
      return;
    }

    // 获取其它可以缩小的slot
    const effectIds = obj.effectIds;
    const n = effectIds.indexOf(id);
    const otherId: string[] = [];
    // 先向后查找
    for (let i = n + 1, l = effectIds.length; i < l; i++) {
      const nowObj = this.objs[effectIds[i]];
      if (nowObj.scale && nowObj[type] > nowObj[minType]) {
        otherId.push(effectIds[i]);
      }
    }
    // 向前查找
    for (let i = n - 1; i >= 0; i--) {
      const nowObj = this.objs[effectIds[i]];
      if (nowObj.scale && nowObj[type] > nowObj[minType]) {
        otherId.push(effectIds[i]);
      }
    }

    // 未找到
    if (otherId.length === 0) {
      console.warn('没有找到能缩小的slot,取消最大化！');
      return;
    }

    this.effectObjs = obj;
    this.effectDOms = {};
    this.effectObjs.effectIds.map((rs: any) => {
      this.effectDOms[rs] = document.getElementById(rs)
    })

    return otherId;
  }

  // 获取打开时需要变动的id及最终大小
  private getShowFinalRs(id: string, otherIds: string[]) {
    const obj = this.objs[id];
    const type = (obj.parentDir === 'col') ? 'width' : 'height';
    const minType = (obj.parentDir === 'col') ? 'minWidth' : 'minHeight';
    const oldType = (obj.parentDir === 'col') ? 'oldWidth' : 'oldHeight';
    let needSize = obj[oldType] || obj[minType] + 0.1;
    needSize = needSize - obj[minType];
    const backData = [];

    // 添加放大元素
    const nowData: any = {};
    nowData.id = id;
    nowData[type] = obj[oldType] || obj[minType] + 0.1;
    backData.push(nowData);

    // 处理其它元素
    for (let i = 0, l = otherIds.length; i < l; i++) {
      const thisObj = this.objs[otherIds[i]];
      // 能缩小的最大值
      const canMin = thisObj[type] - thisObj[minType];
      if (canMin > 0) {
        if (canMin >= needSize) {
          const temp: any = {};
          temp.id = otherIds[i];
          temp[type] = thisObj[type] - needSize;
          backData.push(temp);
          break;
        } else {
          const temp: any = {};
          temp.id = otherIds[i];
          temp[type] = thisObj[type] - canMin;
          backData.push(temp);
          needSize -= canMin;
        }
      }
    }

    return backData;
  }

  // 滑动关闭动画执行
  private hideAnimateRun(hideId: string, scaleId: string) {
    const hideDom: any = this.effectDOms[hideId];
    const scaleDom: any = this.effectDOms[scaleId];
    const type = (this.objs[hideId].parentDir === 'col') ? 'width' : 'height';
    const minType = (this.objs[hideId].parentDir === 'col') ? 'minWidth' : 'minHeight';
    hideDom.className += ' __animate__';
    scaleDom.className += ' __animate__';
    const thisType = (this.objs[scaleId][type] + this.objs[hideId][type] - this.objs[hideId][minType]) * 100;
    const hideType = this.objs[hideId][minType] * 100;
    return new Promise(resolve => {
      setTimeout(() => {
        hideDom.style[type] = hideType + '%';
        scaleDom.style[type] = thisType + '%';
        resolve(1);
      }, 0)
    })
  }

  // 动画到指定的参数
  private AnimateRun(objs: any) {
    // 添加class
    objs.map((rs: any) => {
      const dom = document.getElementById(rs.id)!;
      dom.className += ' __animate__';
    })

    return new Promise(resolve => {
      setTimeout(() => {
        objs.map((rs: any) => {
          const type = (this.objs[rs.id].parentDir === 'col') ? 'width' : 'height';
          const nowType = rs[type] * 100;
          const dom = document.getElementById(rs.id)!;
          dom.style[type] = nowType + '%';
        })
        resolve(1)
      }, 0)
    })
  }

  // 移除animate class
  private removeAnimateClass(dom: HTMLElement) {
    let className: any = dom.className;
    if (!className) {
      return;
    }
    className = className.split(' ');
    const backData: string[] = [];
    className.map((rs: string) => {
      if (rs !== '__animate__') {
        backData.push(rs);
      }
    })
    dom.className = backData.join(' ');
  }

  destroy() {
    this.layout.removeEventListener('mousedown', this.mouseDownFn, false);
    this.layout.removeEventListener('mouseleave', this.mouseLeaveFn, false)
    this.body.removeEventListener('mousemove', this.mouseMoveFn, false);
    this.body.removeEventListener('mouseup', this.mouseEndFn, false);
  }
}

export default function (param: any) {
  drtParam.time = param.callBackInterval;
  return new LayoutAddEvent(param);
}
