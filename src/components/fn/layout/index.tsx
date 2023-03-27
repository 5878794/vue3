import {
  defineComponent,
  onMounted,
  onUnmounted,
  watch,
  getCurrentInstance,
} from "vue";
import createDom from "./createDom";
import addEvent from "./addEvent";
import guid from '../guid'
import "./css.css";

// setting = {
//   dir: 'col',        // col:竖向排列   row：横向排列
//   children: [
//     {
//       width: 'auto',     // 可以auto 或 百分比
//       minHeight: '20%',  // 可以使用px
//       height: '100%',  // 可以auto 或 百分比
//       scale: true, // 是否能改变区域大小 默认:false
//       slotName: 'a1' //插入slot的名字 没有不会生成插槽
//       children:[...] // 可以无限嵌套
//     }
//   ]
// }

export default defineComponent({
  name: "layout",
  emits: ["resize"],
  props: {
    callBackInterval: { type: Number, default: 300 }, // 回调节流事件 ms
    setting: { type: Object, default: () => ({}), required: true }, // 配置参数 见上面setting注释
    defaultMinWidth: { type: Number, default: 50 }, // 默认最小宽高 单位px
    defaultMinHeight: { type: Number, default: 50 },
    scaleLineColor: { type: String, default: "transparent" }, // 拖动条颜色
    scaleLineHoverColor: { type: String, default: "rgba(0,0,0,.5)" },
    reactionWidth: { type: Number, default: 15 }, // 拖动条宽度
    createRandomBg: { type: Boolean, default: false }, // 随机生成块的背景 初始辅助用
  },
  setup(props: any, context: any) {
    const { ctx }: any = getCurrentInstance();
    const id = "layout_" + guid();
    let addEventObj: any = null;

    // 将数据中的auto转换为实际的百分比
    const handlerUnit = (data: any[], dir: string) => {
      const units: any = [];
      const prop = dir === "row" ? "height" : "width";
      const otherProp = dir === "row" ? "width" : "height";
      let n = 0; // units 中auto个数
      let use = 0; // 已分配的百分比

      data.map((rs: any) => {
        rs.id = "li" + guid();
        const p = rs[prop].toLowerCase();
        units.push(p);
        if (p === "auto") {
          n++;
        } else {
          // 判断是否是百分比
          if (p.substr(p.length - 1) !== "%") {
            console.warn("layout 组件参数中width和height必须是百分比或auto！");
          } else {
            use += parseInt(p);
          }
        }
      });

      // 一个auto 实际所占比例
      const nPer = (100 - use) / n;

      // auto替换成百分比
      data.map((rs: any) => {
        if (rs[prop].toLowerCase() === "auto") {
          rs[prop] = nPer + "%";
        }
        if (
          !rs[otherProp] ||
          (rs[otherProp] && rs[otherProp].toLowerCase() === "auto")
        ) {
          rs[otherProp] = "100%";
        }

        if (rs.children && rs.children.length > 0) {
          handlerUnit(rs.children, rs.dir);
        }
      });
    };
    handlerUnit(props.setting.children, props.setting.dir);

    const emitFn: any = (res: any) => {
      context.emit("resize", res);
    };

    onMounted(() => {
      addEventObj = addEvent({
        props,
        id,
        emit: emitFn,
        callBackInterval: props.callBackInterval,
        defaultMinWidth: props.defaultMinWidth,
        defaultMinHeight: props.defaultMinHeight,
        scaleLineColor: props.scaleLineColor,
        scaleLineHoverColor: props.scaleLineHoverColor,
      });
    });
    onUnmounted(() => {
      addEventObj.destroy();
    });

    watch(
      () => props.setting,
      () => {
        if (addEventObj) {
          addEventObj.destroy();
        }
        handlerUnit(props.setting.children, props.setting.dir);
        addEventObj = addEvent({
          props,
          id,
          emit: emitFn,
          callBackInterval: props.callBackInterval,
          defaultMinWidth: props.defaultMinWidth,
          defaultMinHeight: props.defaultMinHeight,
        });
        ctx.$forceUpdate();
      },
      { deep: true }
    );

    // 关闭一个 slot
    const hideSlot = (slotName: string) => {
      addEventObj.hideSlot(slotName);
    };
    const showSlot = (slotName: string) => {
      addEventObj.showSlot(slotName);
    };

    const fullComponent = (slotName: string) => {
      addEventObj.fullComponent(slotName);
    };
    const fullComponentBack = () => {
      addEventObj.fullComponentBack();
    };

    const getLayout = () => {
      return addEventObj.getLayout();
    }

    return {
      id,
      createDom,
      hideSlot, // 隐藏一个slot
      showSlot, // 隐藏后显示一个slot
      getLayout, // 获取当前布局信息
      fullComponent, // 组件内全屏一个slot
      fullComponentBack, // 全屏返回
    };
  },
  render() {
    const setSlot = (name: string) => {
      name = name || "";
      if (name && this.$slots[name]) {
        return (this.$slots as any)[name]();
      } else {
        return "";
      }
    };
    return (
      <>
        {this.createDom(
          this.setting,
          this.id,
          setSlot,
          this.scaleLineColor,
          this.reactionWidth,
          this.scaleLineHoverColor,
          this.createRandomBg
        )}
        {/* {this.$slots.default} */}
      </>
    );
  },
});
