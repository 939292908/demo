const Fingerprint2 = require('fingerprintjs2');
const m = require('mithril');
const utils = require('@/util/utils.js').default;
const I18n = require("@/languages/I18n").default;
// const { getISP } = require('@/api/').webApi;

const deviceInfo = {
    modalOpen: false,
    info: {
        userAgent: {
            name: '设备信息(userAgent)',
            value: ''
        },
        platform: {
            name: '操作系统(Platform)',
            value: ''
        },
        language: {
            name: '浏览器语言(Language)',
            value: ''
        },
        explore: {
            name: '使用浏览器(Explore)',
            value: ''
        },
        ip: {
            name: '用户IP(IP)',
            value: ''
        },
        location: {
            name: '用户所在地(Location)',
            value: ''
        },
        isp: {
            name: '网络运营商(ISP)',
            value: ''
        }
    },
    closeModal: function () {
        this.modalOpen = false;
    },
    openModal: function () {
        this.modalOpen = true;
        this.initDeviceInfo();
    },
    initDeviceInfo: function () {
        const that = this;
        const excludes = {
            userAgent: true,
            audio: true,
            enumerateDevices: true,
            fonts: true,
            fontsFlash: true,
            webgl: true,
            canvas: true
        };
        const options = { excludes: excludes };

        this.info.userAgent.value = window.navigator.userAgent;
        this.info.platform.value = this.detectOS();

        Fingerprint2.get(options, function (components) {
            // 参数
            console.log('ht', components);
            for (const item of components) {
                switch (item.key) {
                case 'language':
                    that.info.language.value = item.value;
                    break;
                case 'timezone':
                    that.info.location.value = item.value;
                    break;
                case 'screenResolution':
                    that.info.explore.value = `${I18n.$t('10490')} ${screen.width}  ${I18n.$t('10491')} ${screen.height}`;// `\n 浏览器宽: ${screen.width} \n 浏览器高: ${screen.height}`;
                    break;
                }
            }
            m.redraw();
        });
        this.getIpAdress();
    },
    detectOS: function () {
        const sUserAgent = navigator.userAgent;
        const isWin = (navigator.platform === "Win32") || (navigator.platform === "Windows");
        const isMac = (navigator.platform === "Mac68K") || (navigator.platform === "MacPPC") || (navigator.platform === "Macintosh") || (navigator.platform === "MacIntel");
        if (isMac) {
            return "Mac";
        }
        const isUnix = (navigator.platform === "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        const isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        if (isLinux) return "Linux";
        if (isWin) {
            const isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) return "Win2000";
            const isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP) return "WinXP";
            const isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) return "Win2003";
            const isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) return "WinVista";
            const isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Win7";
        }
        return "other";
    },
    getIpAdress() {
        utils.createScript({
            src: 'https://pv.sohu.com/cityjson?ie=utf-8',
            cb: this.initAdressFun,
            errcb: this.initAdressErrorFun,
            id: 'ip-address'
        });
    },
    initAdressFun: function(res) {
        // 显示最新的ip地址信息
        if (window.returnCitySN && window.returnCitySN.cip) {
            console.log('ht', 'returnCitySN', window.returnCitySN);
            deviceInfo.info.ip.value = window.returnCitySN.cip;
            deviceInfo.getISP();
        }
    },
    initAdressErrorFun: function(err) {
        console.log('initAdressErrorFun', err);
    },
    getISP: function() {
        window.op_aladdin_callback = (result) => {
            if (result.status === "0" && result.data.length > 0) {
                try {
                    const address = result.data[0].location.split(' ');
                    deviceInfo.info.isp.value = address[1];
                    m.redraw();
                } catch (err) {
                    console.log('地址有误: ', err);
                }
            }
        };
        utils.createScript({
            src: `https://sp0.baidu.com/8aQDcjqpAAV3otqbppnN2DJv/api.php?resource_id=6006&ie=utf8&oe=gbk&format=json&jsonp&query=${deviceInfo.info.ip.value}&cb=op_aladdin_callback`,
            cb: res => {},
            errcb: res => {
                console.log('getISP err', res);
            },
            id: 'ip-address'
        });
    }
};

module.exports = deviceInfo;