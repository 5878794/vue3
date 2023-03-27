import axios, {AxiosRequestHeaders, AxiosResponse, ResponseType} from "axios";
import {AjaxSetType,ajaxApiType,plugType} from './index.type';

interface AjaxSetType1 extends AjaxSetType{
  method?:string
  url?:string
}


/**
 * ajax默认配置
 * */
const defaultAjaxSet:AjaxSetType = {
  baseUrl:'/',
  contentType:'application/x-www-form-urlencoded;charset=UTF-8',
  getToken(){
    return localStorage.getItem('token');
  },
  timeout:30000,
  responseType:'json',
  beforeSendUse(data:any,header:any){},
  successUse(rs,success,error){
    const data:any = rs.data;
    if(typeof data === 'string'){
      success(data);
      return;
    }

    if(data.code === 0 || data.code === 200){
      success(data.data)
    }else{
      error(data.msg);
    }
  },
  errorUse(msg){},
  uploadFileKey:'file',
  uploadFileType:[],
  uploadFileSize:2      //mb
};
/**
* 缓存的插件
*/
export const plugin:plugType = {};
/**
 * 缓存的api
 * */
const test = 'test'+new Date().getTime();
const apis:ajaxApiType = {};
apis[test] = {type:'get',url:'test'};

export default class Ajax {
  private readonly baseUrl:string
  private readonly api:string
  private readonly contentType:string
  private readonly getToken?:()=>string|null
  private readonly timeout:number
  private readonly responseType:ResponseType|undefined
  private readonly beforeSendUse?:(data:any,header:any)=>void
  private readonly successUse?:(response:AxiosResponse,resolve:Function,reject:Function)=>any
  private readonly errorUse?:(errMsg:any,code?:string)=>void
  private readonly method:string|undefined
  private readonly headers:AxiosRequestHeaders
  private url:string
  private successFn:((rs:any)=>any) | undefined
  private readonly uploadFileKey:string
  private uploadFileType:string[]
  private readonly uploadFileSize:number

  constructor(props:AjaxSetType1) {
    this.baseUrl = props.baseUrl || defaultAjaxSet.baseUrl || '';
    this.api = props.api || '';
    this.contentType = props.contentType || defaultAjaxSet.contentType || '';
    this.getToken = props.getToken || defaultAjaxSet.getToken;
    this.timeout = props.timeout || defaultAjaxSet.timeout || 3000;
    this.responseType = props.responseType || defaultAjaxSet.responseType;
    this.beforeSendUse = props.beforeSendUse || defaultAjaxSet.beforeSendUse ;
    this.successUse = props.successUse || defaultAjaxSet.successUse;
    this.errorUse = props.errorUse || defaultAjaxSet.errorUse;
    this.successFn = undefined;
    this.uploadFileKey = props.uploadFileKey || defaultAjaxSet.uploadFileKey || 'file';
    this.uploadFileType = props.uploadFileType || defaultAjaxSet.uploadFileType || [];
    this.uploadFileSize = props.uploadFileSize ||defaultAjaxSet.uploadFileSize || 2;

    if(this.api){
      if(!apis[this.api]){
        throw `Ajax中${this.api}接口不存在！`;
      }
      const apiObj = apis[this.api];
      this.method = apiObj.type;
      this.url = this.baseUrl + apiObj.url;
    }else{
      this.method = props.method || 'get'
      this.url = this.baseUrl + props.url;
    }


    this.headers = this.createHeader();

  }

  /**
   * 创建header
   * */
  private createHeader(){
    const header:AxiosRequestHeaders|any = {};
    if(this.getToken){
      header.token = this.getToken()!;
    }
    if(this.contentType){
      header['Content-Type'] = this.contentType;
    }

    return header;
  }

  /**
   * 自定义成功后的处理函数 需要return data给最终的send的promise函数
   * @example
   *  await Network
   *    .request('web#sampleAllType')
   *    .success((rs:any)=>{
   *      return rs.data;
   *    })
   *    .send({a:1});
   */
  public success(fn:(rs:any)=>void){
    this.successFn = fn;
    return this;
  }


  static createApi(ajaxObj:ajaxApiType){
    Object.assign(apis,ajaxObj);
  }

  /**
   * 创建不缓存的api 默认执行Network.request
   * */
  static createApiFunction(ajaxObj:ajaxApiType){
    const api:any = {};
    for(let [key,obj] of Object.entries(ajaxObj)){
      const method = obj.type;
      const url = obj.url;
      api[key] = new Ajax({
        method:method,
        url:url
      })
    }
    return api;
  }

  static setting(setting:AjaxSetType){
    Object.assign(defaultAjaxSet,setting);
  }

  /**
   * 更改请求url
   * */
  public requestUrl(url:string){
    this.url = url;
    return this;
  }


  /**
   * 增加header参数
   * */
  public header(obj:AxiosRequestHeaders|any={}){
    for(let [key,val] of Object.entries(obj)){
      this.headers[key] = (val as any).toString();
    }
    return this;
  }

  public changeFileUploadType(types:string[]){
    this.uploadFileType = types;
    return this;
  }

  /**
   * 发送请求
   * */
  public send(data?:any){
    let postData:any,urlParam:any;

    if(this.method === 'get'){
      urlParam = data;
    }else{
      postData = data;
    }

    if(this.beforeSendUse){
      this.beforeSendUse(data,this.headers);
    }

    return new Promise((resolve, reject) => {
      axios(this.url,{
        method:this.method,
        responseType:this.responseType,
        params:urlParam,
        data:postData,
        timeout:this.timeout,
        headers:this.headers
      }).then((rs:AxiosResponse)=>{
        if(this.successFn){
          let data = this.successFn(rs.data);
          resolve(data);
          return;
        }

        if(this.successUse){
          this.successUse.call(this,rs,resolve,reject)
        }else{
          resolve(rs);
        }
      }).catch((e:any)=>{
        if(!e.response){
          reject(e);
          return
        }
        const code = e.response.status;
        const msg = e.response.statusText;
        if(this.errorUse){
          this.errorUse(msg,code);
        }
        reject(msg);
      })
    })
  }

  /**
   * 文件上传
   * */
  public uploadFile(file:File,otherParam?:any){
    const formData = new FormData();
    formData.append(this.uploadFileKey, file);

    // 添加其他参数
    if(otherParam){
      for (const [key, val] of Object.entries(otherParam)) {
        formData.append(key, (val as string));
      }
    }

    //检查上传的文件
    let checkPass = true;
    let msg = '';

    const fileSize = file.size;
    if(this.uploadFileSize*1024*1024 < fileSize){
      checkPass = false;
      // msg = `上传文件大于 ${this.getFileSize(this.uploadFileSize)}`;
      msg = `上传文件大于 ${this.uploadFileSize} MB`;
    }

    const fileName = file.name;
    const fileExt = fileName.substring(fileName.lastIndexOf('.')+1);
    if(this.uploadFileType.length !== 0){
      if(!this.uploadFileType.includes(fileExt)){
        checkPass = false;
        msg = `上传文件后缀名必须是: ${this.uploadFileType.join('、')} 的文件`;
      }
    }

    if(!checkPass){
      return Promise.reject(msg);
    }

    return this.send(formData);
  }



  /**
   * @description 注册插件
   * @example
   * const  ff = function(this:any,str:string,str1:string){
   *   console.log(this);
   *   this.url += '/'+str + '/'+str1;
   * }
   * Ajax.use(ff)
   * */
  static use(fn:Function){
    const temp:any = new Ajax({api:test});
    const name = fn.name;
    if(temp[name]){
      throw('Network.Ajax.use()：插件名"'+name+'"冲突，请更换名字');
    }
    if(plugin[name]){
      console.warn(`Ajax插件${name}已被覆盖！`)
    }
    plugin[name] = fn;
  }

  /**
   * 使用插件
   * @example 通过Network对象调用
   * await Network
   *    .request('web#sampleAllType')
   *    .press('ff','test','test1')
   *    .send({a:1});
   * */
  public press(fn:string,...arg:any){
    if(!plugin[fn]){
      throw `Ajax中 ${fn} 插件不存在！！！`
    }
    plugin[fn].call(this,...arg);
    return this;
  }


}



