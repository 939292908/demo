const m = require('mithril');
const Tooltip = require('@/views/components/common/Tooltip/Tooltip.view');
const utils = require('@/util/utils').default;
require('@/styles/pages/footer/footer.scss');
const methods = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        methods.openNavbarDropdown = !methods.openNavbarDropdown;
    },
    handlerMenuClick: function (item) {
        console.log(item);
        if (item.link) {
            window.open(item.link);
        } else if (item.email) {
            window.location = `mailto:${item.email}`;
        }
    },
    iconList: [
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
    ],
    menuList: [
        {
            id: 1,
            class: 'body-3',
            label: "平台服务",
            list: [
                {
                    label: "币币交易",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961613"
                },
                {
                    label: "法币交易",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961593"
                },
                {
                    label: "永续合约",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961633"
                },
                {
                    label: "杠杆ETF",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360008544873"
                },
                {
                    label: "全币种合约",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/categories/360003442694"
                }
            ]
        },
        {
            id: 2,
            label: "平台条款",
            list: [
                {
                    label: "服务协议",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404594"
                },
                {
                    label: "法律声明",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404554"
                },
                {
                    label: "隐私条款",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404594"
                },
                {
                    label: "合规牌照",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360048389153"
                }
            ]
        },
        {
            id: 3,
            label: "服务支持",
            list: [
                {
                    label: "新手帮助",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007960273"
                },
                {
                    label: "常见问题",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/categories/360003464933"
                },
                {
                    label: "公告中心",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/categories/360003415534"
                },
                {
                    label: "相关费率",
                    link: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007979093"
                }
            ]
        },
        {
            id: 4,
            label: "联系我们",
            list: [
                {
                    class: 'body-4',
                    label: "服务邮箱",
                    email: "support@vbit.one"
                },
                {
                    render() {
                        return m(Tooltip, {
                            label: "加入社群",
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
                            label: "联系客服",
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
    ],
    openMenuIdList: []
};

module.exports = {
    view() {
        return m('div.views-pages-home-footer.container', {
        }, [
            // 底部
            m('div', { class: `pub-footer columns pt-7 pb-6 mt-7` }, [
                // 左边width
                m('div', { class: `footer-left column is-6` }, [
                    // logo
                    m('svg.icon.footer-logo', { "aria-hidden": true }, [
                        m('use', { "xlink:href": "#icon-white-logo" })
                    ]),
                    m('p', { class: `footer-title ${utils.isMobile() ? 'ml-6' : ''}` }, ["全球区块链资产衍生品交易平台"]),
                    // 社区
                    m('div', { class: `is-flex mt-7 is-between is-hidden-mobile`, style: "width: 300px" }, [
                        methods.iconList.map(item => {
                            return m('a', { class: ``, target: "_blank", href: item.href }, [
                                m(Tooltip, {
                                    label: m('i', { class: `iconfont ${item.name}` }),
                                    class: 'has-text-level-2 has-text-primary-hover',
                                    content: item.img ? m('img', { class: '', src: item.img }) : "",
                                    position: 'top'
                                })
                            ]);
                        })
                    ])
                ]),
                // 右边
                m('div', { class: `footer-right column columns is-6` }, [
                    methods.menuList.map((item, index) => {
                        return m('div', { class: `column bottom-navigation-tab-1  ${utils.isMobile() ? 'ml-6' : ''}`, key: 'item' + index }, [
                            // 菜单标题
                            m('div', { class: `body-4 is-between ${utils.isMobile() ? 'mt-7' : ''}` }, [
                                m('span', { class: `mb-3` }, item.label),
                                m('span', {
                                    class: `pr-5 ${utils.isMobile() ? '' : 'is-hidden'}`,
                                    onclick() {
                                        console.log(item);

                                        if (methods.openMenuIdList.some(id => id === item.id)) { // 有id
                                            methods.openMenuIdList = methods.openMenuIdList.filter(id => id !== item.id);
                                        } else { // 没有id
                                            methods.openMenuIdList.push(item.id);
                                        }
                                    }
                                }, methods.openMenuIdList.some(id => id === item.id) ? '-' : '+')
                            ]),
                            // 子菜单
                            m('ul', { class: `${methods.openMenuIdList.some(id => id === item.id) || !utils.isMobile() ? '' : 'is-hidden'}` }, item.list.map((item1, index1) => {
                                return m('li', { class: `body-4 has-text-white  has-text-primary-hover has-text-level-2`, onclick: () => methods.handlerMenuClick(item1), key: 'item1' + index1 }, [
                                    m('span.curPri', (item1.render && item1.render()) || item1.label)
                                ]);
                            }))
                        ]);
                    })
                ])
            ]),
            m('p', { class: `bottom-copyright is-hidden-mobile my-3` }, ["© 2019-2020 Vbit 版权所有"])
        ]);
    }
};