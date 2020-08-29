const m = require('mithril');
require('@/views/page/myAssets/myWalletIndex/children/recharge/recharge.scss');
const rechargeIndex = require('@/views/page/myAssets/myWalletIndex/children/recharge/index');

module.exports = {
    oninit: () => {
        rechargeIndex.initFn();
        console.log(rechargeIndex);
    },
    oncreate: () => {
    },
    view: () => {
        return m('div', { class: `views-page-myAssets-myWalletIndex-childer-recharge theme--light` }, [
            m('div', { class: `top mb-7 has-bg-level-2 ` }, [
                m('i', { class: `iconfont icon-Return has-text-title` }),
                m('span', { class: `has-text-title my-4 ml-4 title-medium` }, '充币')
            ]),
            m('div', { class: `bottom content-width` }, [
                m('div', { class: `bottom-upper has-bg-level-2 pl-8 pt-7` }, [
                    m('div', { class: `` }, [
                        m('span', { class: `body-5` }, '币种')
                    ]),
                    m('div', { class: `currencySel border-radius-medium mt-2 mb-7` }, [
                        m('div.select is-fullwidth',
                            rechargeIndex.selData,
                            m('select', [
                                m('option', { selected: true }, 'Country1'),
                                m('option', { selected: false }, 'Country2'),
                                m('option', { selected: false }, 'Country3')
                            ])
                        )
                    ]),
                    m('div', {}, [
                        m('span', { class: `body-5` }, '充币地址')
                    ]),
                    m('div', { class: `currencyAddr border-radius-medium mt-2 mb-7` }, [
                        m('div', { class: `currencyAddr-text ml-3` }, [
                            m('span', {}, '128')
                        ]),
                        m('div', { class: `currencyAddr-Operation ml-3` }, [
                            m('i', { class: `iconfont icon-copy has-text-primary` }),
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