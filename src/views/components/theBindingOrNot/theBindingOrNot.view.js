const m = require('mithril');
const broadcast = require('@/broadcast/broadcast');
const globalModels = require('@/models/globalModels');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const l180n = require('@/languages/I18n').default;

module.exports = {
    isChangeClose: false,
    UserInfor: {},
    popUpData: {
        show: false,
        doubleButton: false,
        isHandleVerify: false,
        title: {
            logo: '',
            text: ''
        },
        content: '',
        buttonText: '',
        buttonClick: null,
        doubleButtonCof: []
    },
    oninit: function () {
        if (Object.keys(globalModels.getAccount()).length > 0) {
            this.handleUserCanAction(globalModels.getAccount());
        } else {
            broadcast.onMsg({
                key: this.name,
                cmd: broadcast.GET_USER_INFO_READY,
                cb: this.handleUserCanAction.bind(this)
            });
        }
    },
    handleTotalShow: function ({ content, buttonText, buttonClick, doubleButtonCof, doubleButton, isLinshiErWeiMa }) {
        this.isChangeClose = true;
        this.popUpData = {
            show: true,
            isHandleVerify: false,
            content,
            buttonText,
            buttonClick,
            doubleButtonCof,
            doubleButton,
            title: { text: l180n.$t('10082') /* '温馨提示' */ },
            isLinshiErWeiMa
        };
        m.redraw();
    },
    handleUserCanAction: function (data) {
        if (data.setting2fa.email !== 1) {
            return this.handleTotalShow({ content: l180n.$t('10610') /* '为了您的账户安全，请先绑定邮箱' */, buttonText: l180n.$t('10229') /* '邮箱验证' */, buttonClick: () => { m.route.set("/bindEmail"); } });
        }
        const doubleButtonCof = [
            { text: l180n.$t('10227') /* '谷歌验证' */, issolid: false, click: () => { m.route.set("/openGoogleVerify"); } },
            { text: l180n.$t('10228') /* '手机验证' */, issolid: true, click: () => { m.route.set("/bindPhone"); } }
        ];
        if (data.setting2fa.google !== 1 && data.setting2fa.phone !== 1) {
            return this.handleTotalShow({ content: l180n.$t('10405')/* '为了您的账户安全，请先绑定手机或谷歌' */, doubleButton: true, doubleButtonCof });
        }
    },
    handleCloseDialog: function () {
        this.show = false;
    },
    handleBack: function () {
        window.router.go(-1);
    },
    view: function () {
        return m.fragment(
            this.popUpData.show ? m(VerifyView, { close: this.isChangeClose ? this.handleBack : this.handleCloseDialog, ...this.popUpData }) : null
        );
    },
    onremove: function () {
        broadcast.offMsg({
            key: this.name,
            cmd: broadcast.GET_USER_INFO_READY,
            isall: true
        });
    }
};