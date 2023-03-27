const ua:string = navigator.userAgent.toLowerCase();
const isSafari = !!(ua.match(/version\/([\d.]+).*safari/));

const format = function(date:Date, fmt:string) {
  // y 年份
  const o:any = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
        ? (o[k])
        : (('00' + o[k]).substr(('' + o[k]).length)));
    }
  }
  return fmt;
}

// 时间戳、日期格式 转 日期对象
const _str2Obj = function(date:any) {
  if (date.indexOf('-') > -1 || date.indexOf('/') > -1) {
    date = date.split(/-|\//g);
    const newDate:any = [];

    // Safari 月日  必须是：01 不能是：1
    date.map((rs:any) => {
      if (parseInt(rs) < 10) {
        newDate.push('0' + parseInt(rs))
      } else {
        newDate.push(parseInt(rs));
      }
    });
    date = newDate.join('-');
  } else {
    date = parseInt(date);
  }

  date = new Date(date);

  return date;
};

// chrome ios自动转换格式  -或/ 设置日期控件显示用
const getSetDate = function(date:any) {
  if (!date) { return ''; }

  date = _str2Obj(date);

  if (isSafari) {
    return format(date, 'yyyy/MM/dd');
  } else {
    return format(date, 'yyyy-MM-dd');
  }
};

// stamp2time和time2stamp   2个时间转换的毫秒数会被忽略。
const getDateTime = function(b:any) {
  b = b || new Date().getTime();
  const a = new Date(parseInt(b));
  // var year=a.getFullYear();
  // var month=parseInt(a.getMonth())+1;
  // month= (month<10)? "0"+month : month;
  // var date=a.getDate();
  // date= (date<10)? "0"+date : date;
  // var hours=a.getHours();
  // hours= (hours<10)? "0"+hours : hours;
  // var minutes=a.getMinutes();
  // minutes= (minutes<10)? "0"+minutes : minutes;
  // var seconds=a.getSeconds();
  // seconds= (seconds<10)? "0"+seconds : seconds;
  //
  // return year+"-"+month+"-"+date+" "+hours+":"+minutes+":"+seconds;
  return format(a, 'yyyy-MM-dd hh:mm:ss');
};

const getDateTime1 = function(b:any) {
  if (!b) {
    return '时间待定';
  }
  // b = b || new Date().getTime();
  const a:any = new Date(parseInt(b));
  const year = a.getFullYear();
  let month:any = parseInt(a.getMonth()) + 1;
  month = (month < 10) ? '0' + month : month;
  let date = a.getDate();
  date = (date < 10) ? '0' + date : date;

  return year + '年' + month + '月' + date + '日';
};

const getDateTime2 = function(b:any) {
  b = b || new Date().getTime();
  const a = new Date(parseInt(b));
  // var year=a.getFullYear();
  // var month=parseInt(a.getMonth())+1;
  // month= (month<10)? "0"+month : month;
  // var date=a.getDate();
  // date= (date<10)? "0"+date : date;
  // var hours=a.getHours();
  // hours= (hours<10)? "0"+hours : hours;
  // var minutes=a.getMinutes();
  // minutes= (minutes<10)? "0"+minutes : minutes;
  // var seconds=a.getSeconds();
  // seconds= (seconds<10)? "0"+seconds : seconds;
  return format(a, 'yyyy-MM-dd hh:mm');
  // return year+"-"+month+"-"+date+" "+hours+":"+minutes;
};

// 传入时间戳，输出日期部分
const getDate = function (b:any) {
  b = b || new Date().getTime();
  const a = new Date(parseInt(b));
  // var year = a.getFullYear();
  // var month = parseInt(a.getMonth()) + 1;
  // month = (month < 10) ? "0" + month : month;
  // var date = a.getDate();
  // date = (date < 10) ? "0" + date : date;
  // return year + "-" + month + "-" + date;
  return format(a, 'yyyy-MM-dd');
};
const getDate1 = function (b:any) {
  if (!b) {
    return '';
  }
  const a = _str2Obj(b);
  // b = (b.indexOf('-')>-1 || b.indexOf('\/')>-1)? b : parseInt(b);
  // b = getSetDate(b);
  // b = b || new Date().getTime();
  // var a = new Date(b);
  // var year = a.getFullYear();
  // var month = parseInt(a.getMonth()) + 1;
  // month = (month < 10) ? "0" + month : month;
  // var date = a.getDate();
  // date = (date < 10) ? "0" + date : date;
  // return year + "-" + month + "-" + date;
  return format(a, 'yyyy-MM-dd');
};

// a :   2012-12-13   2012-12-12 12:12:33  自动补位
const getStamp = function(a:any) {
  if (!a) {
    return new Date().getTime();
  }

  let newStr = a.replace(/:/g, '-');
  newStr = newStr.replace(/ /g, '-');
  newStr = newStr.replace(/\//ig, '-');
  const arr = newStr.split('-');
  if (arr.length !== 6) {
    for (let i = 0, l = 6 - arr.length; i < l; i++) {
      arr.push(0);
    }
  }

  return new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5])).getTime();
};

// 倒计时用
// 大于1天只返回天数
// 小于1天 返回   时：分：秒
const getDataTime3 = function(stamp:number):string|number {
  const day = 86400000; // 1000*60*60*24
  const hour = 3600000; // 1000*60*60
  const minute = 60000; // 1000*60

  // 大于1天
  if (stamp > day) {
    return parseInt(String(stamp / day));
  }

  let f, m;
  const s = parseInt(String(stamp / hour));
  stamp = stamp - hour * s;
  f = parseInt(String(stamp / minute));
  stamp = stamp - minute * f;
  m = parseInt(String(stamp / 1000));

  f = (f < 10) ? '0' + f : f;
  m = (m < 10) ? '0' + m : m;

  return s + ':' + f + ':' + m;
};

const getMonthMaxDay = function(year:number, month:number) {
  // 获取这个月的最大天数
  let day = 0;
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      day = 31;
      break;
    case 4:
    case 6:
    case 9:
    case 11:
      day = 30;
      break;
    case 2:
      if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
        day = 29;
      } else {
        day = 28;
      }
      break;
    default:
      day = 31;
  }

  return day;
}

// 获取当前月的起始日期
const getNowMonthDay = function() {
  const now = new Date();
  const year = now.getFullYear();
  let month:string|number = now.getMonth() + 1;
  const maxDay = getMonthMaxDay(year, month);
  month = (month < 10) ? '0' + month : month;

  const sDay = year + '-' + month + '-01';
  const eDay = year + '-' + month + '-' + maxDay;

  return [sDay, eDay];
}

const formatData = (stamp?:number|string,fmt?:string) =>{
  fmt = fmt || 'yyyy-MM-dd'
  stamp = stamp || new Date().getTime();
  let newData:Date|null = null;
  try{
    if(stamp.toString().indexOf('-')>-1 || stamp.toString().indexOf('\/')>-1){
      newData = new Date(stamp);
    }else{
      newData = new Date(parseInt(stamp.toString()));
    }
  }catch(e){
    console.error('formatData:无法格式化日期格式')
  }

  if(newData){
    return format(newData, fmt);
  }else{
    return '';
  }


}

export {
  formatData,
  getDateTime, getDateTime1, getDate1, getDateTime2, getDate, getStamp, getDataTime3, getNowMonthDay, getSetDate
};
