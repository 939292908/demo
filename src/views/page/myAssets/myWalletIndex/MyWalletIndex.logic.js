const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const table = require('@/views/page/myAssets/myWalletIndex/tradeTable/TradeTable.view');
const transferLogic = require('@/views/page/myAssets/transfer/transfer.logic.js'); // 划转模块逻辑
// const I18n = require('@/languages/I18n').default;

const model = {
    currency: 'BTC',
    totalValue: 0, // 总资产
    totalCNY: 0, // 人民币
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
    showCurrencyMenu: false, // show币种菜单
    selectOp: [{ id: 'BTC', label: 'BTC' }, { id: 'USDT', label: 'USDT' }], // 币种列表
    form: {
        wType: '' // 当前币种选中值
    },
    // 币种 菜单配置
    getCurrencyMenuOption: function () {
        const that = this;
        return {
            evenKey: `myWalletIndex${Math.floor(Math.random() * 10000)}`,
            showMenu: that.showCurrencyMenu,
            setShowMenu: type => {
                that.showCurrencyMenu = type;
            },
            class: `myCoinSelect`,
            activeId: cb => cb(that.form, 'wType'),
            onClick (item) {
                broadcast.emit({ cmd: broadcast.CHANGE_SW_CURRENCY, data: item.id });
                that.setCurrency(item.id);
                that.sets();
            },
            getList () {
                return that.selectOp;
            }
        };
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
        this.hideMoneyFlag = !this.hideMoneyFlag;
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
    switchChange: function (val, type) {
        if (val === 'none') {
            return window.$message({ title: '提示', content: '暂未开放，敬请期待', type: 'primary' });
        }
        this.swValue = val;
        transferLogic.setTransferModalOption({
            transferFrom: val // from钱包默认选中
        });
        if (type === 'small') {
            // 防止被交易账户01覆盖交易账户悬浮卡片的值
            window.event.stopPropagation();
        }
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
        const that = this;
        if (item.id === 4) { // 点击资金划转
            // transferLogic.isShow = true;
            transferLogic.setTransferModalOption({
                isShow: true,
                transferFrom: model.swValue,
                coin: "",
                successCallback() { // 划转成功回调
                    that.sets();
                }
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
    initFn: function() {
        wlt.init();

        this.form.wType = this.selectOp[0].id;
        // 获取当前网址，如：http://localhost:8080/#!/myWalletIndex?id=03
        const currencyIndex = window.document.location.href.toString().split('=')[1];
        if (currencyIndex === '03' || currencyIndex === '02' || currencyIndex === '01' || currencyIndex === '04') {
        // if (currencyIndex === '03' || currencyIndex === '02' || currencyIndex === '01') {
            this.switchChange(currencyIndex);
            this.setSwValue(currencyIndex);
        } else {
            this.switchChange('03');
            this.setSwValue('03');
        }

        const self = this;
        broadcast.onMsg({
            key: this.currency,
            cmd: broadcast.MSG_WLT_READY,
            cb: function () {
                self.sets();
            }
        });
        broadcast.onMsg({
            key: this.currency,
            cmd: broadcast.MSG_WLT_UPD,
            cb: function () {
                self.sets();
            }
        });
        self.sets();
    },
    createFn: function() {
        this.sets();
    },
    removeFn: function() {
        broadcast.offMsg({
            key: this.currency,
            cmd: broadcast.MSG_WLT_READY,
            isall: true
        });
    }
};
module.exports = model;
// export default model;