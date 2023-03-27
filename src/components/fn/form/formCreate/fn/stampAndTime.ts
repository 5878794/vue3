const _format = function (date: Date, fmt: string) {
    //y 年份
    const o: any = {
        "M+": date.getMonth() + 1,                 //月份
        "d+": date.getDate(),                    //日
        "h+": date.getHours(),                   //小时
        "m+": date.getMinutes(),                 //分
        "s+": date.getSeconds(),                 //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (const k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                (o[k]) :
                (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

const _getDateObj = (txt: number | string | null) => {
    if (!txt) {
        return null;
    }
    //是数字
    if (!isNaN((txt as number))) {
        return new Date(parseInt(txt.toString()));
    }
    //字符串日期格式
    let new_str = txt.toString();
    new_str = new_str.replace(/:/g, '-');
    new_str = new_str.replace(/ /g, '-');
    new_str = new_str.replace(/\//ig, '-');
    const arr: any[] = new_str.split("-");
    if (arr.length != 6) {
        for (let i = 0, l = 6 - arr.length; i < l; i++) {
            arr.push(0);
        }
    }

    return new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5]));
}

const getMonthMaxDay = function (year: number, month: number) {
    //获取这个月的最大天数
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
            if ((year % 4 == 0 && year % 100 != 0) || (year % 400 == 0)) {
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

const getStamp = (txt: string | Date | number | null) => {
    if (!txt) {
        return '';
    }
    if (typeof txt === 'object') {
        return txt.getTime();
    }
    return _getDateObj(txt)?.getTime();
}

const getDate = (txt: Date | string | null | number, fmt: string) => {
    if (!txt) {
        return '';
    }
    const stamp = getStamp(txt);
    const data = new Date(stamp!);
    return _format(data, fmt)
}

export {
    getMonthMaxDay,
    getStamp,
    getDate
}


