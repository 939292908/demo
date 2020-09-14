const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const l180n = require('@/languages/I18n').default;
const broadcast = require('@/broadcast/broadcast');

const manageAssetData = {
    walletAcId: 'all',
    walletList: [],
    LBList: [],
    legalList: [],
    pirData: [],
    AssetOverview: {
        coinToBTC: 0, // 资产总额 BTC (账户权益 BTC)
        coinToCNY: 0, // 资产估值 CRN （账户权益 CRN）
        UPNLToBTC: 0, // 未实现盈亏 BTC
        UPNLToCRN: 0, // 未实现盈亏 CRN
        NLToBTC: 0, // 可用保证金 BTC
        NLToCRN: 0 // 可用保证金 CRN
    },
    isShow: true,
    handleEditShow: function () {
        this.isShow = !this.isShow;
        if (this.isShow) return this.getAssetOverview();
        this.AssetOverview = {
            coinToBTC: '******',
            coinToCNY: '******',
            UPNLToBTC: '******',
            UPNLToCRN: '******',
            NLToBTC: '******',
            NLToCRN: '******'
        };
    },
    handleChangeWallet: function (item) {
        this.walletAcId = item.activeId;
        this.getAssetOverview();
    },
    handleClickLBItem: function (item) {
        if (!item.toUrl) return window.$message({ title: l180n.$t('10410') /* '提示' */, content: l180n.$t('10594') /* 功能暂未开放，敬请期待 */, type: 'success' });
        window.router.push(item.toUrl);
    },
    getAssetOverview: function () {
        var walletAcText = '';
        var data = {};
        switch (this.walletAcId) {
        case "01":
            walletAcText = 'contractTotalValueFor';
            data = this.getAssetOverviewReplenish();
            break;
        case "02": walletAcText = 'coinTotalValueFor'; break;
        case "03": walletAcText = 'walletTotalValueFor'; break;
        case "04": walletAcText = 'legalTotalValueFor'; break;
        default: walletAcText = 'totalValueFor';
        }
        this.AssetOverview = {
            coinToBTC: wlt[`${walletAcText}BTC`] || 0,
            coinToCNY: wlt[`${walletAcText}CNY`] || 0,
            UPNLToBTC: data.UPNLToBTC?.toFixed(8),
            UPNLToCRN: data.UPNLToCRN?.toFixed(2),
            NLToBTC: data.NLToBTC?.toFixed(8),
            NLToCRN: data.NLToCRN?.toFixed(2)
        };
        m.redraw();
    },
    getAssetOverviewReplenish: function () {
        let UPNLToBTC = 0; let UPNLToCRN = 0;
        let NLToBTC = 0; let NLToCRN = 0;
        for (let i = 0; i < wlt.wallet['01'].length; i++) {
            UPNLToBTC += Number(wlt.wallet['01'][i].UPNLToBTC);
            UPNLToCRN += Number(wlt.wallet['01'][i].UPNLToCRN);
            NLToBTC += Number(wlt.wallet['01'][i].NLToBTC);
            NLToCRN += Number(wlt.wallet['01'][i].NLToCRN);
        }
        return { UPNLToBTC, UPNLToCRN, NLToBTC, NLToCRN };
    },
    getWltData: function () {
        this.pirData = [
            { name: l180n.$t('10055') /* '我的钱包' */, value: Number(wlt.walletTotalValueForUSDT) },
            { name: l180n.$t('10072') /* '合约账户' */, value: Number(wlt.contractTotalValueForUSDT) },
            { name: l180n.$t('10073') /* '币币账户' */, value: Number(wlt.coinTotalValueForUSDT) },
            { name: l180n.$t('10074') /* '法币账户' */, value: Number(wlt.legalTotalValueForUSDT) }
        ];
        this.getAssetOverview();
    },
    initList: function () {
        this.walletList = [
            { label: l180n.$t('10152') /* '资产总览' */, activeId: 'all' },
            { label: l180n.$t('10055') /* '我的钱包' */, activeId: '03' },
            { label: l180n.$t('10072') /* '合约账户' */, activeId: '01' },
            { label: l180n.$t('10073') /* '币币账户' */, activeId: '02' },
            { label: l180n.$t('10074') /* '法币账户' */, activeId: '04' }
        ];
        this.pirData = [
            { name: l180n.$t('10055') /* '我的钱包' */, value: 0 },
            { name: l180n.$t('10072') /* '合约账户' */, value: 0 },
            { name: l180n.$t('10073') /* '币币账户' */, value: 0 },
            { name: l180n.$t('10074') /* '法币账户' */, value: 0 }
        ];
        this.LBList = [
            { label: l180n.$t('10056') /* '充币' */, toUrl: '/recharge' },
            { label: l180n.$t('10057') /* '提币' */, toUrl: '/extractCoin' },
            { label: l180n.$t('10058') /* '内部转账' */, toUrl: '' },
            { label: l180n.$t('10059') /* '资金划转' */, toUrl: '' }
        ];
        this.legalList = [
            { label: l180n.$t('10220') /* '买' */, toUrl: '' },
            { label: l180n.$t('10221') /* '买' */, toUrl: '' },
            { label: l180n.$t('10071') /* '划转' */, toUrl: '' }
        ];
    },
    oninit: function () {
        const self = this;
        wlt.init();
        self.initList();
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.MSG_WLT_READY,
            cb: self.getWltData.bind(this)
        });
        if (wlt.wallet['01'].toString()) {
            self.getWltData();
        }
        broadcast.onMsg({
            key: this.name,
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: self.initList.bind(self)
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
            cmd: broadcast.MSG_LANGUAGE_UPD,
            isall: true
        });
        this.walletAcId = 'all';
        wlt.remove();
    }
};

module.exports = manageAssetData;