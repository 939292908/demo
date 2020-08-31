const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const table = require('@/views/page/myAssets/myWalletIndex/tradeTable/tradeTableView');
const tableIndex = require('@/views/page/myAssets/myWalletIndex/tradeTable/tradeTableIndex');
const transferLogic = require('@/views/page/myAssets/transfer/transfer.logic.js'); // 划转模块逻辑
let timeOut = null;

const model = {
    currency: 'BTC',
    totalValue: 0, // 总资产
    totalCNY: 0, // 人民币
    walletTotalValue: 0, // 我的钱包总资产
    tradingAccountTotalValue: 0, // 交易账户总资产
    otherTotalValue: 0, // 其他账户
    hideMoneyFlag: false, // 是否隐藏资产
    coinTotal: 0, // 币币
    legalTotal: 0, // 法币
    contractTotal: 0, // 合约
    swValue: '03', // 03:我的钱包 01:交易账户(01币币，02法币，04合约) 2:其他账户
    setSwValue(value) {
        model.swValue = value;
        // model.transferModalOption.transferFrom = model.swValue;
        transferLogic.transferModalOption.setTransferModalOption({
            transferFrom: model.swValue // from钱包默认选中
        });
    },
    selectOpFlag: false, // 是否显示币种列表
    selectOpText: 'BTC', // 默认币种BTC
    selectOp: ['BTC', 'USDT'], // 币种列表
    setCurrency: function (param) {
        this.currency = param;
    },
    setTotalValue: function (param) {
        this.totalValue = param;
    },
    setTotalCNY: function (param) {
        this.totalCNY = param;
    },
    setWalletTotalValue: function (param) {
        this.walletTotalValue = param;
    },
    setTradingAccountTotalValue: function (param) {
        this.tradingAccountTotalValue = param;
    },
    setOtherTotalValue: function (param) {
        this.otherTotalValue = param;
    },
    hideValue: function () {
        const ele = document.getElementsByClassName('changeMoneyImg')[0];
        if (this.hideMoneyFlag) { // 显示
            ele.classList.value = ele.classList.value.replace('yincang', 'zichanzhengyan');
            this.hideMoneyFlag = !this.hideMoneyFlag;
            this.setTotalValue(wlt[this.currency === 'BTC' ? 'totalValueForBTC' : 'totalValueForUSDT']);
            this.setTotalCNY(wlt.totalCNYValue);
        } else { // 隐藏
            ele.classList.value = ele.classList.value.replace('zichanzhengyan', 'yincang');
            this.hideMoneyFlag = !this.hideMoneyFlag;
            this.setTotalValue('******');
            this.setTotalCNY('******');
        }
    },
    setCoinTotal: function (param) {
        this.coinTotal = param;
    },
    setLegalTotal: function (param) {
        this.legalTotal = param;
    },
    setContractTotal: function (param) {
        this.contractTotal = param;
    },
    switchChange: function (val) {
        this.swValue = val;
        tableIndex.setPageFlag(val);
        console.log(this.swValue, '--this.swValue');
        transferLogic.transferModalOption.setTransferModalOption({
            transferFrom: val // from钱包默认选中
        });
        this.sets();
        this.switchContent();
    },
    switchContent: function () {
        broadcast.emit({ cmd: broadcast.CHANGE_SW_CURRENCY, data: this.currency });
        return m(table, { tableType: 'wallet', swValue: this.swValue, setIdx: this.setSwValue });
    },
    Nav: {
        firstNav: [
            {
                id: 1,
                title: '充币',
                // 跳转至哪个链接 例如：to: 'http://www.baidu.com || /chargeMoney'
                to: '/recharge'
            },
            {
                id: 2,
                title: '提币',
                // 跳转至哪个链接
                to: '/extractCoin'
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
            transferLogic.initTransferInfo(); // 初始化弹框
            transferLogic.transferModalOption.isShow = true;
        }
        // 弹框↑
        if (item.to !== "") { // 跳转
            window.router.push(item.to);
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
    // 切换币种列表的显示隐藏
    setSelectOpFlag: function() {
        this.selectOpFlag = !this.selectOpFlag;
        if (this.selectOpFlag) {
            document.getElementsByClassName('currType')[0].style.display = '';
        } else {
            document.getElementsByClassName('currType')[0].style.display = 'none';
        }
    },
    setSelectOpText: function(param) {
        this.selectOpText = param;
    },
    // 设置button（option）显示的值     切换currency
    selectOpHideUl: function(item) {
        document.getElementsByClassName('currType')[0].style.display = 'none';
        this.setSelectOpText(item);
        this.setCurrency(item);
        broadcast.emit({ cmd: broadcast.CHANGE_SW_CURRENCY, data: item });
        this.sets();
    },
    // 点击除button的元素隐藏币种列表
    optionDisplay: function(event) {
        if (event.target.classList.value.indexOf('showSelI') < 0 && event.target.classList.value.indexOf('showSelBtn') < 0) {
            this.selectOpFlag = false;
            document.getElementsByClassName('currType')[0].style.display = 'none';
        }
    },
    // 提币，内部转账，资金划转悬浮样式
    changeBtnSty: function (index, type) {
        if (index !== 0) {
            const ele = document.getElementsByClassName('Operation' + index)[0];
            if (type === 'show') {
                ele.classList.value = ele.classList.value.replace('has-text-primary bgNone', 'has-bg-primary');
            } else {
                ele.classList.value = ele.classList.value.replace('has-bg-primary', 'has-text-primary bgNone has-line-level-2');
            }
        }
    },
    sets: function () {
        this.currency === 'BTC' ? this.setTotalValue(wlt.totalValueForBTC) : this.setTotalValue(wlt.totalValueForUSDT);
        this.currency === 'BTC' ? this.setWalletTotalValue(wlt.walletTotalValueForBTC) : this.setWalletTotalValue(wlt.walletTotalValueForUSDT);
        this.currency === 'BTC' ? this.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForBTC) : this.setTradingAccountTotalValue(wlt.tradingAccountTotalValueForUSDT);
        this.currency === 'BTC' ? this.setOtherTotalValue(wlt.otherAccountTotalValueForBTC) : this.setOtherTotalValue(wlt.otherAccountTotalValueForUSDT);
        this.currency === 'BTC' ? this.setCoinTotal(wlt.coinTotalValueForBTC) : this.setCoinTotal(wlt.coinTotalValueForUSDT);
        this.currency === 'BTC' ? this.setLegalTotal(wlt.legalTotalValueForBTC) : this.setLegalTotal(wlt.legalTotalValueForUSDT);
        this.currency === 'BTC' ? this.setContractTotal(wlt.contractTotalValueForBTC) : this.setContractTotal(wlt.contractTotalValueForUSDT);
        this.setTotalCNY(wlt.totalCNYValue);
    },
    initFn: function() {
        m.redraw();
    },
    createFn: function() {
        wlt.init();
        timeOut = setTimeout(() => {
            this.sets();
        }, '100');
        m.redraw();
    },
    removeFn: function() {
        clearTimeout(timeOut);
        wlt.remove();
    }
};
module.exports = model;
// export default model;