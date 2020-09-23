const m = require('mithril');
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n.js').default;
const config = require('@/config.js');

require('@/views/page/home/introduce/introduce.scss');

module.exports = {
    toPage() {
        if (utils.getItem('loginState')) {
            window.open("trd/", '_blank');
        } else {
            window.router.push('/login');
        }
    },
    toUrl () {
        window.open("/w/#!/register", '_blank');
    },
    view: function () {
        return m('div', { class: 'views-pages-home-introduce ' }, [
            // 1. 平台介绍 模块
            // m('div', { class: `introduce-box ` }, [
            m('div', { class: ``, style: `background: url(${require("@/assets/img/home/layer_14.png").default}) no-repeat center center / 100%;` }, [
                // 内容
                m('div', { class: `container ` }, [
                    m('div', { class: `pt-8 title-x-large` }, [
                        m('p', { class: `font-weight-regular ${utils.isMobile() ? 'ml-7 title-small ' : 'title-x-large'}` }, [
                            // "世界领先的专业数字资产衍生品交易平台"
                            I18n.$t('10022')
                        ]),
                        m('img.world-line', { class: `mb-5 ${utils.isMobile() ? 'ml-7 ' : 'ml-2'}`, src: require("@/assets/img/home/rectangle1.png").default })
                    ]),
                    m('div', { class: `has-text-level-2 body-6 ${utils.isMobile() ? 'ml-7 mr-7' : 'pt-8'}` }, [
                        // "Vbit平台金融量化团队均来自JP摩根、摩根士丹利、OKCoin、Binance等知名金融机构。Vbit平台由国际化各领域专家团队研发运营,确保平台拥有最前沿的技术，用户享有最极致的产品体验。"
                        I18n.$t('10023', { value: config.exchName })
                    ]),
                    m('div', { class: `mt-7 has-text-level-2 body-6  ${utils.isMobile() ? 'ml-7 mr-7' : 'pc才有的类名xx'}` }, [
                        // " Vbit秉承用户至上的服务理念，坚持公平、公正、公开的交易原则，致力于为全球投资者提供安全、快捷的数字货币衍生品交易服务。"
                        I18n.$t('10024', { value: config.exchName })
                    ])
                ]),
                // 蒙板
                m('div', { class: ` introduce-box-masking is-hidden-mobile mt-8` })
            ]),
            // 2. 交易之旅 模块
            m('div', { class: `introduce-transaction container` }, [
                // 标题
                m('p', { class: `pt-9 mt-6 has-text-centered font-weight-regular title-x-large-1` }, [
                    // "开启交易之旅"
                    I18n.$t('10025')
                ]),
                // 按钮
                m('div', { class: `has-text-centered mt-8 pb-8` }, [
                    m('a', { class: `border-radius-medium button-register has-bg-primary button mr-2 title-medium font-weight-regular skew-right ${utils.isMobile() ? 'body-5 ' : 'pc才有的类名xx'}`, onclick: this.toUrl, target: "_blank" }, [
                        // '立即注册'
                        I18n.$t('10026')
                    ]),
                    m('a', { class: `border-radius-medium button-transaction has-bg-primary button title-medium font-weight-regular  skew-left ml-3  ${utils.isMobile() ? 'body-5 ' : 'pc才有的类名xx'}`, onclick: this.toPage, target: "_blank" }, [
                        // '即刻交易'
                        I18n.$t('10027')
                    ])
                ]),
                // 橘色 盒子
                m('div', { class: `home-introduce-Rectangle border-1 container is-align-items-center has-bg-primary mt-9` }, [
                    // 图片
                    m('img', { class: 'home-picture-vbit', src: require("@/assets/img/home/vbit.png").default }),
                    // 下载信息
                    m('div', { class: `h100 ${utils.isMobile() ? 'pr-6 ml-8' : 'home-download-info-vbit'}` }, [
                        m('p', { class: `title-large font-weight-regular` }, [
                            // '随时随地交易'
                            I18n.$t('10028')
                        ]),
                        m('p', { class: `pt-2 ${utils.isMobile() ? 'title-small font-weight-regular' : ''}` }, [
                            // '下载Vbit移动应用端'
                            I18n.$t('10028', { value: config.exchName })
                        ])
                    ]),
                    // 下载按钮
                    m('div', { class: `h100 ${utils.isMobile() ? 'pl-8 mt-5' : 'home-download-btn-vbit'}` }, [
                        m('div', { class: `dropdown is-hoverable is-up` }, [
                            m('div', { class: "dropdown-trigger has-text-1" }, [
                                // Android 按钮
                                m('a', { class: `border-radius-medium  Android-button button is-info is-inverted is-outlined download-ios mr-4   ${utils.isMobile() ? 'title-small  mb-6 ml-7' : 'pc才有的类名xx'}`, target: "_blank", href: "https://vbit.me/m#/downloadApp" }, [
                                    m('i', { class: "iconfont icon-android-fill mr-2" }),
                                    m('span', { class: `title-small font-weight-regular` }, "Android")
                                ])
                            ]),
                            m('div.dropdown-menu', {}, [
                                m('div', { class: "dropdown-content pa-4", style: 'width: 163px' }, [
                                    m('img', { class: ``, width: "131px", src: require("@/assets/img/home/download.png").default })
                                ])
                            ])
                        ]),
                        m('div', { class: `dropdown is-hoverable is-up` }, [
                            m('div', { class: "dropdown-trigger has-text-1" }, [
                                // iOS 按钮
                                m('a', { class: `border-radius-medium  IOS-button button is-info is-inverted is-outlined download-iOS ${utils.isMobile() ? 'title-small  mb-7 ml-7' : 'pc才有的类名xx'} `, target: "_blank", href: "https://vbit.me/m#/downloadApp" }, [
                                    m('i', { class: "iconfont icon-apple mr-2" }),
                                    m('span', { class: `title-small font-weight-regular` }, 'IOS')
                                ])
                            ]),
                            m('div.dropdown-menu', {}, [
                                m('div', { class: "dropdown-content pa-4", style: 'width: 163px' }, [
                                    m('img', { class: ``, width: "131px", src: require("@/assets/img/home/download.png").default })
                                ])
                            ])
                        ])
                    ])
                ])
            ])
        ]);
    }
};
