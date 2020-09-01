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
    test(row, type) {
        const that = this;
        console.log(that.pageFlag, 'this.pageFlag---');
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
    tableAction: function (searchContent, type) {
        const table = document.getElementsByTagName('table')[0];
        const rowsLength = table.rows.length;
        if (type === 'search') {
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
        } else if (type === 'hideZero') {
            this.hideZeroFlag = !this.hideZeroFlag;
            let count = 1;
            if (this.hideZeroFlag) {
                for (let i = 1; i < rowsLength - 1; i++) {
                    const value = table.rows[i].cells[1].innerHTML;
                    if (value !== '0.00000000') {
                        // 显示行操作
                        table.rows[i].style.display = '';
                    } else {
                        // 隐藏行操作
                        table.rows[i].style.display = 'none';
                        count = count + 1;
                    }
                }
                if (count === rowsLength - 1) {
                    table.rows[rowsLength - 1].style.display = '';
                }
            } else {
                table.rows[rowsLength - 1].style.display = 'none';
                for (let i = 1; i < rowsLength - 1; i++) {
                    // 显示行操作
                    table.rows[i].style.display = '';
                }
            }
        }
    },
    createFn: function (vnode) {
        this.hideZeroFlag = vnode.attrs.hideZeroFlag;
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
    },
    updateFn(vnode) {
        if (this.oldValue !== vnode.attrs.swValue) {
            this.setPageFlag(vnode.attrs.swValue);
        }
        this.oldValue = vnode.attrs.swValue;
    },
    removeFn: function () {
        broadcast.offMsg({
            key: 'view-pages-Myassets-TablegB',
            isall: true
        });
    }
};