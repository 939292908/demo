const m = require('mithril');
// const titleLogo = require("@/assets/img/logo/title-logo.png").default;
const I18n = require("@/languages/I18n").default;
const Tooltip = require('@/views/components/common/Tooltip/Tooltip.view.js');
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
        // apiLines.initLines();
        apiLines.updateLines();
    },
    view: function () {
        return m('nav.navbar.is-fixed-top.theme--darken.body-5', {
            role: "navigation",
            "aria-label": "main navigation",
            class: "has-bg-sub-level-1"
        }, [
            m('.navbar-brand', {}, [
                m('div.navbar-item.cursor-pointer', {
                    onclick: function () {
                        window.router.push(window.router.defaultRoutePath);
                    }
                }, [
                    m('svg.icon.header-logo', { "aria-hidden": true }, [
                        m('use', { "xlink:href": "#icon-white-logo" })
                    ])
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
                    m('div', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.$message({
                                content: I18n.$t('10513'), // 暂未开放，敬请期待
                                type: 'primary'
                            });
                        }
                    }, [
                        I18n.$t('10001')// '法币交易'
                    ]),
                    // 合约交易
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('div.navbar-item.ma-0.has-text-primary-hover.cursor-pointer', {}, [
                            I18n.$t('10002')// "合约交易"
                        ]),
                        m('div.theme--light', { }, [
                            m('div.navbar-dropdown.has-bg-level-2.border-radius-medium.pa-0', {}, [
                                m('a', {
                                    class: `navbar-item media is-align-items-center pa-5 ma-0`,
                                    href: '/w/trd/',
                                    target: "_blank"
                                }, [
                                    // m('div.media-left.pa-3', {}, [
                                    //     m('div', { class: `header-navbar-item-icon has-line-level-3 mr-2` })
                                    // ]),
                                    m('div', { class: `media-content` }, [
                                        m('div', { class: `content` }, [
                                            m('p', { class: `title-small` }, [
                                                // "USDT永续合约"
                                                'USDT ' + I18n.$t('10033')
                                            ]),
                                            m('p', { class: `body-4 has-text-level-3` }, [
                                                // " 最高百倍杠杆，交易简单"
                                                I18n.$t('10591')
                                            ])
                                        ])
                                    ])
                                ]),
                                m('a', {
                                    class: `navbar-item media is-align-items-center pa-5 ma-0`,
                                    href: '/w/trd/',
                                    target: "_blank"
                                }, [
                                    // m('div.media-left.pa-3', {}, [
                                    //     m('div', { class: `header-navbar-item-icon has-line-level-3 mr-2` })
                                    // ]),
                                    m('div', { class: `media-content` }, [
                                        m('div', { class: `content` }, [
                                            m('span', { class: `title-small` }, [
                                                // "全币种合约"
                                                I18n.$t('10035')
                                            ]),
                                            m('span', { class: `header-new-info has-bg-primary px-3 ml-2` }, ["NEW"]),
                                            m('p', { class: `body-4 has-text-level-3` }, [
                                                // " 小币种开仓，统一价格标的"
                                                I18n.$t('10592')
                                            ])
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ]),
                    m('div', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.$message({
                                content: I18n.$t('10513'), // 暂未开放，敬请期待
                                type: 'primary'
                            });
                        }
                    }, [
                        // '币币交易'
                        I18n.$t('10003')
                    ]),
                    m('div', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.$message({
                                content: I18n.$t('10513'), // 暂未开放，敬请期待
                                type: 'primary'
                            });
                        }
                    }, [
                        // 'ETF专区'
                        I18n.$t('10004')
                    ]),
                    m('div', {
                        class: "navbar-item has-text-primary-hover cursor-pointer ",
                        onclick: function () {
                            window.open('https://vbithelp.zendesk.com/hc/zh-cn/sections/360007960273');
                        }
                    }, [
                        // '新手帮助'
                        I18n.$t('10005')
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
                    m('div.navbar-item.has-dropdown.is-hoverable' + (utils.getItem('loginState') ? '' : '.is-hidden'), {}, [
                        m('div.navbar-item.ma-0.has-text-primary-hover.cursor-pointer', {}, [
                            // "资产"
                            I18n.$t('10049')
                        ]),
                        m('div.theme--light', { }, [
                            m('div.navbar-dropdown.is-right.has-bg-level-2.border-radius-medium', {}, [
                                m('a', {
                                    class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                    onclick: function () {
                                        window.router.push({
                                            path: '/myWalletIndex',
                                            data: {
                                                id: '03'
                                            }
                                        });
                                    }
                                }, [
                                    // '我的钱包'
                                    I18n.$t('10055')
                                ]),
                                m('a', {
                                    class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                    onclick: function () {
                                        window.router.push({
                                            path: '/myWalletIndex',
                                            data: {
                                                id: '01'
                                            }
                                        });
                                    }
                                }, [
                                    // '合约账户'
                                    I18n.$t('10072')
                                ]),
                                m('a', {
                                    class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                    onclick: function () {
                                        window.router.push({
                                            path: '/myWalletIndex',
                                            data: {
                                                id: '02'
                                            }
                                        });
                                    }
                                }, [
                                    // '币币账户'
                                    I18n.$t('10073')
                                ]),
                                m('a', {
                                    class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                    onclick: function () {
                                        window.router.push({
                                            path: '/myWalletIndex',
                                            data: {
                                                id: '04'
                                            }
                                        });
                                    }
                                }, [
                                    // '法币账户'
                                    I18n.$t('10074')
                                ])
                            ])
                        ])
                    ]),
                    // 我的
                    m('div.navbar-item.has-dropdown.is-hoverable' + (utils.getItem('loginState') ? '' : '.is-hidden'), {}, [
                        m('div.navbar-item.ma-0.has-text-primary-hover.cursor-pointer', {}, [
                            m('i.iconfont.icon-Personal')
                        ]),
                        m('div.theme--light', { }, [
                            m('div.navbar-dropdown.is-right.has-bg-level-2.border-radius-medium.pt-0', {}, [
                                m('div', { class: ` pa-6`, style: `background: url(${require("@/assets/img/home/background.png").default}) no-repeat center center / 100% 100%; width:"200px"` }, [
                                    m('div', { class: `header-my-tooltip-top has-text-level-1` }, [
                                        m('p', { class: `` }, [
                                            m('p', { class: `title-small` }, [
                                                utils.hideAccountNameInfo(globalModels.getAccount().accountName || '--')
                                            ]),
                                            m('p', { class: `body-4 has-text-level-2` }, [
                                                'UID:' + (globalModels.getAccount().uid || '--')
                                            ])
                                        ])
                                    ])
                                ]),
                                m('a', {
                                    class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                    onclick: function () {
                                        window.router.push({
                                            path: '/selfManage'
                                        });
                                    }
                                }, [
                                    // '账户安全'
                                    I18n.$t('10181')
                                ]),
                                m('a', {
                                    class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5 is-hidden`
                                }, [
                                    // '身份认证'
                                    I18n.$t('10182')
                                ]),
                                m('a', {
                                    class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5 is-hidden`
                                }, [
                                    // 'API管理'
                                    I18n.$t('10183')
                                ]),
                                m('a', {
                                    class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5 is-hidden`
                                }, [
                                    // '邀请返佣'
                                    I18n.$t('10184')
                                ]),
                                m('a', {
                                    class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                    onclick: () => {
                                        header.loginOut();
                                    }
                                }, [
                                    // '退出登录'
                                    I18n.$t('10185')
                                ])
                            ])
                        ])
                    ]),
                    // 下载
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('div.navbar-item.ma-0.has-text-primary-hover.cursor-pointer', {}, [
                            m('i.iconfont.icon-xiazai')
                        ]),
                        m('div.theme--light', { }, [
                            m('div.navbar-dropdown.is-right.has-bg-level-2.border-radius-medium.box.min-width-250.pa-5', {}, [
                                m('article', { class: `media is-align-items-center` }, [
                                    m('div.media-left', {}, [
                                        m('figure.image.is-64x64', {}, [
                                            m('img', { class: '', src: require("@/assets/img/home/download.png").default })
                                        ])
                                    ]),
                                    m('div', { class: `media-content` }, [
                                        m('div', { class: `content` }, [
                                            m('p', { class: `title-small` }, [
                                                // "扫码下载APP"
                                                I18n.$t('10489')
                                            ]),
                                            m('p', { class: `title-small` }, "iOS&Android")
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ]),
                    // 线路切换
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('div.navbar-item.ma-0.has-text-primary-hover.cursor-pointer', {}, [
                            m('i.iconfont.icon-signal')
                        ]),
                        m('div.theme--light', { }, [
                            m('div.navbar-dropdown.is-right.has-bg-level-2.border-radius-medium', {}, [
                                m('div', {
                                    class: "navbar-item px-6 ma-0 pa-0 title-small is-flex"
                                }, [
                                    // `线路切换(${apiLines.netLines.length})`,
                                    I18n.$t('10153', { value: apiLines.netLines.length }),
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
                                        class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                        onclick: function() {
                                            apiLines.setLinesActive(item.Id);
                                        }
                                    }, [
                                        m('i.iconfont.icon-dot' + (item.Id !== apiLines.activeLine.Id ? '.opacity-0' : '.has-text-primary')),
                                        m('span.column.pr-8', {}, [
                                            item.Name
                                        ]),
                                        m('span.column.has-text-left', {}, [
                                            // '延迟 ' + apiLines.wsResponseSpeed[i] + '/' + apiLines.apiResponseSpeed[i] + 'ms'
                                            I18n.$t('10155') + ' ' + (apiLines.wsResponseSpeed[i] || '--') + '/' + (apiLines.apiResponseSpeed[i] || '--') + 'ms'
                                        ])
                                    ]);
                                })
                            ])
                        ])
                    ]),
                    // 语言
                    m('div.navbar-item.has-dropdown.is-hoverable', {}, [
                        m('div.navbar-item.ma-0.has-text-primary-hover.cursor-pointer', {}, [
                            I18n.langList[I18n.getLocale()].language
                        ]),
                        m('div.theme--light', { }, [
                            m('div.navbar-dropdown.is-right.has-bg-level-2.border-radius-medium', {}, [
                                Object.keys(I18n.langList).map((item, i) => {
                                    if (I18n.langList[item].open) {
                                        return m('a', {
                                            class: `navbar-item has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5`,
                                            onclick: function() {
                                                I18n.setLocale(item, res => {
                                                    // window._console.log('header setLocale', res);
                                                });
                                            }
                                        }, [
                                            m('i.iconfont.icon-dot' + (item !== I18n.getLocale() ? '.opacity-0' : '.has-text-primary')),
                                            I18n.langList[item].language
                                        ]);
                                    }
                                })
                            ])
                        ])
                    ])
                ])
            ]),
            // 设备信息
            m(modal, {
                isShow: deviceInfo.modalOpen, // 显示隐藏
                onClose () {
                    deviceInfo.closeModal();
                }, // 关闭事件
                slot: { // 插槽
                    header: m('div.w100', {}, [
                        m('div', {}, [
                            // `Web网络监测(${globalModels.getAccount().uid})`
                            `${I18n.$t('10164')}(${globalModels.getAccount().uid || '****'})`
                        ]),
                        m('article.body-4.has-text-level-3.message.is-warning.mt-4.mr-4.flex-shrink-initial', {}, [
                            m('div.message-body.border-1', {}, [
                                // '此页面仅用于定位您的浏览器和网络信息，不涉及您的隐私信息，请放心使用。'
                                I18n.$t('10165')
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