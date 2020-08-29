const { webApi, Conf } = require("@/newApi2").webApi;

module.exports = {
    sendEmails: function () {
        const params = {
            email: '',
            host: this.$params.webSite + '/m/#/accounts',
            fn: 'wda',
            lang: this.$i18n.locale,
            fishCode: this.$store.state.account.antiFishCode,
            token: encodeURIComponent(this.$store.state.account.token),
            checkCode: new Date().valueOf().toString(32),
            wType: '',
            aid: '',
            money: this.numVal,
            addr: this.addressVal,
            fee: this.fee,
            seq: '',
            exChannel: Conf.exchId
        };
        webApi.sendEmailV2(params).then(res => {
            console.log(res);
        });
    }
};