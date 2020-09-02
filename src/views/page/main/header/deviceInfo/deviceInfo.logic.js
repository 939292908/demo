const Fingerprint2 = require('fingerprintjs2');
const m = require('mithril');
const deviceInfo = {
    modalOpen: false,
    deviceInfo: {
        userAgent: '',
        platform: '',
        language: '',
        explore: '',
        ip: '',
        location: '',
        isp: ''
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

        this.deviceInfo.userAgent = window.navigator.userAgent;

        Fingerprint2.get(options, function (components) {
            // 参数
            console.log('ht', components);
            for (const item of components) {
                switch (item.key) {
                case 'language':
                    that.deviceInfo.language = item.value;
                    break;
                case 'timezone':
                    that.deviceInfo.location = item.value;
                    break;
                case 'platform':
                    that.deviceInfo.platform = item.value;
                    break;
                }
            }
            m.redraw();
        });
    }
};

module.exports = deviceInfo;