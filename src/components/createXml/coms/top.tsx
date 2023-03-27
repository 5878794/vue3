import defineClassComponent from '../../fn/defineClassComponent'
import {inject, onMounted} from "vue";
import boxStyle from '../css/box.module.scss';
import styles from '../css/css.module.scss';


const inputs = [
  {name: '文本', type: 'text', w: 1, h: 1, icon: ''},
  {name: '密码', type: 'password', w: 1, h: 1, icon: ''},
  {name: '下拉选择', type: 'select', w: 1, h: 1, icon: ''},
  {name: '颜色', type: 'color', w: 1, h: 1, icon: ''},
  {name: '单选', type: 'radio', w: 1, h: 1, icon: ''},
  {name: '文件', type: 'file', w: 1, h: 1, icon: ''},
  {name: '图片', type: 'image', w: 1, h: 1, icon: ''},
  {name: '日期', type: 'date', w: 1, h: 1, icon: ''},
  {name: '时间', type: 'time', w: 1, h: 1, icon: ''},
  {name: '日期时间', type: 'dateTime', w: 1, h: 1, icon: ''},
  {name: '组', type: 'group', w: 1, h: 2, icon: '', column: 1, children: []},
  {name: '重复', type: 'repeat', w: 1, h: 2, icon: '', repeatKey: '', column: 1, children: []},
]
inputs.map((input: any, i: number) => {
  if (input.type === 'select') {
    input.option = [];
  }
  input.unit = '';
  input.unitOption = [];
  input.rule = [];
  input.customRule = [];
  input.errMsg = '';
  input.style = '';
  input.id = 'a' + i;
  input.key = input.type;
})


class Top {
  props: any;
  opt: any;
  inputs: any[] = inputs;
  root: any;
  mainDom: any;
  propDom: any;

  constructor(props: any, opt: any) {
    this.props = props;
    this.opt = opt;

    const root = inject('root') as any;
    this.root = root.proxy;

    onMounted(() => {
      this.mainDom = this.root.$refs.mainDom;
      this.propDom = this.root.$refs.propDom;
    })
  }

  static setComponent() {
    return {}
  }


  dragStart(e: DragEvent) {
    const target = e.target as HTMLElement;
    const id = target.id;
    const data = this.inputs.find((item: any) => {
      return item.id == id
    })
    e.dataTransfer!.setData('text/plain', JSON.stringify(data));
    this.mainDom.setTempDomGridStyle(data.w, data.h)
  }

  //拖拽过程中
  drag(e: DragEvent) {

  }

  dragEnd(e: DragEvent) {
    this.mainDom.dragEnd(e);
  }

  render() {
    return <div class={[boxStyle.box_hlc]}>
      {this.inputs.map((input: any) => {
        return <p
          id={input.id}
          draggable={true}
          onDragstart={((e: DragEvent) => this.dragStart(e)) as any}
          onDrag={((e: DragEvent) => this.drag(e)) as any}
          onDragend={((e: DragEvent) => this.dragEnd(e)) as any}
        >{input.type}</p>
      })}
    </div>
  }
}


export default defineClassComponent(Top);
