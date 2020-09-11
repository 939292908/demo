const I18n = require("../../../../languages/I18n").default;
const Tooltip = require('@/views/components/common/Tooltip/Tooltip.view');
const m = require('mithril');
const utils = require('@/util/utils').default;

const logic = {
    // 菜单标题click
    handlerMenuTitleClick(item) {
        if (logic.openMenuIdList.some(id => id === item.id)) { // 有id
            logic.openMenuIdList = logic.openMenuIdList.filter(id => id !== item.id);
        } else { // 没有id
            logic.openMenuIdList.push(item.id);
        }
    },
    // 菜单click
    handlerMenuClick (item) {
        if (item.link) {
            const link = I18n.getLocale() === 'en' && item.helpCenter ? item.link.replace('zh-cn', 'en-001') : item.link;
            window.open(link);
        } else if (item.email) {
            window.location = `mailto:${item.email}`;
        }
    },
    // icon列表
    getIconList() {
        return [
            {
                name: "icon-qq",
                img: require("@/assets/img/home/QQcustomer_service.png").default
            },
            {
                name: "icon-WeChat",
                img: require("@/assets/img/home/Communitywechat.png").default
            },
            {
                href: "https://www.facebook.com/Vbit-107388547588403/",
                name: "icon-Facebook"
            },
            {
                href: "https://twitter.com/VbitOfficial",
                name: "icon-Twitter"
            },
            {
                href: "https://t.me/VbitOfficial",
                name: "icon-Aircraft"
            },
            {
                href: "https://weibo.com/VbitOfficial",
                name: "icon-Weibo"
            },
            {
                href: "https://www.mytokencap.com/exchange/vbit",
                name: "icon-Mmm"
            }
        ];
    },
    // 菜单列表
    getMenuList() {
        return [
            {
                id: 1,
                class: 'body-3',
                label: I18n.$t('10032'), // "平台服务",
                list: [
                    {
                        label: I18n.$t('10003'), // "币币交易",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961613"
                    },
                    {
                        label: I18n.$t('10001'), // "法币交易",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961593"
                    },
                    {
                        label: I18n.$t('10033'), // "永续合约",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961633"
                    },
                    {
                        label: I18n.$t('10034'), // "杠杆ETF",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360008544873"
                    },
                    {
                        label: I18n.$t('10035'), // "全币种合约",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/categories/360003442694"
                    }
                ]
            },
            {
                id: 2,
                label: I18n.$t('10036'), // "平台条款",
                list: [
                    {
                        label: I18n.$t('10037'), // "服务协议",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404594"
                    },
                    {
                        label: I18n.$t('10038'), // "法律声明",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404554"
                    },
                    {
                        label: I18n.$t('10039'), // "隐私条款",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404594"
                    },
                    {
                        label: I18n.$t('10040'), // "合规牌照",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360048389153"
                    }
                ]
            },
            {
                id: 3,
                label: I18n.$t('10041'), // "服务支持",
                list: [
                    {
                        label: I18n.$t('10005'), // "新手帮助",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007960273"
                    },
                    {
                        label: I18n.$t('10042'), // "常见问题",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/categories/360003464933"
                    },
                    {
                        label: I18n.$t('10043'), // "公告中心",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/categories/360003415534"
                    },
                    {
                        label: I18n.$t('10044'), // "相关费率",
                        link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007979093"
                    }
                ]
            },
            {
                id: 4,
                label: I18n.$t('10045'), // "联系我们",
                list: [
                    {
                        class: 'body-4',
                        label: I18n.$t('10046'), // "服务邮箱",
                        email: "support@vbit.one"
                    },
                    {
                        render() {
                            return m(Tooltip, {
                                label: I18n.$t('10047'), // "加入社群",
                                triggerClass: "has-text-primary-hover",
                                content: [
                                    m('div', { class: `mr-1 has-text-centered ${utils.isMobile() ? 'ml-7' : ''}` }, [
                                        m('img', { class: ``, src: require("@/assets/img/home/Communitywechat.png").default })
                                    ])
                                ],
                                position: 'top'
                            });
                        }
                    },
                    {
                        render() {
                            return m(Tooltip, {
                                label: I18n.$t('10581'), // "联系客服",
                                triggerClass: "has-text-primary-hover",
                                content: [
                                    m('div', { class: `body-4 has-text-centered ${utils.isMobile() ? 'ml-7' : ''}` }, [
                                        m('img', { class: ``, src: require("@/assets/img/home/QQcustomer_service.png").default })
                                    ])
                                ],
                                position: 'top'
                            });
                        }
                    }
                ]
            }
        ];
    },
    // 菜单开启状态的id
    openMenuIdList: []
};

module.exports = logic;