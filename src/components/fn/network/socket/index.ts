
interface SocketConfigType{
  server?:string,
  maxRetryCount?:number,
  reConnectDelayTime?:number,
  onMessage?:(rs:any)=>void,
  onSend?:(rs:any)=>void,
  onConnected?:()=>void,
  onDisconnect?:()=>void,
  onError?:(event:Event)=>void
  getToken?:(()=>string) | undefined
}


/**
 * socket 连接缓存
 * */
const SocketsDataBase = {};
/**
 * 全局配置
 * */
const socketSet:SocketConfigType = {
  server:'',
  maxRetryCount:10,
  reConnectDelayTime:5000,
  getToken(){
    return localStorage.getItem('token') || 'null';
  }
}

export default class Socket {
  /**
   * 服务器地址
   * */
  private readonly server:string;
  /**
   * 最大重连次数
   * */
  private readonly maxRetryCount:number;
  /**
   * 连接超时时间
   * */
  private readonly reConnectDelayTime:number;
  /**
   * 信息处理函数
   * */
  private readonly onMessage:(rs:any)=>void;
  /**
   * 信息发送处理函数
   * */
  private readonly onSend:(rs:any)=>any;
  /**
   * 当连接成功时
   * */
  private readonly onConnected:()=>void;
  /**
   * 连接断开时
   * */
  private readonly onDisconnect:()=>void;
  /**
   * 获取token函数
   * */
  private readonly getToken:(()=>string) | undefined;
  /**
   * 发生错误时
   * */
  private readonly onError:(event:Event)=>void;
  /**
   * 发送失败缓存
   * */
  private loseData:any[];
  /**
   * webSocket对象
   * */
  private socket:WebSocket|null
  /**
   * 是否正常退出
   * */
  private connectOver:boolean
  /**
   * 连接状态
   * */
  private connectState:boolean
  /**
   * 重连次数
   * */
  private connectNumber:number

  constructor(opt:SocketConfigType) {
    this.server = opt.server || socketSet.server || '';
    this.maxRetryCount = opt.maxRetryCount || socketSet.maxRetryCount || 10;
    this.reConnectDelayTime = opt.reConnectDelayTime || socketSet.reConnectDelayTime || 5000;
    this.onMessage = opt.onMessage || socketSet.onMessage || function (){};
    this.onSend = opt.onSend || socketSet.onSend || function (rs){return rs;};
    this.onConnected = opt.onConnected || socketSet.onConnected || function (){};
    this.onDisconnect = opt.onDisconnect || socketSet.onDisconnect || function (){};
    this.onError = opt.onError || socketSet.onError || function (){};
    this.getToken = opt.getToken || socketSet.getToken || undefined;
    this.loseData = [];
    this.socket = null;
    this.connectOver = false;
    this.connectState = false;
    this.connectNumber = 0;

    if(!this.server){
      throw ('未配置socket的server地址！！！');
    }

    if(this.getToken){
      this.server += '/'+this.getToken();
    }

    this.connect();
  }

  /**
   * 默认设置配置
   * */
  static setting(setting:SocketConfigType){
    Object.assign(socketSet,setting);
  }

  /**
   * 连接
   * */
  public connect(){
    if (this.socket) return

    this.socket = new WebSocket(this.server);

    this.socket!.onclose = (event) => {
      this.onDisconnect();
      this.socket = null

      if (!this.connectOver) {
        this.connectNumber++;
        if(this.connectNumber>socketSet.maxRetryCount!){
          console.error('无法连接socket服务器！','error');
          return;
        }
        setTimeout(()=>{
          console.log(`socket 开始重连 第${this.connectNumber}次!`);
          this.connect();
        },this.reConnectDelayTime)

        if(this.connectState){
          console.error('服务已断开，正在尝试重新连接','error');
        }
      }

      this.connectState = false;
    }

    this.socket!.onerror = (event) => {
      this.connectState = false;
      this.onError(event);
    }

    this.socket!.onmessage = (event) =>{
      this.onMessage(JSON.parse(event.data));
    }


    this.socket!.onopen = (res) => {

      this.onConnected();
      if(this.connectNumber !== 0){
        console.error('socket服务器连接成功！','success');
      }
      this.connectNumber = 0;
      this.connectState = true;
      //发送之间的发送失败的数据
      if(this.loseData.length > 0){
        const newData = JSON.parse(JSON.stringify(this.loseData));
        this.loseData = [];
        newData.map((info:any)=>{
          this.send(info);
        })
      }
    }
  }

  /**
   * 关闭连接
   * */
  disconnect() {
    this.connectState = false // 先将connectState状态设为false，表明是手动关闭
    this.connectOver = true;
    this.socket!.close()
    this.socket = null;
  }

  /**
   * 发送信息
   * */
  public send(data:any){
    if (this.connectState) {
      const newData = this.onSend(data);
      this.socket!.send(JSON.stringify(newData))

    } else {
      console.error('服务已断开，正在尝试重新连接，数据将在重连成功后自动发送','error');
      // 断联期间发送的数据，直接保存
      this.loseData.push(data)
    }
  }

}

