import defineClassComponent from '../../fn/defineClassComponent'
import guid from '../../fn/guid'
import boxStyle from '../css/box.module.scss';
import styles from '../css/css.module.scss';
import {inject, onMounted, ref, nextTick, onUpdated} from "vue";

const temp = [
  {name: '密码', desc: 'password', type: 'password', id: 222, w: 1, h: 1, icon: ''},
  {name: '文本', desc: 'input', type: 'text', id: 1, w: 2, h: 1, icon: ''},
  {name: '密码', desc: 'password', type: 'password', id: 2, w: 2, h: 1, icon: ''},
  {name: '选择', desc: 'select', type: 'select', id: 3, w: 2, h: 1, icon: ''},
  {name: '密码', desc: 'password', type: 'password', id: 2222, w: 2, h: 1, icon: ''},
  {
    name: '组', desc: 'group', type: 'group', id: 4, w: 3, h: 1, column: 1, icon: '', children: [
      {name: '文本', desc: 'input', type: 'text', id: 5, w: 1, h: 1, icon: ''},
      {
        name: '组', desc: 'group', type: 'group', id: 6, w: 1, h: 1, column: 1, icon: '', children: [
          {name: '文本', desc: 'input', type: 'text', id: 7, w: 1, h: 1, icon: ''},
          {name: '密码', desc: 'password', type: 'password', id: 8, w: 1, h: 1, icon: ''},
        ]
      },
      {name: '密码', desc: 'password', type: 'password', id: 9, w: 1, h: 1, icon: ''},
      {name: '密码', desc: 'password', type: 'password', id: 10, w: 1, h: 1, icon: ''},
      {name: '密码', desc: 'password', type: 'password', id: 11, w: 1, h: 1, icon: ''},
      {name: '密码', desc: 'password', type: 'password', id: 12, w: 1, h: 1, icon: ''},
      {name: '密码', desc: 'password', type: 'password', id: 13, w: 1, h: 1, icon: ''},
      {name: '密码', desc: 'password', type: 'password', id: 14, w: 1, h: 1, icon: ''},
      {name: '密码', desc: 'password', type: 'password', id: 15, w: 1, h: 1, icon: ''},
      {name: '密码', desc: 'password', type: 'password', id: 16, w: 1, h: 1, icon: ''},
      {name: '密码', desc: 'password', type: 'password', id: 17, w: 1, h: 1, icon: ''},
      {name: '密码', desc: 'password', type: 'password', id: 18, w: 1, h: 1, icon: ''},
    ]
  },
];

//TODO 删除

class Main {
  props: any;
  opt: any;
  root: any;
  topDom: any; //顶部dom
  propDom: any; //样式dom
  tempMoved: any; //移动时dom存放的位置
  dom: any;  //当前组件dom
  columnNumber = ref(4); //列数
  rowHeight = ref(40); //行高
  tempDom: any; //拖拽进入时的临时dom
  mouseTarget: any; //当前鼠标指向的target
  data: any = ref([]); //数据
  isMoveType: boolean = false;  //是否是移动
  movedDom: any;  //移动的dom缓存
  refreshTemp: any = ref(1);
  tempDomW: number = 1;
  tempDomH: number = 1;
  chooseItemId: any = null;

  constructor(props: any, opt: any) {
    this.props = props;
    this.opt = opt;
    // this.data = ref(temp);

    const root = inject('root') as any;
    this.root = root.proxy;


    // let bodyClickFn: any;
    onMounted(() => {
      this.propDom = this.root.$refs.propDom;
      this.topDom = this.root.$refs.topDom;
      this.dom = this.root.$refs.mainDom;
      this.tempMoved = this.root.$refs.tempMoved;
      this.createTempDom();
    })

    onUpdated(() => {
      if (!this.chooseItemId) {
        return
      }
      const dom = document.getElementById(this.chooseItemId);
      this.setChooseItemBg(dom)
    })
  }

  static setComponent() {
    return {}
  }

  setColumn(col: number) {
    this.columnNumber.value = col;
  }

  refresh() {
    this.refreshTemp.value++;
  }

  createTempDom() {
    this.tempDom = document.createElement('div');
    this.tempDom.style.background = '#ccc';
    this.tempDom.style.display = 'none';
    this.tempDom.dataset.type = 'tempDom';
    this.tempDom.id = '__tempDom__'
    this.dom.$el.appendChild(this.tempDom);
  }

  dragOver(e: DragEvent) {
    e.preventDefault();
    const target = this.findTargetDom(e);
    if (!target) {
      return;
    }
    if (this.mouseTarget === target) {
      return;
    }

    this.mouseTarget = target;

    const type = target.dataset.type;
    if (type === 'tempDom') {
      return;
    }

    this.tempDom.style.display = 'block';
    const parentW = this.getDomParentColumn(target);
    const nowW = (parentW < this.tempDomW) ? parentW : this.tempDomW;
    this.tempDom.style.gridColumn = 'span ' + nowW;
    this.tempDom.style.gridRow = 'span ' + this.tempDomH;


    //目标是group的容器
    if (type === 'main') {
      this.dom.$el.appendChild(this.tempDom);
      return;
    }

    if (type === 'groupBody') {
      target.appendChild(this.tempDom);
      return;
    }
    //目标是单个的元素或group的title
    if (type === 'item' || type === 'group') {
      if (this.findDomLevelPreviousHasTempDom(target)) {
        if (target.nextElementSibling) {
          target.parentElement.insertBefore(this.tempDom, target.nextElementSibling)
        } else {
          target.parentElement?.appendChild(this.tempDom);
        }
      } else {
        target.parentElement.insertBefore(this.tempDom, target)
      }
    }
  }

  //拖动开始时设置tempDom的grid属性
  setTempDomGridStyle(w: string, h: string) {
    this.tempDomW = parseInt(w);
    this.tempDomH = parseInt(h);
    this.tempDom.style.gridColumn = 'span ' + this.tempDomW;
    this.tempDom.style.gridRow = 'span ' + this.tempDomH;
  }

  //获取target的父级的column
  getDomParentColumn(dom: any) {
    //获取target的父级的column
    let find: any;

    if (dom.dataset.type === 'main') {
      return this.columnNumber.value;
    }

    const loopFn = (dom: any) => {
      if (!dom) {
        return
      }
      const type = dom.dataset.type;
      if (type === 'group' || type === 'main') {
        find = dom;
      } else {
        loopFn(dom.parentElement)
      }
    }
    loopFn(dom.parentElement);

    if (!find) {
      return 1;
    }

    if (find.dataset.type === 'group') {
      let data = find.dataset.data;
      data = JSON.parse(data);
      return data.column || 1;
    } else {
      return this.columnNumber.value;
    }
  }

  //查找同层之前的元素是否有插入的临时dom
  findDomLevelPreviousHasTempDom(target: any) {
    let find = false;
    const loopFn = (target: any) => {
      if (!target) {
        return;
      }
      if (target === this.tempDom) {
        find = true;
      } else {
        loopFn(target.previousElementSibling)
      }
    }
    loopFn(target.previousElementSibling);
    return find;
  }

  dragEnter(e: DragEvent) {
  }

  dragLevel(e: DragEvent) {
  }

  dropFn(e: DragEvent) {
    const data: string = e.dataTransfer!.getData("text/plain");
    const {id, type} = this.findTempDomPlace();
    this.tempDom.style.display = 'none';
    if (this.isMoveType) {
      this.handlerDataItem(id, type, data, true);
    } else {
      this.handlerDataItem(id, type, data, false)
    }
  }

  //创建唯一id
  createXmlTempId() {
    return guid();
  }

  //通过id获取数据中的位置
  getInfoFromDataById(id: string, type?: string) {
    const data = this.data.value;
    const find: any = {};
    let isFind = false;

    const loopFn = (data: any, w: number) => {
      for (let i = 0, l = data.length; i < l; i++) {
        if (isFind) {
          break;
        }
        if (data[i].id.toString() === id.toString()) {
          find.data = data[i];
          find.n = i;
          find.parent = data;
          find.parentColumn = (type === 'after') ? w : (data[i].children) ? data[i].column : w;
          isFind = true;
          break;
        } else {
          if (data[i].children && data[i].children.length > 0) {
            loopFn(data[i].children, data[i].column);
          }
        }
      }
    }
    loopFn(data, this.columnNumber.value);

    return find;
  }

  //新增的数据处理
  handlerDataItem(id: string, type: string, data: any, isMove: boolean) {
    data = JSON.parse(data);
    if (!isMove) {
      //生成新的id
      data.id = this.createXmlTempId();
    } else {
      //删除之前移动的数据
      const moveId = data.id;
      const moveObj = this.getInfoFromDataById(moveId);
      moveObj.parent.splice(moveObj.n, 1);
    }

    const nowId = data.id;
    const choose = () => {
      nextTick(() => {
        const dom = document.getElementById(nowId);
        this.setChooseItemBg(dom);
      })
    }


    if (id === '__xml_create_main__') {
      this.handlerObjWidth(data, this.columnNumber.value);
      this.data.value.unshift(data)
      choose();
      return;
    }
    if (type === 'first') {
      const obj = this.getInfoFromDataById(id, type);
      this.handlerObjWidth(data, obj.parentColumn);
      obj.data.children.unshift(data);
      choose();
      return;
    }
    if (type === 'after') {
      const obj = this.getInfoFromDataById(id, type);
      this.handlerObjWidth(data, obj.parentColumn);
      obj.parent.splice(obj.n + 1, 0, data);
      choose();
      return;
    }
  }

  //判断宽度大于父级的column，则设置成column的值
  handlerObjWidth(data: any, column: number) {
    if (data.w > column) {
      data.w = column;
    }
  }

  //获取tempDom的位置
  findTempDomPlace() {
    let preDom = this.tempDom.previousElementSibling;
    if (!preDom) {
      preDom = this.tempDom.parentElement;
    }

    const find = {
      id: '',
      type: ''
    };

    const loopFn = (dom: any, inGroup?: boolean) => {
      if (dom.dataset && dom.dataset.type) {
        const type = dom.dataset.type;
        if (type === 'item') {
          find.id = dom.getAttribute('id');
          find.type = 'after';
        } else if (type === 'groupBody') {
          loopFn(dom.parentElement, true)
        } else if (type === 'main') {
          find.id = dom.getAttribute('id');
          find.type = 'first';
        } else if (type === 'group') {
          if (inGroup) {
            find.id = dom.getAttribute('id');
            find.type = 'first';
          } else {
            find.id = dom.getAttribute('id');
            find.type = 'after';
          }
        }
      } else {
        loopFn(dom.parentElement, inGroup)
      }
    }

    loopFn(preDom);

    return find;
  }

  createList(list: any) {
    return list.map((rs: any) => {
      if (rs.type === 'group' || rs.type === 'repeat') {
        return this.createGroup(rs);
      } else {
        return this.createInput(rs);
      }
    })
  }

  createGroup(rs: any) {
    const w = `grid-column:span ${rs.w};`;
    const h = `grid-row:span ${rs.h};`;
    const row = `grid-auto-rows:${this.rowHeight.value}px;`;
    const column = `grid-template-columns:1fr`;
    const wBody = `grid-column:span 1;`;
    const hBody = `grid-row:span ${rs.h - 1};`;
    const columnBody = `grid-template-columns:${'1fr '.repeat(rs.column)};`;
    const padding = 'padding:0 20px;';

    return <div
      class={['group_body', 'group_html']}
      style={[w, h, column, row, padding]}
      data-type='group'
      id={rs.id}
      key={this.createXmlTempId()}
      draggable={true}
      data-data={JSON.stringify(rs)}
      onDragstart={((e: DragEvent) => this.dragStart(e)) as any}
      onDrag={((e: DragEvent) => this.drag(e)) as any}
      onDragend={((e: DragEvent) => this.dragEnd(e)) as any}
    >
      {rs.name && <div class={['group_title', boxStyle.box_hlc]}>{rs.name}</div>}
      <div
        class='group_body group_main'
        style={[wBody, hBody, columnBody, row]}
        data-type='groupBody'
      >
        {this.createList(rs.children)}
      </div>
    </div>
  }

  createInput(rs: any) {
    const fn = (rs: any) => {
      const type = rs.type;
      switch (type) {
        case 'text': {
          return <div class={[boxStyle.boxflex1, 'input_body']}>{rs.type}</div>;
        }
        case 'password': {
          return <div class={[boxStyle.boxflex1, 'input_body']}>{rs.type}</div>;
        }
        case 'select': {
          return <div class={[boxStyle.boxflex1, 'input_body']}>{rs.type}</div>;
        }
        case 'color': {
          return <div class={[boxStyle.boxflex1, 'input_body']}>{rs.type}</div>;
        }
        case 'radio': {
          return <div class={[boxStyle.boxflex1, 'input_body']}>{rs.type}</div>;
        }
        case 'file': {
          return <div class={[boxStyle.boxflex1, 'input_body']}>{rs.type}</div>;
        }
        case 'image': {
          return <div class={[boxStyle.boxflex1, 'input_body']}>{rs.type}</div>;
        }
        case 'date': {
          return <div class={[boxStyle.boxflex1, 'input_body']}>{rs.type}</div>;
        }
        case 'time': {
          return <div class={[boxStyle.boxflex1, 'input_body']}>{rs.type}</div>;
        }
        case 'dateTime': {
          return <div class={[boxStyle.boxflex1, 'input_body']}>{rs.type}</div>;
        }
        default:
          console.log('未找到' + type + '!!!');
      }
    };

    const w = `grid-column:span ${rs.w};`;
    const h = `grid-row:span ${rs.h};`;

    return <div
      class={[boxStyle.box_hlc, 'input_item']}
      style={[w, h]}
      data-type='item'
      id={rs.id}
      key={this.createXmlTempId()}
      draggable={true}
      data-data={JSON.stringify(rs)}
      onDragstart={((e: DragEvent) => this.dragStart(e)) as any}
      onDrag={((e: DragEvent) => this.drag(e)) as any}
      onDragend={((e: DragEvent) => this.dragEnd(e)) as any}
    >
      <div class={['input_label']}>{rs.name}</div>
      {fn(rs)}
    </div>
  }

  computeGroupHeight(list: any) {
    const temp: any = [];

    const loopFn = (list: any) => {
      list.map((rs: any) => {
        if (rs.children && rs.children.length > 0) {
          loopFn(rs.children);
          computerFn(rs, rs.name);
        }
      })
    }

    const computerFn = (data: any, title: any) => {
      const body = document.createElement('div');
      body.style.display = 'grid';
      body.style.gridTemplateColumns = '1fr '.repeat(data.column);
      body.style.gridAutoRows = '20px';
      body.style.gridAutoFlow = 'row';
      body.style.position = 'fixed';
      body.style.left = '-1000000px';
      body.style.top = '0px';

      data.children.map((rs: any) => {
        const div = document.createElement('div');
        div.style.gridColumn = 'span ' + rs.w;
        div.style.gridRow = 'span ' + rs.h;
        body.appendChild(div);
      })

      document.body.appendChild(body);
      temp.push(body);
      const height = body.getBoundingClientRect().height;
      const h = height / 20;
      if (title) { //+2为title和 底部padding
        data.h = h + 2;
      } else {
        data.h = h + 1;
      }
    }
    loopFn(list)

    temp.map((dom: any) => {
      document.body.removeChild(dom);
    })
  }

  findTargetDom(e: MouseEvent) {
    const target = e.target as HTMLElement;
    let find: any = '';
    const fn = (dom: any) => {
      if (document.body === dom) {
        return ''
      }

      const data = dom.dataset;
      if (!data.type) {
        const parent = dom.parentElement;
        fn(parent);
      } else {
        find = dom;
      }
    }
    fn(target);

    return find;
  }

  //item再次被拖动================
  dragStart(e: DragEvent) {
    const target = e.target as HTMLElement;
    const data = target.dataset.data as string;
    e.dataTransfer!.setData('text/plain', data);

    this.mouseTarget = target;
    target.parentElement!.insertBefore(this.tempDom, target);
    const w = target.style.gridColumn.split(' ')[1];
    const h = target.style.gridRow.split(' ')[1];
    this.setTempDomGridStyle(w, h);
  }

  drag(e: DragEvent) {
    if (!this.isMoveType) {
      this.isMoveType = true;

      const target = this.tempDom.nextElementSibling;
      this.tempDom.style.display = 'block';

      target.style.position = 'fixed';
      target.style.left = '-99999px';
      target.style.top = '-999px';
      this.tempMoved.appendChild(target);
    }
  }

  //新建和移动的 dragEnd事件
  dragEnd(e: DragEvent) {
    const state = e.dataTransfer!.dropEffect;
    if (state !== 'copy') {
      this.tempDom.style.display = 'none';
    }

    if (this.isMoveType) {
      //还原移除的dom
      this.emptyMovedDom();
      this.refresh();
    }

    this.isMoveType = false;

  }

  //==============================

  //清空临时的dom
  emptyMovedDom() {
    const items = this.tempMoved.children;
    for (let i = 0, l = items.length; i < l; i++) {
      this.tempMoved.removeChild(items[i])
    }
  }

  //查找元素
  findItem(target: any) {
    let find: any;
    const loopFn = (dom: any) => {
      if (!dom) {
        return
      }
      const classList = (dom.className) ? dom.className.split(' ') : [];
      if (classList.includes('mainDiv') || classList.includes('group_html') || classList.includes('input_item')) {
        find = dom;
      } else {
        loopFn(dom.parentElement)
      }
    }
    loopFn(target);
    return find;
  }

  //设置选中元素背景
  setChooseItemBg(target: any) {
    this.clearAllBg();
    target.style.background = '#f2efff';

    const id = target.id;
    const obj = this.getInfoFromDataById(id);
    this.propDom.setProp(obj.data);
    this.chooseItemId = id;
  }

  //获取jsonData
  getJsonData() {
    const data = this.data.value;
    const newData = JSON.parse(JSON.stringify(data));
    //添加父级元素，并处理key为层级形式
    const fn = (data: any, parent: any) => {
      data.map((rs: any) => {
        rs.parent = parent;

        if (parent) {
          if (parent.type === 'repeat') {
            rs.lv = parent.key + '[row].' + rs.key;
          } else {
            rs.lv = parent.key + '.' + rs.key;
          }
        }


        if (rs.children) {
          fn(rs.children, rs)
        }
      })
    }
    fn(newData, null);
    return newData;
  }

  //清空背景
  clearAllBg() {
    const body = this.dom.$el;
    const group = body.getElementsByClassName('group_html');
    const item = body.getElementsByClassName('input_item');
    const clearBg = (doms: any) => {
      for (let i = 0, l = doms.length; i < l; i++) {
        doms[i].style.background = '';
      }
    }
    body.style.background = '';
    clearBg(group);
    clearBg(item);
  }

  clickFn(e: MouseEvent) {
    // e.stopPropagation();
    const target = this.findItem(e.target);
    this.setChooseItemBg(target)
  }

  render() {
    this.computeGroupHeight(this.data.value);
    const mainStyle = `grid-template-columns:${'1fr '.repeat(this.columnNumber.value)};grid-auto-rows:${this.rowHeight.value}px;padding-bottom:${this.rowHeight.value}px;`;
    return <div class={['mainDiv']}
                ref='dropDom'
                data-type='main'
                id='__xml_create_main__'
                key={'a' + this.refreshTemp.value}
                onDragover={((e: DragEvent) => this.dragOver(e)) as any}
                onDragenter={((e: DragEvent) => this.dragEnter(e)) as any}
                onDragleave={((e: DragEvent) => this.dragLevel(e)) as any}
                onDrop={((e: DragEvent) => this.dropFn(e)) as any}
                onClick={((e: MouseEvent) => this.clickFn(e)) as any}
                style={mainStyle}
    >
      {this.createList(this.data.value)}
    </div>
  }
}


export default defineClassComponent(Main);
