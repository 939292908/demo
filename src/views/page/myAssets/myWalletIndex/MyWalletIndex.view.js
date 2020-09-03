const m = require('mithril');
const Header = require('../../../components/indexHeader/indexHeader.view');
const Transfer = require('@/views/page/myAssets/transfer/transfer.view.js');
const myWalletIndex = require('@/views/page/myAssets/myWalletIndex/MyWalletIndex.logic');
require('@/views/page/myAssets/myWalletIndex/MyWalletIndex.scss');
const Dropdown = require('@/views/components/common/Dropdown');

module.exports = {
    oninit: () => {
        myWalletIndex.initFn();
        m.redraw();
    },
    view: () => {
        return m('div', { class: `views-pages-myassets-myWalletIndex theme--light` }, [
            m('div', {}, [
                m('div.top mb-8', { style: { height: `344px`, width: `100%`, backgroundColor: `#0E1C33` } }, [
                    m('div', { class: `myWalletIndex-warpper container content-width` }, [
                        // highlightFlag:哪个高亮   0：我的资产  1：资产记录
                        m(Header, {
                            highlightFlag: 0,
                            navList: [{ to: '/myWalletIndex', title: '我的资产' }, { to: '/assetRecords', title: '资金记录' }]
                        }),
                        m('div', { class: `myWalletIndex-head columns-flex mt-7` }, [
                            m('div', { class: `myWalletIndex-head-left column` }, [
                                m('div', { class: `myWalletIndex-head-left-total columns pt-3` }, [
                                    m('span', { class: `body-6 pt-2`, style: `color:white` }, [`总资产估值`]),
                                    m('div', { class: `form-item-content border-radius-medium mt-2 mb-7` }, [
                                        m(Dropdown, myWalletIndex.getCurrencyMenuOption())
                                    ])
                                ]),
                                m('div', { class: `number-hide`, style: `color:white;` }, [
                                    m('span', { class: `title-large` }, [myWalletIndex.hideMoneyFlag ? '******' : myWalletIndex.totalValue]),
                                    m('span', { class: `title-large` }, [` ` + myWalletIndex.currency]),
                                    m('i', { class: (myWalletIndex.hideMoneyFlag ? `iconfont icon-zichanzhengyan` : `iconfont icon-yincang`) + ` changeMoneyImg pl-2 cursor-pointer`, onclick: () => { myWalletIndex.hideValue(); }, style: { color: '#585E71' } }),
                                    m('br'),
                                    m('span', { style: `color:#9A9EAC` }, [`≈ `]),
                                    m('span', { style: `color:#9A9EAC` }, [myWalletIndex.hideMoneyFlag ? '******' : myWalletIndex.totalCNY]),
                                    m('span', { style: `color:#9A9EAC` }, [` CNY`])
                                ])
                            ]),
                            m('div', { class: `myWalletIndex-head-right column pa-5` }, [
                                // 充币  提币  内部转账  资金划转
                                m('div', { class: `is-between  pt-8` }, [
                                    myWalletIndex.Nav.firstNav.map((item, index) => {
                                        return m(`button.column button-large mx-3 border-radius-small cursor-pointer Operation${index} has-line-level-2`, {
                                            class: item.title === `充币` ? `has-bg-primary` : `has-text-primary bgNone`,
                                            key: item.title,
                                            onclick: () => { myWalletIndex.handlerClickNavBtn(item); },
                                            onmouseover: () => { myWalletIndex.changeBtnSty(index, `show`); },
                                            onmouseleave: () => { myWalletIndex.changeBtnSty(index, `hide`); }
                                        },
                                        [item.title]);
                                    })
                                ])
                            ])
                        ]),
                        // 我的钱包  交易账户  其他账户
                        m('div', { class: `myWalletIndex-switch columns-flex mt-7 is-between` }, [
                            m('div.wallet border-radius-medium px-7 py-7 column cursor-pointer', {
                                class: (myWalletIndex.swValue === '03' ? `has-bg-primary` : ` has-bg-level-2`),
                                onclick: () => { myWalletIndex.switchChange('03'); }
                            }, [
                                m('div', { class: `body-5 mb-1` }, [
                                    m('span', { }, `我的钱包`)
                                ]),
                                m('div', { class: `title-small ` }, [
                                    m('span', {}, myWalletIndex.hideMoneyFlag ? '******' : myWalletIndex.walletTotalValue),
                                    m('span', {}, [` ` + myWalletIndex.currency])
                                ])
                            ]),
                            m('div.trade border-radius-medium px-7 py-7 mx-5 column cursor-pointer', {
                                class: (myWalletIndex.swValue !== '03' ? `has-bg-primary` : `has-bg-level-2`),
                                onclick: () => { myWalletIndex.switchChange('01'); }
                            }, [
                                m('div.left', {}, [
                                    m('div', { class: `body-5 mb-1` }, [
                                        m('span', { }, `交易账户`)
                                    ]),
                                    m('div', { class: `title-small ` }, [
                                        m('span', {}, myWalletIndex.hideMoneyFlag ? '******' : myWalletIndex.tradingAccountTotalValue),
                                        m('span', {}, [` ` + myWalletIndex.currency])
                                    ])
                                ]),
                                m('div.right', {
                                    onmouseover: function () { myWalletIndex.switchDisplay(`tradeCard`, `show`); },
                                    onmouseleave: function () { myWalletIndex.switchDisplay(`tradeCard`, `hide`); }
                                }, [
                                    m('div.cursor-pointer', {
                                    }, [
                                        m('span', { class: `card1 title-medium` }, `...`)
                                    ]),
                                    m('div.tradeCard body-2 border-radius-medium pa-7 has-bg-level-2 box-shadow', {
                                        style: { display: `none` }
                                    }, [
                                        m('span.mb-1 cursor-pointer', `合约账户`),
                                        m('a.mb-5 has-text-level-3', { class: myWalletIndex.swValue === '01' || myWalletIndex.swValue === '03' ? 'has-text-primary' : '', onclick: () => { myWalletIndex.switchChange('01', 'small'); } }, myWalletIndex.contractTotal + ` ` + myWalletIndex.currency),
                                        m('span.mb-1 cursor-pointer', `币币账户`),
                                        m('a.mb-5 has-text-level-3', { class: myWalletIndex.swValue === '02' ? 'has-text-primary' : '', onclick: () => { myWalletIndex.switchChange('02', 'small'); } }, myWalletIndex.coinTotal + ` ` + myWalletIndex.currency),
                                        m('span.mb-1 cursor-pointer', `法币账户`),
                                        m('a.has-text-level-3', { class: myWalletIndex.swValue === '04' ? 'has-text-primary' : '', onclick: () => { myWalletIndex.switchChange('04', 'small'); } }, myWalletIndex.legalTotal + ` ` + myWalletIndex.currency)
                                    ])
                                ])
                            ]),
                            m('div.other border-radius-medium px-7 py-7 column cursor-pointer has-bg-level-2', { onclick: () => { myWalletIndex.switchChange('none'); } }, [
                                m('div', { class: `body-5 mb-1` }, [
                                    m('span', {}, `其他账户`)
                                ]),
                                m('div', { class: `title-small` }, [
                                    m('span', {}, myWalletIndex.hideMoneyFlag ? '******' : myWalletIndex.otherTotalValue),
                                    m('span', {}, [` ` + myWalletIndex.currency])
                                ])
                            ])
                        ])
                    ])
                ]),
                m('div', { class: `myWalletIndex-table container pb-7 content-width` }, [
                    myWalletIndex.switchContent()
                ])
            ]),
            // 资金划转组件
            m(Transfer)
        ]);
    },
    oncreate: () => {
        myWalletIndex.createFn();
    },
    onremove: () => {
        myWalletIndex.removeFn();
    }
};