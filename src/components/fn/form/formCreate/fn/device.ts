const device: any = {
    ver: 0
};
const allReg = {
    isIpad: /ipad; cpu os ([\d_]+)/,
    isIphone: /iphone os ([\d_]+)/,
    isAndroid: /android[ /]([\d.]+)/,
    isIe: /(msie ([\d.]+))|(rv:([\d.]+)\) like gecko)/,
    isFirefox: /firefox\/([\d.]+)/,
    isChrome: /chrome\/([\d.]+)/,
    isOpera: /opera.([\d.]+)/,
    isSafari: /version\/([\d.]+).*safari/,
    isWeChat: /MicroMessenger/i
}
const ua = navigator.userAgent.toLowerCase();

const getVer = (text: string) => {
    const ver = text.split(".");
    const _ver = [];
    for (let i = 0, l = ver.length; i < l; i++) {
        if (i >= 2) {
            break;
        }
        _ver.push(ver[i]);
    }
    return _ver.join(".");
}

for (const [key, reg] of Object.entries(allReg)) {
    const rs = ua.match(reg);
    device[key] = !!rs;
    if (rs) {
        const verText = rs[1].replace(/_/g, ".");
        device.ver = getVer(verText);
    }
}

device.isPhone = (device.isAndroid || device.isIpad || device.isIphone);
device.isPc = !device.isPhone;

const p = navigator.platform;
device.isWin = p.indexOf("Win") == 0;
device.isMac = p.indexOf("Mac") == 0;
device.isLinux = (p == "X11") || (p.indexOf("Linux") == 0);


export default device;