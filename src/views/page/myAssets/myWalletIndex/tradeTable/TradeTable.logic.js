const broadcast = require('@/broadcast/broadcast');
const wlt = require('@/models/wlt/wlt');
const transferLogic = require('@/views/page/myAssets/transfer/transfer.logic.js'); // 划转模块逻辑
// const I18n = require('@/languages/I18n').default;
// const m = require('mithril');

module.exports = {
    vnode: {},
    currency: 'BTC',
    hideZeroFlag: false, // 是否隐藏0资产 默认为false，
    dataLength: 0, // 初始化时暂无数据
    pageFlag: '01', // 01：合约账户，02：币币账户，04：法币账户
    accountTitle: '', // 交易账户中表格右上角的币种
    accountBanlance: 0, // 交易账户中表格右上角的币种总额
    oldValue: null, // 优化一直执行update
    oldHideMoneyFlag: null, // 优化一直执行update
    columnData: { // 表格列
        wallet: [],
        coin: [],
        contract: [],
        legal: []
    },
    tableData: { // 表格数据
        walletData: [],
        coinData: [],
        contractData: [],
        legalData: []
    },
    // navAry: [{ idx: '01', val: '合约账户' }, { idx: '02', val: '币币账户' }],
    navAry: [{ idx: '01', val: '合约账户' }, { idx: '02', val: '币币账户' }, { idx: '04', val: '法币账户' }],
    coinType: 'wallet',
    tableDateList: 'walletData',
    setPageFlag: function (param) {
        this.pageFlag = param;
        this.vnode.attrs.setIdx(param);
        if (param === '01') {
            this.coinType = 'contract';
            this.tableDateList = 'contractData';
            this.accountTitle = '合约账户';
        } else if (param === '02') {
            this.coinType = 'coin';
            this.tableDateList = 'coinData';
            this.accountTitle = '币币账户';
        } else if (param === '04') {
            this.coinType = 'legal';
            this.tableDateList = 'legalData';
            this.accountTitle = '法币账户';
        } else if (param === '03') {
            this.coinType = 'wallet';
            this.tableDateList = 'walletData';
        }
        this.initAccountBanlance();
        this.setDataLength(this.tableData[this.tableDateList].length);
        this.searchTableData();
    },
    initAccountBanlance: function() {
        this.accountBanlance = this.currency === 'BTC' ? wlt[this.coinType + 'TotalValueForBTC'] : wlt[this.coinType + 'TotalValueForUSDT'];
    },
    setCurrency: function(param) {
        this.currency = param;
        this.initColumnData();
    },
    setDataLength: function (param) {
        this.dataLength = param;
    },
    initTableData: function () {
        this.tableData.legalData = wlt.wallet['04'];
        this.tableData.walletData = wlt.wallet['03'];
        this.tableData.contractData = wlt.wallet['01'];
        this.tableData.coinData = wlt.wallet['02'];
    },
    initColumnData: function () {
        this.columnData = {
            wallet: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '锁定', val: 'depositLock' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '充值', to: '/recharge' }, { operation: '提现', to: '/extractCoin' }, { operation: '划转', to: '地址' }] }
            ],
            coin: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '冻结', val: 'Frz' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '' }, { operation: '去交易', to: '' }] }
            ],
            contract: [
                { col: '币种', val: 'wType' },
                { col: '账户权益', val: 'MgnBal' },
                { col: '未实现盈亏', val: 'UPNL' },
                { col: '可用保证金', val: 'NL' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '' }, { operation: '去交易', to: '' }] }
            ],
            legal: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '冻结', val: 'otcLock' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '' }, { operation: '去交易', to: '' }] }
            ]
        };
    },
    jump: function (row, item) {
        const that = this;
        transferLogic.initTransferInfo(); // 初始化弹框
        if (item.operation === '划转') {
            transferLogic.setTransferModalOption({
                isShow: true,
                coin: row.wType, // 币种 默认选中
                transferFrom: that.pageFlag,
                successCallback() { // 划转成功回调
                    that.setPageFlag();
                }
            });
        } else if (item.operation === '充值') {
            if (row.Setting.canRecharge) {
                window.router.push(item.to + '?wType=' + row.wType);
            } else {
                return window.$message({ title: '提示', content: '暂未开启', type: 'primary' });
            }
        } else if (item.operation === '提现') {
            window.router.push(item.to + '?wType=' + row.wType);
        } else if (item.operation === '去交易') {
            return window.$message({ title: '提示', content: '暂未开放', type: 'danger' });
        }
    },
    copyAry: function (ary) {
        const res = [];
        for (let i = 0; i < ary.length; i++) {
            res.push(ary[i]);
        }
        return res;
    },
    setHideZeroFlag: function () {
        this.hideZeroFlag = !this.hideZeroFlag;
    },
    searchTableData: function () {
        const that = this;
        // setTimeout(() => {
        const tbody = document.getElementsByTagName('table')[0].childNodes[1];
        const rowsLength = tbody.rows.length - 1; // tbody.rows.length - 1：最后一行是暂无数据
        const index = [];
        if (that.hideZeroFlag) {
            for (let i = 0; i < rowsLength; i++) {
                if (tbody.rows[i].style.display !== 'none') {
                    index.push(i);
                } else {
                    continue;
                }
            }
        } else {
            for (let i = 0; i < rowsLength; i++) {
                index.push(i);
            }
        }
        that.search(index);
        // }, 50);
    },
    oldAry: [],
    search: function (ary) {
        this.oldAry = ary;
        if (this.oldAry !== ary) {
            console.log(1);
        }
        const tbody = document.getElementsByTagName('table')[0].childNodes[1];
        const searchContent = document.getElementsByClassName('coinSearch')[0].value;
        for (const i of ary) {
            if (searchContent) {
                const searchText = tbody.rows[i].cells[0].innerHTML;
                if (searchText.toUpperCase().indexOf(searchContent.toUpperCase()) !== -1) {
                    tbody.rows[i].style.display = ''; // 显示行操作
                } else {
                    tbody.rows[i].style.display = 'none'; // 隐藏行操作
                }
            } else {
                tbody.rows[i].style.display = '';
            }
        }
    },
    createFn: function (vnode) {
        const self = this;
        this.vnode = vnode;
        broadcast.onMsg({
            key: 'view-pages-Myassets-TablegB',
            cmd: broadcast.CHANGE_SW_CURRENCY,
            cb: (arg) => {
                this.setCurrency(arg);
            }
        });
        this.oldHideMoneyFlag = vnode.attrs.hideMoneyFlag;
        // 初始化表头
        this.initColumnData();
        // 初始化表格数据（表身）
        this.initTableData();
        // 初始化交易账户各账户名称与估值
        this.initAccountBanlance();
        broadcast.onMsg({
            key: 'view-pages-Myassets-TablegB',
            cmd: broadcast.MSG_WLT_UPD,
            cb: function () {
                self.initTableData();
            }
        });

        // 获取当前网址，如：http://localhost:8080/#!/myWalletIndex?id=03
        const currencyIndex = window.document.location.href.toString().split('=')[1];
        if (currencyIndex === '03' || currencyIndex === '02' || currencyIndex === '01' || currencyIndex === '04') {
            this.setPageFlag(currencyIndex);
        } else {
            this.setPageFlag('03');
        }

        // 判断暂无数据是否显示
        if (this.dataLength === 0) {
            document.getElementsByTagName('table')[0].rows[document.getElementsByTagName('table')[0].rows.length - 1].style.display = '';
        } else {
            document.getElementsByTagName('table')[0].rows[document.getElementsByTagName('table')[0].rows.length - 1].style.display = 'none';
        }
    },
    updateFn: function(vnode) {
        if (this.oldValue !== vnode.attrs.swValue) {
            this.setPageFlag(vnode.attrs.swValue);
        }
        if (this.oldHideMoneyFlag !== vnode.attrs.hideMoneyFlag) {
            this.oldHideMoneyFlag = vnode.attrs.hideMoneyFlag;
        }
        this.oldValue = vnode.attrs.swValue;
        this.oldHideMoneyFlag = vnode.attrs.hideMoneyFlag;
    },
    removeFn: function () {
        broadcast.offMsg({
            key: 'view-pages-Myassets-TablegB',
            isall: true
        });
    }
};