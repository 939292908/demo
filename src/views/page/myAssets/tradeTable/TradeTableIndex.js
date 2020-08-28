const m = require('mithril');
const wlt = require('@/models/wlt/wlt');

require('@/styles/pages/Myassets/tradeTable.scss');
const broadcast = require('@/broadcast/broadcast');
const TradeTableView = require('@/pages/page/myAssets/tradeTable/TradeTableView');

const t = {
    currency: 'BTC',
    setCurrency: function(param) {
        this.currency = param;
        this.initColumnData();
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
        this.tableData.legalData = this.copyAry(wlt.wallet['04']);
        this.tableData.walletData = this.copyAry(wlt.wallet['03']);
        this.tableData.contractData = this.copyAry(wlt.wallet['01']);
        this.tableData.coinData = this.copyAry(wlt.wallet['02']);
    },
    initColumnData: function () {
        this.columnData = {
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
    accountBanlance: 0,
    setAccountBanlance: function(param) {
        t.accountBanlance = param;
    },
    dataLength: 0,
    setDataLength: function (param) {
        t.dataLength = param;
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
            if (vnode.attrs.type === 'coinColumnData') {
                t.setDataLength(t.tableData.coinData.length);
                t.setAccountTitle('币币账户');
                t.setAccountBanlance(wlt.coinTotalValueForBTC);
            } else if (vnode.attrs.type === 'legalColumnData') {
                t.setDataLength(t.tableData.legalData.length);
                t.setAccountTitle('法币账户');
                t.setAccountBanlance(wlt.legalTotalValueForBTC);
            } else if (vnode.attrs.type === 'contractColumnData') {
                t.setDataLength(t.tableData.contractData.length);
                t.setAccountTitle('合约账户');
                t.setAccountBanlance(wlt.contractTotalValueForBTC);
            } else {
                t.setDataLength(t.tableData.walletData.length);
            }
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