const m = require('mithril');
const Header = require('@/pages/page/myAssets/header/HeaderView');
const Modal = require('@/pages/components/common/Modal');
const Transfer = require('@/pages/components/transfer');
require('@/styles/pages/Myassets/MyWalletIndex.scss');

module.exports = function (props) {
    const { myWalletIndex } = props;
    return m('div', { class: `views-pages-myassets-myWalletIndex theme--light` }, [
        m('div', { onclick: function() { myWalletIndex.optionDisplay(event); } }, [
            m('div.top mb-8', { style: { height: `344px`, width: `100%`, backgroundColor: `#0E1C33` } }, [
                m('div', { class: `myWalletIndex-warpper container content-width` }, [
                    // highlightFlag:哪个高亮   0：我的资产  1：资产记录
                    m(Header, { highlightFlag: 0 }),
                    m('div', { class: `myWalletIndex-head columns-flex mt-7` }, [
                        m('div', { class: `myWalletIndex-head-left column` }, [
                            m('div', { class: `myWalletIndex-head-left-total columns pt-3` }, [
                                m('span', { class: `body-6`, style: `color:white` }, [`总资产估值`]),
                                m('div', {}, [
                                    m('button.cursor-pointer', { onclick: myWalletIndex.setSelectOpFlag, style: { color: `#FF8B00` } }, myWalletIndex.selectOpText + ` ▼`),
                                    m('ul.border-radius-small ml-3 has-bg-level-2 currType', { style: { display: `none` } }, [
                                        myWalletIndex.selectOp.map(item => {
                                            return m('li.cursor-pointer pl-3', { class: item === myWalletIndex.selectOpText ? `has-text-primary` : ``, onclick: function() { myWalletIndex.selectOpHideUl(item); } }, item);
                                        })
                                    ])
                                ])
                            ]),
                            m('div', { class: `number-hide`, style: `color:white` }, [
                                m('span', { class: `title-large` }, [myWalletIndex.totalValue]),
                                m('span', { class: `title-large` }, [` ` + myWalletIndex.currency]),
                                m('img.pl-2 changeMoneyImg', {
                                    onclick: myWalletIndex.hideValue,
                                    src: require('@/assets/img/myAssets/hideMoney.svg').default,
                                    style: { width: '18px', height: '11.59px' }
                                }),
                                m('br'),
                                m('span', { style: `color:#9A9EAC` }, [`≈ `]),
                                m('span', { style: `color:#9A9EAC` }, [myWalletIndex.totalCNY]),
                                m('span', { style: `color:#9A9EAC` }, [` CNY`])
                            ])
                        ]),
                        m('div', { class: `myWalletIndex-head-right column pa-5` }, [
                            // 充币  提币  内部转账  资金划转
                            m('div', { class: `is-between  pt-8` }, [
                                myWalletIndex.Nav.firstNav.map((item, index) => {
                                    return m(`button.column button-large mx-3 border-radius-small cursor-pointer Operation${index} has-line-level-2`, {
                                        class: item.title === `充币` ? `has-bg-primary` : `has-text-primary bgNone`,
                                        onclick: function () { myWalletIndex.handlerClickNavBtn(item); },
                                        onmouseover: function() { myWalletIndex.changeBtnSty(index, `show`); },
                                        onmouseleave: function() { myWalletIndex.changeBtnSty(index, `hide`); }
                                    },
                                    [item.title]);
                                })
                            ])
                        ])
                    ]),
                    // 我的钱包  交易账户  其他账户
                    m('div', { class: `myWalletIndex-switch columns-flex mt-7 is-between` }, [
                        m('div.wallet border-radius-medium px-7 py-7 column', {
                            class: (myWalletIndex.swValue === 0 ? `has-bg-primary` : `has-bg-level-2`),
                            onclick: function() { myWalletIndex.switchChange(0); }
                        }, [
                            m('div', { class: `body-5 mb-1` }, [
                                m('span', { }, `我的钱包`)
                            ]),
                            m('div', { class: `title-small ` }, [
                                m('span', {}, myWalletIndex.walletTotalValue),
                                m('span', {}, [` ` + myWalletIndex.currency])
                            ])
                        ]),
                        m('div.trade border-radius-medium px-7 py-7 mx-5 column', {
                            class: (myWalletIndex.swValue === 1 ? `has-bg-primary` : `has-bg-level-2`),
                            onclick: function() { myWalletIndex.switchChange(1, `true`); }
                        }, [
                            m('div.left', {}, [
                                m('div', { class: `body-5 mb-1` }, [
                                    m('span', { }, `交易账户`)
                                ]),
                                m('div', { class: `title-small ` }, [
                                    m('span', {}, myWalletIndex.tradingAccountTotalValue),
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
                                    // m('span.mb-1 cursor-pointer', `合约账户`),
                                    // m('a.mb-5 has-text-level-3', { class: myWalletIndex.wltIdx === 1 ? 'has-text-primary' : '', onclick: function () { myWalletIndex.changeTradeAccount(1); } }, myWalletIndex.contractTotal + ` ` + myWalletIndex.currency),
                                    // m('span.mb-1 cursor-pointer', `币币账户`),
                                    // m('a.mb-5 has-text-level-3', { class: myWalletIndex.wltIdx === 2 ? 'has-text-primary' : '', onclick: function () { myWalletIndex.changeTradeAccount(2); } }, myWalletIndex.coinTotal + ` ` + myWalletIndex.currency),
                                    // m('span.mb-1 cursor-pointer', `法币账户`),
                                    // m('a.has-text-level-3', { class: myWalletIndex.wltIdx === 4 ? 'has-text-primary' : '', onclick: function () { myWalletIndex.changeTradeAccount(4); } }, myWalletIndex.legalTotal + ` ` + myWalletIndex.currency)
                                    m('span.mb-1 cursor-pointer', `合约账户`),
                                    m('a.mb-5 has-text-level-3', { onclick: function () { myWalletIndex.changeTradeAccount(1); } }, myWalletIndex.contractTotal + ` ` + myWalletIndex.currency),
                                    m('span.mb-1 cursor-pointer', `币币账户`),
                                    m('a.mb-5 has-text-level-3', { onclick: function () { myWalletIndex.changeTradeAccount(2); } }, myWalletIndex.coinTotal + ` ` + myWalletIndex.currency),
                                    m('span.mb-1 cursor-pointer', `法币账户`),
                                    m('a.has-text-level-3', { onclick: function () { myWalletIndex.changeTradeAccount(4); } }, myWalletIndex.legalTotal + ` ` + myWalletIndex.currency)
                                ])
                            ])
                        ]),
                        m('div.other border-radius-medium px-7 py-7 column has-bg-level-2', {}, [
                            m('div', { class: `body-5 mb-1` }, [
                                m('span', { }, `其他账户`)
                            ]),
                            m('div', { class: `title-small ` }, [
                                m('span', {}, myWalletIndex.otherTotalValue),
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
        m(Modal, {
            isShow: myWalletIndex.transferModal.isShow, // 显示隐藏
            onOk: myWalletIndex.transferModal.onOk, // 确认事件 // 使用默认确认按钮
            onClose: myWalletIndex.transferModal.onClose, // 关闭事件
            slot: { // 插槽
                header: "资金划转",
                body: myWalletIndex.transferModal.isShow ? m(Transfer) : []
            }
        })
    ]);
};