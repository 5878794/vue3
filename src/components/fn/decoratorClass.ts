// 装饰器

const Decorator = {
  // 显示loading
  showLoad() {
    return (target:any, name:string, descriptor:any) => {
      const fn = descriptor.value;
      descriptor.value = async function (...rest:any) {
        this.showLoading();
        await fn.call(this, ...rest);
        this.hideLoading();
      }
    }
  },
  // 延迟执行
  debounce(timeout = 1000) {
    return function (target:any, key:string, descriptor:any) {
      // 获取被装饰的方法
      const fn = descriptor.value;
      // 初始timerID
      let timer:any = null;
      // 覆盖被装饰的方法
      descriptor.value = async function (...rest:any) {
        clearTimeout(timer);
        timer = setTimeout(async () => {
          await fn.call(this, ...rest);
        }, timeout);
      };
    }
  },
  // 防连点  param={time:300}
  throttle(param:any) {
    return function (target:any, key:string, descriptor:any) {
      // 获取被装饰的方法
      const fn = descriptor.value;
      let previous = 0;
      // 覆盖被装饰的方法
      descriptor.value = async function (...rest:any) {
        const wait = param.time || 300;
        const now = new Date().getTime();
        if (now - previous > wait) {
          previous = now;
          await fn.call(this, ...rest);
        }
      };
    }
  },

  showLoading() {
    console.log('show loading')
  },
  hideLoading() {
    console.log('hide loading')
  },
};

export default Decorator;
