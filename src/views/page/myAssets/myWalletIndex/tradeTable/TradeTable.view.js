const m = require('mithril');
const t = require('@/views/page/myAssets/myWalletIndex/tradeTable/TradeTable.logic');
require('@/views/page/myAssets/myWalletIndex/tradeTable/TradeTable.scss');
const I18n = require('@/languages/I18n').default;
const Loading = require('@/views/components/loading/loading.view');

module.exports = {
    oninit(vnode) {
        // t.initFn(vnode);
    },
    oncreate: (vnode) => {
        t.createFn(vnode);
    },
    view(vnode) {
        return m('div', { class: `views-pages-Myassets-Table pt-7 px-5 has-bg-level-2` }, [
            m('div.tradingAccount mb-7 tabs mb-0', { style: { display: vnode.attrs.swValue !== '03' ? '' : 'none' } }, [
                m('ul.tradingAccount_nav', { }, [
                    t[vnode.attrs.swValue === '06' ? `otherNavAry` : `tradeNavAry`].map((item) => {
                        return m('li', { class: t.pageFlag === item.idx ? 'is-active' : '' }, [
                            m('a', {
                                onclick: e => {
                                    window.router.push('/myWalletIndex?id=' + item.idx);
                                }
                            }, item.val)
                        ]);
                    })
                ])
            ]),
            m('div', { class: `nav pr-5` }, [
                m('div.search mr-7 has-line-level-3 py-1 px-3', {}, [
                    m('input', {
                        class: `coinSearch`,
                        placeholder: I18n.$t('10514') /* `币种搜索` */,
                        oninput: function () {
                            t.setTableNewAry();
                        }
                    }),
                    m('i', { class: `iconfont icon-Search has-text-level-4` })
                ]),
                m('div.hideZeroAsset mr-7', {}, [
                    m('i', { class: t.hideZeroFlag ? `iconfont icon-u_check-square cursor-pointer` : `iconfont icon-Unselected cursor-pointer`, onclick: () => { t.setHideZeroFlag(); } }),
                    m('span', { class: `ml-1` }, I18n.$t('10062') /* `隐藏0资产` */)
                ]),
                m('div.fundRecords mr-7 cursor-pointer', {}, [
                    m('i', { class: 'iconfont icon-AssetRecord' }),
                    m('span', {
                        class: `ml-1`,
                        onclick: function () {
                            window.router.push({
                                path: '/assetRecords',
                                data: {
                                    aType: t.pageFlag
                                }
                            });
                        }
                    }, I18n.$t('10053') /* `资金记录` */)
                ]),
                m('div.profit', { style: { display: t.coinType === `contract` ? `none` : `none` } }, [
                    m('i', { class: 'iconfont icon-Analysis' }),
                    m('span', I18n.$t('10075') /* `盈亏分析` */)
                ]),
                m('div.account', { style: { display: t.coinType !== `wallet` ? `` : `none` } }, [
                    m('span', {}, t.accountTitle),
                    m('span', {}, `  `),
                    m('span', {}, isNaN(Number(t.accountBanlance)) ? '--' : t.oldHideMoneyFlag ? '******' : t.accountBanlance + t.currency)
                ])
            ]),
            m('div.tab', { class: `pb-7 mt-7 border-radius-medium` },
                m('table', {}, [
                    m('thead', {}, [
                        // 循环表头
                        m('tr', {}, [
                            t.columnData[t.coinType].map((item, index) => {
                                return m('td.has-text-level-4', { class: `` }, item.col);
                            })
                        ])
                    ]),
                    // t.tableData[t.tableDateList] : 源数据
                    // t.tableNewAry ： 处理后的数据
                    t.tableData[t.tableDateList].length === 0
                        ? m('tbody', {}, [m('tr', [m('td', { class: `tableLoading`, colspan: 6, style: { textAlign: `center` } }, m(Loading))])])
                        : m('tbody', {}, [
                            t.tableNewAry.map((row) => {
                                return m('tr', {
                                    key: row.wType
                                }, [
                                    t.columnData[t.coinType].map((item, i) => {
                                        if (i === t.columnData[t.coinType].length - 1) {
                                            // 操作列
                                            return m('td.py-4 has-text-level-1', {}, [
                                                item.val.map(aHref => {
                                                    return m('a.mr-4 has-text-primary', { onclick: () => { t.jump(row, aHref); } }, aHref.operation);
                                                })
                                            ]);
                                        } else if (i === t.columnData[t.coinType].length - 2) { // 估值列
                                            return m('td.py-4 has-text-level-1', {}, isNaN(Number(row[item.val])) ? '--' : t.oldHideMoneyFlag ? '******' : row[item.val] + ` ` + t.currency);
                                        } else if (i === 0) { // 第一列币种不需要隐藏
                                            return m('td.py-4 has-text-level-1', {}, row[item.val]);
                                        } else {
                                            return m('td.py-4 has-text-level-1', {}, isNaN(Number(row[item.val])) ? '--' : t.oldHideMoneyFlag ? '******' : row[item.val]);
                                        }
                                    })
                                ]);
                            }),
                            m('tr', { style: { display: t.isShowNoneData ? '' : 'none' } }, [
                                m('td', { colspan: 6, style: { textAlign: `center` } }, [
                                    m('div', { class: `noneData` }, [
                                        m('div', { class: `noneDataDiv` }, [
                                            m('div', { class: `has-bg-level-1 mb-3 imgDiv` }, [
                                                m('img', { class: `mt-4`, src: require(`@/assets/img/myAssets/noneData.svg`).default })
                                            ]),
                                            m('div', { class: `spanDiv` }, [
                                                m('span', { class: `has-text-level-4` }, I18n.$t('10515') /* '暂无数据' */)
                                            ])
                                        ])
                                    ])
                                ])
                            ])
                        ])
                ])
            )
        ]);
    },
    onupdate(vnode) {
        t.updateFn(vnode);
    },
    onremove() {
        t.removeFn();
    }
};