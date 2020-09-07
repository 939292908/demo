const m = require('mithril');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const table = require('@/views/page/myAssets/myWalletIndex/tradeTable/TradeTable.view');
const transferLogic = require('@/views/page/myAssets/transfer/transfer.logic.js'); // 划转模块逻辑
const I18n = require('@/languages/I18n').default;
const gM = require('@/models/globalModels');

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
    rechargeFlag: null, // 充币总开关
    transferFlag: null, // 划转总开关
    withdrawFlag: null, // 提币总开关
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
    option: {
        evenKey: "optionkey",
        currentId: 1,
        btnWidth: 70,
        menuWidth: 70,
        showMenu: false,
        setOption (option) {
            this.showMenu = option.showMenu;
            this.currentId = option.currentId ? option.currentId : this.currentId;
        },
        onClick(item) {
            broadcast.emit({ cmd: broadcast.CHANGE_SW_CURRENCY, data: item.label });
            model.setCurrency(item.label);
            model.sets();
        },
        renderHeader(item) {
            return m('div', { class: `selectDiv` }, [
                m('span', { class: `has-text-primary` }, item.label)
            ]);
        },
        menuList() {
            return [
                {
                    id: 1,
                    label: 'BTC'
                },
                {
                    id: 2,
                    label: 'USDT'
                }
            ];
        }
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
            return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10513') /* '暂未开放，敬请期待' */, type: 'primary' });
        }
        // console.log(val);
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
        firstNav: []
    },
    setFirstNav() {
        this.Nav.firstNav = [
            {
                id: 1,
                title: I18n.$t('10056') /* '充币' */,
                // 跳转至哪个链接 例如：to: 'http://www.baidu.com || /chargeMoney'
                to: '/recharge',
                flag: this.rechargeFlag
            },
            {
                id: 2,
                title: I18n.$t('10057') /* '提币' */,
                // 跳转至哪个链接
                to: '/extractCoin',
                flag: this.withdrawFlag
            },
            // {
            //     id: 3,
            //     title: I18n.$t('10058') '内部转账',
            //     // 跳转至哪个链接
            //     to: ''
            // },
            {
                id: 4,
                title: I18n.$t('10059') /* '资金划转' */,
                // 跳转至哪个链接
                to: '',
                flag: this.transferFlag
            }
        ];
    },
    // 按钮事件
    handlerClickNavBtn (item) {
        if (!item.flag) {
            return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10513') /* '暂未开放，敬请期待' */, type: 'primary' });
        }
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

        const currencyIndex = window.router.getUrlInfo().params.id;
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

        broadcast.onMsg({
            key: this.currency,
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: (arg) => {
                // console.log('切换语言');
                self.setFirstNav();
            }
        });

        self.form.wType = self.currency;
    },
    createFn: function() {
        broadcast.onMsg({
            key: this.currency,
            cmd: broadcast.GET_FUNLIST_READY,
            cb: (arg) => {
                console.log('123', arg);
                m.redraw();
            }
        });
        this.transferFlag = gM.getFunctions().transfer;
        this.rechargeFlag = gM.getFunctions().recharge;
        this.withdrawFlag = gM.getFunctions().withdraw;
        this.setFirstNav();
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