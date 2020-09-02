const m = require('mithril');
const rechargeIndex = require('@/views/page/myAssets/myWalletIndex/children/recharge/recharge.logic');
const AssetRecords = require('@/models/asset/assetsRecords');
const assetTable = require('../../../assetTable/assetTable.view');
require('@/views/page/myAssets/myWalletIndex/children/recharge/recharge.scss');
const Tooltip = require('@/views/components/common/Tooltip');

module.exports = {
    oninit: () => {
        rechargeIndex.initFn();
        AssetRecords.init('03', 'recharge');
    },
    oncreate: () => {
    },
    view: () => {
        return m('div', { class: `views-page-myAssets-myWalletIndex-childer-recharge theme--light` }, [
            // rechargeIndex.USDTLabel,
            m('div', { class: `top mb-7 has-bg-level-2 ` }, [
                m('i', { class: `iconfont icon-Return has-text-title`, onclick: () => { window.router.go(-1); } }),
                m('span', { class: `has-text-title my-4 ml-4 title-medium` }, '充币')
            ]),
            m('div', { class: `bottom content-width mb-9` }, [
                m('div', { class: `bottom-upper has-bg-level-2 pl-8 pt-7` }, [
                    m('div', { class: `` }, [
                        m('span', { class: `body-5` }, '币种')
                    ]),
                    m('div', { class: `currencySel border-radius-medium mt-2 mb-7` }, [
                        m('div.select is-fullwidth',
                            m('select', { class: `coinSel`, onchange: () => { rechargeIndex.modifySelect(); } }, [
                                rechargeIndex.pageData.map(item => {
                                    return m('option', { }, item.wType + '  |  ' + item.zh);
                                })
                            ])
                        )
                    ]),
                    m('div', { class: `xrpLable mb-7`, style: { display: rechargeIndex.memo ? (rechargeIndex.selectCheck === 'XRP' || rechargeIndex.selectCheck === 'EOS' ? '' : 'none') : 'none' } }, [
                        m('div', { class: `labeltip` }, [
                            m('span', {}, '标签'),
                            m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover` }, [
                                m(Tooltip, {
                                    label: m('i', { class: `iconfont icon-Tooltip` }),
                                    content: rechargeIndex.labelTips,
                                    hiddenArrows: false
                                })
                            ])
                        ]),
                        m('div', { class: `mt-2 px-2 has-text-primary border-radius-small uid` }, rechargeIndex.uId)
                    ]),
                    m('div', { class: `usdtLable mb-7`, style: { display: rechargeIndex.openChains ? (rechargeIndex.selectCheck === 'USDT' ? '' : 'none') : 'none' } }, [
                        m('div', { class: `labeltip` }, [
                            m('span', {}, '链名称'),
                            m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover` }, [
                                m(Tooltip, {
                                    label: m('i', { class: `iconfont icon-Tooltip` }),
                                    content: rechargeIndex.labelTips,
                                    hiddenArrows: false
                                })
                            ])
                        ]),
                        m('div', { class: `mt-2` }, [
                            rechargeIndex.USDTLabel.map((item, index) => {
                                return m('button', {
                                    class: `mr-6 cursor-pointer ` + (rechargeIndex.btnCheckFlag === index ? `has-bg-primary` : `noneBG`),
                                    onclick: () => { rechargeIndex.changeBtnflag(index, item); }
                                }, item);
                            })
                        ])
                    ]),
                    m('div', {}, [
                        m('span', { class: `body-5` }, '充币地址')
                    ]),
                    m('div', { class: `currencyAddr border-radius-medium mt-2 mb-7` }, [
                        m('div', { class: `currencyAddr-text ml-3` }, [
                            m('input', { class: `addrText`, type: 'text', readOnly: `readOnly`, value: rechargeIndex.rechargeAddr })
                        ]),
                        m('div', { class: `currencyAddr-Operation ml-3` }, [
                            m('div', { class: `iImg mt-2` }, [
                                m('i', { class: `iconfont icon-copy has-text-primary cursor-pointer`, onclick: () => { rechargeIndex.copyText(); } }),
                                m('i', {
                                    class: `iconfont icon-QrCode has-text-primary cursor-pointer`,
                                    onmouseover: () => {
                                        rechargeIndex.changeQrcodeDisplay('show');
                                    },
                                    onmouseout: () => {
                                        rechargeIndex.changeQrcodeDisplay('hide');
                                    }
                                })
                            ]),
                            m('div', { class: `QrCodeImg`, style: { display: rechargeIndex.qrcodeDisplayFlag ? '' : 'none' } })
                        ])
                    ]),
                    m('div', { class: `tips` }, [
                        m('span', {}, '温馨提示'),
                        m('br'),
                        rechargeIndex.tips.split('*').map((item, index) => m('span', { class: index === 0 ? 'has-text-primary' : '' }, '*' + item))
                    ])
                ]),
                m('div.bottom-tab.has-bg-level-2.mt-5.pt-3', {}, [
                    m('div.pa-5', {}, [
                        m('span.title-small', {}, ['近期提币记录']),
                        m('i.iconfont.icon-Tooltip', {}, []),
                        m('span.all', { class: `has-text-primary cursor-pointer`, onclick: () => { window.router.push('/assetRecords'); } }, '全部记录')
                    ]),
                    m('hr.ma-0'),
                    m(assetTable, { class: 'pa-5', list: AssetRecords.showList })
                ])
            ])
        ]);
    },
    onremove: () => {
    }
};