const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const MyWalletIndexView = require('@/pages/page/myAssets/myWalletIndex/MyWalletIndexView');
const TradeAccountIndex = require('@/pages/page/myAssets/tradeAccount/TradeAccountIndex');
const MyWalletIndex = require('@/pages/page/myAssets/myWallet/MyWalletIndex');

const myWalletIndex = {
    currency: 'BTC',
    setCurrency: function (param) {
        myWalletIndex.currency = param;
    },
    totalValue: 0, // 总资产
    setTotalValue: function (param) {
        myWalletIndex.totalValue = param;
    },
    totalCNY: 0, // 人民币
    setTotalCNY: function (param) {
        myWalletIndex.totalCNY = param;
    },
    walletTotalValue: 0, // 我的钱包总资产
    setWalletTotalValue: function (param) {
        myWalletIndex.walletTotalValue = param;
    },
    tradingAccountTotalValue: 0, // 交易账户总资产
    setTradingAccountTotalValue: function (param) {
        myWalletIndex.tradingAccountTotalValue = param;
    },
    hideMoneyFlag: false, // 是否隐藏资产
    hideValue: function () {
        if (myWalletIndex.hideMoneyFlag) {
            myWalletIndex.hideMoneyFlag = !myWalletIndex.hideMoneyFlag;
            myWalletIndex.setTotalValue(wlt[myWalletIndex.currency === 'BTC' ? 'totalValueForBTC' : 'totalValueForUSDT']);
            myWalletIndex.setTotalCNY(wlt[myWalletIndex.currency === 'BTC' ? 'totalCNYValueForBTC' : 'totalCNYValueForUSDT']);
        } else {
            myWalletIndex.hideMoneyFlag = !myWalletIndex.hideMoneyFlag;
            myWalletIndex.setTotalValue('******');
            myWalletIndex.setTotalCNY('******');
        }
    },
    wltTotal: 0, // 我的钱包
    setWltTotal: function (param) {
        myWalletIndex.wltTotal = param;
    },
    accountTotal: 0, // 交易账户
    setAccountTotal: function (param) {
        myWalletIndex.accountTotal = param;
    },
    // 币币
    coinTotal: 0,
    setCoinTotal: function (param) {
        myWalletIndex.coinTotal = param;
    },
    // 法币
    legalTotal: 0,
    setLegalTotal: function (param) {
        myWalletIndex.legalTotal = param;
    },
    // 合约
    contractTotal: 0,
    setContractTotal: function (param) {
        myWalletIndex.contractTotal = param;
    },
    swValue: 0, // 0:我的钱包 1:交易账户 2:其他账户
    switchChange: function (val, type) {
        console.log('type', type);
        if (type) {
            this.wltIdx = val;
        }
        myWalletIndex.swValue = val;
    },
    wltIdx: 0,
    switchContent: function () {
        broadcast.emit({ cmd: broadcast.CHANGE_SW_CURRENCY, data: myWalletIndex.currency });
        switch (myWalletIndex.swValue) {
        case 0:
            return m(MyWalletIndex);
        case 1:
            return m(TradeAccountIndex, { idx: this.wltIdx });
        default:
            break;
        }
    },
    Nav: {
        firstNav: [
            {
                title: '充币',
                // 跳转至哪个链接 例如：to: 'http://www.baidu.com'
                to: '#!/chargeMoney'
            },
            {
                title: '提币',
                // 跳转至哪个链接
                to: ''
            },
            {
                title: '内部转账',
                // 跳转至哪个链接
                to: ''
            },
            {
                title: '资金划转',
                // 跳转至哪个链接
                to: ''
            }
        ]
    },
    toPage: function (val) {
        if (val === "") {
            return;
        }
        window.location.href = val;
    },
    switchDisplay: function (param, flag) {
        if (param === 'tradeCard') {
            if (flag === 'show') {
                document.getElementsByClassName('tradeCard')[0].style.display = '';
            } else if (flag === 'hide') {
                document.getElementsByClassName('tradeCard')[0].style.display = 'none';
            }
        }
    },
    selectOpFlag: false,
    selectOpText: 'BTC',
    selectOp: ['BTC', 'USDT'],
    // 切换ul（select）的显示隐藏
    setSelectOpFlag: function() {
        event.stopPropagation();
        myWalletIndex.selectOpFlag = !myWalletIndex.selectOpFlag;
        if (myWalletIndex.selectOpFlag) {
            document.getElementsByTagName('ul')[0].style.display = '';
        } else {
            document.getElementsByTagName('ul')[0].style.display = 'none';
        }
    },
    setSelectOpText: function(param) {
        myWalletIndex.selectOpText = param;
    },
    // 设置button（option）显示的值
    selectOpHideUl: function(item) {
        document.getElementsByTagName('ul')[0].style.display = 'none';
        myWalletIndex.setSelectOpText(item);
        myWalletIndex.setCurrency(item);
        broadcast.emit({ cmd: broadcast.CHANGE_SW_CURRENCY, data: item });
        item === 'BTC' ? myWalletIndex.setTotalValue(wlt.totalValueForBTC) : myWalletIndex.setTotalValue(wlt.totalValueForUSDT);
        item === 'BTC' ? myWalletIndex.setWalletTotalValue(wlt.walletTotalValueForBTC) : myWalletIndex.setWalletTotalValue(wlt.walletTotalValueForUSDT);
        item === 'BTC' ? myWalletIndex.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForBTC) : myWalletIndex.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForUSDT);
    },
    // 点击除button的元素隐藏ul（仿select）
    optionDisplay: function(event) {
        if (event.target.tagName !== 'BUTTON') {
            myWalletIndex.selectOpFlag = false;
            document.getElementsByTagName('ul')[0].style.display = 'none';
        }
    },
    changeBtnSty: function (index, type) {
        if (index !== 0) {
            const ele = document.getElementsByClassName('Operation' + index)[0];
            if (type === 'show') {
                ele.classList.value = ele.classList.value.replace('bgNone has-text-primary has-line-level-2', 'has-bg-primary');
            } else {
                ele.classList.value = ele.classList.value.replace('has-bg-primary', 'bgNone has-text-primary has-line-level-2');
            }
        }
    },
    changeTradeAccount: function(param) {
        console.log('param-------------------------', param);
        // 点击交易账户(...)中则显示对应page
        myWalletIndex.switchChange(1);
        this.wltIdx = param;
        window.event.stopPropagation();
        myWalletIndex.switchContent();
        // broadcast.emit({ cmd: broadcast.MA_CHANGE_TRADE_PAGE, data: param });
    },
    DelayDataAcquisition: function() {
        myWalletIndex.setTotalValue(wlt.totalValueForBTC);
        myWalletIndex.setWalletTotalValue(wlt.walletTotalValueForBTC);
        myWalletIndex.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForBTC);
        myWalletIndex.setLegalTotal(wlt.legalTotalValueForBTC);
        myWalletIndex.setContractTotal(wlt.contractTotalValueForBTC);
        myWalletIndex.setCoinTotal(wlt.coinTotalValueForBTC);
        myWalletIndex.setTotalCNY(wlt.totalCNYValueForBTC);
        m.redraw();
    }
};
module.exports = {
    oninit: function() {
        // Http.getWallet({
        //     exChannel: 30
        // }).then(function(arg) {
        //     console.log(arg, '11111');
        // });
    },
    oncreate: function() {
        wlt.init();
        setTimeout(myWalletIndex.DelayDataAcquisition, '100');
    },
    data: {
        my: 'nzm'
    },
    view: function () {
        const props = {
            myWalletIndex: myWalletIndex
        };
        return MyWalletIndexView(props);
    },
    onremove: function() {
        wlt.remove();
    }
};