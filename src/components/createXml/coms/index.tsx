import defineClassComponent from '../../fn/defineClassComponent'
import {getCurrentInstance, provide, ref} from "vue";
import boxStyle from '../css/box.module.scss';
import styles from '../css/css.module.scss';

import Top from './top';
import Prop from './prop';
import Main from './main';

class createXml {
  props: any;
  opt: any;
  root: any;
  topDom = ref(null);
  propDom = ref(null);
  mainDom = ref(null);
  tempMoved = ref(null);

  constructor(props: any, opt: any) {
    this.props = props;
    this.opt = opt;
    this.root = getCurrentInstance();
    provide('root', this.root);
  }

  static setComponent() {
    return {
      components: {Top, Prop, Main}
    }
  }

  test() {
    console.log('root test')
  }

  render() {
    return <>
      <div class={[boxStyle.box_hlt, 'createXmlBody', styles.main]}>
        <div class={[boxStyle.boxflex1, 'body', boxStyle.box_slt]}>
          <div class={['inputs', boxStyle.box_hlc]}>
            <Top ref='topDom'/>
          </div>
          <div class={['main', boxStyle.boxflex1]}>
            <Main ref='mainDom'/>
          </div>
          <div ref='tempMoved'></div>
        </div>
        <div class='prop'>
          <Prop ref='propDom'/>
        </div>
      </div>
    </>
  }

}

export default defineClassComponent(createXml)
