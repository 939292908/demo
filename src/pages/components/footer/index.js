const m = require('mithril');
const Tooltip = require('@/pages/components/common/Tooltip');

const methods = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        methods.openNavbarDropdown = !methods.openNavbarDropdown;
    }
};

const iconList = [
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
module.exports = {
    view: function () {
        return m('div.views-pages-home-footer.container', {
        }, [
            // 底部
            m('div', { class: `pub-footer columns pt-7 pb-6 mt-7` }, [
                // 左边width
                m('div', { class: `footer-left column is-6` }, [
                    // logo
                    m('img', { class: '', src: require("@/assets/img/logo/title-logo.png").default, style: "width: 112;height:28px;" }),
                    m('p', { class: `footer-title` }, ["全球区块链资产衍生品交易平台"]),
                    // 社区
                    m('div', { class: `is-flex mt-7 is-between is-hidden-mobile`, style: "width: 300px" }, [
                        iconList.map(item => {
                            return m('a', { class: ``, target: "_blank", href: item.href }, [
                                m(Tooltip, {
                                    label: m('i', { class: `iconfont ${item.name}` }),
                                    class: 'has-text-level-2 has-text-primary-hover',
                                    content: item.img ? m('img', { class: '', src: item.img }) : ""
                                })
                            ]);
                        })
                    ])
                ]),
                // 右边
                m('div', { class: `footer-right column columns is-6` }, [
                    // 导航栏
                    m('div', { class: `column bottom-navigation-tab-1` }, [
                        m('div', { class: `body-6 ` }, ['平台服务']),
                        m('a', { class: `has-text-white  has-text-primary-hover has-text-level-2`, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961613", target: "_blank" }, ["币币交易"]),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover has-text-level-2`, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961593", target: "_blank" }, ["法币交易"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover has-text-level-2`, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961633", target: "_blank" }, ["永续合约"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover has-text-level-2`, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360008544873", target: "_blank" }, ["杠杆ETF"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover has-text-level-2`, href: "https://vbithelp.zendesk.com/hc/zh-cn/categories/360003442694", target: "_blank" }, ["全币种合约"])
                        )
                    ]),
                    m('div', { class: `column bottom-navigation-tab-2` }, [
                        m('p', { class: `body-6`, href: "" }, ["平台条款"]),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover has-text-level-2`, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404594", target: "_blank" }, ["服务协议"])
                        ),
                        m('a', { class: `has-text-white  has-text-primary-hover has-text-level-2`, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404554", target: "_blank" }, ["法律声明"]),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white has-text-primary-hover has-text-level-2`, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404594", target: "_blank" }, ["隐私条款"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white has-text-primary-hover has-text-level-2`, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360048389153", target: "_blank" }, ["合约牌照"])
                        )
                    ]),
                    m('div', { class: `column bottom-navigation-tab-2 ` }, [
                        m('p', { class: `body-6` }, ["服务支持"]),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover has-text-level-2`, href: `https://vbithelp.zendesk.com/hc/zh-cn/sections/360007960273`, target: "_blank" }, ["新手帮助"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white has-text-primary-hover has-text-level-2`, href: `https://vbithelp.zendesk.com/hc/zh-cn/categories/360003464933`, target: "_blank" }, ["常见问题"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white has-text-primary-hover has-text-level-2`, href: `https://vbithelp.zendesk.com/hc/zh-cn/categories/360003415534`, target: "_blank" }, ["公告中心"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white has-text-primary-hover has-text-level-2`, href: `https://vbithelp.zendesk.com/hc/zh-cn/sections/360007979093`, target: "_blank" }, ["相关费率"])
                        )
                    ]),
                    m('div', { class: `column bottom-navigation-tab-2` }, [
                        m('p', { class: `has-text-level-4 body-6` }, ["联系我们"]),
                        m('a', { class: `has-text-white has-text-primary-hover has-text-level-2` }, [
                            m('div', {
                                onclick: function () {
                                    window.location = `mailto: support@vbit.one`;
                                }
                            }, ['服务邮箱'])
                        ]),
                        m('p', { class: `has-text-white  has-text-primary-hover has-text-level-2` },
                            m(Tooltip, {
                                label: "加入社群",
                                content: [
                                    m('div', { class: `` }, [
                                        m('img', { class: '', src: require("@/assets/img/home/Communitywechat.png").default })
                                    ])
                                ]
                            })
                        ),
                        m('p', { class: `has-text-white  has-text-primary-hover has-text-level-2` }, m(Tooltip, {
                            label: "联系客服",
                            content: [
                                m('div', { class: `is-flex` }, [
                                    m('div', { class: `` }, [
                                        m('img', { class: '', src: require("@/assets/img/home/QQcustomer_service.png").default })
                                    ])
                                ])
                            ]
                        }))
                    ])
                ])
            ]),
            m('p', { class: `bottom-copyright is-hidden-mobile` }, ["© 2019-2020 Vbit 版权所有"])
        ]);
    }
};