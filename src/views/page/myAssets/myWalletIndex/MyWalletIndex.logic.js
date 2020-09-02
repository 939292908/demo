const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const table = require('@/views/page/myAssets/myWalletIndex/tradeTable/TradeTable.view');
const transferLogic = require('@/views/page/myAssets/transfer/transfer.logic.js'); // 划转模块逻辑
let timeOut = null;

const model = {
    currency: 'BTC',
    totalValue: 0, // 总资产
    totalCNY: 0, // 人民币
    showCurrencyMenu: false, // show币种菜单
    walletTotalValue: 0, // 我的钱包总资产
    tradingAccountTotalValue: 0, // 交易账户总资产
    otherTotalValue: 0, // 其他账户
    hideMoneyFlag: false, // 是否隐藏资产 默认false不隐藏
    coinTotal: 0, // 币币
    legalTotal: 0, // 法币
    contractTotal: 0, // 合约
    swValue: '03', // 03:我的钱包 01:交易账户(01币币，02法币，04合约) 2:其他账户
    // 切换我的钱包。交易账户
    setSwValue(value) {
        model.swValue = value;
        // model.transferFrom = model.swValue;
        transferLogic.setTransferModalOption({
            transferFrom: model.swValue // from钱包默认选中
        });
    },
    // selectOpFlag: false, // 是否显示币种列表
    // selectOpText: 'BTC', // 默认币种BTC
    selectOp: [{ id: 'BTC', label: 'BTC' }, { id: 'USDT', label: 'USDT' }], // 币种列表
    form: {
        coin: this.selectOp[0]
    },
    // 设置币种
    setCurrency: function (param) {
        this.currency = param;
    },
    // 设置总估值
    setTotalValue: function (param) {
        this.totalValue = param;
    },
    // 设置人民币
    setTotalCNY: function (param) {
        this.totalCNY = param;
    },
    // 设置我的钱包总值
    setWalletTotalValue: function (param) {
        this.walletTotalValue = param;
    },
    // 设置交易账户总值
    setTradingAccountTotalValue: function (param) {
        this.tradingAccountTotalValue = param;
    },
    // 设置其他账户宗旨
    setOtherTotalValue: function (param) {
        this.otherTotalValue = param;
    },
    // 隐藏资产
    hideValue: function () {
        const ele = document.getElementsByClassName('changeMoneyImg')[0];
        if (this.hideMoneyFlag) { // 显示
            ele.classList.value = ele.classList.value.replace('yincang', 'zichanzhengyan');
            this.hideMoneyFlag = !this.hideMoneyFlag;
        } else { // 隐藏
            ele.classList.value = ele.classList.value.replace('zichanzhengyan', 'yincang');
            this.hideMoneyFlag = !this.hideMoneyFlag;
        }
    },
    // 设置币币总值
    setCoinTotal: function (param) {
        this.coinTotal = param;
    },
    // 设置法币总值
    setLegalTotal: function (param) {
        this.legalTotal = param;
    },
    // 设置合约总值
    setContractTotal: function (param) {
        this.contractTotal = param;
    },
    // 切换我的钱包，交易账户，币币，合约，法币
    switchChange: function (val) {
        this.swValue = val;
        transferLogic.setTransferModalOption({
            transferFrom: val // from钱包默认选中
        });
        // 防止被交易账户01覆盖交易账户悬浮卡片的值
        // window.event.stopPropagation();
        this.sets();
        this.switchContent();
    },
    // 切换表格内容
    switchContent: function () {
        broadcast.emit({ cmd: broadcast.CHANGE_SW_CURRENCY, data: this.currency });
        return m(table, { swValue: this.swValue, setIdx: this.setSwValue, hideMoneyFlag: this.hideMoneyFlag });
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
        if (item.id === 4) { // 点击资金划转
            // transferLogic.isShow = true;
            transferLogic.setTransferModalOption({
                isShow: true,
                transferFrom: model.swValue,
                coin: ""
            });
        }
        // 弹框↑
        if (item.to !== "") { // 跳转
            window.router.push(item.to);
        }
    },
    // 交易账户（...）显示与隐藏切换
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
    // 设置下拉框选中值
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
    // 设置各种估值
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
    getCurrencyMenuOption() {
        return {
            evenKey: `myWalletIndex${Math.floor(Math.random() * 10000)}`,
            activeId: cb => cb(model.form, 'coin'),
            showMenu: model.showCurrencyMenu,
            setShowMenu: type => {
                model.showCurrencyMenu = type;
            },
            onClick (item) {
                console.log(item);
                this.setCurrency(item);
                broadcast.emit({ cmd: broadcast.CHANGE_SW_CURRENCY, data: item });
                this.sets();
            },
            getList () {
                return model.selectOp;
            }
        };
    },
    initFn: function() {
        // 获取当前网址，如：http://localhost:8080/#!/myWalletIndex?id=03
        const currencyIndex = window.document.location.href.toString().split('=')[1];
        if (currencyIndex === '03' || currencyIndex === '02' || currencyIndex === '01' || currencyIndex === '04') {
            this.switchChange(currencyIndex);
            this.setSwValue(currencyIndex);
        } else {
            this.switchChange('03');
            this.setSwValue('03');
        }
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