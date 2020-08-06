let m = require('mithril')
// let m = require('swiper')

require('@/styles/pages/home.css')

let marketList = require('./marketList')

module.exports = {
    view:  function(){
        return m('views-pages-home-transaction', {}, [
            // 平台介绍
            m('div', { class: `my-7` }, [
                m('div', { class: `title-2` }, ['开启交易之旅']),
                m('button', { class: `register` }, ['立即注册']),
                m('button', { class: `transaction` }, ['即可交易']),
            ]),          
        ])
    }
}