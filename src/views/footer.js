const m = require('mithril');

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
                            m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                        ]),
                        m('div', { class: `` }, [
                            m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                        ]),
                        m('a', { class: ``, href: "https://www.facebook.com/Vbit-107388547588403/" }, [
                            m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                        ]),
                        m('a', { class: ``, href: "https://twitter.com/VbitOfficial" }, [
                            m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                        ]),
                        m('a', { class: ``, href: "https://t.me/VbitOfficial" }, [
                            m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                        ]),
                        m('a', { class: ``, href: "https://weibo.com/VbitOfficial" }, [
                            m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                        ]),
                        m('a', { class: ``, href: "https://www.mytokencap.com/exchange/vbit" }, [
                            m('img', { class: 'community', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 20px;height:20px;" })
                        ])
                    ])
                ]),
                // 右边
                m('div', { class: `footer-right column is-6 is-between` }, [
                    // 导航栏
                    m('div', { class: `bottom-navigation-tab-1` }, [
                        m('p', { class: `body-6` }, ['平台服务']),
                        m('p', { class: `` },
                            m('a', { class: ``, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961613" }, ["币币交易"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: ``, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961593" }, ["法币交易"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: ``, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360007961633" }, ["永续合约"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: ``, href: "https://vbithelp.zendesk.com/hc/zh-cn/sections/360008544873" }, ["杠杆ETF"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: ``, href: "https://vbithelp.zendesk.com/hc/zh-cn/categories/360003442694" }, ["全币种合约"])
                        )
                    ]),
                    m('div', { class: `bottom-navigation-tab-2` }, [
                        m('p', { class: `body-6`, href: "" }, ["平台条款"]),
                        m('p', { class: `` },
                            m('a', { class: ``, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404594" }, ["服务协议"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: ``, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404554" }, ["法律声明"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: ``, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360045404594" }, ["隐私条款"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: ``, href: "https://vbithelp.zendesk.com/hc/zh-cn/articles/360048389153" }, ["合约牌照"])
                        )
                    ]),
                    m('div', { class: `bottom-navigation-tab-2` }, [
                        m('p', { class: `body-6` }, ["服务支持"]),
                        m('p', { class: `` },
                            m('a', { class: `https://vbithelp.zendesk.com/hc/zh-cn/sections/360007960273` }, ["新手帮助"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `https://vbithelp.zendesk.com/hc/zh-cn/categories/360003464933` }, ["常见问题"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `https://vbithelp.zendesk.com/hc/zh-cn/categories/360003415534` }, ["公告中心"])
                        ),
                        m('p', { class: `` },
                            m('a', { class: `https://vbithelp.zendesk.com/hc/zh-cn/sections/360007979093` }, ["相关费率"])
                        )
                    ]),
                    m('div', { class: `bottom-navigation-tab-2` }, [
                        m('p', { class: `body-6` }, ["联系我们"]),
                        m('p', { class: `` }, ["服务邮箱"]),
                        m('p', { class: `` }, ["加入社群"]),
                        m('p', { class: `` }, ["联系客服"])
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