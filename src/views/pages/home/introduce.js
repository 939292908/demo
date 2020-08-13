const m = require('mithril');

require('@/styles/pages/home.css');

module.exports = {
    view: function () {
        return m('views-pages-home-introduce', { class: 'introduce-content' }, [
            // 平台介绍
            m('div', { class: `frame-1 container w` }, [
                m('p', { class: `title-2` }, ["世界领先的专业数字资产衍生品交易平台"]),
                m('div', { class: `` }, ["Vbit平台金融量化团队均来自JP摩根、摩根士丹利、OKCoin、Binance等知名金融机构。Vbit平台由国际化各领域专家团队研发运营,确保平台拥有最前沿的技术，用户享有最极致的产品体验。"]),
                m('div', { class: `` }, [" Vbit秉承用户至上的服务理念，坚持公平、公正、公开的交易原则，致力于为全球投资者提供安全、快捷的数字货币衍生品交易服务。"])
            ]),
            m('div', { class: ` my-7 container` }, [
                m('div', { class: `title-5` }, ['开启交易之旅']),
                m('a', { class: ``, href: "http://localhost:8080/#!/register" }, [
                    m('button', { class: `register` }, ['立即注册'])
                ]),
                m('button', { class: `transaction` }, ['即可交易']),
                // 二维码下载
                m('div', { class: `` }, [
                    m('div', { class: `border-1 container is-around ` }, [
                        // 图片
                        // m('div', { class: `` }, [
                        //     m('img', { class: '', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 200px;height:200px;" })
                        // ]),
                        // 下载信息
                        m('div', { class: `download-title-1` }, [
                            m('p', { class: `title-1` }, ['随时随地交易']),
                            m('p', { class: `` }, ['下载Vbit移动应用端'])
                        ]),
                        // iOS 二维码
                        m('a', { class: ``, href: "https://vbit.me/m#/downloadApp" }, [
                            m('button', { class: `download-ios` }, ['iOS 下载'])
                        ]),
                        // Android 二维码
                        m('a', { class: ``, href: "https://vbit.me/m#/downloadApp" }, [
                            m('button', { class: `download-Android` }, ['Android下载'])
                        ])
                    ])
                ])
            ])
        ]);
    }
};