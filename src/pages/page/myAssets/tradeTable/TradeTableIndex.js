const m = require('mithril');
const wlt = require('@/models/wlt/wlt');

require('@/styles/pages/Myassets/tradeTable.scss');
const broadcast = require('@/broadcast/broadcast');
const TradeTableView = require('@/pages/page/myAssets/tradeTable/TradeTableView');

const t = {
    dataType: 'contract',
    setDataType: function(param) {
        t.dataType = param;
    },
    currency: 'BTC',
    setCurrency: function(param) {
        t.currency = param;
        t.initColumnData();
        t.setAccountBanlance();
    },
    columnData: {
        walletColumnData: [],
        coinColumnData: [],
        contractColumnData: [],
        legalColumnData: []
    },
    tableData: {
        walletData: [],
        coinData: [],
        contractData: [],
        legalData: []
    },
    initTableData: function () {
        t.tableData.legalData = t.copyAry(wlt.wallet['04']);
        t.tableData.walletData = t.copyAry(wlt.wallet['03']);
        t.tableData.contractData = t.copyAry(wlt.wallet['01']);
        t.tableData.coinData = t.copyAry(wlt.wallet['02']);
    },
    initColumnData: function () {
        t.columnData = {
            walletColumnData: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '锁定', val: 'depositLock' },
                { col: t.currency + '估值', val: t.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '充值', to: '地址' }, { operation: '提现', to: '地址' }, { operation: '划转', to: '地址' }] }
            ],
            coinColumnData: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '冻结', val: 'Frz' },
                { col: t.currency + '估值', val: t.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '地址' }, { operation: '去交易', to: '地址' }] }
            ],
            contractColumnData: [
                { col: '币种', val: 'wType' },
                { col: '账户权益', val: 'MgnBal' },
                { col: '未实现盈亏', val: 'UPNL' },
                { col: '可用保证金', val: 'NL' },
                { col: t.currency + '估值', val: t.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '地址' }, { operation: '去交易', to: '地址' }] }
            ],
            legalColumnData: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '冻结', val: 'otcLock' },
                { col: t.currency + '估值', val: t.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '地址' }, { operation: '去交易', to: '地址' }] }
            ]
        };
    },
    copyAry: function (ary) {
        const res = [];
        for (let i = 0; i < ary.length; i++) {
            res.push(ary[i]);
        }
        return res;
    },
    hideZeroFlag: false, // 是否隐藏0资产 默认为false
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
    accountTitle: '',
    setAccountTitle: function(param) {
        t.accountTitle = param;
    },
    dataLength: 0,
    setDataLength: function (param) {
        t.dataLength = param;
    },
    accountBanlance: 0,
    setAccountBanlance: function() {
        t.accountBanlance = t.currency === 'BTC' ? wlt[t.dataType + 'TotalValueForBTC'] : wlt[t.dataType + 'TotalValueForUSDT'];
    },
    sets: function (vnode) {
        if (vnode.attrs.type === 'coinColumnData') {
            t.setDataType('coin');
            t.setAccountTitle('币币账户');
            t.setDataLength(t.tableData.coinData.length);
        } else if (vnode.attrs.type === 'legalColumnData') {
            t.setDataType('legal');
            t.setAccountTitle('法币账户');
            t.setDataLength(t.tableData.legalData.length);
        } else if (vnode.attrs.type === 'contractColumnData') {
            t.setDataType('contract');
            t.setAccountTitle('合约账户');
            t.setDataLength(t.tableData.contractData.length);
        } else {
            t.setDataLength(t.tableData.walletData.length);
        }
        t.setAccountBanlance();
    }
};

module.exports = {
    oninit: function () {
        broadcast.onMsg({
            key: 'view-pages-Myassets-TablegB',
            cmd: broadcast.CHANGE_SW_CURRENCY,
            cb: (arg) => {
                t.setCurrency(arg);
            }
        });
        t.hideZeroFlag = false;
    },
    oncreate(vnode) {
        setTimeout(() => {
            t.initTableData();
            t.initColumnData();
            t.sets(vnode);
            if (t.dataLength === 0) {
                document.getElementsByTagName('table')[0].rows[document.getElementsByTagName('table')[0].rows.length - 1].style.display = '';
            } else {
                document.getElementsByTagName('table')[0].rows[document.getElementsByTagName('table')[0].rows.length - 1].style.display = 'none';
            }
            m.redraw();
        }, '100');
    },
    view: function (vnode) {
        const props = {
            t: t
        };
        return TradeTableView(props, vnode);
    },
    onremove: function () {
        broadcast.offMsg({
            key: 'view-pages-Myassets-TablegB',
            isall: true
        });
    }
};