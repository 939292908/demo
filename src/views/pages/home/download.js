let m = require('mithril')
// let m = require('swiper')

require('@/styles/pages/home.css')

let marketList = require('./marketList')

module.exports = {
    view:  function(){
        return m('views-pages-home-download', {}, [
            // 二维码下载
            m('div', { class: `border-1 w is-around is-align-items-center` }, [
                // 图片
                m('div', { class: `` }, [
                    m('img', { class: '', src: "https://forum.vuejs.org/uploads/default/original/2X/5/555257b8c5e7ecf34ce4f9b952eeaf006adfa339.png", style: "width: 200px;height:200px;" })
                ]),
                // 下载信息
                m('div', { class: `body-6` }, [
                    m('p', { class: `` }, ['随时随地交易']),
                    m('p', { class: `` }, ['下载Vbit移动应用端'])
                ]),
                // iOS 二维码
                m('div', { class: `` }, [
                    m('img', { class: '', src: "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28" }),
                    m('p', { class: `` }, ['iOS 下载'])
                ]),
                // Android 二维码
                m('div', { class: `` }, [
                    m('img', { class: '', src: "https://cdn.jsdelivr.net/gh/vmlite/s/bulma/images/bulma-logo.png", width: "112", height: "28" }),
                    m('p', { class: `` }, ['Android下载'])
                ])
            ]),

        ])
    }
}