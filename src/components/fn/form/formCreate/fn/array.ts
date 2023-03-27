//获取数组中出现次数最多的元素(字符或数字)
const getArrayRepeatMaxItem = (arr: string[] | number[]) => {
    const temp: any = {};
    arr.map((item) => {
        const key = item.toString();
        if (!temp[key]) {
            temp[key] = 1;
        } else {
            temp[key] += 1;
        }
    })
    let back = '',
        tempVal = 0;
    for (const [key, val] of Object.entries(temp)) {
        const nowVal = val as any;
        if (nowVal > tempVal) {
            tempVal = nowVal;
            back = key;
        }
    }
    return back;
}


export {
    getArrayRepeatMaxItem
}
