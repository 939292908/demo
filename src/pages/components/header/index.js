const m = require('mithril');
const titleLogo = require("@/assets/img/logo/title-logo.png").default;
const I18n = require("../../../languages/I18n").default;
const Tooltip = require('@/views/components/common/Tooltip');
const userInfo = require('@/models/login/userInfo');
const utils = require('@/util/utils').default;

const methods = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        methods.openNavbarDropdown = !methods.openNavbarDropdown;
    }
};

module.exports = {
    view: function () {
        return m('nav.navbar.is-fixed-top', {
            role: "navigation",
            "aria-label": "main navigation"
        }, [
            m('.navbar-brand', {}, [
                m('a.navbar-item', {
                    onclick: function () {
                        window.router.push('/');
                    }
                }, [
                    m('img', {
                        src: titleLogo,
                        width: "112",
                        height: "28"
                    })
                ]),
                m('a.navbar-burger.burger', {
                    class: "" + (methods.openNavbarDropdown ? " is-active" : ""),
                    role: "button",
                    "aria-label": "menu",
                    "aria-expanded": false,
                    "data-target": "navbarBasicExample",
                    onclick: methods.clickNavbarOpenBtn
                }, [
                    m('span', { "aria-hidden": true }),
                    m('span', { "aria-hidden": true }),
                    m('span', { "aria-hidden": true })
                ])
            ]),
            // 未登录样式
            m('div#navbarBasicExample.navbar-menu', { class: "" + (methods.openNavbarDropdown ? " is-active" : "") }, [
                m('div.navbar-start', {}, [
                    m('a.navbar-item', {
                        class: "has-text-primary-hover",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '法币交易'
                    ]),
                    m('div.navbar-item.cursor-pointer' + (!userInfo.getLoginState() ? '.is-hidden' : ''), {
                        class: `has-dropdown is-hoverable`
                    }, [
                        m('div', { class: `navbar-item has-text-primary-hover ` }, ["合约交易"]),
                        m('div', { class: `navbar-dropdown` }, [
                            m('div', {
                                class: `navbar-item has-text-primary-hover body-6 `,
                                onclick: function () {
                                    window.router.push('/myWalletIndex');
                                }
                            }, [
                                m('div', { class: `` }, [
                                    m('p', { class: `` }, "USDT永续合约"),
                                    m('p', { class: `body-4` }, [" 最高百倍杠杆，交易简单"])
                                ])
                            ]),
                            m('a', {
                                class: `navbar-item has-text-primary-hover body-6 `,
                                onclick: function () {
                                    window.router.push('/myWalletIndex');
                                }
                            }, [
                                m('div', { class: `` }, [
                                    m('p', { class: `` }, [
                                        m('span', { class: `` }, "全币种合约"),
                                        m('span', { class: `px-3 ml-2`, style: `background: orange; border-radius: 10px 10px 10px 0; color:#fff` }, "NEW")
                                    ]),
                                    m('p', { class: `body-4` }, [" 小币种开仓，统一价格标的"])
                                ])
                            ],
                            m('span', { class: `has-text-primary-hover border-radius-small` }, [])
                            )
                        ])
                    ]),

                    m('a.navbar-item', {
                        class: "has-text-primary-hover",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '币币交易'
                    ]),
                    m('a.navbar-item', {
                        class: "has-text-primary-hover",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        'ETF专区'
                    ]),
                    m('a.navbar-item', {
                        class: "has-text-primary-hover",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '新手帮助'
                    ])
                ])
            ]),
            m('div.navbar-end', {}, [
                m('div.navbar-item' + (userInfo.getLoginState() ? '.is-hidden' : ''), {}, [
                    m('div.buttons', {}, [
                        m('div.button', {
                            onclick: function () {
                                window.router.push('/login');
                            }
                        }, [
                            I18n.$t('10136')
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
                // 已登录样式
                m('div.navbar-item.cursor-pointer' + (!userInfo.getLoginState() ? '.is-hidden' : ''), {
                    class: `has-dropdown is-hoverable`
                }, [
                    m('div', { class: `navbar-item has-text-primary-hover` }, ["资产"]),
                    m('div', { class: `navbar-dropdown` }, [
                        m('a', {
                            class: `navbar-item has-text-primary-hover`,
                            onclick: function () {
                                window.router.push('/myWalletIndex');
                            }
                        }, ["我的钱包"]),
                        m('a', {
                            class: `navbar-item has-text-primary-hover`,
                            onclick: function () {
                                window.router.push('/myWalletIndex');
                            }
                        }, ["合约账户"]),
                        m('a', {
                            class: `navbar-item has-text-primary-hover`,
                            onclick: function () {
                                window.router.push('/myWalletIndex');
                            }
                        }, ["币币账号"]),
                        m('a', {
                            class: `navbar-item has-text-primary-hover`,
                            onclick: function () {
                                window.router.push('/myWalletIndex');
                            }
                        }, ["法币账户"])
                    ])
                ]),
                m('a.navbar-item.cursor-pointer' + (!userInfo.getLoginState() ? '.is-hidden' : ''), {
                    class: `has-dropdown is-hoverable`,
                    onclick: function () {
                        window.router.push('/');
                    }
                }, [
                    m('a', { class: `navbar-item has-text-primary-hover` }, ["订单"]),
                    m('div', { class: `navbar-dropdown` }, [
                        m('a', { class: `navbar-item has-text-primary-hover` }, ["合约订单"]),
                        m('a', { class: `navbar-item has-text-primary-hover` }, ["币币订单"]),
                        m('a', { class: `navbar-item has-text-primary-hover` }, ["法币订单"]),
                        m('a', { class: `navbar-item has-text-primary-hover` }, ["跟单订单"])
                    ])
                ]),
                // 我的
                m('a.navbar-item' + (!userInfo.getLoginState() ? '.is-hidden' : ''), {
                    class: `has-dropdown is-hoverable`,
                    onclick: function () {
                        // window.router.push('/userCenter');
                    }
                }, [
                    m('a', { class: 'navbar-item has-text-primary-hover' }, [
                        m('div', {
                            // onclick: function () {
                            //     window.router.push('/userCenter');
                            // }
                        }, ['用户中心']),
                        m('div', { class: `navbar-dropdown` }, [
                            m('a', { class: `navbar-item` }, [
                                m('svg', {
                                    class: 'icon',
                                    "aria-hidden": true
                                }, [
                                    m('use', { "xlink:href": '#icon-logo' })
                                ]),
                                m('a', { class: `navbar-item` }, ["12"])
                            ]),
                            m('a', { class: `navbar-item` }, [
                                m('span.icon', {}, [
                                    m('i.iconfont.icon-logo')
                                ]),
                                m('a', { class: `navbar-item has-text-primary-hover` }, ["账户安全"])
                            ]),
                            m('a', { class: `navbar-item` }, [
                                m('span.icon', {}, [
                                    m('i.iconfont.icon-logo')
                                ]),
                                m('a', { class: `navbar-item has-text-primary-hover` }, ["身份认证"])
                            ]),
                            m('a', { class: `navbar-item` }, [
                                m('span.icon', {}, [
                                    m('i.iconfont.icon-logo')
                                ]),
                                m('a', { class: `navbar-item has-text-primary-hover` }, ["API管理"])
                            ]),
                            m('a', { class: `navbar-item` }, [
                                m('span.icon', {}, [
                                    m('i.iconfont.icon-logo')
                                ]),
                                m('a', { class: `navbar-item has-text-primary-hover` }, ["邀请返佣"])
                            ]),
                            m('a', { class: `navbar-item` }, [
                                m('span.icon', {}, [
                                    m('i.iconfont.icon-logo')
                                ]),
                                m('a', {
                                    class: `navbar-item has-text-primary-hover`,
                                    onclick: () => {
                                        utils.removeItem("ex-session");
                                        userInfo.setLoginState(false);
                                    }
                                }, ["退出登录"])
                            ])
                        ])
                    ])
                ]),

                // 下载
                m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover` }, [
                    m(Tooltip, {
                        label: m('i.iconfont.icon-downLoad'),
                        content: m('img', { class: '', src: require("@/assets/img/home/download.png").default })
                    })
                ]),
                // 切换线路
                m('a.navbar-item.cursor-pointer' + (!userInfo.getLoginState() ? '.is-hidden' : ''), {
                    class: `has-dropdown is-hoverable has-text-primary-hover`,
                    onclick: function () {
                        window.router.push('/');
                    }
                }, [
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover` }, [
                        m('span.icon', {}, [
                            m('i.iconfont.icon-signal')
                        ])
                    ]),
                    m('div', { class: `navbar-dropdown` }, [
                        m('p', { class: `navbar-item has-text-primary-hover` }, ["线路切换(10)"]),
                        m('a', { class: `navbar-item has-text-primary-hover` }, ["币币订单"]),
                        m('a', { class: `navbar-item has-text-primary-hover` }, ["法币订单"]),
                        m('a', { class: `navbar-item has-text-primary-hover` }, ["跟单订单"])
                    ])
                ]),
                // 语言
                m('div.navbar-item.has-dropdown.is-hoverable  has-text-primary-hover', {}, [
                    m('div.navbar-link', {}, [
                        '简体中文/CNY'
                    ]),
                    m('div.navbar-dropdown', {}, [
                        m('a.navbar-item has-text-primary-hover', {
                            class: "" + (I18n.getLocale() === 'zh' ? ' is-active' : ''),
                            onclick: function () {
                                I18n.setLocale('zh', res => {
                                    // window._console.log('header setLocale', res);
                                });
                            }
                        }, [
                            '简体中文'
                        ]),
                        m('a.navbar-item  has-text-primary-hover', {
                            class: "" + (I18n.getLocale() === 'en' ? ' is-active' : ''),
                            onclick: function () {
                                I18n.setLocale('en', res => {
                                    // window._console.log('header setLocale', res);
                                });
                            }
                        }, [
                            'English'
                        ]),
                        m('a.navbar-item  has-text-primary-hover', {
                            class: "" + (I18n.getLocale() === 'tw' ? ' is-active' : ''),
                            onclick: function () {
                                I18n.setLocale('tw', res => {
                                    // window._console.log('header setLocale', res);
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