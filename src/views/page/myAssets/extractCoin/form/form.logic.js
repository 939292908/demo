const m = require('mithril');
const { Conf, webApi, BaseUrl } = require('@/api');
const UserInfo = require('@/models/globalModels');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const geetest = require('@/models/validate/geetest').default;
const errCode = require('@/util/errCode').default;
const utils = require('@/util/utils').default;
const validate = require('@/models/validate/validate').default;

const extract = {
    name: 'FROM_DATA',
    promptText: '如果您希望将本地数字资产提出至某地址，则该地址及为您的提币地址。 *某些地址可能需要您提供地址的标签，请务必填写，否则有丢失币的风险 *填写错误可能导致资产损失，请仔细核对 *完成LV3身份认证后，24h提币额度提升至100BTC，如需更多请联系客服',
    UserInfo: {},
    selectList: [],
    linkButtonList: [],
    currentExtractableNum: '0', // 可提
    currentSelect: {}, // 选中的币种
    currenLinkBut: '', // 选中链名字
    currentFees: {}, // 最小值 手续费
    coinInfo: {},
    feesList: [],
    popUpData: { // 弹框【验证，提示】 数据
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
    errorShow: {
        address: {
            show: false,
            text: ''
        },
        unmber: {
            show: false,
            text: ''
        }
    },
    extractCoin: {
        coinNum: '',
        address: '',
        linkName: ''
    }, // 提币数据
    getCoinInfo: function () {
        const params = { locale: 'zh', vp: Conf.exchId };
        webApi.getCoinInfo(params).then(res => {
            if (res.result.code === 0) {
                extract.coinInfo = res.result.data;
                return extract.getSelectListData();
            }
            window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
        });
    },
    getCurrentCoinFees: function () {
        const self = this;
        webApi.getCoinFees().then(res => {
            if (res.result.code === 0) {
                self.feesList = res.feeList;
                return false;
            }
            window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
        });
    },
    getSelectListData: function () {
        console.log(wlt.wallet);
        this.selectList = [...wlt.wallet['03']];
        this.currentSelect = this.selectList[0];
        this.getlinkButtonListData();
        m.redraw();
    },
    getlinkButtonListData: function () {
        this.getCurrentFeesChange();
        this.getExtractableCoinToBTCNum();
        this.currenLinkBut = '';
        if (this.currentSelect.wType !== 'USDT') {
            this.linkButtonList = [];
            return;
        }
        const canWithdrawChains = {};
        for (const key in this.currentSelect.Setting) {
            if (key.includes('canWithdrawUSDT-Omni')) {
                canWithdrawChains.canWithdrawUSDT = this.currentSelect.Setting[key];
            } else if (key.includes('canWithdraw')) {
                canWithdrawChains[key.split('-').join('')] = this.currentSelect.Setting[key];
            }
        }
        this.linkButtonList = this.coinInfo[this.currentSelect.wType].chains.filter(item => {
            return canWithdrawChains[`${'canWithdraw' + item.attr}`];
        });
        if (this.linkButtonList.length > 0) this.currenLinkBut = this.linkButtonList[0].attr;
    },
    getCurrentFeesChange: function () {
        this.currentFees = this.feesList.find(item => item.wType === this.currentSelect.wType);
    },
    getExtractableCoinToBTCNum: function () {
        var BTCNum = 0;
        const price = wlt.getPrz(this.currentSelect.wType);
        const btcPrice = wlt.getPrz('BTC');
        const usableCoin = this.currentSelect.mainBal - this.currentFees.withdrawFee > 0 ? this.currentSelect.mainBal - this.currentFees.withdrawFee : 0;
        if (this.currentSelect.wType === 'USDT') {
            BTCNum = Number(usableCoin / price).toFixed(8);
        } else if (this.currentSelect.wType === 'BTC') {
            BTCNum = usableCoin.toFixed(8);
        } else {
            BTCNum = Number(usableCoin * price / btcPrice).toFixed(8);
        }
        if (BTCNum > 2) return this.getExtractableNum(BTCNum);
        this.currentExtractableNum = BTCNum;
    },
    getBTCToCoin: function (BTCNum) {
        const price = wlt.getPrz(this.currentSelect.wType);
        const btcPrice = wlt.getPrz('BTC');
        if (this.currentSelect.wType === 'USDT') {
            return Number(BTCNum * price).toFixed(8);
        } else if (this.currentSelect.wType === 'BTC') {
            return Number(BTCNum).toFixed(8);
        }
        return Number(BTCNum * btcPrice / price).toFixed(8);
    },
    getExtractableNum: function (BTCNum) {
        if (this.currentSelect?.Setting?.idcardVerifyWithdraw && this.UserInfo.iStatus === 9) {
            this.currentExtractableNum = this.getBTCToCoin(BTCNum > 100 ? 100 : BTCNum);
        } else {
            this.currentExtractableNum = this.getBTCToCoin(2);
        }
    },
    sendExtractCoin: function () {
        const user = this.UserInfo;
        const params = {
            token: user.token,
            wType: this.currenLinkBut || this.currentSelect.wType,
            money: this.extractCoin.coinNum,
            aid: user.uid + '06',
            addr: this.extractCoin.address,
            op: 0
        };
        if (this.currentSelect.wType === 'XRP' || this.currentSelect.wType === 'EOS') {
            params.addr = this.extractCoin.address + ',' + this.extractCoin.linkName;
        }
        webApi.withdrawDeposit(params).then(res => {
            if (res.result.code === 0) return extract.readrSendEmail(params, user, res.seq);
            window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
        }).catch(e => {
            console.log(e, '提币确定');
        });
    },
    handleSubmit: function () {
        if (this.errorShow.unmber.show || this.errorShow.address.show) return false;
        if (!this.extractCoin.address) return window.$message({ content: '提币地址不能为空', type: 'danger' });
        if (this.extractCoin.coinNum <= 0) return window.$message({ content: '输入值不能为0', type: 'danger' });
        geetest.verify();
    },
    readrSendEmail: function (params, user, seq) {
        const emailParms = {
            seq,
            email: user.email,
            host: BaseUrl.WebAPI + '/m/#/accounts', // TODO 参数获取
            fn: 'wda',
            lang: 'zh',
            fishCode: user.antiFishCode,
            token: encodeURIComponent(user.token),
            checkCode: new Date().valueOf().toString(32),
            wType: params.wType,
            aid: params.aid,
            money: params.money,
            addr: params.addr,
            fee: extract.currentFees.withdrawFee,
            exChannel: Conf.exchId
        };
        webApi.sendEmailV2(emailParms).then(res => {
            if (res.result.code === 0) return extract.handleChangeShow(false); // 打开 b
            window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
        });
    },
    readyStartSafetyVerify: function (start) {
        if (start !== 'success') return;
        validate.activeSmsAndGoogle({
            securePhone: utils.hideMobileInfo(extract.UserInfo.phone),
            phoneNum: extract.UserInfo.phone
        }, res => {
            extract.sendExtractCoin();
            extract.handleChangeShow(); // 关闭 a
        });
        extract.handleChangeShow(true); // 打开 a
    },
    handleChangeShow: function (isHandleVerify) {
        extract.popUpData = {
            show: !extract.popUpData.show,
            isHandleVerify,
            title: { text: isHandleVerify ? '安全验证' : '温馨提示' }
        };
        m.redraw();
    },
    handleTotalShow: function ({ content, buttonText, buttonClick, doubleButtonCof, doubleButton }) {
        extract.popUpData = {
            show: !extract.popUpData.show,
            isHandleVerify: false,
            content,
            buttonText,
            buttonClick,
            doubleButtonCof,
            doubleButton,
            title: { text: '温馨提示' }
        };
        m.redraw();
    },
    handleUserCanAction: function () {
        if (!this.UserInfo.setting2fa.email) return this.handleTotalShow({ content: '提币需邮件确认，请先绑定邮箱', buttonText: '邮箱验证', buttonClick: () => { m.route.set("/my"); } });
        const doubleButtonCof = [
            { text: '谷歌验证', click: () => { m.route.set("/my"); } },
            { text: '手机验证', click: () => { m.route.set("/my"); } }
        ];
        if (!this.UserInfo.setting2fa.google && !this.UserInfo.setting2fa.phone) return this.handleTotalShow({ content: '为了您的账户安全，请先绑定手机或谷歌', doubleButton: true, doubleButtonCof });
    },
    oninit: function () {
        const self = this;
        wlt.init();
        this.initGeetest();

        self.getCurrentCoinFees();
        self.UserInfo = UserInfo.getAccount();
        if (!Object.keys(self.UserInfo).length) {
            broadcast.onMsg({
                key: this.name,
                cmd: broadcast.GET_USER_INFO_READY,
                cb: (data) => { self.UserInfo = data; }
            });
        }
        if (!wlt.wallet['01'].toString()) {
            broadcast.onMsg({
                key: this.name,
                cmd: broadcast.MSG_WLT_READY,
                cb: self.getCoinInfo
            });
        } else {
            self.getCoinInfo();
        }
    },
    initGeetest() {
        geetest.init();
        broadcast.onMsg({
            key: this.name,
            cmd: 'geetestMsg',
            cb: this.readyStartSafetyVerify
        });
    },
    onremove: function () {
        broadcast.offMsg({
            key: this.name,
            cmd: broadcast.GET_USER_INFO_READY,
            isall: true
        });
        broadcast.offMsg({
            key: this.name,
            cmd: broadcast.MSG_WLT_READY,
            isall: true
        });
        broadcast.offMsg({
            key: this.name,
            cmd: 'getUserInfo',
            isall: true
        });
    }
};

module.exports = extract;