const m = require('mithril');
const utils = require('@/util/utils').default;

require('@/styles/pages/home/introduce.scss');

module.exports = {
    toPage() {
        if (utils.getItem('loginState')) {
            window.router.push('/myWalletIndex');
        } else {
            window.router.push('/login');
        }
    },
    view: function () {
        return m('div', { class: 'views-pages-home-introduce ' }, [
            // 1. 平台介绍 模块
            // m('div', { class: `introduce-box ` }, [
            m('div', { class: ``, style: `background: url(${require("@/assets/img/home/layer_14.png").default}) no-repeat center center / 100% 100%;` }, [
                // 内容
                m('div', { class: `container ` }, [
                    m('div', { class: `pt-8 title-x-large` }, [
                        m('p', { class: `font-weight-regular ${utils.isMobile() ? 'ml-7 title-small ' : 'pc才有的类名xx'}` }, "世界领先的专业数字资产衍生品交易平台"),
                        m('img', { class: 'mb-5 ml-7', src: require("@/assets/img/home/rectangle1.png").default })
                    ]),
                    m('div', { class: `has-text-level-2 body-6 ${utils.isMobile() ? 'ml-7 mr-7 pt-' : 'pt-8'}` }, ["Vbit平台金融量化团队均来自JP摩根、摩根士丹利、OKCoin、Binance等知名金融机构。Vbit平台由国际化各领域专家团队研发运营,确保平台拥有最前沿的技术，用户享有最极致的产品体验。"]),
                    m('div', { class: `mt-7 has-text-level-2 body-6  ${utils.isMobile() ? 'ml-7 mr-7' : 'pc才有的类名xx'}` }, [" Vbit秉承用户至上的服务理念，坚持公平、公正、公开的交易原则，致力于为全球投资者提供安全、快捷的数字货币衍生品交易服务。"])
                    // m('div', { class: `introduce-div` }, [])
                ]),
                // 蒙板
                m('div', { class: ` introduce-box-masking  has-mode is-hidden-mobile` })
            ]),
            // 2. 交易之旅 模块
            m('div', { class: `introduce-transaction container` }, [
                // 标题
                m('p', { class: `pt-8 has-text-centered font-weight-regular title-x-large-1` }, "开启交易之旅"),
                // 按钮
                m('div', { class: `has-text-centered mt-8` }, [
                    m('a', { class: `button-register has-bg-primary button mr-2 title-medium font-weight-regular skew-right ${utils.isMobile() ? 'body-5 ' : 'pc才有的类名xx'}`, href: "http://localhost:8080/#!/register", target: "_blank" }, ['立即注册']),
                    m('a', { class: `button-transaction has-bg-primary button title-medium font-weight-regular  skew-left ml-3  ${utils.isMobile() ? 'body-5 ' : 'pc才有的类名xx'}`, onclick: this.toPage, target: "_blank" }, ['即可交易'])
                ]),
                // 橘色 盒子
                m('div', { class: `home-introduce-Rectangle border-1 container is-align-items-center has-bg-primary ` }, [
                    // 图片
                    m('img', { class: 'home-picture-vbit', src: require("@/assets/img/home/vbit.png").default }
                    ),
                    // 下载信息
                    m('div', { class: `pr-6 mb-8` }, [
                        m('p', { class: `ml-3 title-large font-weight-regular` }, ['随时随地交易']),
                        m('p', { class: `ml-3 pt-2 ${utils.isMobile() ? 'title-small  ml-6 font-weight-regular' : 'pc才有的类名xx'}` }, ['下载Vbit移动应用端'])
                    ]),
                    // 下载按钮
                    m('div', { class: `pl-8 mb-8` }, [
                        // Android 按钮
                        m('a', { class: `Android-button button is-info is-inverted is-outlined download-ios mr-4   ${utils.isMobile() ? 'title-small  mb-6 ml-7' : 'pc才有的类名xx'}`, target: "_blank", href: "https://vbit.me/m#/downloadApp" }, [
                            m('i', { class: "iconfont icon-android-fill mr-2" }),
                            m('span', { class: `title-small font-weight-regular` }, "Android")
                        ]),
                        // iOS 按钮
                        m('a', { class: `IOS-button button is-info is-inverted is-outlined download-iOS ${utils.isMobile() ? 'title-small  mb-7 ml-7' : 'pc才有的类名xx'} `, target: "_blank", href: "https://vbit.me/m#/downloadApp" }, [
                            m('i', { class: "iconfont icon-apple mr-2" }),
                            m('span', { class: `title-small font-weight-regular` }, 'IOS')
                        ])
                    ])
                ])
            ])
        ]);
    }
};