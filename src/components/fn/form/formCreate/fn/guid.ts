//生成guid

export default function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        //取16以内的随机数
        const r = Math.random() * 16 | 0,
            //x直接返回随机数
            //y返回 r&0x3|0x8 的位运算
            v = (c == 'x') ? r : (r & 0x3 | 0x8);
        //返回16进制值
        return v.toString(16);
    });
}