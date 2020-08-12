const m = require('mithril');
const QRCode = require('qrcode');
module.exports = {
    data: {
        QRSrc: ""
    },
    oninit: function (vNode) {
        QRCode.toDataURL('wtf').then(url => {
            this.src = url;
        }).catch(err => {
            console.log(err);
        });
    },
    view: function (vNode) {
        return m('div', '快快乐乐');
    }
};