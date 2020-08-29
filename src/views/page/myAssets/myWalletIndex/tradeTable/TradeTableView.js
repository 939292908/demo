const m = require('mithril');
const t = require('@/views/page/myAssets/myWalletIndex/tradeTable/TradeTableIndex');
require('@/views/page/myAssets/myWalletIndex/tradeTable/TradeTable.scss');
// const myWalletIndex = require('../MyWalletIndex').default;
// console.log('myWalletIndex', myWalletIndex);

module.exports = {
    oninit: (vnode) => {
        t.initFn(vnode);
    },
    oncreate: (vnode) => {
        t.createFn(vnode);
        m.redraw();
    },
    view: (vnode) => {
        return m('div', { class: `views-pages-Myassets-Table pt-7 px-5` }, [
            // myWalletIndex.swValue,
            vnode.attrs.swValue + '-------',
            m('div.tradingAccount mb-3 tabs', { style: { display: vnode.attrs.swValue === '01' || vnode.attrs.swValue === '02' || vnode.attrs.swValue === '04' ? '' : 'none' } }, [
                m('ul.tradingAccount_nav mx-5', { }, [
                    t.navAry.map((item) => {
                        return m('li', { class: '' + (t.pageFlag === item.idx ? "is-active" : ''), onclick: () => { t.setPageFlag(item.idx); } }, m('a', {}, item.val));
                    })
                ])
            ]),
            m('div', { class: `nav mb-3 pr-5` }, [
                m('div.search mr-7', {}, [
                    m('input', {
                        class: `has-line-level-3 border-radius-small py-1 pl-1`,
                        placeholder: `币种搜索`,
                        oninput: function () {
                            t.tableAction(this.value, `search`);
                        }
                    })
                ]),
                m('div.hideZeroAsset mr-7', {}, [
                    m('label.checkbox', { onclick: function () { t.tableAction(``, `hideZero`); } }, [
                        m('input[type=checkbox].mr-1', { checked: t.hideZeroFlag }),
                        `隐藏0资产`
                    ])
                ]),
                m('div.fundRecords mr-7', {}, [
                    m('i', { class: 'iconfont icon-AssetRecord' }),
                    // m('i', { class: 'iconfont', value: `${nzm}` }),
                    m('span', [`资金记录`])
                ]),
                m('div.profit', { style: { display: vnode.attrs.tableType === `contract` ? `` : `none` } }, [
                    m('i', { class: 'iconfont icon-Analysis' }),
                    m('span', [`盈亏分析`])
                ]),
                m('div.account', { style: { display: vnode.attrs.tableType !== `wallet` ? `` : `none` } }, [
                    m('span', {}, vnode.attrs.accountTitle),
                    m('span', {}, `  `),
                    m('span', {}, vnode.attrs.accountBanlance + t.currency)
                ])
            ]),
            m('div.tab', { class: `pb-7 border-radius-medium` },
                m('table', {}, [
                    m('thead', {}, [
                        // 循环表头
                        m('tr', {}, [
                            t.columnData[vnode.attrs.tableType].map((item, index) => {
                                return m('td.pt-7', { class: `` }, item.col);
                            })
                        ])
                    ]),
                    m('tbody', {}, [
                        // 循环表身
                        vnode.attrs.tableData.map((row) => {
                            return m('tr', {}, [
                                t.columnData[vnode.attrs.tableType].map((item, i) => {
                                    if (i === t.columnData[vnode.attrs.tableType].length - 1) {
                                        // 操作列
                                        return m('td.pt-7 has-text-level-1', {}, [
                                            item.val.map(aHref => {
                                                return m('a.mr-4 has-text-primary', { onclick: () => { t.test(row, aHref.operation); } }, aHref.operation);
                                            })
                                        ]);
                                    } else if (i === t.columnData[vnode.attrs.tableType].length - 2) {
                                        // 估值列
                                        return m('td.pt-7 has-text-level-1', {}, row[item.val] + ` ` + t.currency);
                                    } else {
                                        return m('td.pt-7 has-text-level-1', {}, row[item.val]);
                                    }
                                })
                            ]);
                        }),
                        m('tr', { style: { display: `none` } }, [
                            m('td', { colspan: 6, style: { textAlign: `center` } }, `暂无数据`)
                        ])
                    ])
                ])
            )
        ]);
    },
    onremove: () => {
        t.removeFn();
    }
};