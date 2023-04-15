import defineClassComponent from "@/components/fn/defineClassComponent";
import boxStyle from '@/css/box.module.scss'
import pageStyle from '@/css/page.module.scss'
import {shallowRef} from "vue";

const files = require.context('./',true,/.vue$/);
const components:any = [];
files.keys().forEach((path)=>{
    const key = path.split('/')[1];
    components.push({key:key,com:files(path).default})
})

class Index{
    props:any;
    opts:any;
    show:any = shallowRef('');

    constructor(props:any,opts:any) {
        this.props = props;
        this.opts = opts;

        this.show.value = components[0].com;
    }

    renderCom(){
        const tag = this.show.value;
        return <tag/>
    }

    change(i:number){
        this.show.value = components[i].com;
    }

    ready(){
        console.log(123)
    }

    destroy(){
        console.log('end')
    }

    render(){
        return <div class={[boxStyle.box_hlt]}>
            <div class={[pageStyle.left]} style='cursor:pointer;line-height:20px;'>
                {components.map((rs:any,i:number)=>{
                    return <div
                        onClick={()=> this.change(i)}
                    >{rs.key}</div>
                })}
            </div>
            <div class={[boxStyle.boxflex1]} style='height:100vh;'>
                {this.renderCom()}
            </div>
        </div>
    }
}


export default defineClassComponent(Index);