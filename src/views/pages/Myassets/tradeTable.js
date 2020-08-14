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
                    var searchText = table.rows[i].cells[0].innerHTML;
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
                for (var j = 1; j < rowsLength - 1; j++) {
                    table.rows[j].style.display = '';
                }
            }
        } else if (type === 'hideZero') {
            this.hideZeroFlag = !this.hideZeroFlag;
            let count = 1;
            if (this.hideZeroFlag) {
                for (let i = 1; i < rowsLength; i++) {
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
                if (count === rowsLength) {
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
    }
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
    },
    oncreate(vnode) {
        wlt.init();
        setTimeout(() => {
            t.initTableData();
            t.initColumnData();
            m.redraw();
        }, '100');
    },
    view(vnode) {
        // table
        return m('div', { class: 'views-pages-Myassets-Table' }, [
            m('div', { class: 'nav' }, [
                m('div.search', {}, [
                    m('input', {
                        placeholder: '币种搜索',
                        oninput: function () {
                            t.tableAction(this.value, 'search');
                        }
                    })
                ]),
                m('div.hideZeroAsset', {}, [
                    m('label.checkbox', { onclick: function () { t.tableAction('', 'hideZero'); } }, [
                        m('input[type=checkbox]', { checked: t.hideZeroFlag }),
                        '隐藏0资产'
                    ])
                ]),
                m('div', {}, [
                    m('img', {}),
                    m('span', ['资金记录'])
                ]),
                m('div', { style: { display: vnode.attrs.typeData === 'contractData' ? '' : 'none' } }, [
                    m('img', {}),
                    m('span', ['盈亏分析'])
                ])
            ]),
            m('table', { style: { border: '1px solid #ccc' } }, [
                m('thead', {}, [
                    // 循环表头
                    m('tr', {}, [
                        t.columnData[vnode.attrs.type].map((item, index) => {
                            return m('td', {}, item.col);
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
                                    return m('td', {}, [
                                        item.val.map(aHref => {
                                            return m('a', {}, aHref.operation);
                                        })
                                    ]);
                                } else if (i === t.columnData[vnode.attrs.type].length - 2) {
                                    // 估值列
                                    return m('td', {}, row[item.val] + ' ' + t.currency);
                                } else {
                                    return m('td', {}, row[item.val]);
                                }
                            })
                        ]);
                    }),
                    m('tr', { style: { display: 'none' } }, [
                        m('td', { colspan: 6, style: { textAlign: 'center' } }, '暂无数据')
                    ])
                ])
            ])
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