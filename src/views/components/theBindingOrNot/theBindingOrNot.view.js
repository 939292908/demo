const m = require('mithril');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');

module.exports = {
    show: false,
    isChangeClose: false,
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
        // alert(1);
    },
    oncreate: function () {
        // alert(2);
    },
    handleCloseDialog: function () {
        this.show = false;
    },
    handleBack: function () {
        window.router.go(-1);
    },
    view: function () {
        return m.fragment(
            this.show ? m(VerifyView, { close: this.isChangeClose ? this.handleBack : this.handleCloseDialog, ...this.popUpData }) : null
        );
    },
    onremove: function () {
        // alert(3);
    }
};