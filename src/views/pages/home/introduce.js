let m = require('mithril')
// let m = require('swiper')

require('@/styles/pages/home.css')

let marketList = require('./marketList')

module.exports = {
    view:  function(){
        return m('views-pages-home-introduce', {}, [
            // 平台介绍
            m('div', { class: `frame-1 w` }, [
                m('div', { class: `` }, ["世界领先的专业数字资产衍生品交易平台。 Vbit平台金融量化团队均来自JP摩根、摩根士丹利、OKCoin、Binance等知名金融机构。Vbit平台由国际化各领域专家团队研发运营,确保平台拥有最前沿的技术，用户享有最极致的产品体验。Vbit秉承用户至上的服务理念，坚持公平、公正、公开的交易原则，致力于为全球投资者提供安全、快捷的数字货币衍生品交易服务。"])
            ]),           
        ])
    }
}