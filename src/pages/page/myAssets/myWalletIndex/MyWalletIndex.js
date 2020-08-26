const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const MyWalletIndexView = require('@/pages/page/myAssets/myWalletIndex/MyWalletIndexView');
const TradeAccountIndex = require('@/pages/page/myAssets/tradeAccount/TradeAccountIndex');
const MyWalletIndex = require('@/pages/page/myAssets/myWallet/MyWalletIndex');

const myWalletIndex = {
    // 资金划转弹框 模块
    transferModal: {
        isShow: false,
        closeMe() {
            myWalletIndex.transferModal.isShow = false;
        },
        onOk() {
            myWalletIndex.transferModal.closeMe();
            console.log('onOk');
        },
        onClose() {
            myWalletIndex.transferModal.closeMe();
        }
    },
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
    wltIdx: 0, // 币币，法币，合约
    switchChange: function (val, type) {
        myWalletIndex.swValue = val;
        if (type !== undefined) {
            // 点击交易账户则默认显示合约
            this.wltIdx = 1;
        }
    },
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
                id: 1,
                title: '充币',
                // 跳转至哪个链接 例如：to: 'http://www.baidu.com || #!/chargeMoney'
                to: '#!/chargeMoney'
            },
            {
                id: 2,
                title: '提币',
                // 跳转至哪个链接
                to: ''
            },
            {
                id: 3,
                title: '内部转账',
                // 跳转至哪个链接
                to: ''
            },
            {
                id: 4,
                title: '资金划转',
                // 跳转至哪个链接
                to: ''
            }
        ]
    },
    // 按钮事件
    handlerClickNavBtn (item) {
        console.log(item);
        if (item.id === 4) { // 点击资金划转
            this.transferModal.isShow = true;
        }
        // if (item.to !== "") {
        //     this.toPage(item.to);
        // }
    },
    toPage: function (val) {
        if (val !== "") {
            window.location.href = val;
        }
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
    // 提币，内部转账，资金划转悬浮样式
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
        // 点击交易账户(...)中则显示对应page
        myWalletIndex.switchChange(1);
        this.wltIdx = param;
        // 阻止交易账户冒泡再次wltIdx赋值
        window.event.stopPropagation();
        // （我的钱包，交易账户）切换内容
        myWalletIndex.switchContent();
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
    oncreate: function() {
        wlt.init();
        setTimeout(myWalletIndex.DelayDataAcquisition, '100');
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