const m = require('mithril');

require('@/styles/pages/home.css');

module.exports = {
    view: function () {
        return m('div.views-pages-home-introduce', { class: '' }, [
            // 平台介绍title-
            m('div', { class: `frame-1 container w` }, [
                m('p', { class: ` title-5 introduce-content pt-6` }, ["世界领先的专业数字资产衍生品交易平台"]),
                m('img', { class: 'introduce-rectangle', src: require("@/assets/img/home/rectangle1.png").default }),
                m('div', { class: `has-text-level-4 introduce introduce-content pt-8` }, ["Vbit平台金融量化团队均来自JP摩根、摩根士丹利、OKCoin、Binance等知名金融机构。Vbit平台由国际化各领域专家团队研发运营,确保平台拥有最前沿的技术，用户享有最极致的产品体验。"]),
                m('div', { class: `has-text-level-4 home-introduce introduce-content pt-3 pb-8` }, [" Vbit秉承用户至上的服务理念，坚持公平、公正、公开的交易原则，致力于为全球投资者提供安全、快捷的数字货币衍生品交易服务。"])
            ]),
            m('div', { class: ` introduce-transaction container` }, [
                m('div', { class: `title-5 pt-8` }, ['开启交易之旅']),
                m('a', { class: `pt-8`, href: "http://localhost:8080/#!/register" }, [
                    m('button', { class: `register has-bg-primary` }, ['立即注册']),
                    m('button', { class: `transaction has-bg-primary` }, ['即可交易'])
                ]),
                // 二维码下载
                m('div', { class: `` }, [
                    m('div', { class: `border-1 container is-around pt-8` }, [
                        // 图片
                        m('div', { class: `introduce` }, [
                            m('div', { class: `home-introduce-Rectangle` }, [
                                m('img', { class: 'home-picture-vbit', src: require("@/assets/img/home/vbit.png").default }
                                ),
                                // 下载信息
                                m('div', { class: `download-title-1` }, [
                                    m('p', { class: ` title-1 pr-7` }, ['随时随地交易']),
                                    m('p', { class: `has-text-level-4 ` }, ['下载Vbit移动应用端'])
                                ]),
                                // iOS 二维码
                                // m('div', { class: `home-download-ios` }, [
                                m('a', { class: ``, href: "https://vbit.me/m#/downloadApp" }, [
                                    m('p', { class: `download-ios` }, ['iOS 下载']
                                    ),
                                    // Android 二维码
                                    m('p', { class: `download-Android` }, ['Android下载'])
                                ])
                                // ])
                            ])
                        ])
                    ])
                ])
            ])
        ]);
    }
};