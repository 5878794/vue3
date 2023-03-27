interface StyleProp {
  width: string | number;
  height: string | number;
}

// import Toolbar from './toolbar';

const createDom = {
  init(
    setting: any,
    id: string,
    setSlot: any,
    scaleLineColor: string,
    reactionWidth: number,
    scaleLineHoverColor: string,
    createRandomBg: boolean
  ) {
    const dir = setting.dir;
    const contextClass = ["zx-layout", dir === "row" ? "box_slt" : "box_hlt"];

    return (
      <div
        id={id}
        class={contextClass}
        style="width:100%;height:100%;overflow:hidden;"
      >
        {this.createList(
          setting.children,
          dir,
          setting.id,
          "",
          setSlot,
          scaleLineColor,
          reactionWidth,
          scaleLineHoverColor,
          createRandomBg
        )}
      </div>
    );
  },
  // 生成列内元素的style
  createItemStyle(prop: StyleProp) {
    const backStyle: any = {
      position: "relative",
    };
    backStyle.width = prop.width;
    backStyle.height = prop.height;
    // backStyle.overflow = 'hidden';

    // backStyle.background = '#ccc';
    // backStyle.borderWidth = '1px';
    // backStyle.borderStyle = 'solid';
    // backStyle.borderColor = '#ccc';
    backStyle.boxSizing = "border-box";

    return backStyle;
  },
  createList(
    list: any[],
    dir: string,
    id: string,
    name: string,
    setSlot: any,
    scaleLineColor: string,
    reactionWidth: number,
    scaleLineHoverColor: string,
    createRandomBg: boolean
  ) {
    if (!list || list.length === 0) {
      return <>{setSlot(name)}</>;
    }
    // console.log({ list });

    return (
      <>
        {list.map((rs: any, i: number) => {
          const contextClass = [
            rs.dir === "col" ? "box_hlt" : "box_slt",
            rs.slotName && `zx-layout__${rs.slotName}`,
          ];
          const style = this.createItemStyle(rs);
          if (createRandomBg && (!rs.children || rs.children.length === 0)) {
            style.background = this.createRandomBg();
          }

          let needScale = false;
          if (i !== 0) {
            // 判断当前和之前的是否有一个 scale 属性是true
            needScale = rs.scale && list[i - 1].scale;
          }
          return (
            <div id={rs.id} style={style} class={contextClass}>
              {/*<Toolbar />*/}
              {this.createScaleDom(
                dir,
                i,
                rs.id,
                needScale,
                scaleLineColor,
                reactionWidth,
                scaleLineHoverColor
              )}
              {this.createList(
                rs.children,
                rs.dir,
                rs.id,
                rs.slotName,
                setSlot,
                scaleLineColor,
                reactionWidth,
                scaleLineHoverColor,
                createRandomBg
              )}
            </div>
          );
        })}
      </>
    );
  },
  // 生成随机背景
  createRandomBg() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    const a = Math.floor(Math.random() * 5) / 10 + 0.5;
    return `rgba(${r},${g},${b},${a})`;
  },
  createScaleDom(
    dir: string,
    number: number,
    id: string,
    needScale: boolean,
    scaleLineColor: string,
    reactionWidth: number,
    scaleLineHoverColor: string
  ) {
    if (number === 0 || !needScale) {
      return "";
    }

    let style =
      dir === "row"
        ? `position:absolute; left:0; top:${
          -reactionWidth / 2
        }px; width:100%; height:${reactionWidth}px;cursor:n-resize;z-index:10;`
        : `position:absolute; left:${
          -reactionWidth / 2
        }px; top:0; width:${reactionWidth}px; height:100%;cursor:e-resize;z-index:10;`;
    style += `--bg:${scaleLineColor};--hoverBg:${scaleLineHoverColor};`;

    let className: any = ["__drag_div__"];
    className.push(dir === "row" ? " __drag_div_row__" : "__drag_div_col__");
    className = className.join(" ");

    return <div class={className} style={style} id={"__layout__" + id}></div>;
  },
};

export default function (
  setting: any,
  id: string,
  setSlot: any,
  scaleLineColor: string,
  reactionWidth: number,
  scaleLineHoverColor: string,
  createRandomBg: boolean
) {
  return createDom.init(
    setting,
    id,
    setSlot,
    scaleLineColor,
    reactionWidth,
    scaleLineHoverColor,
    createRandomBg
  );
}
