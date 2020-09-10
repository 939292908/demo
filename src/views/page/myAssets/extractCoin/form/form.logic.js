const m = require('mithril');
const { Conf, webApi, ActiveLine } = require('@/api');
const UserInfo = require('@/models/globalModels');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const geetest = require('@/models/validate/geetest').default;
const errCode = require('@/util/errCode').default;
const utils = require('@/util/utils').default;
const validate = require('@/models/validate/validate').default;
const l180n = require('@/languages/I18n').default;
const globalModels = require('@/models/globalModels');

const extract = {
    locale: '',
    initWType: '',
    name: 'FROM_DATA',
    promptText: l180n.$t('10407'),
    // promptText: '如果您希望将本地数字资产提出至某地址，则该地址及为您的提币地址。 *某些地址可能需要您提供地址的标签，请务必填写，否则有丢失币的风险 *填写错误可能导致资产损失，请仔细核对 *完成LV3身份认证后，24h提币额度提升至100BTC，如需更多请联系客服',
    UserInfo: {},
    showCurrencyMenu: false, // 选币打开 关闭
    selectActiveId: {
        wType: ''
    },
    selectList: [],
    linkButtonList: [],
    currentExtractableNum: '0', // 可提
    currentSelect: {}, // 选中的币种
    currenLinkBut: '', // 选中链名字
    currentFees: {}, // 最小值 手续费
    isChangeClose: false, // 是否修改弹框关闭事件
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
    isReqFees: false,
    getCoinInfo: function () {
        extract.coinInfo = wlt.coinInfo;
        extract.getCurrentCoinFees();
        // const params = { locale: extract.locale, vp: Conf.exchId };
        // webApi.getCoinInfo(params).then(res => {
        //     if (res.result.code === 0) {
        //         extract.coinInfo = res.result.data;
        //         return extract.getCurrentCoinFees();
        //         // return extract.getSelectListData();
        //     }
        //     window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
        // });
    },
    getCurrentCoinFees: function () {
        const self = this;
        if (self.isReqFees) {
            return;
        }
        self.isReqFees = true;
        webApi.getCoinFees().then(res => {
            self.isReqFees = false;
            if (res.result.code === 0) {
                self.feesList = res.feeList;
                return extract.getSelectListData();
            }
            window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
        });
    },
    getSelectListData: function () {
        const selectList = [...wlt.wallet['03']];
        let index = 0;
        for (let i = 0; i < selectList.length; i++) {
            selectList[i].label = selectList[i].wType + ' | ' + wlt.wltFullName[selectList[i].wType].name;
            selectList[i].id = selectList[i].wType;
            if (this.initWType === selectList[i].wType) {
                index = i;
                this.selectActiveId.wType = selectList[i].wType;
            }
        }
        this.selectActiveId.wType = selectList.id;
        this.selectList = selectList;
        this.currentSelect = this.selectList[index];
        this.checkIdcardVerify();
        this.getlinkButtonListData();
        m.redraw();
    },
    getlinkButtonListData: function () {
        this.currenLinkBut = '';
        this.errCodeToNull();
        this.getCurrentFeesChange();
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
        if (this.linkButtonList.length > 0) {
            this.currenLinkBut = this.linkButtonList[0].attr;
            this.getCurrentFeesChange(true);
        }
    },
    getCurrentFeesChange: function (isLinkBut) {
        const wType = isLinkBut ? this.currenLinkBut : this.currentSelect.wType;
        this.currentFees = this.feesList.find(item => item.wType === wType);
        this.getExtractableCoinToBTCNum();
    },
    getExtractableCoinToBTCNum: function () {
        const price = wlt.getPrz(this.currentSelect.wType);
        const btcPrice = wlt.getPrz('BTC');
        const usableCoin = this.currentSelect.wdrawable - this.currentFees.withdrawFee > 0 ? this.currentSelect.wdrawable - this.currentFees.withdrawFee : 0;
        const BTCNum = Number(usableCoin * price / btcPrice).toFixed(8);
        if (BTCNum > 2) return this.getExtractableNum(BTCNum);
        this.currentExtractableNum = Number(usableCoin).toFixed(8);
    },
    getBTCToCoin: function (BTCNum) {
        const price = wlt.getPrz(this.currentSelect.wType);
        const btcPrice = wlt.getPrz('BTC');
        return Number(BTCNum * btcPrice / price).toFixed(8);
    },
    getExtractableNum: function (BTCNum) {
        if (this.UserInfo.iStatus === 9) {
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
            aid: user.uid + '01',
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
            window.$message({ content: l180n.$t('10338')/* '系统繁忙' */, type: 'danger' });
        });
    },
    handleSubmit: function () {
        if (this.errorShow.unmber.show || this.errorShow.address.show) return false;
        if (!this.extractCoin.address) {
            this.errorShow.address.show = true;
            this.errorShow.address.text = l180n.$t('10401')/* '提币地址不能为空' */;
            return;
        }
        if (this.extractCoin.coinNum <= 0) return window.$message({ content: l180n.$t('10402')/* '输入值不能为0' */, type: 'danger' });
        geetest.verify();
    },
    readrSendEmail: function (params, user, seq) {
        const emailParms = {
            seq,
            email: user.email,
            host: ActiveLine.WEBSITE + '/m/#/accounts',
            fn: 'wda',
            lang: extract.locale,
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
        }).catch(e => { window.$message({ content: l180n.$t('10338')/* '系统繁忙' */, type: 'danger' }); });
    },
    readyStartSafetyVerify: function (start) {
        if (start !== 'success') return;
        const funName = extract.UserInfo?.setting2fa.google && extract.UserInfo?.setting2fa.phone ? 'activeSmsAndGoogle' : extract.UserInfo?.setting2fa.google ? 'activeGoogle' : 'activeSms';
        if ((extract.UserInfo?.setting2fa.google && extract.UserInfo?.setting2fa.phone) || extract.UserInfo?.setting2fa.phone) {
            validate[funName]({
                securePhone: utils.hideMobileInfo(extract.UserInfo.phone),
                phoneNum: extract.UserInfo.nationNo + '-' + extract.UserInfo.phone
            }, res => {
                extract.sendExtractCoin();
                extract.handleChangeShow(); // 关闭 a
            });
        }
        if (extract.UserInfo?.setting2fa.google) {
            validate[funName](res => {
                extract.sendExtractCoin();
                extract.handleChangeShow(); // 关闭 a
            });
        }
        extract.handleChangeShow(true); // 打开 a
    },
    handleChangeShow: function (isHandleVerify) {
        extract.isChangeClose = false;
        extract.popUpData = {
            show: !extract.popUpData.show,
            isHandleVerify,
            title: { text: isHandleVerify ? l180n.$t('10113')/* 安全验证 */ : l180n.$t('10082') /* '温馨提示' */ }
        };
        m.redraw();
    },
    handleTotalShow: function ({ content, buttonText, buttonClick, doubleButtonCof, doubleButton, isLinshiErWeiMa }) {
        extract.isChangeClose = true;
        extract.popUpData = {
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
    handleUserCanAction: function () {
        if (this.UserInfo.setting2fa.email !== 1 || (this.UserInfo.setting2fa.google !== 1 && this.UserInfo.setting2fa.phone !== 1)) {
            return this.handleTotalShow({ content: l180n.$t('10540') /* '提币需邮件确认，请先绑定邮箱 为了您的账户安全，还需绑定手机或谷歌' */, isLinshiErWeiMa: true });
        }
        // if (this.UserInfo.setting2fa.email !== 1) {
        //     return this.handleTotalShow({ content: l180n.$t('10404') /* '提币需邮件确认，请先绑定邮箱' */, buttonText: l180n.$t('10229') /* '邮箱验证' */, buttonClick: () => { m.route.set("/my"); } });
        // }
        // const doubleButtonCof = [
        //     { text: l180n.$t('10227') /* '谷歌验证' */, issolid: false, click: () => { m.route.set("/my"); } },
        //     { text: l180n.$t('10228') /* '手机验证' */, issolid: true, click: () => { m.route.set("/my"); } }
        // ];
        // if (this.UserInfo.setting2fa.google !== 1 && this.UserInfo.setting2fa.phone !== 1) {
        //     return this.handleTotalShow({ content: l180n.$t('10405')/* '为了您的账户安全，请先绑定手机或谷歌' */, doubleButton: true, doubleButtonCof });
        // }
    },
    oninit: function (initWType) {
        const self = this;
        wlt.init();
        this.initGeetest();
        this.initWType = initWType;
        this.locale = l180n.getLocale();
        self.UserInfo = UserInfo.getAccount();
        if (Object.keys(self.UserInfo).length > 0) {
            self.handleUserCanAction();
        } else {
            broadcast.onMsg({
                key: this.name,
                cmd: broadcast.GET_USER_INFO_READY,
                cb: (data) => { self.UserInfo = data; self.handleUserCanAction(); console.log(self.UserInfo, 2); }
            });
        }
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.MSG_WLT_READY,
            cb: self.getCoinInfo
        });
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.MSG_ASSETD_UPD,
            cb: () => {
                if (wlt.wallet['03'].length > 0) self.getExtractableCoinToBTCNum(); m.redraw();
            }
        });
        if (wlt.wallet['01'].toString()) {
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
        // broadcast.offMsg({
        //     key: this.name,
        //     cmd: broadcast.MSG_WLT_READY,
        //     isall: true
        // });
        // 生命周期结束清空列表选中字段并关闭列表
        this.showCurrencyMenu = false;
        this.selectActiveId.wType = '';
        this.errCodeToNull();
    },
    errCodeToNull: function () {
        this.extractCoin.address = '';
        this.extractCoin.coinNum = '';
        this.extractCoin.linkName = '';
        this.errorShow = {
            address: {
                show: false,
                text: ''
            },
            unmber: {
                show: false,
                text: ''
            }
        };
    },
    // 检查当前币种提现是否需要身份认证
    checkIdcardVerify: function() {
        if (this.currentSelect.Setting.idcardVerifyWithdraw === true) {
            const account = globalModels.getAccount();
            if (extract.popUpData.show) return;
            if (account.iStatus === 0 || account.iStatus === 2) {
                this.handleTotalShow({ content: l180n.$t('10534') /* ' 为了您的账户安全，请按照提示实名认证！' */, isLinshiErWeiMa: true });
            } else if (account.iStatus === 1) {
                this.handleTotalShow({ content: l180n.$t('10535') /* '为了您的账户安全，实名认证通过后才可提现！' */, isLinshiErWeiMa: false });
            }
        }
    }
};

module.exports = extract;