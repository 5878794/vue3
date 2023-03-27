import {Ref, ref} from "vue";

type TypeName = 'move' | 'top' | 'left' | 'right' | 'bottom' | 'leftTop' | 'rightTop' | 'leftBottom' | 'rightBottom';

interface mouseDownParamType {
    e: MouseEvent,
    x: Ref<number>,
    y: Ref<number>,
    z?: Ref<number>,
    w?: Ref<number>,
    h?: Ref<number>,
    type?: TypeName,
    cursor?: Ref<string>,
}

interface MouseMoveType {
    x: number,
    y: number,
    w: number,
    h: number,
    z: number,
    cursor: Ref<string> | undefined,
    mouseStartPoint: { x: number, y: number },
    xRef: Ref<number> | undefined,
    yRef: Ref<number> | undefined,
    type: TypeName | undefined,
    wRef: Ref<number> | undefined,
    hRef: Ref<number> | undefined,
    mousedown: (opt: mouseDownParamType) => void,
    moveState: boolean,
    mouseMove: (e: MouseEvent) => void,
    mouseUp: (e: MouseEvent) => void,
    handlerData: (e: MouseEvent) => void
}

window.addEventListener('mousemove', (e) => {
    mouseMove.mouseMove(e);
}, {capture: false, passive: false});
window.addEventListener('mouseup', (e) => {
    mouseMove.mouseUp(e);
}, {capture: false, passive: false})

const mouseMove: MouseMoveType = {
    mouseStartPoint: {x: 0, y: 0},
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    z: 0,
    cursor: undefined,
    xRef: undefined,
    yRef: undefined,
    type: undefined,
    wRef: undefined,
    hRef: undefined,
    moveState: false,
    mousedown(opt) {
        opt.e.preventDefault();
        opt.e.stopPropagation();
        this.moveState = true;
        this.cursor = opt.cursor ? opt.cursor : ref('');
        this.x = opt.x.value;
        this.y = opt.y.value;
        this.w = opt.w ? opt.w.value : 0;
        this.h = opt.h ? opt.h.value : 0;
        this.xRef = opt.x;
        this.yRef = opt.y;
        this.wRef = opt.w || ref(0);
        this.hRef = opt.h || ref(0);
        this.type = (opt.type) ? opt.type : "move";
        this.mouseStartPoint.x = opt.e.screenX;
        this.mouseStartPoint.y = opt.e.screenY;
    },
    mouseMove(e) {
        if (!this.moveState) {
            return;
        }
        this.handlerData(e);

    },
    mouseUp(e) {
        if (!this.moveState) {
            return;
        }
        this.moveState = false;
        this.cursor!.value = 'default';
    },
    handlerData(e) {
        const x = e.screenX;
        const y = e.screenY;
        const mx = x - this.mouseStartPoint.x;
        const my = y - this.mouseStartPoint.y;

        if (this.type === 'move') {
            this.xRef!.value = this.x + mx;
            this.yRef!.value = this.y + my;
            this.cursor!.value = 'move';
        }
        if (this.type === 'top') {
            this.yRef!.value = this.y + my;
            this.cursor!.value = 'n-resize';
            this.hRef!.value = this.h - my;
        }
        if (this.type === 'left') {
            this.xRef!.value = this.x + mx;
            this.cursor!.value = 'w-resize';
            this.wRef!.value = this.w - mx;
        }
        if (this.type === 'right') {
            this.cursor!.value = 'e-resize';
            this.wRef!.value = this.w + mx;
        }
        if (this.type === 'bottom') {
            this.cursor!.value = 's-resize';
            this.hRef!.value = this.h + my;
        }
        if (this.type === 'leftTop') {
            this.xRef!.value = this.x + mx;
            this.yRef!.value = this.y + my;
            this.cursor!.value = 'nw-resize';
            this.hRef!.value = this.h - my;
            this.wRef!.value = this.w - mx;
        }
        if (this.type === 'rightTop') {
            this.yRef!.value = this.y + my;
            this.cursor!.value = 'ne-resize';
            this.hRef!.value = this.h - my;
            this.wRef!.value = this.w + mx;
        }
        if (this.type === 'leftBottom') {
            this.xRef!.value = this.x + mx;
            this.cursor!.value = 'sw-resize';
            this.hRef!.value = this.h + my;
            this.wRef!.value = this.w - mx;
        }
        if (this.type === 'rightBottom') {
            this.cursor!.value = 'se-resize';
            this.hRef!.value = this.h + my;
            this.wRef!.value = this.w + mx;
        }
    }
}


export default mouseMove;
