const m = require('mithril');
const t = require('@/views/page/myAssets/myWalletIndex/tradeTable/TradeTable.logic');
require('@/views/page/myAssets/myWalletIndex/tradeTable/TradeTable.scss');

module.exports = {
    oninit(vnode) {
        // t.initFn(vnode);
    },
    oncreate: (vnode) => {
        t.createFn(vnode);
    },
    view(vnode) {
        return m('div', { class: `views-pages-Myassets-Table pt-7 px-5 has-bg-level-2` }, [
            m('div.tradingAccount mb-7 tabs', { style: { display: vnode.attrs.swValue === '01' || vnode.attrs.swValue === '02' || vnode.attrs.swValue === '04' ? '' : 'none' } }, [
                m('ul.tradingAccount_nav mx-5', { }, [
                    t.navAry.map((item) => {
                        return m('li', { class: '' + (t.pageFlag === item.idx ? "is-active" : ''), onclick: () => { t.setPageFlag(item.idx); } }, m('a', {}, item.val));
                    })
                ])
            ]),
            m('div', { class: `nav pr-5` }, [
                m('div.search mr-7 has-line-level-3', {}, [
                    m('input', {
                        class: `border-radius-small py-1 pl-1 coinSearch`,
                        placeholder: `币种搜索`,
                        oninput: function () {
                            t.setTableNewAry();
                        }
                    }),
                    m('i', { class: `iconfont icon-Search has-text-level-4` })
                ]),
                m('div.hideZeroAsset mr-7', {}, [
                    m('i', { class: t.hideZeroFlag ? `iconfont icon-u_check-square cursor-pointer` : `iconfont icon-Unselected cursor-pointer`, onclick: () => { t.setHideZeroFlag(); } }),
                    m('span', { class: `ml-2` }, `隐藏0资产`)
                ]),
                m('div.fundRecords mr-7', {}, [
                    m('i', { class: 'iconfont icon-AssetRecord' }),
                    m('span', { onclick: function () { window.router.push('/assetRecords'); } }, [`资金记录`])
                ]),
                m('div.profit', { style: { display: t.coinType === `contract` ? `none` : `none` } }, [
                    m('i', { class: 'iconfont icon-Analysis' }),
                    m('span', [`盈亏分析`])
                ]),
                m('div.account', { style: { display: t.coinType !== `wallet` ? `` : `none` } }, [
                    m('span', {}, t.accountTitle),
                    m('span', {}, `  `),
                    m('span', {}, t.oldHideMoneyFlag ? '******' : t.accountBanlance + t.currency)
                ])
            ]),
            m('div.tab', { class: `pb-7 border-radius-medium` },
                m('table', {}, [
                    m('thead', {}, [
                        // 循环表头
                        m('tr', {}, [
                            t.columnData[t.coinType].map((item, index) => {
                                return m('td.pt-7 has-text-level-4', { class: `` }, item.col);
                            })
                        ])
                    ]),
                    m('tbody', {}, [
                        // JSON.stringify(t.tableNewAry),
                        // 循环表身
                        t.tableNewAry.map((row) => {
                            return m('tr', {}, [
                                t.columnData[t.coinType].map((item, i) => {
                                    if (i === t.columnData[t.coinType].length - 1) {
                                        // 操作列
                                        return m('td.pt-7 has-text-level-1', {}, [
                                            item.val.map(aHref => {
                                                return m('a.mr-4 has-text-primary', { onclick: () => { t.jump(row, aHref); } }, aHref.operation);
                                            })
                                        ]);
                                    } else if (i === t.columnData[t.coinType].length - 2) { // 估值列
                                        return m('td.pt-7 has-text-level-1', {}, t.oldHideMoneyFlag ? '******' : row[item.val] + ` ` + t.currency);
                                    } else if (i === 0) { // 第一列币种不需要隐藏
                                        return m('td.pt-7 has-text-level-1', {}, row[item.val]);
                                    } else {
                                        return m('td.pt-7 has-text-level-1', {}, t.oldHideMoneyFlag ? '******' : row[item.val]);
                                    }
                                })
                            ]);
                        }),
                        m('tr', { style: { display: t.isShowNoneData ? '' : 'none' } }, [
                            m('td', { colspan: 6, style: { textAlign: `center` } }, [
                                m('div', { class: `noneData mt-8` }, [
                                    m('div', { class: `has-bg-level-1 mb-3` }, [
                                        m('img', { class: `mt-4`, src: require(`@/assets/img/myAssets/noneData.svg`).default })
                                    ]),
                                    m('span', { class: `has-text-level-4` }, '暂无数据')
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