const m = require('mithril');
const rechargeIndex = require('@/views/page/myAssets/myWalletIndex/children/recharge/index');
require('@/views/page/myAssets/myWalletIndex/children/recharge/recharge.scss');

module.exports = {
    pageData: [],
    tips: '*您只能向此地址充值BTC，其他资产充入BTC地址将无法找回 *使用BTC地址充值需要1个网络确认才能到账 *默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户',
    oninit: () => {
        rechargeIndex.initFn();
    },
    oncreate: () => {
    },
    view: () => {
        return m('div', { class: `views-page-myAssets-myWalletIndex-childer-recharge theme--light` }, [
            m('div', { class: `top mb-7 has-bg-level-2 ` }, [
                m('i', { class: `iconfont icon-Return has-text-title` }),
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
                                    return m('option', { }, item.wType);
                                })
                            ])
                        )
                    ]),
                    m('div', {}, [
                        m('span', { class: `body-5` }, '充币地址')
                    ]),
                    m('div', { class: `currencyAddr border-radius-medium mt-2 mb-7` }, [
                        m('div', { class: `currencyAddr-text ml-3` }, [
                            m('input', { class: `addrText`, type: 'text', readOnly: `readOnly`, value: `1323232` })
                        ]),
                        m('div', { class: `currencyAddr-Operation ml-3` }, [
                            m('i', { class: `iconfont icon-copy has-text-primary cursor-pointer`, onclick: () => { rechargeIndex.copyText(); } }),
                            m('i', { class: `iconfont icon-QrCode has-text-primary` })
                        ])
                    ]),
                    m('div', {}, [
                        m('span', {}, '温馨提示'),
                        m('br'),
                        rechargeIndex.tips.split('*').map(item => m('span', {}, '*' + item))
                    ])
                ]),
                m('div', { class: `bottom-tab has-bg-level-2 mt-5 pt-3` }, [
                    m('div', { class: `pl-5` }, [
                        m('span', { class: `title-small` }, '近期充币记录'),
                        m('i', { class: `iconfont icon-Tooltip` })
                    ]),
                    m('hr')
                ])

            ])
        ]);
    },
    onremove: () => {
    }
};