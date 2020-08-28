const m = require('mithril');
const { Conf, webApi, wsApi } = require('@/newApi2');
const UserInfo = require('@/models/globalModels');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const geetest = require('@/models/validate/geetest').default;
console.log(wsApi, wlt);
const extract = {
    name: 'FROM_DATA',
    promptText: '*如果您希望将本地数字资产提出至某地址，则该地址及为您的提币地址。 *某些地址可能需要您提供地址的标签，请务必填写，否则有丢失币的风险 *填写错误可能导致资产损失，请仔细核对 *完成LV3身份认证后，24h提币额度提升至100BTC，如需更多请联系客服',
    selectList: [],
    linkButtonList: [],
    currentExtractableNum: '0', // 可提
    currentSelect: {}, // 选中的币种
    currenLinkBut: '', // 选中链名字
    currentFees: {}, // 最小值 手续费
    coinInfo: {},
    feesList: [],
    errorShow: {
        address: false,
        unmber: false
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
                extract.getSelectListData();
            }
        });
    },
    getCurrentCoinFees: function () {
        const self = this;
        webApi.getCoinFees().then(res => {
            if (res.result.code === 0) {
                self.feesList = res.feeList;
            }
        });
    },
    getSelectListData: function () {
        this.selectList = [...wlt.wallet['03']];
        this.currentSelect = this.selectList[0];
        this.getlinkButtonListData();
        m.redraw();
    },
    getlinkButtonListData: function () {
        this.getCurrentFeesChange();
        this.getExtractableCoinToBTCNum();
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
        if (this.linkButtonList.length > 0) this.currenLinkBut = this.linkButtonList[0].name;
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
        const userInfo = UserInfo.getAccount();
        if (this.currentSelect?.Setting?.idcardVerifyWithdraw && userInfo.iStatus === 9) {
            this.currentExtractableNum = this.getBTCToCoin(BTCNum > 100 ? 100 : BTCNum);
        } else {
            this.currentExtractableNum = this.getBTCToCoin(2);
        }
    },
    handleSubmit: function () {
        console.log(UserInfo.getAccount());
        if (this.errorShow.unmber || this.errorShow.address) return false;
        const user = UserInfo.getAccount();
        const params = {
            token: user.token,
            wType: this.currentSelect.wType,
            money: this.extractCoin.coinNum,
            aid: user.uid + '06',
            addr: this.extractCoin.address,
            op: 0
        };
        if (this.currentSelect.wType === 'XRP' || this.currentSelect.wType === 'EOS') {
            params.addr = this.extractCoin.address + ',' + this.extractCoin.linkName;
        }
        webApi.withdrawDeposit(params).then(res => {
            console.log(res);
        }).catch(e => {
            geetest.verify();
            console.log(e, '提币确定');
        });
    },
    oninit: function () {
        const self = this;
        wlt.init();
        this.initGeetest();
        self.getCurrentCoinFees();
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
            cb: res => {
                if (res === 'success') {
                    console.log(1);
                } else {
                    console.log(2);
                }
            }
        });
    },
    onremove: function () {
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