const m = require('mithril');

require('@/styles/pages/home/introduce.scss');

module.exports = {
    toPage() {
        if (window.gWebApi.loginState) {
            window.router.push('/chargeMoney');
        } else {
            window.router.push('/login');
        }
    },
    view: function () {
        return m('div', { class: 'views-pages-home-introduce ' }, [
            // 1. 平台介绍 模块
            m('div', { class: `introduce-box ` }, [
                // 内容
                m('div', { class: `container pl-8` }, [
                    m('div', { class: `pt-8 title-x-large-1` }, [
                        m('p', { class: `font-weight-regular` }, "世界领先的专业数字资产衍生品交易平台"),
                        m('img', { class: 'mb-7', src: require("@/assets/img/home/rectangle1.png").default })
                    ]),
                    m('div', { class: ` pt-8 has-text-level-2 body-6` }, ["Vbit平台金融量化团队均来自JP摩根、摩根士丹利、OKCoin、Binance等知名金融机构。Vbit平台由国际化各领域专家团队研发运营,确保平台拥有最前沿的技术，用户享有最极致的产品体验。"]),
                    m('div', { class: `mt-7 has-text-level-2 body-6` }, [" Vbit秉承用户至上的服务理念，坚持公平、公正、公开的交易原则，致力于为全球投资者提供安全、快捷的数字货币衍生品交易服务。"]),
                    m('div', { class: `introduce-div` }, [])
                ]),
                // 蒙板
                m('div', { class: `introduce-box-masking` })
            ]),
            // 2. 交易之旅 模块
            m('div', { class: `introduce-transaction container` }, [
                // 标题
                m('p', { class: `pt-8 has-text-centered font-weight-regular title-x-large-1` }, "开启交易之旅"),
                // 按钮
                m('div', { class: `has-text-centered mt-8` }, [
                    m('a', { class: `button mr-2 has-bg-primary button-register title-medium font-weight-regular skew-right`, href: "http://localhost:8080/#!/register", target: "_blank" }, ['立即注册']),
                    m('a', { class: `button has-bg-primary button-transaction title-medium font-weight-regular  skew-left ml-3`, onclick: this.toPage, href: "http://localhost:8080/#!/register", target: "_blank" }, ['即可交易'])
                ]),
                // 橘色 盒子
                m('div', { class: `home-introduce-Rectangle border-1 container is-align-items-center has-bg-primary` }, [
                    // 图片
                    m('img', { class: 'home-picture-vbit', src: require("@/assets/img/home/vbit.png").default }
                    ),
                    // 下载信息
                    m('div', { class: `download-title-1 pr-6` }, [
                        m('p', { class: `title-large font-weight-regular` }, ['随时随地交易']),
                        m('p', { class: ` pt-2` }, ['下载Vbit移动应用端'])
                    ]),
                    // 下载按钮
                    m('div', { class: `pl-8` }, [
                        // Android 按钮
                        m('a', { class: `button is-info is-inverted is-outlined download-ios mr-4 ml-7`, target: "_blank", href: "https://vbit.me/m#/downloadApp" }, [
                            m('img', { class: 'pr-2', src: require("@/assets/img/home/Android.png").default }),
                            m('span', { class: `title-small font-weight-regular` }, "Android")
                        ]),
                        // iOS 按钮
                        m('a', { class: `button is-info is-inverted is-outlined download-iOS`, target: "_blank", href: "https://vbit.me/m#/downloadApp" }, [
                            m('img', { class: 'pr-2', src: require("@/assets/img/home/iOS.png").default }),
                            m('span', { class: `title-small font-weight-regular` }, 'IOS')
                        ])
                    ])
                ])
            ])
        ]);
    }
};