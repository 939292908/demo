const broadcast = require('@/broadcast/broadcast');
const wlt = require('@/models/wlt/wlt');
const transferLogic = require('@/views/page/myAssets/transfer/transfer.logic.js'); // 划转模块逻辑

module.exports = {
    vnode: {},
    currency: 'BTC',
    hideZeroFlag: false, // 是否隐藏0资产 默认为false
    dataLength: 0, // 暂无数据
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
        this.setAccountBanlance();
        this.setDataLength(this.tableData[this.tableDateList].length);
        setTimeout(() => {
            this.tableAction(`hideZero`);
        }, 150);
    },
    setAccountBanlance: function() {
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
        this.tableData.legalData = this.copyAry(wlt.wallet['04']);
        this.tableData.walletData = this.copyAry(wlt.wallet['03']);
        this.tableData.contractData = this.copyAry(wlt.wallet['01']);
        this.tableData.coinData = this.copyAry(wlt.wallet['02']);
    },
    initColumnData: function () {
        this.columnData = {
            wallet: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '锁定', val: 'depositLock' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '充值', to: '地址' }, { operation: '提现', to: '地址' }, { operation: '划转', to: '地址' }] }
            ],
            coin: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '冻结', val: 'Frz' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '地址' }, { operation: '去交易', to: '地址' }] }
            ],
            contract: [
                { col: '币种', val: 'wType' },
                { col: '账户权益', val: 'MgnBal' },
                { col: '未实现盈亏', val: 'UPNL' },
                { col: '可用保证金', val: 'NL' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '地址' }, { operation: '去交易', to: '地址' }] }
            ],
            legal: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '冻结', val: 'otcLock' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '地址' }, { operation: '去交易', to: '地址' }] }
            ]
        };
    },
    jump(row, type) {
        const that = this;
        transferLogic.initTransferInfo(); // 初始化弹框
        if (type === '划转') {
            transferLogic.setTransferModalOption({
                isShow: true,
                coin: row.wType, // 币种 默认选中
                transferFrom: that.pageFlag
            });
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
        this.tableAction(`hideZero`);
    },
    tableAction: function (type) {
        if (type === 'search') {
            const searchContent = document.getElementsByClassName('coinSearch').value;
            this.searchTableData(searchContent);
        } else if (type === 'hideZero') {
            // if (this.oldHideMoneyFlag) {
            //     this.oldHideMoneyFlag = false;
            //     if (this.hideZeroFlag) {
            //         this.hideTableData();
            //     } else {
            //         this.showTableData();
            //     }
            //     this.oldHideMoneyFlag = true;
            // }
            if (this.hideZeroFlag) {
                this.hideTableData();
            } else {
                this.showTableData();
            }
        }
    },
    searchTableData: function (searchContent) {
        const table = document.getElementsByTagName('table')[0];
        const rowsLength = table.rows.length;
        let count = 1;
        if (searchContent !== "") {
            for (let i = 1; i < rowsLength; i++) {
                const searchText = table.rows[i].cells[0].innerHTML;
                if (searchText.toUpperCase().indexOf(searchContent.toUpperCase()) !== -1) {
                    // 显示行操作
                    table.rows[i].style.display = '';
                } else {
                    // 隐藏行操作
                    table.rows[i].style.display = 'none';
                    count = count + 1;
                }
            }
            if (count === rowsLength) {
                table.rows[rowsLength - 1].style.display = '';
            }
        } else if (searchContent === "") {
            table.rows[rowsLength - 1].style.display = 'none';
            for (let j = 1; j < rowsLength - 1; j++) {
                table.rows[j].style.display = '';
            }
        }
    },
    showTableData: function () {
        const tbody = document.getElementsByTagName('table')[0].childNodes[1];
        const rowsLength = tbody.rows.length - 1; // tbody.rows.length - 1：最后一行是暂无数据
        tbody.rows[rowsLength].style.display = 'none';
        for (let i = 1; i < rowsLength; i++) {
            // 显示行操作
            tbody.rows[i].style.display = '';
        }
    },
    hideTableData: function () {
        let count = 0;
        const tbody = document.getElementsByTagName('table')[0].childNodes[1];
        const rowsLength = tbody.rows.length - 1; // tbody.rows.length - 1：最后一行是暂无数据
        for (let i = 0; i < rowsLength; i++) {
            const text = tbody.rows[i].cells[1].innerHTML;
            if (text === '0.00000000' || text === '0.0000') {
                count = count + 1;
                tbody.rows[i].style.display = 'none';
            } else {
                tbody.rows[i].style.display = '';
            }
        }
        if (count === rowsLength) {
            tbody.rows[rowsLength].style.display = '';
        }
    },
    createFn: function () {
        wlt.init();
        broadcast.onMsg({
            key: 'view-pages-Myassets-TablegB',
            cmd: broadcast.CHANGE_SW_CURRENCY,
            cb: (arg) => {
                this.setCurrency(arg);
            }
        });
        setTimeout(() => {
            this.initColumnData();
            this.initTableData();
            this.setPageFlag('03');
            this.setAccountBanlance();
            if (this.dataLength === 0) {
                document.getElementsByTagName('table')[0].rows[document.getElementsByTagName('table')[0].rows.length - 1].style.display = '';
            } else {
                document.getElementsByTagName('table')[0].rows[document.getElementsByTagName('table')[0].rows.length - 1].style.display = 'none';
            }
        }, '100');
    },
    initFn: function (vnode) {
        this.vnode = vnode;
        this.oldHideMoneyFlag = vnode.attrs.hideMoneyFlag;
    },
    updateFn(vnode) {
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