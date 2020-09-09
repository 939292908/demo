const m = require('mithril');
require('./invitation.scss');
const img = require('./image.png').default;
module.exports = {
    view: function () { // self-manage-content-block 资产内的样式
        return m('.self-manage-content-block invitattion-block', [
            // block header
            m('.asset-header dis-flex justify-between align-center', [
                m('div.asset-title', [
                    m('span', '邀请返佣')
                    // m('i.iconfont icon-xiala')
                ]),
                m('div' /* m('i.iconfont icon-xiala') */)
            ]),
            m('div.invitattion-qrcode-box py-8', m('.qrCode', [
                m('img.mb-3', { src: img }),
                m('div.text mb-1', '我的专属·邀请码'),
                m('div.click-copy', [
                    m('span', 'iccjks'),
                    m('i.iconfont icon-xiala')
                ])
            ]))
        ]);
    }
};