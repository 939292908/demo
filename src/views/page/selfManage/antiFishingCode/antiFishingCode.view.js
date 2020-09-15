const m = require('mithril');
require('@/views/page/selfManage/antiFishingCode/antiFishingCode.scss');
const antiFCLogic = require('@/views/page/selfManage/antiFishingCode/antiFishingCode.logic');
const I18n = require('@/languages/I18n').default;
const Header = require('@/views/components/indexHeader/indexHeader.view');
const InputWithComponent = require('@/views/components/inputWithComponent/inputWithComponent.view');

const antiFCView = {
    view: () => {
        return m('div', { class: `views-page-selfManage-antiFishingCode theme--light pb-7` }, [
            m(Header, {
                highlightFlag: 1,
                navList: [
                    { to: '/selfManage', title: I18n.$t('10051') /* '个人总览' */ },
                    { to: '/securityManage', title: I18n.$t('10181') /* '账户安全' */ },
                    { to: '', title: I18n.$t('10182') /* '身份认证' */ },
                    { to: '', title: I18n.$t('10183') /* 'API管理' */ },
                    { to: '', title: I18n.$t('10184') /* '邀请返佣' */ }
                ]
            }),
            m('div', { class: `operation mb-7 has-bg-level-2` }, [
                m('div', { class: `content-width container` }, [
                    m('i', { class: `iconfont icon-Return has-text-title cursor-pointer`, onclick: () => { window.router.go(-1); } }),
                    m('span', { class: `has-text-title my-4 ml-4 title-medium` }, I18n.$t('10278') /* '您正在设置防钓鱼码' */),
                    m('i', { class: `iconfont icon-Tooltip pr-2 cursor-pointer` })
                ])
            ]),
            m('div', { class: `center container content-width has-bg-level-2` }, [
                m('div', { class: `container content-width pt-8` }, [
                    m('span', { class: `` }, I18n.$t('10232') /* '防钓鱼码' */),
                    m(InputWithComponent, {
                        hiddenLine: true,
                        addClass: `mt-2`,
                        options: {
                            oninput: e => {
                                antiFCLogic.antiFishingCodeValue = e.target.value;
                            },
                            value: antiFCLogic.antiFishingCodeValue
                        }
                    }),
                    m('div', { class: `mt-8` }, [
                        m('button', { class: `has-bg-primary cursor-pointer` }, I18n.$t('10337') /* '确定' */)
                    ])
                ])
            ])
        ]);
    },
    onremove: () => {
    }
};
module.exports = antiFCView;