const m = require('mithril');
const Invitation = require('./invitation.logic');
const l180n = require('@/languages/I18n').default;
require('./invitation.scss');

module.exports = {
    oninit: function () {
        Invitation.oninit();
    },
    oncreate: function () {
        document.getElementById('invitationCode').addEventListener('copy', this.copyEditText);
    },
    copyEditText: function (e) {
        e.clipboardData.setData('text/plain', Invitation.invitationCode);
        e.preventDefault();
        window.$message({ title: l180n.$t('10410') /* '提示' */, content: l180n.$t('10546') /* '复制成功' */, type: 'success' });
    },
    handleClickCopy: function () {
        document.execCommand('copy');
    },
    view: function () { // self-manage-content-block 资产内的样式
        return m('.self-manage-content-block invitattion-block', [
            // block header
            m('.asset-header dis-flex justify-between align-center', [
                m('div.asset-title', [
                    m('span', l180n.$t('10184') /* '邀请返佣' */)
                    // m('i.iconfont icon-xiala')
                ]),
                m('div' /* m('i.iconfont icon-xiala') */)
            ]),
            m('div.invitattion-qrcode-box py-8', m('.qrCode', [
                m('img.mb-3', { src: Invitation.qrCodeBase64 }),
                m('div.text mb-1', l180n.$t('10215') /* '我的专属·邀请码' */),
                m('div.click-copy', { onclick: this.handleClickCopy, id: 'invitationCode' }, [
                    m('span', Invitation.invitationCode),
                    m('i.iconfont icon-copy')
                ])
            ]))
        ]);
    },
    onremove: function () {
        Invitation.onremove();
        document.getElementById('invitationCode').removeEventListener('copy', this.copyEditText);
    }
};