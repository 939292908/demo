const m = require('mithril');
require('@/views/page/myAssets/myWalletIndex/children/recharge/recharge.scss');
const rechargeLogic = require('@/views/page/myAssets/myWalletIndex/children/recharge/recharge.logic');
const AssetRecords = require('@/models/myAssets/assetsRecords');
const assetTable = require('../../../assetTable/assetTable.view');
const Tooltip = require('@/views/components/common/Tooltip/Tooltip.view');
const Dropdown = require('@/views/components/common/Dropdown/Dropdown.view');
const I18n = require('@/languages/I18n').default;
const Header = require('@/views/components/indexHeader/indexHeader.view');
const Loading = require('@/views/components/loading/loading.view');

module.exports = {
    oninit: () => {
        rechargeLogic.initFn();
        AssetRecords.init('03', 'recharge', 1, 10);
        AssetRecords.setLanguageListen();
    },
    view: () => {
        return m('div', { class: `views-page-myAssets-myWalletIndex-childer-recharge theme--light pb-7` }, [
            m(Header, {
                highlightFlag: 0,
                navList: [{ to: '/myWalletIndex', title: I18n.$t('10052') /* '我的资产' */ }, { to: '/assetRecords', title: I18n.$t('10053') /* '资金记录' */ }]
            }),
            m('div', { class: `top mb-7 has-bg-level-2 cursor-pointer` }, [
                m('div', { class: `content-width `, style: { margin: `auto` } }, [
                    m('i', { class: `iconfont icon-Return has-text-title cursor-pointer`, onclick: () => { window.router.go(-1); } }),
                    m('span', { class: `has-text-title my-4 ml-4 title-medium` }, I18n.$t('10056') /* '充币' */)
                ])
            ]),
            m('div', { class: `bottom content-width mb-7 border-radius-medium` }, [
                m('div', { class: `bottom-upper has-bg-level-2 pl-8 pt-7` }, [
                    m('div', { class: `myLoading ${rechargeLogic.isLoadingShow ? `` : `is-hidden`}` }, [
                        m(Loading)
                    ]),
                    m('div', { class: `` }, [
                        m('div', { class: `form-item-title` }, I18n.$t('10063') /* '币种' */),
                        m('div', { class: `form-item-content border-radius-medium mt-2 mb-7`, style: { width: `384px` } }, [
                            m(Dropdown, rechargeLogic.option)
                        ]),
                        m('div', { class: `xrpLable mb-7`, style: { display: rechargeLogic.item.memo ? (rechargeLogic.option.currentId === 'XRP' || rechargeLogic.option.currentId === 'EOS' ? '' : 'none') : 'none' } }, [
                            m('div', { class: `labeltip` }, [
                                m('span', {}, I18n.$t('10098') /* '标签' */),
                                m('div.navbar-item.cursor-pointer', { class: `` }, [
                                    m(Tooltip, {
                                        label: m('i', { class: `iconfont icon-Tooltip` }),
                                        content: rechargeLogic.labelTips,
                                        position: 'bottom',
                                        direction: 'right'
                                    })
                                ])
                            ]),
                            m('div', { class: `mt-2 px-2 has-text-primary border-radius-small tag is-primary is-light uid` }, rechargeLogic.item.uId)
                        ]),
                        m('div', { class: `usdtLable mb-7`, style: { display: rechargeLogic.item.openChains ? (rechargeLogic.option.currentId === 'USDT' ? '' : 'none') : 'none' } }, [
                            m('div', { class: `labeltip` }, [
                                m('span', {}, I18n.$t('10100') /* '链名称' */),
                                m('div.navbar-item.cursor-pointer', { class: `` }, [
                                    m(Tooltip, {
                                        label: m('i', { class: `iconfont icon-Tooltip` }),
                                        content: rechargeLogic.nameTips.map(item => {
                                            return m('span', { key: item, class: `mt-1` }, item);
                                        }),
                                        width: `240px`,
                                        position: `bottom`,
                                        direction: `right`
                                    })
                                ])
                            ]),
                            m('div', { class: `mt-2` }, [
                                rechargeLogic.chainSelected && rechargeLogic.chainList.map((item) => {
                                    return m('button', {
                                        class: `mr-6 button button-small is-primary` + (rechargeLogic.chainSelected === item.name ? ` has-text-white` : ` is-outlined`),
                                        key: item.name,
                                        onclick: () => {
                                            rechargeLogic.chainSelected = item.name;
                                            rechargeLogic.initItem();
                                        }
                                    }, item.name);
                                })
                            ])
                        ]),
                        m('div', {}, [
                            m('span', { class: `body-5` }, I18n.$t('10081') /* '充币地址' */)
                        ]),
                        m('div', { class: `currencyAddr border-radius-medium mt-2 mb-7` }, [
                            m('div', { class: `currencyAddr-text ml-3 has-bg-level-3 mr-6` }, rechargeLogic.item.rechargeAddr),
                            m('div', { class: `currencyAddr-Operation ml-3` }, [
                                m('div', { class: `iImg mt-2` }, [
                                    m('i', { class: `iconfont icon-copy has-text-primary cursor-pointer mr-2`, onclick: () => { rechargeLogic.copyText(); } }),
                                    m(Tooltip, {
                                        label: m('i', { class: `iconfont icon-QrCode has-text-primary cursor-pointer` }),
                                        content: m('img', { class: `addressImg`, src: rechargeLogic.rechargeAddrSrc }),
                                        position: `bottom`,
                                        direction: `right`
                                    })
                                ])
                            ])
                        ]),
                        m('div', { class: `tips pb-6` }, [
                            m('span', { class: `body-5` }, I18n.$t('10082') /* '温馨提示' */),
                            m('br'),
                            rechargeLogic.tipsAry.map((item, index) => m(`span.pb-1 body-4`, { class: index === 0 ? `has-text-primary` : `has-text-level-4`, key: item }, '*' + item))
                        ])
                    ])
                ]),
                m('div.bottom-tab.has-bg-level-2.mt-5.pt-3.border-radius-medium', {}, [
                    m('div.pa-5', {}, [
                        m('span.title-small', {}, I18n.$t('10086') /* '近期充币记录' */),
                        m(Tooltip, {
                            label: m('i.iconfont.icon-Tooltip.iconfont-large'),
                            content: I18n.$t('10509')/* '只展示近期十条记录' */,
                            hiddenArrows: false
                        }),
                        m('span.all', { class: `has-text-primary cursor-pointer`, onclick: () => { window.router.push('/assetRecords'); } }, I18n.$t('10087') /* '全部记录' */)
                    ]),
                    m('hr.ma-0'),
                    m(assetTable, {
                        class: 'pa-5',
                        list: AssetRecords.showList,
                        loading: AssetRecords.loading,
                        aType: AssetRecords.aType
                    })
                ])
            ])
        ]);
    },
    onremove: () => {
        rechargeLogic.removeFn();
        AssetRecords.destroy();
    }
};