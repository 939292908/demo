//开启谷歌验证-下载app
const m = require('mithril')

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div',[
            m('div','下载谷歌验证码'),
            m('div',{style:{display:'flex',justifyContent:'space-around'}},[
                m('div','APP STORE'),
                m('div','GOOGLE PLAY')
            ]),
            m('div',{style:{color:'orange',textAlign:'right'}},'下一步')
        ])
    }
}