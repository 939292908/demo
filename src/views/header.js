const m = require('mithril');
const titleLogo = require("@/assets/img/logo/title-logo.png").default;

const methods = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        methods.openNavbarDropdown = !methods.openNavbarDropdown;
    }
};

module.exports = {
    view: function () {
        return m('nav.navbar.is-fixed-top', { role: "navigation", "aria-label": "main navigation" }, [
            m('.navbar-brand', {}, [
                m('a.navbar-item', {
                    onclick: function () {
                        window.router.push('/');
                    }
                }, [
                    m('img', { src: titleLogo, width: "112", height: "28" })
                ]),
                m('a.navbar-burger.burger', { class: "" + (methods.openNavbarDropdown ? " is-active" : ""), role: "button", "aria-label": "menu", "aria-expanded": false, "data-target": "navbarBasicExample", onclick: methods.clickNavbarOpenBtn }, [
                    m('span', { "aria-hidden": true }),
                    m('span', { "aria-hidden": true }),
                    m('span', { "aria-hidden": true })
                ])
            ]),
            m('div#navbarBasicExample.navbar-menu', { class: "" + (methods.openNavbarDropdown ? " is-active" : "") }, [
                m('div.navbar-start', {}, [
                    m('a.navbar-item', {
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '法币交易'
                    ]),
                    //  m('a.navbar-item', {onclick:function(){
                    //      window.router.push('/')
                    //  }}, [
                    //      '合约交易'
                    //  ]),
                    //  m('a.navbar-item', {onclick:function(){
                    //      window.router.push('/')
                    //  }}, [
                    //      '币币交易'
                    //  ]),
                    //  m('a.navbar-item', {onclick:function(){
                    //      window.router.push('/')
                    //  }}, [
                    //      'ETG专区'
                    //  ]),
                    m('a.navbar-item', {
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '交易中心'
                    ]),
                    m('a.navbar-item', {
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '数据中心'
                    ]),
                    m('a.navbar-item', {
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '新手帮助'
                    ])
                    // 切换语言
                    //  m('a.navbar-item', {}, [
                    //      window.gI18n.$t('10002', {value: "BTC"})
                    //  ]),
                    //  m('a.navbar-item', {}, [
                    //      window.gI18n.$t('10001', {value: "BTC"})
                    //  ]),

                    //  白黑夜
                    //  m('a.navbar-item', {
                    //      onclick: function(){
                    //          window.themeDark = !window.themeDark
                    //      }
                    //  }, [
                    //      m('i.iconfont'+(window.themeDark?'.icon-baitian':'.icon-night'))
                    //  ]),
                ])
            ]),
            m('div.navbar-end', {}, [
                m('div.navbar-item' + (window.gWebApi.loginState ? '.is-hidden' : ''), {}, [
                    m('div.buttons', {}, [
                        m('div.button', {
                            onclick: function () {
                                window.router.push('/login');
                            }
                        }, [
                            "登录"
                        ]),
                        m('div.button.has-bg-primary', {
                            onclick: function () {
                                window.router.push('/register');
                            }
                        }, [
                            "注册"
                        ])
                    ])
                ]),
                m('div.navbar-item.cursor-pointer' + (!window.gWebApi.loginState ? '.is-hidden' : ''), {
                    class: `has-dropdown is-hoverable`
                }, [
                    m('div', { class: `navbar-item` }, ["资产"]),
                    m('div', { class: `navbar-dropdown` }, [
                        m('a', {
                            class: `navbar-item`,
                            onclick: function () {
                                window.router.push('/myWalletIndex');
                            }
                        }, ["我的钱包"]),
                        m('a', {
                            class: `navbar-item`,
                            onclick: function () {
                                window.router.push('/myWalletIndex');
                            }
                        }, ["合约账户"]),
                        m('a', {
                            class: `navbar-item`,
                            onclick: function () {
                                window.router.push('/myWalletIndex');
                            }
                        }, ["币币账号"]),
                        m('a', {
                            class: `navbar-item`,
                            onclick: function () {
                                window.router.push('/myWalletIndex');
                            }
                        }, ["法币账户"])
                    ])
                ]),
                m('a.navbar-item.cursor-pointer' + (!window.gWebApi.loginState ? '.is-hidden' : ''), {
                    class: `has-dropdown is-hoverable`,
                    onclick: function () {
                        window.router.push('/');
                    }
                }, [
                    m('a', { class: `navbar-item` }, ["订单"]),
                    m('div', { class: `navbar-dropdown` }, [
                        m('a', { class: `navbar-item` }, ["合约订单"]),
                        m('a', { class: `navbar-item` }, ["币币订单"]),
                        m('a', { class: `navbar-item` }, ["法币订单"]),
                        m('a', { class: `navbar-item` }, ["跟单订单"])
                    ])
                ]),
                // 我的
                m('a.navbar-item' + (!window.gWebApi.loginState ? '.is-hidden' : ''), {
                    class: `has-dropdown is-hoverable`,
                    onclick: function () {
                        // window.router.push('/userCenter');
                    }
                }, [
                    m('a', { class: 'navbar-item' }, [
                        m('div', {
                            onclick: function () {
                                window.router.push('/userCenter');
                            }
                        }, ['用户中心']),
                        m('div', { class: `navbar-dropdown` }, [
                            m('a', { class: `navbar-item` }, [
                                m('svg', { class: 'icon', "aria-hidden": true }, [
                                    m('use', { "xlink:href": '#icon-logo' })
                                ]),
                                m('a', { class: `navbar-item` }, ["12"])
                            ]),
                            m('a', { class: `navbar-item` }, [
                                m('span.icon', {}, [
                                    m('i.iconfont.icon-logo')
                                ]),
                                m('a', { class: `navbar-item` }, ["账户安全"])
                            ]),
                            m('a', { class: `navbar-item` }, [
                                m('span.icon', {}, [
                                    m('i.iconfont.icon-logo')
                                ]),
                                m('a', { class: `navbar-item` }, ["身份认证"])
                            ]),
                            m('a', { class: `navbar-item` }, [
                                m('span.icon', {}, [
                                    m('i.iconfont.icon-logo')
                                ]),
                                m('a', { class: `navbar-item` }, ["API管理"])
                            ]),
                            m('a', { class: `navbar-item` }, [
                                m('span.icon', {}, [
                                    m('i.iconfont.icon-logo')
                                ]),
                                m('a', { class: `navbar-item` }, ["邀请返佣"])
                            ]),
                            m('a', { class: `navbar-item` }, [
                                m('span.icon', {}, [
                                    m('i.iconfont.icon-logo')
                                ]),
                                m('a', { class: `navbar-item` }, ["退出登录"])
                            ])
                        ])
                    ])
                ]),
                // 下载
                m('div.navbar-item.cursor-pointer', { class: `` }, [
                    m('span.icon', {}, [
                        m('i.iconfont.icon-downLoad')
                    ])
                ]),
                // 切换线路
                m('div.navbar-item.cursor-pointer', { class: `` }, [
                    m('span.icon', {}, [
                        m('i.iconfont.icon-signal')
                    ])
                ]),
                // 语言
                m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                    m('div.navbar-link', {}, [
                        '简体中文/CNY'
                    ]),
                    m('div.navbar-dropdown', {}, [
                        m('a.navbar-item', {
                            class: "" + (window.gI18n.locale === 'zh' ? ' is-active' : ''),
                            onclick: function () {
                                window.gI18n.setLocale('zh', res => {
                                    window._console.log('header setLocale', res);
                                });
                            }
                        }, [
                            '简体中文'
                        ]),
                        m('a.navbar-item', {
                            class: "" + (window.gI18n.locale === 'en' ? ' is-active' : ''),
                            onclick: function () {
                                window.gI18n.setLocale('en', res => {
                                    window._console.log('header setLocale', res);
                                });
                            }
                        }, [
                            'English'
                        ]),
                        m('a.navbar-item', {
                            class: "" + (window.gI18n.locale === 'tw' ? ' is-active' : ''),
                            onclick: function () {
                                window.gI18n.setLocale('tw', res => {
                                    window._console.log('header setLocale', res);
                                });
                            }
                        }, [
                            '繁体中文'
                        ])
                    ])
                ])
            ])
        ]);
    }
};