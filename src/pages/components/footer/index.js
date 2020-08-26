const m = require('mithril');
const Tooltip = require('@/views/components/common/Tooltip');

const methods = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        methods.openNavbarDropdown = !methods.openNavbarDropdown;
    }
};

module.exports = {
    view: function () {
        return m('div.views-pages-home-footer.container', {}, [
            // 底部
            m('div', { class: `pub-footer columns pt-7 pb-6 mt-7` }, [
                // 左边
                m('div', { class: `footer-left column is-6` }, [
                    // logo
                    m('img', { class: '', src: "static/img/title-logo.png", style: "width: 112;height:28px;" }),
                    m('p', { class: `has-text-level-2` }, ["全球区块链资产衍生品交易平台"]),
                    // 社区
                    m('div', { class: `is-flex mt-7 is-between`, style: "width: 300px" }, [
                        m('a', { class: ``, href: "index.html" }, [
                            m(Tooltip, {
                                label: m('i.iconfont.icon-WeChat'),
                                class: 'has-text-level-2 has-text-primary-hover',
                                content: m('img', { class: '', src: require("@/assets/img/home/Communitywechat.png").default })
                            })
                        ]),
                        m(Tooltip, {
                            label: m('i.iconfont.icon-qq'),
                            class: 'has-text-level-2 has-text-primary-hover',
                            content: m('img', { class: '', src: require("@/assets/img/home/QQcustomer_service.png").default })
                        }),
                        m('a', { class: ``, href: "https://www.facebook.com/Vbit-107388547588403/" }, [
                            m('i', { class: "community iconfont icon-Facebook has-text-level-2 has-text-primary-hover" })
                        ]),
                        m('a', { class: ``, href: "https://twitter.com/VbitOfficial" }, [
                            m('i', { class: "community iconfont icon-Twitter has-text-level-2 has-text-primary-hover" })
                        ]),
                        m('a', { class: ``, href: "https://t.me/VbitOfficial" }, [
                            m('i', { class: "community iconfont icon-Aircraft has-text-level-2 has-text-primary-hover" })
                        ]),
                        m('a', { class: ``, href: "https://weibo.com/VbitOfficial" }, [
                            m('i', { class: "community iconfont icon-Weibo has-text-level-2 has-text-primary-hover" })
                        ]),
                        m('a', { class: ``, href: "https://www.mytokencap.com/exchange/vbit" }, [
                            m('i', { class: "community iconfont icon-Mmm has-text-level-2 has-text-primary-hover" })
                        ])
                    ])
                ]),
                // 右边
                m('div', { class: `footer-right column is-6 is-between ` }, [
                    // 导航栏
                    m('div', { class: `bottom-navigation-tab-1` }, [
                        m('div', { class: `` }, ['平台服务']),
                        m('p', { class: `mt-2` },
                            m('a', { class: `has-text-white  has-text-primary-hover has-text-level-2`, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961613", target: "_blank" }, ["币币交易"])
                        ),
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
                    m('div', { class: `bottom-navigation-tab-2` }, [
                        m('p', { class: ``, href: "" }, ["平台条款"]),
                        m('p', { class: `mt-2` },
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
                    m('div', { class: `bottom-navigation-tab-2 ` }, [
                        m('p', { class: `` }, ["服务支持"]),
                        m('p', { class: `mt-2` },
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
                    m('div', { class: `bottom-navigation-tab-2` }, [
                        m('p', { class: `has-text-level-4` }, ["联系我们"]),
                        m('p', { class: `mt-2` },
                            m('a', { class: `has-text-white has-text-primary-hover has-text-level-2` }, [
                                m('div', {
                                    onclick: function () {
                                        window.location = `mailto: support@vbit.one`;
                                    }
                                }, ['服务邮箱'])
                            ])
                        ),
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
            m('p', { class: `bottom-copyright` }, ["© 2019-2020 Vbit 版权所有"])
        ]);
    }
};