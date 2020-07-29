let m = require('mithril')

require('@/styles/pages/home.css')
// let demo = require('@/views/pages/demo')

module.exports = {
    oncreate: function () { 

    },
    view: function () {
        return m('div.views-pages-home-index', [ 
            m('div', { class: `index-info-box-right` }, [
                m('div', { class: `p1` }, ['我要买']),
                m('div', { class: `p2` }, ['参考价 6.95CNY/USDT']),
                ]),
            m('div', { class: `index-info-box` }, [
                m('div', { class: `index-info-box-right` }, [
                    m('select', { class: `p3` }, [
                    m('option', { class: `` }, ['USDT']),
                    m('option', { class: `` }, ['U']),
                    m('option', { class: `` }, ['S']),
                    ]),
                    m('select', { class: `select` }, [
                    m('option', { class: `` }, ['CNY']),
                    m('option', { class: `` }, ['C']),
                    m('option', { class: `` }, ['N']),
                    ]),
                    m('button', { class: `btn` }, ['购买USDT'])
                    ]),
                    ]),  
            m('div', { class: `Notice`}, [
                m('div', { class: `Notice-content` }, [
                    m('div', { class: `Notice-1` }, ['我是公告公告']),
                    m('div', { class: `Notice-2` }, ['我是公告公告']),
                    m('div', { class: `Notice-3` }, ['我是公告公告']),
                    m('div', { class: `Notice-4` }, ['我是公告公告']),
                ]),
                m('div', { class: `frame` }, [
                        m('div', { class: `listing`}, [
                        m('div', { class: `` }, ['名称']),
                        m('div', { class: `` }, ['最新价']),
                        m('div', { class: `` }, ['涨跌桶']),
                        m('div', { class: `` }, ['24h交易量'])
                ])
            ]),
            m('div', { class: `frame-1` }, [
                m('div', { class: `` }, ["世界领先的专业数字资产衍生品交易平台。Vbit平台金融量化团队均来自JP摩根、摩根士丹利、OKCoin、Binance等知名金融机构。Vbit平台由国际化各领域专家团队研发运营,确保平台拥有最前沿的技术，用户享有最极致的产品体验。Vbit秉承用户至上的服务理念，坚持公平、公正、公开的交易原则，致力于为全球投资者提供安全、快捷的数字货币衍生品交易服务。"])
            ]),
            m('div', { class: `frame-2` }, [
            m('.navbar-brand', {}, [
                m('a.navbar-item', {class:'frame-image-1'}, [
                    m('img', {class:'',"src":"https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height:"28",},
                        m('div', { class: `.details-1` }, ["安全保障：世界顶级安全团队打造、主动安全的防御系统、银行级加密、冷热钱包分层体系，保障用户资金安全！"])
                    ),
                    m('img', {class:'',"src":"https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height:"28",},
                    ),
                    m('img', {class:'',"src":"https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height:"28",},
                    ),
                    m('img', {class:'',"src":"https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height:"28",},
                    )
                ])
            ])
        ]),
            m('div', { class: `title-1` }, ['开启交易之旅']),
            m('button', { class: `register` }, ['立即注册']),
            m('button', { class: `transaction` }, ['即可交易']),
            m('div', { class: `frame-3 w` }, [
                m('.navbar-brand', {}, [
                    m('a.navbar-item', {class:'frame-image-2'}, [
                        m('img', {class:'',"src":"https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height:"28",},
                        )
                    ]),
                    m('div', { class: `title-1` }, ["随时随地交易"],
                    m('div', { class: `title-1` }, ["下载Vbit移动应用端"]),),

                    m('a.navbar-item', {class:'QR code-1'}, [
                        m('img', {class:'',"src":"https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height:"28",},
                        )
                    ]),
                    m('a.navbar-item', {class:'QR code-2'}, [
                        m('img', {class:'',"src":"https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height:"28",},
                        ),
                        m('div', { class: `download-ios` }, ["iOS 下载"]),
                    ]),
                    m('div', { class: `download-Android` }, ["Android下载"])
                ])
            ])
    ])
            ])
    }
}