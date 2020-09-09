// const { Conf, webApi, ActiveLine } = require('@/api');
// const UserInfo = require('@/models/globalModels');
const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');

const manageAssetData = {
    walletAcId: 'all',
    walletList: [
        { label: '资产总览', activeId: 'all' },
        { label: '我的钱包', activeId: '03' },
        { label: '合约账户', activeId: '01' },
        { label: '币币账户', activeId: '02' },
        { label: '法币账户', activeId: '04' }
    ],
    LBList: [
        { label: '充币', toUrl: 'all' },
        { label: '提币', toUrl: '03' },
        { label: '内部转账', toUrl: '01' },
        { label: '资金划转', toUrl: '02' }
    ],
    AssetOverview: {
        coinToBTC: 0,
        coinToCNY: 0
    },
    handleChangeWallet: function (item) {
        this.walletAcId = item.activeId;
        this.handleChangeAssetOverview();
    },
    handleChangeAssetOverview: function () {
        var walletAcText = '';
        switch (this.walletAcId) {
        case "01": walletAcText = 'contractTotalValueFor'; break;
        case "02": walletAcText = 'coinTotalValueFor'; break;
        case "03": walletAcText = 'walletTotalValueFor'; break;
        case "04": walletAcText = 'legalTotalValueFor'; break;
        default: walletAcText = 'totalValueFor';
        }
        this.AssetOverview = {
            coinToBTC: wlt[`${walletAcText}BTC`] || 0,
            coinToCNY: wlt[`${walletAcText}CNY`] || 0
        };
        m.redraw();
    },
    getWltData: function () {
        console.log(wlt, 1111);
        this.handleChangeAssetOverview();
    },
    oninit: function () {
        const self = this;
        wlt.init();
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.MSG_WLT_READY,
            cb: self.getWltData.bind(this)
        });
        console.log(wlt);
        if (wlt.wallet['01'].toString()) {
            self.getWltData();
        }
    },
    onremove: function () {
        broadcast.offMsg({
            key: this.name,
            cmd: broadcast.MSG_WLT_READY,
            isall: true
        });
        this.walletAcId = 'all';
    }
};

module.exports = manageAssetData;