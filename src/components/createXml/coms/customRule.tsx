import defineClassComponent from '../../fn/defineClassComponent'
import {inject, onMounted, ref} from 'vue';
import boxStyle from '../css/box.module.scss';
import styles from '../css/css.module.scss';

const symbolList = [
  '+', '-', '*', '/', '=', '>', '<', '>=', "<="
];


class CustomRule {
  props: any;
  opt: any;
  data: any;
  value: any;
  dom: any;
  id: string;
  itemKeys: any = ref([]);
  propDom: any;

  constructor(props: any, opt: any) {
    this.props = props;
    this.opt = opt;
    this.data = this.props.data;
    this.value = this.props.value;
    this.dom = ref(null);
    this.id = this.props.id;

    const root = inject('root') as any;
    onMounted(() => {
      this.propDom = root.proxy.$refs.propDom;
      this.itemKeys.value = this.getItemData(this.id);
    })
  }

  static setComponent() {
    return {
      props: {
        data: {
          type: Object, default: () => ({})
        },
        value: {
          type: Object, default: () => ([])
        },
        id: {type: String, default: ''}
      }
    }
  }

  addClick(type: string, text?: string) {
    this.value.push({
      type: type,
      value: text
    })
  }

  delFn(i: number) {
    this.value.splice(i, 1);
  }

  getItemData(id: string) {
    //获取同级的数据
    const data = this.propDom.getParentChildrenById(id);
    //排除自身
    const newData = data.filter((rs: any) => rs.id !== id);

    return newData;
  }

  createList() {
    return this.value.map((rs: any, i: number) => {
      if (rs.type === 'text' || rs.type === 'self') {
        return this.createText(rs, i);
      } else if (rs.type === 'item') {
        return this.createItem(rs, i);
      } else if (rs.type === 'symbol') {
        return this.createSymbol(rs, i);
      } else if (rs.type === 'input') {
        return this.createInput(rs, i);
      }
    })
  }

  createText(data: any, i: number) {
    return <div class='custom_item_body'>
      <div style='line-height:26px;'>{data.value}</div>
      <div class='del' onClick={(() => this.delFn(i)) as any}>x</div>
    </div>
  }

  createSymbol(data: any, i: number) {
    return <div class={['custom_item_body', boxStyle.box_hlc]}>
      <select style='height:24px;' onChange={((e: MouseEvent) => {
        const val = (e.target as any).value;
        this.value[i].value = val;
      }) as any}>
        {
          symbolList.map((rs: any) => {
            return <option value={rs} selected={(rs === data.value) ? true : false}>{rs}</option>
          })
        }
      </select>
      <div class='del' onClick={(() => this.delFn(i)) as any}>x</div>
    </div>
  }

  createInput(data: any, i: number) {
    return <div class={['custom_item_body', boxStyle.box_hlc]}>
      <input style='width:50px;height:24px;' type='text' v-model={data.value}/>
      <div class='del' onClick={(() => this.delFn(i)) as any}>x</div>
    </div>
  }

  createItem(data: any, i: number) {
    const id = data.value;

    return <div class={['custom_item_body', boxStyle.box_hlc]}>
      <select style='height:24px;' onChange={((e: MouseEvent) => {
        const val = (e.target as any).value;
        this.value[i].value = val;
      }) as any}>
        <option value=''></option>
        {
          this.itemKeys.value.map((rs: any) => {
            return <option value={rs.id} selected={(rs.id === id) ? true : false}>{rs.name}</option>
          })
        }
      </select>
      <div class='del' onClick={(() => this.delFn(i)) as any}>x</div>
    </div>
  }

  render() {
    return <div class='prop_item prop_option custom_rule'>
      <div class={[boxStyle.box_hlc, 'option']}>
        <div class='prop_item_name' style='width:140px;text-align:left;padding-left:3px;'>{this.data.name}</div>
      </div>
      <div class={[boxStyle.box_hcc, 'itemP']}>
        <p onClick={(() => this.addClick('self', '自身值')) as any}>自身值</p>
        <p onClick={(() => this.addClick('text', '(')) as any}>(</p>
        <p onClick={(() => this.addClick('text', ')')) as any}>)</p>
        <p onClick={(() => this.addClick('item')) as any}>元素</p>
        <p onClick={(() => this.addClick('symbol')) as any}>运算符</p>
        <p onClick={(() => this.addClick('input')) as any}>输入</p>
      </div>
      <div
        class={['custom_main']}
        ref='dom'
      >
        <div class={[boxStyle.box_hlc, boxStyle.box_lines]}>
          {this.createList()}
        </div>
      </div>
    </div>
  }
}


export default defineClassComponent(CustomRule);
