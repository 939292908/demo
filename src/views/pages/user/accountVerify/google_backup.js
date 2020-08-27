//开启谷歌验证-下载app
const m = require('mithril')

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div',[
            m('div','请妥善保管好该密钥，以免丢失'),
            m('div','P6IQFDD4XT7Q3I4W'),
            m('div','如果该密钥丢失，需要联系客服处理，这通常需要一定的时间'),
            m('div',[
                m('span',{style:{marginRight:'200px'}},'上一步'),
                m('span','下一步')
            ])
        ])
    }
}