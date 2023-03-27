//使用class创建vue组件
/* eslint-disable */
/*
demo:--------------------------------------------------------
import {classDefineComponent} from "@zx-pack/zx-tool";
class A {
  props:any;
  opt:any;
  constructor(props: any, opt: any) {
    this.props = props;
    this.opt= opt;
  }

  //vue设置
  static setComponent() {
    return {
      props: {
        aaa: {type: String, default: '111'}
      },
      emits: [],
      components: {},
      name: ''
    }
  }

  //vue 的render函数 中的事件需要使用函数 否则函数内this无效
  render(){
    return <>
      <div onClick={()=>this.bbb()}>{this.props.aaa}</div>
    </>
  }
}
export default classDefineComponent(A);

demo end-----------------------------------------
*/

const getClassMethods = (obj: any) => {
  let prototypes: any = [];
  const fn = (obj: any) => {
    const pro = Object.getPrototypeOf(obj);
    if (pro) {
      prototypes.unshift(pro)
      fn(pro)
    }
  }
  fn(obj);
  //删除默认的原型
  prototypes = prototypes.splice(1);

  const back: any = {};
  prototypes.map((rs: any) => {
    const keys = Object.getOwnPropertyNames(rs);
    for (let [key, val] of Object.entries(keys)) {
      if (val !== 'constructor') {
        back[val] = true;
      }
    }
  })

  return back;
}

const classForVueExpose = (obj: any) => {
  const keys = getClassMethods(obj);

  const back: any = {...obj};
  // const back: any = {};

  Object.keys(keys).map((key: string) => {
    if (key !== 'render') {
      back[key] = function (...arg: any) {
        return obj[key](...arg)
      }
    }
  })

  return back;
}
import {defineComponent} from "vue";

// export default function (obj: any) {
//   return defineComponent({
//     ...obj.setComponent(),
//     setup(props: any, opt: any) {
//       const a = new obj(props, opt);
//       const b = classForVueExpose(a);
//       opt.expose(b)
//       return a.render();
//     }
//   })
// }

export default function (obj: any) {
  let a: any;

  const props = obj.setComponent ? obj.setComponent() : {};

  return defineComponent({
    ...props,
    setup(props: any, opt: any) {
      a = new obj(props, opt);
      return classForVueExpose(a);
    },
    render() {
      return a.render()
    }
  })
}
