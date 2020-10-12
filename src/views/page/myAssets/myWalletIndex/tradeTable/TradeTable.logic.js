const broadcast = require('@/broadcast/broadcast');
const wlt = require('@/models/wlt/wlt');
const transferLogic = require('@/views/page/myAssets/transfer/transfer.logic.js'); // 划转模块逻辑
const I18n = require('@/languages/I18n').default;
const gM = require('@/models/globalModels');
const m = require('mithril');

module.exports = {
    vnode: {},
    currency: 'BTC',
    hideZeroFlag: false, // 是否隐藏0资产 默认为false，
    pageFlag: '01', // 01：合约账户，02：币币账户，03：我的钱包，04：法币账户，06：跟单账户
    accountTitle: '', // 交易账户中表格右上角的币种
    accountBanlance: 0, // 交易账户中表格右上角的币种总额
    oldValue: null, // 优化一直执行update
    oldHideMoneyFlag: null, // 优化一直执行update
    rechargeFlag: null, // 充币总开关
    transferFlag: null, // 划转总开关
    withdrawFlag: null, // 提币总开关
    tradeNavAry: [], // 交易账户导航-合约账户，币币账户，法币账户
    otherNavAry: [], // 其他账户导航-跟单账户
    coinType: 'wallet',
    tableDateList: 'walletData',
    isShowNoneData: false, // 表格是否有数据,
    tableNewAry: [], // 表格显示的数组
    columnData: { // 表格列
        wallet: [],
        coin: [],
        contract: [],
        legal: [],
        documentary: []
    },
    tableData: { // 表格数据
        walletData: [],
        coinData: [],
        contractData: [],
        legalData: [],
        documentaryData: []
    },
    initOtherNavAry() {
        this.otherNavAry = [{ idx: '06', val: I18n.$t('10548') /* '跟单账户' */ }];
    },
    setNavAry() {
        this.tradeNavAry = [{ idx: '01', val: I18n.$t('10072') /* '合约账户' */ }, { idx: '02', val: I18n.$t('10073') /* '币币账户' */ }, { idx: '04', val: I18n.$t('10074') /* '法币账户' */ }];
    },
    setPageFlag: function (param) {
        this.pageFlag = param;
        if (param === '01') {
            this.coinType = 'contract';
            this.tableDateList = 'contractData';
            this.accountTitle = I18n.$t('10072'); /* '合约账户' */
        } else if (param === '02') {
            this.coinType = 'coin';
            this.tableDateList = 'coinData';
            this.accountTitle = I18n.$t('10073'); /* '币币账户' */
        } else if (param === '04') {
            this.coinType = 'legal';
            this.tableDateList = 'legalData';
            this.accountTitle = I18n.$t('10074'); /* '法币账户' */
        } else if (param === '06') {
            this.coinType = 'documentary';
            this.tableDateList = 'documentaryData';
            this.accountTitle = I18n.$t('10548'); /* '跟单账户' */
        } else if (param === '03') {
            this.coinType = 'wallet';
            this.tableDateList = 'walletData';
        }
        this.initAccountBanlance();
        this.setTableNewAry();
        m.redraw();
    },
    // 交易账户 导航 右侧 金额
    initAccountBanlance: function() {
        this.accountBanlance = this.currency === 'BTC' ? wlt[this.coinType + 'TotalValueForBTC'] : wlt[this.coinType + 'TotalValueForUSDT'];
    },
    // 设置当前选中币种
    setCurrency: function(param) {
        this.currency = param;
        this.initColumnData();
    },
    // 各账户数据
    initTableData: function () {
        this.tableData.legalData = wlt.wallet['04']; // 法币
        this.tableData.walletData = wlt.wallet['03']; // 我的钱包
        this.tableData.contractData = wlt.wallet['01']; // 合约
        this.tableData.coinData = wlt.wallet['02']; // 币币
        this.tableData.documentaryData = wlt.wallet['06']; // 跟单
    },
    // 各账户表格字段
    initColumnData: function () {
        this.columnData = {
            // 我的钱包
            wallet: [
                { col: I18n.$t('10063') /* '币种' */, val: 'wType' },
                { col: I18n.$t('10064') /* '总额' */, val: 'TOTAL' },
                { col: I18n.$t('10065') /* '可用' */, val: 'NL' },
                { col: I18n.$t('10066') /* '锁定' */, val: 'depositLock' },
                { col: this.currency + I18n.$t('10516') /* '估值' */, val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: I18n.$t('10068') /* '操作' */, val: [{ operation: I18n.$t('10056') /* '充币' */, to: '/recharge' }, { operation: I18n.$t('10057') /* '提币' */, to: '/extractCoin' }, { operation: I18n.$t('10071') /* '划转' */, to: '' }] }
            ],
            // 币币
            coin: [
                { col: I18n.$t('10063') /* '币种' */, val: 'wType' },
                { col: I18n.$t('10064') /* '总额' */, val: 'TOTAL' },
                { col: I18n.$t('10065') /* '可用' */, val: 'NL' },
                { col: I18n.$t('10080') /* '冻结' */, val: 'Frz' },
                { col: this.currency + I18n.$t('10516') /* '估值' */, val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: I18n.$t('10068') /* '操作' */, val: [{ operation: I18n.$t('10071') /* '划转' */, to: '' }, { operation: I18n.$t('10079') /* '去交易' */, to: '' }] }
            ],
            // 合约
            contract: [
                { col: I18n.$t('10063') /* '币种' */, val: 'wType' },
                { col: I18n.$t('10076') /* '账户权益' */, val: 'MgnBal' },
                { col: I18n.$t('10077') /* '未实现盈亏' */, val: 'UPNL' },
                { col: I18n.$t('10078') /* '可用保证金' */, val: 'NL' },
                { col: this.currency + I18n.$t('10516') /* '估值' */, val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: I18n.$t('10068') /* '操作' */, val: [{ operation: I18n.$t('10071') /* '划转' */, to: '' }, { operation: I18n.$t('10079') /* '去交易' */, to: '' }] }
            ],
            // 法币
            legal: [
                { col: I18n.$t('10063') /* '币种' */, val: 'wType' },
                { col: I18n.$t('10064') /* '总额' */, val: 'TOTAL' },
                { col: I18n.$t('10065') /* '可用' */, val: 'NL' },
                { col: I18n.$t('10080') /* '冻结' */, val: 'otcLock' },
                { col: this.currency + I18n.$t('10516') /* '估值' */, val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: I18n.$t('10068') /* '操作' */, val: [{ operation: I18n.$t('10071') /* '划转' */, to: '' }, { operation: I18n.$t('10079') /* '去交易' */, to: '' }] }
            ],
            // 跟单
            documentary: [
            ]
        };
    },
    // 表格中充币，提币，划转，去交易的点击事件
    jump: function (row, item) {
        const that = this;
        if (item.operation === I18n.$t('10071') /* '划转' */) {
            if (this.transferFlag === 1 && row.Setting.canTransfer) {
                transferLogic.setTransferModalOption({
                    isShow: true,
                    coin: row.wType, // 币种 默认选中
                    transferFrom: that.pageFlag,
                    successCallback() { // 划转成功回调
                        that.setPageFlag(that.pageFlag);
                        that.initAccountBanlance();
                    }
                });
            } else {
                return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10513') /* '暂未开放，敬请期待' */, type: 'primary' });
            }
        } else if (item.operation === I18n.$t('10056') /* '充币' */) {
            if (this.rechargeFlag === 1 && row.Setting.canRecharge) {
                window.router.push({ path: item.to, data: { wType: row.wType } });
            } else {
                return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10513') /* '暂未开放，敬请期待' */, type: 'primary' });
            }
        } else if (item.operation === I18n.$t('10057') /* '提币' */) {
            if (this.withdrawFlag === 1 && row.Setting.canWithdraw) {
                window.router.push({ path: item.to, data: { wType: row.wType } });
            } else {
                return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10513') /* '暂未开放，敬请期待' */, type: 'primary' });
            }
        } else if (item.operation === I18n.$t('10079') /* '去交易' */) {
            if (this.pageFlag === '01') {
                window.open('/w/trd/#!/future');
            } else {
                return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10513') /* '暂未开放，敬请期待' */, type: 'primary' });
            }
        }
    },
    // 表格隐藏0资产功能
    setHideZeroFlag: function () {
        this.hideZeroFlag = !this.hideZeroFlag;
        this.setTableNewAry();
        // console.log(this.hideZeroFlag);
        localStorage.setItem("isHideZeroFlag", this.hideZeroFlag);
    },
    // 处理表格显示的数组
    setTableNewAry: function () {
        const value = document.getElementsByClassName('coinSearch')[0].value;
        this.tableNewAry = []; // 初始化
        if (this.hideZeroFlag === true && value === '') { // 只隐藏
            // console.log('nzm', '只隐藏');
            for (const i of this.tableData[this.tableDateList]) {
                if ((this.coinType !== 'contract' ? (i.TOTAL !== '0.00000000' && i.TOTAL !== '0.0000') : (i.MgnBal !== '0.00000000' && i.MgnBal !== '0.0000'))) {
                    this.tableNewAry.push(i);
                }
            }
        } else if (this.hideZeroFlag === false && value !== '') { // 只输入
            // console.log('nzm', '只输入');
            for (const i of this.tableData[this.tableDateList]) {
                if (i.wType.toUpperCase().search(value.toUpperCase()) > -1) {
                    this.tableNewAry.push(i);
                }
            }
        } else if (this.hideZeroFlag === true && value !== '') { // 输入且隐藏
            // console.log('nzm', '输入且隐藏');
            for (const i of this.tableData[this.tableDateList]) {
                if ((this.coinType !== 'contract' ? (i.TOTAL !== '0.00000000' && i.TOTAL !== '0.0000') : (i.MgnBal !== '0.00000000' && i.MgnBal !== '0.0000')) && i.wType.toUpperCase().search(value.toUpperCase()) > -1) {
                    this.tableNewAry.push(i);
                }
            }
        } else if (!this.hideZeroFlag && value === '') { // 无操作
            // console.log('nzm', '无操作');
            this.tableNewAry = this.tableData[this.tableDateList];
        }
        // console.log(this.tableNewAry, '----------');
        this.tableNewAry.length === 0 ? this.isShowNoneData = true : this.isShowNoneData = false;
    },
    initFlag: function () {
        const fun = gM.getFunctions();
        this.transferFlag = fun.transfer;
        this.rechargeFlag = fun.recharge;
        this.withdrawFlag = fun.withdraw;
    },
    createFn: function (vnode) {
        const self = this;
        this.vnode = vnode;
        broadcast.onMsg({
            key: 'view-pages-Myassets-TablegB',
            cmd: broadcast.CHANGE_SW_CURRENCY,
            cb: (arg) => {
                this.setCurrency(arg);
                this.initAccountBanlance();
            }
        });

        // 资产数据变化
        broadcast.onMsg({
            key: 'view-pages-Myassets-TablegB',
            cmd: broadcast.MSG_WLT_UPD,
            cb: function () {
                self.initTableData();
                self.setTableNewAry();
            }
        });

        broadcast.onMsg({
            key: 'view-pages-Myassets-TablegB',
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: (arg) => {
                // console.log('切换语言');
                self.setNavAry();
                self.initOtherNavAry();
                self.setPageFlag(currencyIndex);
            }
        });

        // 总开关
        broadcast.onMsg({
            key: 'view-pages-Myassets-TablegB',
            cmd: broadcast.GET_FUNLIST_READY,
            cb: (arg) => {
                self.initFlag();
                m.redraw();
            }
        });
        self.initFlag();

        this.oldHideMoneyFlag = vnode.attrs.hideMoneyFlag;
        // 初始化表头
        this.initColumnData();
        // 初始化表格数据（表身）
        this.initTableData();
        // 初始化交易账户各账户名称与估值
        this.initAccountBanlance();

        const currencyIndex = window.router.getUrlInfo().params.id;
        if (currencyIndex === '03' || currencyIndex === '02' || currencyIndex === '01' || currencyIndex === '06' || currencyIndex === '04') {
            this.setPageFlag(currencyIndex);
        } else {
            this.setPageFlag('03');
        }

        // 本地存储 隐藏0资产标识 （刷新保留值）
        if (localStorage.getItem("isHideZeroFlag") !== null) {
            // console.log(localStorage.getItem("isHideZeroFlag"));
            localStorage.getItem("isHideZeroFlag") === 'true' ? this.hideZeroFlag = true : this.hideZeroFlag = false;
            this.setTableNewAry();
        }

        this.setNavAry();
        this.initOtherNavAry();
    },
    updateFn: function(vnode) {
        // console.log(2222222);
        // 阻止一直赋值 start
        if (this.oldValue !== vnode.attrs.swValue) {
            this.setPageFlag(vnode.attrs.swValue);
        }
        if (this.oldHideMoneyFlag !== vnode.attrs.hideMoneyFlag) {
            this.oldHideMoneyFlag = vnode.attrs.hideMoneyFlag;
            m.redraw();
            // console.log(1111111111, 'table updata', vnode.attrs.hideMoneyFlag, vnode.attrs.swValue);
        }
        this.oldValue = vnode.attrs.swValue;
        this.oldHideMoneyFlag = vnode.attrs.hideMoneyFlag;
        // 阻止一直赋值 end
    },
    removeFn: function () {
        broadcast.offMsg({
            key: 'view-pages-Myassets-TablegB',
            isall: true
        });
    }
};