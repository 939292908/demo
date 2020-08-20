const m = require('mithril');
const wlt = require('@/models/wlt/wlt');

require('@/styles/pages/Myassets/tradeTable.scss');

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
    // DelayDataAcquisition: function(vnode) {
    //     t.initTableData();
    //     t.initColumnData();
    //     if (vnode.attrs.type === 'coinColumnData') {
    //         t.setDataLength(t.tableData.coinData.length);
    //         t.setAccountTitle('币币账户');
    //         t.setAccountBanlance(wlt.coinTotalValueForBTC);
    //     } else if (vnode.attrs.type === 'legalColumnData') {
    //         t.setDataLength(t.tableData.legalData.length);
    //         t.setAccountTitle('法币账户');
    //         t.setAccountBanlance(wlt.legalTotalValueForBTC);
    //     } else if (vnode.attrs.type === 'contractColumnData') {
    //         t.setDataLength(t.tableData.contractData.length);
    //         t.setAccountTitle('合约账户');
    //         t.setAccountBanlance(wlt.contractTotalValueForBTC);
    //     } else {
    //         t.setDataLength(t.tableData.walletData.length);
    //     }
    //     if (t.dataLength === 0) {
    //         document.getElementsByTagName('table')[0].rows[document.getElementsByTagName('table')[0].rows.length - 1].style.display = '';
    //     } else {
    //         document.getElementsByTagName('table')[0].rows[document.getElementsByTagName('table')[0].rows.length - 1].style.display = 'none';
    //     }
    //     m.redraw();
    // }
};

module.exports = {
    oninit() {
        window.gBroadcast.onMsg({
            key: 'view-pages-Myassets-TablegB',
            cmd: window.gBroadcast.CHANGE_SW_CURRENCY,
            cb: function(arg) {
                t.setCurrency(arg);
            }
        });
        t.hideZeroFlag = false;
    },
    oncreate(vnode) {
        // ！！！！
        wlt.init();
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
    view(vnode) {
        // table
        return m('div', { class: 'views-pages-Myassets-Table pt-7 pl-5 pr-5' }, [
            m('div', { class: 'nav mb-3 pr-5' }, [
                m('div.search mr-7', {}, [
                    m('input', {
                        class: 'has-line-level-3 border-radius-small py-1 pl-1',
                        placeholder: '币种搜索',
                        oninput: function () {
                            t.tableAction(this.value, 'search');
                        }
                    })
                ]),
                m('div.hideZeroAsset mr-7', {}, [
                    m('label.checkbox', { onclick: function () { t.tableAction('', 'hideZero'); } }, [
                        m('input[type=checkbox].mr-1', { checked: t.hideZeroFlag }),
                        '隐藏0资产'
                    ])
                ]),
                m('div.fundRecords mr-7', {}, [
                    m('img', { }),
                    m('span', ['资金记录'])
                ]),
                m('div.profit', { style: { display: vnode.attrs.typeData === 'contractData' ? '' : 'none' } }, [
                    m('img', {}),
                    m('span', ['盈亏分析'])
                ]),
                m('div.account', { style: { display: vnode.attrs.typeData !== 'walletData' ? '' : 'none' } }, [
                    m('span', {}, t.accountTitle),
                    m('span', {}, '  '),
                    m('span', {}, t.accountBanlance)
                ])
            ]),
            m('div.tab', { class: 'pb-7 border-radius-medium' },
                m('table', {}, [
                    m('thead', {}, [
                        // 循环表头
                        m('tr', {}, [
                            t.columnData[vnode.attrs.type].map((item, index) => {
                                return m('td.pt-7', { class: '' }, item.col);
                            })
                        ])
                    ]),
                    m('tbody', {}, [
                        // 循环表身
                        t.tableData[vnode.attrs.typeData].map((row) => {
                            return m('tr', {}, [
                                t.columnData[vnode.attrs.type].map((item, i) => {
                                    if (i === t.columnData[vnode.attrs.type].length - 1) {
                                        // 操作列
                                        return m('td.pt-7 has-text-level-1', {}, [
                                            item.val.map(aHref => {
                                                return m('a.mr-4 has-text-primary', {}, aHref.operation);
                                            })
                                        ]);
                                    } else if (i === t.columnData[vnode.attrs.type].length - 2) {
                                        // 估值列
                                        return m('td.pt-7 has-text-level-1', {}, row[item.val] + ' ' + t.currency);
                                    } else {
                                        return m('td.pt-7 has-text-level-1', {}, row[item.val]);
                                    }
                                })
                            ]);
                        }),
                        m('tr', { style: { display: 'none' } }, [
                            m('td', { colspan: 6, style: { textAlign: 'center' } }, '暂无数据')
                        ])
                    ])
                ])
            )
        ]);
    },
    onremove: function () {
        wlt.remove();
        window.gBroadcast.offMsg({
            key: 'view-pages-Myassets-TablegB',
            isall: true
        });
    }
};