// 开启谷歌验证
let m = require('mithril')

let google_download = require('./google_download')

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div',[
            m('div',[
                m('img',{src:'fanhui',style:{marginRight:'100px'}}),
                m('img',{src:'GoogleIcon'}),
                m('span','您正在开启谷歌验证')
            ]),
            m('div',{style:{display:'flex',flexDirection:'row'}},[
                m('div','下载APP'),
                m('div','扫描二维码'),
                m('div','备份密钥'),
                m('div','开启谷歌验证'),
            ]),
            m(google_download)
        ])
    }
}