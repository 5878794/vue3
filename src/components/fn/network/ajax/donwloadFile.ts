//下载文件到本地

export interface downloadUrlObjType{
  src:string,
  name:string
}

const fn = {
  async init(urls:downloadUrlObjType[]){
    for(let i=0,l=urls.length;i<l;i++){
      await this.download(urls[i].src,urls[i].name);
    }
  },
  download(imgUrl:string,fileName:string){
    let _this = this,
      fileType = (imgUrl.indexOf('.')>-1) ? imgUrl.substring(imgUrl.lastIndexOf('.')+1) : '';
      fileName = fileName+'.'+fileType;

    return new Promise((resolve,reject)=>{
      let xhr = new XMLHttpRequest();
      xhr.open("get", imgUrl, true);
      // 至关重要
      xhr.responseType = "blob";
      xhr.onload = function () {
        if (this.status == 200) {
          //得到一个blob对象
          let blob = this.response;
          _this.autoDown(blob,fileName);
          resolve(blob);
        }else{
          reject('下载失败');
        }
      };
      xhr.onerror = function(){
        reject('下载失败');
      };
      xhr.send();
    })
  },
  autoDown(blob:Blob,filename:string){
    const eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    window.URL = window.URL || window.webkitURL;
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  }
};


export default async function(urls:downloadUrlObjType[]){
  return await fn.init(urls);
}

