const m = require('mithril');
const titleLogo = require("@/assets/img/logo/title-logo.png").default;
const I18n = require("../../../../languages/I18n").default;
const Tooltip = require('@/views/components/common/Tooltip');
const utils = require('@/util/utils').default;
const apiLines = require('@/models/network/lines.js');
const globalModels = require('@/models/globalModels');
require('@/styles/pages/header');

const methods = {
    openNavbarDropdown: false,

    clickNavbarOpenBtn: () => {
        methods.openNavbarDropdown = !methods.openNavbarDropdown;
    }
};

module.exports = {
    oncreate: function() {
        // 初始化线路数据
        apiLines.initLines();
    },
    view: function () {
        return m('nav.navbar.is-fixed-top.theme--light', {
            role: "navigation",
            "aria-label": "main navigation",
            class: "has-bg-sub-level-1"
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
            // 未登录样式  pc
            m('div#navbarBasicExample.navbar-menu', { class: 'is-hidden-mobile' + (methods.openNavbarDropdown ? " is-active" : "") }, [
                m('div.navbar-start', {}, [
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '法币交易'
                    ]),

                    // 合约交易
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ` }, [
                        m(Tooltip, {
                            label: "合约交易",
                            width: "250px",
                            content: m('div', { class: `` }, [
                                m('div', {
                                    class: `navbar-item has-text-primary-hover body-6 `,
                                    onclick: function () {
                                        window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('div', { class: `header-navbar-item-icon has-line-level-3 mr-2` }), // 正方形icon
                                    m('div', { class: `` }, [
                                        m('p', { class: `title-small` }, "USDT永续合约"),
                                        m('p', { class: `body-4 has-text-level-3` }, [" 最高百倍杠杆，交易简单"])
                                    ])
                                ]),
                                m('div', {
                                    class: `navbar-item has-text-primary-hover body-6 `,
                                    onclick: function () {
                                        window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('div', { class: `header-navbar-item-icon has-line-level-3 mr-2` }), // 正方形icon
                                    m('div', { class: `` }, [
                                        m('span', { class: `title-small` }, "全币种合约"),
                                        m('span', { class: `header-new-info has-bg-primary px-3 ml-2` }, ["NEW"]),
                                        m('p', { class: `body-4 has-text-level-3` }, [" 小币种开仓，统一价格标的"])
                                    ])
                                ]),
                                m('a', { class: `navbar-item` }, [m('div', { class: `navbar-dropdown navbar-item` }, [
                                    m('a', {
                                        class: `navbar-item has-text-primary-hover body-6 `,
                                        onclick: function () {
                                            window.router.push('/myWalletIndex');
                                        }
                                    }, [
                                        m('div', { class: `header-navbar-item-icon has-line-level-3 mr-2` }), // 正方形icon
                                        m('div', { class: `` }, [
                                            m('p', { class: `` }, [
                                                m('span', { class: `title-small` }, "全币种合约"),
                                                m('span', { class: `header-new-info has-bg-primary px-3 ml-2` }, ["NEW"])
                                            ]),
                                            m('p', { class: `body-4 has-text-level-3` }, [" 小币种开仓，统一价格标的"])
                                        ])
                                    ],
                                    m('span', { class: `has-text-primary-hover border-radius-small` }, [])
                                    )
                                ])
                                ])
                            ])
                        })
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '币币交易'
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        'ETF专区'
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.router.push('/accountSecurity');
                        }
                    }, [
                        '新手帮助'
                    ])
                ]),
                m('div.navbar-end', {}, [
                    m('div.navbar-item' + (utils.getItem('loginState') ? '.is-hidden' : ''), {}, [
                        m('div.buttons', {}, [
                            m('div.button', {
                                onclick: function () {
                                    window.router.push('/login');
                                }
                            }, [
                                I18n.$t('10136')
                            ]),
                            m('div.button.has-bg-primary.is-small', {
                                onclick: function () {
                                    window.router.push('/register');
                                }
                            }, [
                                "注册"
                            ])
                        ])
                    ]),
                    // 已登录样式
                    // 订单
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ` }, [
                        m(Tooltip, {
                            label: "订单",
                            content: m('div', { class: `` }, [
                                m('a', { class: `navbar-item` }, [
                                    m('a', { class: `navbar-item` }, ["合约订单"])
                                ]),
                                m('a', { class: `navbar-item` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["币币订单"])
                                ]),
                                m('a', { class: `navbar-item` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["法币订单"])
                                ]),
                                m('a', { class: `navbar-item` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["跟单订单"])
                                ])
                            ])
                        })
                    ]),
                    // 资产
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ` }, [
                        m(Tooltip, {
                            label: "资产",
                            content: m('div', { class: `` }, [
                                m('a', {
                                    class: `navbar-item`,
                                    onclick: function () {
                                        window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('a', { class: `navbar-item` }, ["我的钱包"])
                                ]),
                                m('a', {
                                    class: `navbar-item`,
                                    onclick: function () {
                                        window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["合约账户"])
                                ]),
                                m('a', {
                                    class: `navbar-item`,
                                    onclick: function () {
                                        window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["币币账号"])
                                ]),
                                m('a', {
                                    class: `navbar-item`,
                                    onclick: function () {
                                        window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["法币账户"])
                                ])
                            ])
                        })
                    ]),
                    // 我的
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ${utils.getItem('loginState') ? "" : "is-hidden"}` }, [
                        m(Tooltip, {
                            label: m('i.iconfont.icon-Personal'),
                            class: "header-my-tooltip",
                            content: m('div', { class: `` }, [
                                m('div', { class: ``, style: `background: url(${require("@/assets/img/home/background.png").default}) no-repeat center center / 100% 100%; width:"200px"` }, [
                                    m('a', { class: `navbar-item py-5 header-my-tooltip-top` }, ["12"])
                                ]),
                                m('a', { class: `` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["账户安全"])
                                ]),
                                m('a', { class: `` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["身份认证"])
                                ]),
                                m('a', { class: `` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["API管理"])
                                ]),
                                m('a', { class: `` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["邀请返佣"])
                                ]),
                                m('a', { class: `` }, [
                                    m('a', {
                                        class: `navbar-item has-text-primary-hover`,
                                        onclick: () => {
                                            utils.removeItem("ex-session");
                                            utils.setItem('loginState', false);
                                            globalModels.setAccount({});
                                        }
                                    }, ["退出登录"])
                                ])
                            ])
                        })
                    ]),
                    // 下载
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ` }, [
                        m(Tooltip, {
                            label: m('i.iconfont.icon-xiazai'),
                            width: '254px',
                            height: '104px',
                            content: m('div', { class: `is-flex` }, [
                                m('img', { class: 'mt-2 ml-2', src: require("@/assets/img/home/Rectangle_530.png").default }),
                                m('div', { class: `is-align-items-center` }, [
                                    m('div', { class: `` }, [
                                        m('p', { class: `ml-6 mt-2 title-small` }, "扫码下载APP"),
                                        m('p', { class: `ml-6  title-small` }, "iOS&Android")
                                    ])
                                ])
                            ])
                        })
                    ]),
                    // 线路切换
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ` }, [
                        m(Tooltip, {
                            label: m('i.iconfont.icon-signal'),
                            content: m('div', { class: `` }, [
                                m('div', { class: `is-align-items-center` }, [
                                    m('div', { class: `` }, [
                                        apiLines.netLines.map((item, i) => {
                                            return m('a', {
                                                class: `navbar-item columns has-text-primary-hover min-width-200 ${item.Id === apiLines.activeLine.Id ? 'is-active' : ''}`,
                                                onclick: function() {
                                                    apiLines.setLinesActive(item.Id);
                                                }
                                            }, [
                                                m('span.column', {}, [
                                                    item.Name
                                                ]),
                                                m('span.column', {}, [
                                                    '延迟 ' + apiLines.apiResponseSpeed[i] + 'ms'
                                                ])
                                            ]);
                                        })
                                    ])
                                ])
                            ])
                        })
                    ]),
                    // 语言
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover mr-7` }, [
                        m(Tooltip, {
                            label: "英",
                            width: '120px',
                            content: m('div', { class: `` }, [
                                m('div', { class: `is-align-items-center` }, [
                                    m('div', { class: `` }, [
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
                        })
                    ])
                ])
            ]),
            // 未登录样式  移动端
            m('div#navbarBasicExample.navbar-menu', { class: "is-hidden-widescreen" + (methods.openNavbarDropdown ? " is-active" : "") }, [
                m('div.navbar-start', {}, [
                    m('', {
                        class: "navbar-item has-text-primary-hover",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '法币交易'
                    ]),

                    // 合约交易
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ` }, [
                        m(Tooltip, {
                            label: "合约交易",
                            width: "250px",
                            content: m('div', { class: `` }, [
                                m('div', {
                                    class: `navbar-item has-text-primary-hover body-6 `,
                                    onclick: function () {
                                        // window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('div', { class: `header-navbar-item-icon has-line-level-3 mr-2` }), // 正方形icon
                                    m('div', { class: `` }, [
                                        m('p', { class: `title-small` }, "USDT永续合约"),
                                        m('p', { class: `body-4 has-text-level-3` }, [" 最高百倍杠杆，交易简单"])
                                    ])
                                ]),
                                m('div', {
                                    class: `navbar-item has-text-primary-hover body-6 `,
                                    onclick: function () {
                                        // window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('div', { class: `header-navbar-item-icon has-line-level-3 mr-2` }), // 正方形icon
                                    m('div', { class: `` }, [
                                        m('span', { class: `title-small` }, "全币种合约"),
                                        m('span', { class: `header-new-info has-bg-primary px-3 ml-2` }, ["NEW"]),
                                        m('p', { class: `body-4 has-text-level-3` }, [" 小币种开仓，统一价格标的"])
                                    ])
                                ]),
                                m('a', { class: `navbar-item` }, [m('div', { class: `navbar-dropdown navbar-item` }, [
                                    m('a', {
                                        class: `navbar-item has-text-primary-hover body-6 `,
                                        onclick: function () {
                                            // window.router.push('/myWalletIndex');
                                        }
                                    }, [
                                        m('div', { class: `header-navbar-item-icon has-line-level-3 mr-2` }), // 正方形icon
                                        m('div', { class: `` }, [
                                            m('p', { class: `` }, [
                                                m('span', { class: `title-small` }, "全币种合约"),
                                                m('span', { class: `header-new-info has-bg-primary px-3 ml-2` }, ["NEW"])
                                            ]),
                                            m('p', { class: `body-4 has-text-level-3` }, [" 小币种开仓，统一价格标的"])
                                        ])
                                    ],
                                    m('span', { class: `has-text-primary-hover border-radius-small` }, [])
                                    )
                                ])
                                ])
                            ])
                        })
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '币币交易'
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        'ETF专区'
                    ]),
                    m('', {
                        class: "navbar-item has-text-primary-hover",
                        onclick: function () {
                            window.router.push('/');
                        }
                    }, [
                        '新手帮助'
                    ])
                ]),
                m('div.navbar-end', {}, [
                    m('div.navbar-item' + (utils.getItem('loginState') ? '.is-hidden' : ''), {}, [
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
                    // 订单
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ` }, [
                        m(Tooltip, {
                            label: "订单",
                            content: m('div', { class: `` }, [
                                m('a', { class: `navbar-item` }, [
                                    m('a', { class: `navbar-item` }, ["合约订单"])
                                ]),
                                m('a', { class: `navbar-item` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["币币订单"])
                                ]),
                                m('a', { class: `navbar-item` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["法币订单"])
                                ]),
                                m('a', { class: `navbar-item` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["跟单订单"])
                                ])
                            ])
                        })
                    ]),
                    // 资产
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ` }, [
                        m(Tooltip, {
                            label: "资产",
                            content: m('div', { class: `` }, [
                                m('a', {
                                    class: `navbar-item`,
                                    onclick: function () {
                                        window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('a', { class: `navbar-item` }, ["我的钱包"])
                                ]),
                                m('a', {
                                    class: `navbar-item`,
                                    onclick: function () {
                                        window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["合约账户"])
                                ]),
                                m('a', {
                                    class: `navbar-item`,
                                    onclick: function () {
                                        window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["币币账号"])
                                ]),
                                m('a', {
                                    class: `navbar-item`,
                                    onclick: function () {
                                        window.router.push('/myWalletIndex');
                                    }
                                }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["法币账户"])
                                ])
                            ])
                        })
                    ]),
                    // 我的
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ${utils.getItem('loginState') ? "" : "is-hidden"}` }, [
                        m(Tooltip, {
                            label: m('i.iconfont.icon-Personal'),
                            class: "header-my-tooltip",
                            content: m('div', { class: `` }, [
                                m('div', { class: ``, style: `background: url(${require("@/assets/img/home/background.png").default}) no-repeat center center / 100% 100%; width:"200px"` }, [
                                    m('a', { class: `navbar-item py-5 header-my-tooltip-top` }, ["12"])
                                ]),
                                m('a', { class: `` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["账户安全"])
                                ]),
                                m('a', { class: `` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["身份认证"])
                                ]),
                                m('a', { class: `` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["API管理"])
                                ]),
                                m('a', { class: `` }, [
                                    m('a', { class: `navbar-item has-text-primary-hover` }, ["邀请返佣"])
                                ]),
                                m('a', { class: `` }, [
                                    m('a', {
                                        class: `navbar-item has-text-primary-hover`,
                                        onclick: () => {
                                            utils.removeItem("ex-session");
                                            utils.setItem('loginState', false);
                                            globalModels.setAccount({});
                                        }
                                    }, ["退出登录"])
                                ])
                            ])
                        })
                    ]),
                    // 下载
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover ` }, [
                        m(Tooltip, {
                            label: m('i.iconfont.icon-xiazai'),
                            width: '254px',
                            height: '104px',
                            content: m('div', { class: `is-flex` }, [
                                m('img', { class: 'mt-2 ml-2', src: require("@/assets/img/home/Rectangle_530.png").default }),
                                m('div', { class: `is-align-items-center` }, [
                                    m('div', { class: `` }, [
                                        m('p', { class: `ml-6 mt-2 title-small` }, "扫码下载APP"),
                                        m('p', { class: `ml-6  title-small` }, "iOS&Android")
                                    ])
                                ])
                            ])
                        })
                    ]),
                    // 语言
                    m('div.navbar-item.cursor-pointer', { class: `has-text-primary-hover mr-7` }, [
                        m(Tooltip, {
                            label: "英",
                            width: '120px',
                            content: m('div', { class: `` }, [
                                m('div', { class: `is-align-items-center` }, [
                                    m('div', { class: `` }, [
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
                        })
                    ])
                ])
            ])
        ]);
    }
};