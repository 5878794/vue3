import {AxiosResponse, ResponseType} from "axios";

export interface AjaxSetType{
  baseUrl?:string
  api?:string
  contentType?:string
  getToken?:()=>string|null
  timeout?:number
  responseType?:ResponseType
  beforeSendUse?:(data:any,header:any)=>void
  successUse?:(response:AxiosResponse,resolve:Function,reject:Function)=>any
  errorUse?:(e:any)=>void
  successFn?:(rs:any)=>any
  uploadFileKey?:string
  uploadFileType?:string[],
  uploadFileSize?:number
}
export interface ajaxApiType{
  [name:string]:ajaxApiItemType
}
interface ajaxApiItemType{
  type:string,
  url:string
}

export interface plugType {
  [name:string]:Function
}


export interface ajaxApiFunctionType{
  [name:string]:any
}

// TODO c
export interface apiFunctionType{
  [name:string]:any
}
export interface apiType{
  [name:string]:apiItemType
}
type apiMode = 'ajax' | 'c';
interface apiItemType{
  type:string,
  url:string,
  mode?:apiMode
}
