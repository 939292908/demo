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
            m('div', { class: `pub-footer columns pt-7 pb-6` }, [
                // 左边
                m('div', { class: `footer-left column is-6` }, [
                    // logo
                    m('img', { class: '', src: "static/img/title-logo.png", style: "width: 112;height:28px;" }),
                    m('p', { class: `` }, ["全球区块链资产衍生品交易平台"]),
                    // 社区
                    m('div', { class: `is-flex mt-5 is-between`, style: "width: 200px" }, [
                        m('a', { class: ``, href: "index.html" }, [
                            m('a', { class: ``, href: "" }, [
                                m('img', { class: 'community ', src: require("@/assets/img/home/wechat.png").default })
                            ])
                        ]),
                        m('a', { class: ``, href: "" }, [
                            m('img', { class: 'community ', src: require("@/assets/img/home/qq.png").default })
                        ]),
                        m('a', { class: ``, href: "https://www.facebook.com/Vbit-107388547588403/" }, [
                            m('img', { class: 'community ', src: require("@/assets/img/home/fb.png").default })
                        ]),
                        m('a', { class: ``, href: "https://twitter.com/VbitOfficial" }, [
                            m('img', { class: 'community', src: require("@/assets/img/home/tw.png").default })
                        ]),
                        m('a', { class: ``, href: "https://t.me/VbitOfficial" }, [
                            m('img', { class: 'community', src: require("@/assets/img/home/telegraph.png").default })
                        ]),
                        m('a', { class: ``, href: "https://weibo.com/VbitOfficial" }, [
                            m('img', { class: 'community', src: require("@/assets/img/home/micro-blog.png").default })
                        ]),
                        m('a', { class: ``, href: "https://www.mytokencap.com/exchange/vbit" }, [
                            m('img', { class: 'community', src: require("@/assets/img/home/my-token.png").default })
                        ])
                    ])
                ]),
                // 右边
                m('div', { class: `footer-right column is-6 is-between ` }, [
                    // 导航栏
                    m('div', { class: `bottom-navigation-tab-1` }, [
                        m('div', { class: `body-6  has-text-primary-hover` }, ['平台服务']),
                        m('a', { class: `has-text-white  has-text-primary-hover`, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961613", target: "_blank" }, ["币币交易"]),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover`, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961593", target: "_blank" }, ["法币交易"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover`, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961633", target: "_blank" }, ["永续合约"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover`, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360008544873", target: "_blank" }, ["杠杆ETF"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover`, href: "https://vbithelp.zendesk.com/hc/zh-cn/categories/360003442694", target: "_blank" }, ["全币种合约"])
                        )
                    ]),
                    m('div', { class: `bottom-navigation-tab-2` }, [
                        m('p', { class: `body-6  has-text-primary-hover`, href: "" }, ["平台条款"]),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover`, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404594", target: "_blank" }, ["服务协议"])
                        ),
                        m('a', { class: `has-text-white  has-text-primary-hover`, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404554", target: "_blank" }, ["法律声明"]),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white has-text-primary-hover`, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404594", target: "_blank" }, ["隐私条款"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white has-text-primary-hover`, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360048389153", target: "_blank" }, ["合约牌照"])
                        )
                    ]),
                    m('div', { class: `bottom-navigation-tab-2 ` }, [
                        m('p', { class: `body-6 has-text-primary-hover` }, ["服务支持"]),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white  has-text-primary-hover`, href: `https://vbithelp.zendesk.com/hc/zh-cn/sections/360007960273`, target: "_blank" }, ["新手帮助"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white has-text-primary-hover`, href: `https://vbithelp.zendesk.com/hc/zh-cn/categories/360003464933`, target: "_blank" }, ["常见问题"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white has-text-primary-hover`, href: `https://vbithelp.zendesk.com/hc/zh-cn/categories/360003415534`, target: "_blank" }, ["公告中心"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `has-text-white has-text-primary-hover`, href: `https://vbithelp.zendesk.com/hc/zh-cn/sections/360007979093`, target: "_blank" }, ["相关费率"])
                        )
                    ]),
                    m('div', { class: `bottom-navigation-tab-2` }, [
                        m('p', { class: `has-text-level-4 body-6  has-text-primary-hover` }, ["联系我们"]),
                        m('p', { class: `has-text-white  has-text-primary-hover` }, m(Tooltip, {
                            label: "服务邮箱",
                            content: [
                                m('div', { class: `is-flex` }, [
                                    m('div', { class: `` }, ['support@vbit.one'])
                                ])
                            ]
                        })),

                        // ),
                        m('p', { class: `has-text-white  has-text-primary-hover` },
                            m(Tooltip, {
                                label: "加入社群",
                                content: [
                                    m('div', { class: `is-flex` }, [
                                        m('div', { class: `` }, [
                                            m('p', { class: `` }, 'wechat'),
                                            m('img', { class: '', src: require("@/assets/img/home/Communitywechat.png").default })
                                        ]),
                                        m('div', { class: `` }, [
                                            m('p', { class: `` }, 'QQ'),
                                            m('img', { class: '', src: require("@/assets/img/home/CommunityQQ.png").default })
                                        ])
                                    ])
                                ]
                            })
                        ),
                        m('p', { class: `has-text-white  has-text-primary-hover` }, m(Tooltip, {
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
        // return m('footer.footer', {}, [
        // m('div.content', {}, [
        // m('p.has-text-centered', {}, [
        //     m('strong', {}, [
        //         'Bulma'
        //     ]),
        //     ' by ',
        //     m('a', {href:""}, [
        //         'Jeremy Thomas'
        //     ]),
        //     '. The source code is licensed',
        //     m('a', {href:""}, [
        //         'MIT'
        //     ]),
        //     '. The website content is licensed ',
        //     m('a', {href:""}, [
        //         'CC BY NC SA 4.0'
        //     ]),
        //     '.'
        // ])
        // ])
        // ])
    }
};