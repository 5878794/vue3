import defineClassComponent from '../../fn/defineClassComponent'
import {inject, onMounted, ref, watch} from "vue";
import boxStyle from '../css/box.module.scss';
import styles from '../css/css.module.scss';
import customRule from "./customRule";

const itemProp = [
  {name: '名称', type: 'text', key: 'name'},
  {name: '宽度', type: 'number', key: 'w'},
  {name: '高度', type: 'number', key: 'h'},
  {name: 'key', type: 'text', key: 'key'},
  {name: '重复by', type: 'select', key: 'repeatKey', useTypes: ['repeat']},
  {name: '单位', type: 'text', key: 'unit', useTypes: ['text', 'select']},
  {name: 'style', type: 'text', key: 'style'},
  {name: '错误提示', type: 'text', key: 'errMsg', notUseTypes: ['group', 'repeat']},
  {name: '单位列表', type: 'units', key: 'unitOption', useTypes: ['text', 'select']},
  {name: '选择列表', type: 'option', key: 'option', useTypes: ['select']},
  {name: '验证规则', type: 'rule', key: 'rule', notUseTypes: ['group', 'repeat']},
  {name: '自定义验证规则', type: 'customRule', key: 'customRule', notUseTypes: ['group', 'repeat']},
];
const rulesSetting = [
  {name: '必填', rule: 'required', hasVal: false},
  {name: '字符串', rule: 'string', hasVal: false},
  {name: '数字', rule: 'number', hasVal: false},
  {name: '整数', rule: 'integer', hasVal: false},
  {name: '大于', rule: 'max', hasVal: true},
  {name: '大于等于', rule: 'maxEqual', hasVal: true},
  {name: '小于', rule: 'min', hasVal: true},
  {name: '小于等于', rule: 'minEqual', hasVal: true},
];

//TODO when

class Prop {
  props: any;
  opt: any;
  root: any;
  mainDom: any;
  topDom: any;
  data: any = ref(null);
  mainColumn: any = ref(null);

  constructor(props: any, opt: any) {
    this.props = props;
    this.opt = opt;

    const root = inject('root') as any;
    this.root = root.proxy;

    onMounted(() => {
      this.mainDom = this.root.$refs.mainDom;
      this.topDom = this.root.$refs.topDom;
      this.mainColumn.value = this.mainDom.columnNumber;
    })

    watch(this.mainColumn, () => {
      this.mainDom.setColumn(this.mainColumn.value)
    })
  }

  static setComponent() {
    return {
      components: {customRule}
    }
  }

  setProp(data: any) {
    //data 响应数据
    if (!data) {
      //主容器
      this.data.value = null;
    } else {
      this.data.value = data;

      //设置repeat元素的dom的背景
      if (data.type === 'repeat') {
        this.setRepeatItemBg(data);
      }
      this.setRelevanceDomBg(data);
    }
  }

  //设置重复依赖的dom 的背景
  setRepeatItemBg(data: any) {
    const repeatId = data.repeatKey;
    //判断是否是repeat
    if (repeatId) {
      const repeatByDom = document.getElementById(repeatId);
      if (repeatByDom) {
        repeatByDom.style.background = '#daeee4';
      }
    }
  }

  //设置关联元素的背景
  setRelevanceDomBg(data: any) {
    const customRule = data.customRule || [];
    customRule.map((rs: any) => {
      if (rs.type === 'item') {
        const id = rs.value;
        const dom = document.getElementById(id);
        if (dom) {
          dom.style.background = '#daeee4';
        }
      }
    })
  }

  showRuleInput(rule: string) {
    return rulesSetting.find((rs: any) => rs.rule === rule)?.hasVal;
  }

  ruleSelectChange(rules: any, e: any, i: number) {
    const rule = e.target.value;
    rules[i].rule = rule;
    const hasVal = this.showRuleInput(rule);
    if (!hasVal) {
      rules[i].value = true;
    } else {
      rules[i].value = '';
    }
  }

  createRule(name: string, rules: any[]) {
    return <div class='prop_item prop_option'>
      <div class={[boxStyle.box_hlc, 'option']}>
        <div class='prop_item_name'>{name}</div>
        <div
          class={[boxStyle.boxflex1, boxStyle.box_hrc, 'option_add']}
          onClick={(() => {
            rules.push({
              rule: 'require',
              value: 'true'
            });
          }) as any}
        >添加
        </div>
      </div>
      <div>
        {
          rules.map((rs: any, i: number) => {
            return <div class={[boxStyle.box_hlc, 'rule_row']}>
              <select class={boxStyle.boxflex1} onChange={((e: any) => this.ruleSelectChange(rules, e, i)) as any}>
                {
                  rulesSetting.map((opt: any) => {
                    return <option value={opt.rule}
                                   selected={(opt.rule === rs.rule) ? true : false}>{opt.name}</option>
                  })
                }
              </select>
              {
                this.showRuleInput(rs.rule) && <input class={boxStyle.boxflex1} type='text' v-model={rs.value}/>
              }
              <div class='option_del' onClick={(() => {
                rules.splice(i, 1);
              }) as any}>-
              </div>
            </div>
          })
        }
      </div>
    </div>
  }

  createOption(name: string, key: string) {
    const data = this.data.value[key] || [];

    return <div class='prop_item prop_option'>
      <div class={[boxStyle.box_hlc, 'option']}>
        <div class='prop_item_name'>{name}</div>
        <div
          class={[boxStyle.boxflex1, boxStyle.box_hrc, 'option_add']}
          onClick={(() => {
            data.push({
              label: '',
              value: ''
            })
          }) as any}
        >添加
        </div>
      </div>
      <div>
        {
          data.map((rs: any, i: number) => {
            return <div class={[boxStyle.box_hlc, 'option_item']}>
              <p class='prop_name'>label:</p>
              <input class={boxStyle.boxflex1} type='text' v-model={rs.label}/>
              <p class='prop_name'>key:</p>
              <input class={boxStyle.boxflex1} type='text' v-model={rs.value}/>
              <div class='option_del' onClick={(() => {
                data.splice(i, 1)
              }) as any}>-
              </div>
            </div>
          })
        }
      </div>
    </div>
  }

  createPropItem(name: string, type: string, key: string, model?: any) {
    return <>
      <div class={['prop_item', boxStyle.box_hlc]}>
        <div class='prop_item_name'>{name}</div>
        <div class={boxStyle.boxflex1}>
          {!key && <input type={type} v-model={model.value}/>}
          {key && <input type={type} v-model={this.data.value[key]}/>}
        </div>
      </div>
    </>
  }

  //根据id获取同级的数据
  getParentChildrenById(id: string) {
    //当前xml的json数据(克隆后的)
    const data = this.mainDom.getJsonData();
    let find = false;
    let backData: any;

    const fn = (data: any) => {
      for (let i = 0, l = data.length; i < l; i++) {
        if (find) {
          break;
        }
        if (data[i].id === id) {
          find = true;
          backData = data[i];
        }
        if (data[i].children) {
          fn(data[i].children)
        }
      }
    }
    fn(data);

    if (!backData) {
      return []
    }

    if (backData.parent) {
      return backData.parent.children;
    } else {
      return data;
    }
  }

  createRepeatKey(name: string, key: string) {
    //当前选中的id
    const id = this.data.value.id;
    const selectedId = this.data.value[key];
    //重复key 取该元素的同级做列表
    const parentChildrenList = this.getParentChildrenById(id);

    //排除自身
    const list = parentChildrenList.filter((item: any) => item.id !== id);

    return <>
      <div class={['prop_item', boxStyle.box_hlc]}>
        <div class='prop_item_name'>{name}</div>
        <div class={boxStyle.boxflex1}>
          <select class={[boxStyle.boxflex1, 'repeatSelect']} onChange={((e: any) => {
            this.data.value[key] = e.target.value;
          }) as any}>
            <option value=''></option>
            {
              list.map((opt: any) => {
                return <option value={opt.id}
                               selected={(opt.id === selectedId) ? true : false}
                >{opt.name}</option>
              })
            }
          </select>
        </div>
      </div>
    </>
  }

  createCustomRule(data: any) {
    return <customRule data={data} key={'a' + new Date().getTime()} id={this.data.value.id}
                       v-model:value={this.data.value.customRule}/>
  }

  renderMain() {
    return this.createPropItem('列数', 'number', '', this.mainColumn);
  }

  renderItem() {
    return itemProp.map((rs: any) => {
      const useType = rs.useTypes;
      const notUseType = rs.notUseTypes;
      const type = this.data.value.type;

      const needRender = () => {
        if (!useType && !notUseType) {
          return true;
        } else if (useType && notUseType) {
          return useType.includes(type) && !notUseType.includes(type);
        } else if (useType) {
          return useType.includes(type);
        } else {
          return !notUseType.includes(type);
        }
      }

      if (needRender()) {
        if (rs.type === 'option') {
          return this.createOption(rs.name, rs.key);
        } else if (rs.type === 'units') {
          return this.createOption(rs.name, rs.key);
        } else if (rs.type === 'rule') {
          const rules = this.data.value[rs.key];
          return this.createRule(rs.name, rules);
        } else if (rs.type === 'select' && rs.key === 'repeatKey') {
          return this.createRepeatKey(rs.name, rs.key);
        } else if (rs.type === 'customRule') {
          return this.createCustomRule(rs)
        } else {
          return this.createPropItem(rs.name, rs.type, rs.key);
        }
      }
    })
  }

  render() {
    return <>
      <div class='title'>属性设置</div>
      {!this.data.value && this.renderMain()}
      {this.data.value && this.renderItem()}
    </>
  }
}


export default defineClassComponent(Prop);
