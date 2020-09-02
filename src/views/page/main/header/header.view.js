const m = require('mithril');
const titleLogo = require("@/assets/img/logo/title-logo.png").default;
const I18n = require("../../../../languages/I18n").default;
const Tooltip = require('@/views/components/common/Tooltip');
const utils = require('@/util/utils').default;
const apiLines = require('@/models/network/lines.js');
const header = require('./header.logic.js');
const globalModels = require('@/models/globalModels');

const modal = require('@/views/components/common/Modal.js');
const deviceInfoView = require('./deviceInfo/deviceInfo.view.js');
const deviceInfo = require('./deviceInfo/deviceInfo.logic.js');
require('@/styles/pages/header');

module.exports = {
    oncreate: function() {
        // 初始化线路数据
        apiLines.initLines();
    },
    view: function () {
        return m('nav.navbar.is-fixed-top.theme--light.body-5', {
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
                    class: "" + (header.openNavbarDropdown ? " is-active" : ""),
                    role: "button",
                    "aria-label": "menu",
                    "aria-expanded": false,
                    "data-target": "navbarBasicExample",
                    onclick: header.clickNavbarOpenBtn
                }, [
                    m('span', { "aria-hidden": true }),
                    m('span', { "aria-hidden": true }),
                    m('span', { "aria-hidden": true })
                ])
            ]),
            // 未登录样式  pc
            m('div#navbarBasicExample.navbar-menu', { class: '' + (header.openNavbarDropdown ? " is-active" : "") }, [
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
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('a.navbar-item.ma-0.has-text-primary-hover', {}, [
                            "合约交易"
                        ]),
                        m('div.navbar-dropdown.has-bg-level-2.border-radius-medium.pa-0', {}, [
                            m('a', { class: `navbar-item media is-align-items-center pa-5 ma-0` }, [
                                m('div.media-left.pa-3', {}, [
                                    m('div', { class: `header-navbar-item-icon has-line-level-3 mr-2` })
                                ]),
                                m('div', { class: `media-content` }, [
                                    m('div', { class: `content` }, [
                                        m('p', { class: `title-small` }, "USDT永续合约"),
                                        m('p', { class: `body-4 has-text-level-3` }, [" 最高百倍杠杆，交易简单"])
                                    ])
                                ])
                            ]),
                            m('a', { class: `navbar-item media is-align-items-center pa-5 ma-0` }, [
                                m('div.media-left.pa-3', {}, [
                                    m('div', { class: `header-navbar-item-icon has-line-level-3 mr-2` })
                                ]),
                                m('div', { class: `media-content` }, [
                                    m('div', { class: `content` }, [
                                        m('span', { class: `title-small` }, "全币种合约"),
                                        m('span', { class: `header-new-info has-bg-primary px-3 ml-2` }, ["NEW"]),
                                        m('p', { class: `body-4 has-text-level-3` }, [" 小币种开仓，统一价格标的"])
                                    ])
                                ])
                            ])
                        ])
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
                m('div.navbar-end.mr-3', {}, [
                    m('div.navbar-item' + (utils.getItem('loginState') ? '.is-hidden' : ''), {}, [
                        m('div.buttons', {}, [
                            m('button.button.button-small.is-outlined.is-primary.px-6', {
                                onclick: function () {
                                    window.router.push('/login');
                                }
                            }, [
                                // 登录
                                I18n.$t('10006')
                            ]),
                            m('button.button.is-primary.button-small.px-6', {
                                onclick: function () {
                                    window.router.push('/register');
                                }
                            }, [
                                // "注册"
                                I18n.$t('10007')
                            ])
                        ])
                    ]),
                    // 已登录样式
                    // 订单
                    m('div.navbar-item.cursor-pointer.is-hidden' + (utils.getItem('loginState') ? '' : '.is-hidden'), { class: `has-text-primary-hover ` }, [
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
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('a.navbar-item.ma-0.has-text-primary-hover', {}, [
                            "资产"
                        ]),
                        m('div.navbar-dropdown.is-right.has-bg-level-2.border-radius-medium', {}, [
                            m('a', {
                                class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                onclick: function () {
                                    window.router.push({
                                        path: '/myWalletIndex',
                                        params: {
                                            id: '03'
                                        }
                                    });
                                }
                            }, [
                                '我的钱包'
                            ]),
                            m('a', {
                                class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                onclick: function () {
                                    window.router.push({
                                        path: '/myWalletIndex',
                                        params: {
                                            id: '01'
                                        }
                                    });
                                }
                            }, [
                                '合约账户'
                            ]),
                            m('a', {
                                class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                onclick: function () {
                                    window.router.push({
                                        path: '/myWalletIndex',
                                        params: {
                                            id: '02'
                                        }
                                    });
                                }
                            }, [
                                '币币账号'
                            ]),
                            m('a', {
                                class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                onclick: function () {
                                    window.router.push({
                                        path: '/myWalletIndex',
                                        params: {
                                            id: '04'
                                        }
                                    });
                                }
                            }, [
                                '法币账户'
                            ])
                        ])
                    ]),
                    // 我的
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('a.navbar-item.ma-0.has-text-primary-hover', {}, [
                            m('i.iconfont.icon-Personal')
                        ]),
                        m('div.navbar-dropdown.is-right.has-bg-level-2.border-radius-medium.pt-0', {}, [
                            m('div', { class: ` pa-6`, style: `background: url(${require("@/assets/img/home/background.png").default}) no-repeat center center / 100% 100%; width:"200px"` }, [
                                m('div', { class: `header-my-tooltip-top has-text-level-1` }, [
                                    m('p', { class: `` }, [
                                        m('p', { class: `title-small` }, [
                                            utils.hideMobileInfo(globalModels.getAccount().accountName || '--')
                                        ]),
                                        m('p', { class: `body-4 has-text-level-2` }, [
                                            'UID:' + globalModels.getAccount().uid
                                        ])
                                    ])
                                ])
                            ]),
                            m('a', {
                                class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`
                            }, [
                                '账户安全'
                            ]),
                            m('a', {
                                class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`
                            }, [
                                '身份认证'
                            ]),
                            m('a', {
                                class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`
                            }, [
                                'API管理'
                            ]),
                            m('a', {
                                class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`
                            }, [
                                '邀请返佣'
                            ]),
                            m('a', {
                                class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                onclick: () => {
                                    header.loginOut();
                                }
                            }, [
                                '退出登录'
                            ])
                        ])
                    ]),
                    // 下载
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('a.navbar-item.ma-0.has-text-primary-hover', {}, [
                            m('i.iconfont.icon-xiazai')
                        ]),
                        m('div.navbar-dropdown.is-right.has-bg-level-2.border-radius-medium.box.min-width-250.pa-5', {}, [
                            m('article', { class: `media is-align-items-center` }, [
                                m('div.media-left', {}, [
                                    m('figure.image.is-64x64', {}, [
                                        m('img', { class: '', src: require("@/assets/img/home/Rectangle_530.png").default })
                                    ])
                                ]),
                                m('div', { class: `media-content` }, [
                                    m('div', { class: `content` }, [
                                        m('p', { class: `title-small` }, "扫码下载APP"),
                                        m('p', { class: `title-small` }, "iOS&Android")
                                    ])
                                ])
                            ])
                        ])
                    ]),
                    // 线路切换
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('a.navbar-item.ma-0.has-text-primary-hover', {}, [
                            m('i.iconfont.icon-signal')
                        ]),
                        m('div.navbar-dropdown.is-right.has-bg-level-2.border-radius-medium', {}, [
                            m('div', {
                                class: "navbar-item px-6 ma-0 pa-0 title-small is-flex"
                            }, [
                                `线路切换(${apiLines.netLines.length})`,
                                m('div.spacer'),
                                m('button.button.is-light.pa-0', {
                                    onclick: function() {
                                        deviceInfo.openModal();
                                    }
                                }, [
                                    m('i.iconfont.icon-fi_file-text.iconfont-x-large-1')
                                ])
                            ]),
                            m('hr.navbar-divider'),
                            apiLines.netLines.map((item, i) => {
                                return m('a', {
                                    class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5 ${item.Id === apiLines.activeLine.Id ? 'is-active' : ''}`,
                                    onclick: function() {
                                        apiLines.setLinesActive(item.Id);
                                    }
                                }, [
                                    m('span.column.pr-8', {}, [
                                        item.Name
                                    ]),
                                    m('span.column.has-text-left', {}, [
                                        '延迟 ' + apiLines.apiResponseSpeed[i] + 'ms'
                                    ])
                                ]);
                            })
                        ])
                    ]),
                    // 语言
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('a.navbar-item.ma-0.has-text-primary-hover', {}, [
                            I18n.langList[I18n.getLocale()].language
                        ]),
                        m('div.navbar-dropdown.is-right.has-bg-level-2.border-radius-medium', {}, [
                            Object.keys(I18n.langList).map((item, i) => {
                                if (I18n.langList[item].open) {
                                    return m('a', {
                                        class: `navbar-item has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5 ${item === I18n.getLocale() ? 'is-active' : ''}`,
                                        onclick: function() {
                                            I18n.setLocale(item, res => {
                                                // window._console.log('header setLocale', res);
                                            });
                                        }
                                    }, [
                                        I18n.langList[item].language
                                    ]);
                                }
                            })
                        ])
                    ])
                ])
            ]),
            // 设备信息
            m(modal, {
                isShow: deviceInfo.modalOpen, // 显示隐藏
                onOk () {
                    deviceInfo.closeModal();
                }, // 确认事件 // 使用默认确认按钮
                onClose () {
                    deviceInfo.closeModal();
                }, // 关闭事件
                slot: { // 插槽
                    header: m('div.w100', {}, [
                        m('div', {}, [
                            'Web网络监测'
                        ]),
                        m('article.body-4.has-text-level-3.message.is-warning.mt-4.mr-4', {}, [
                            m('div.message-body.border-1', {}, [
                                '此页面仅用于定位您的浏览器和网络信息，不涉及您的隐私信息， 请放心使用。'
                            ])
                        ])
                    ]),
                    body: m(deviceInfoView)
                },
                width: '550px'
            })
        ]);
    }
};