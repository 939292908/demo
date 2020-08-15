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
        return m('div.views-pages-home-introduce', { class: '' }, [
            // 平台介绍 模块
            m('div', { class: `frame-1 container w` }, [
                m('p', { class: `home-introduce-p introduce-content pt-6 title-x-large` }, ["世界领先的专业数字资产衍生品交易平台"]),
                m('img', { class: 'introduce-rectangle', src: require("@/assets/img/home/rectangle1.png").default }),
                m('div', { class: `has-text-level-4 introduce introduce-content pt-8` }, ["Vbit平台金融量化团队均来自JP摩根、摩根士丹利、OKCoin、Binance等知名金融机构。Vbit平台由国际化各领域专家团队研发运营,确保平台拥有最前沿的技术，用户享有最极致的产品体验。"]),
                m('div', { class: `has-text-level-4 home-introduce introduce-content pt-3 pb-8` }, [" Vbit秉承用户至上的服务理念，坚持公平、公正、公开的交易原则，致力于为全球投资者提供安全、快捷的数字货币衍生品交易服务。"])
            ]),
            // 交易之旅 模块
            m('div', { class: ` introduce-transaction container` }, [
                // 标题
                m('div', { class: `pt-8 has-text-centered title-x-large` }, ['开启交易之旅']),
                // 按钮
                m('div', { class: `has-text-centered mt-5` }, [
                    m('a', { class: `button mr-2 has-bg-primary`, href: "http://localhost:8080/#!/register" }, ['立即注册']),
                    m('button', { class: `button has-bg-primary`, onclick: this.toPage, href: "http://localhost:8080/#!/register" }, ['即可交易'])
                ]),
                // 橘色 盒子
                m('div', { class: `home-introduce-Rectangle border-1 container is-align-items-center` }, [
                    // 图片
                    m('img', { class: 'home-picture-vbit', src: require("@/assets/img/home/vbit.png").default }
                    ),
                    // 下载信息
                    m('div', { class: `download-title-1 pr-6` }, [
                        m('p', { class: `title-small` }, ['随时随地交易']),
                        m('p', { class: `has-text-level-4 pt-2` }, ['下载Vbit移动应用端'])
                    ]),
                    // 下载按钮
                    m('div', { class: `pl-6` }, [
                        // Android 按钮
                        m('img', { class: 'introduce-item-Object4', src: require("@/assets/img/home/Android.png").default }),
                        m('a', { class: `button is-info is-inverted is-outlined download-ios mr-2`, href: "https://vbit.me/m#/downloadApp" }, ["Android下载"]),
                        // iOS 按钮
                        m('img', { class: 'introduce-item-Object4', src: require("@/assets/img/home/Android.png").default }),
                        m('a', { class: `button is-info is-inverted is-outlined download-iOS`, href: "https://vbit.me/m#/downloadApp" }, ['iOS下载'])
                    ])
                ])
            ])
        ]);
    }
};