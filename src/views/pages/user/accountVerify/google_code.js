//开启谷歌验证-下载app
let m = require('mithril')

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div',[
            m('div','用谷歌验证APP扫描以下验证码'),
            m('img',{src:'erweima'}),
            m('div','如果您无法扫描这个二维码，请在App中手动输入这串字符'),
            m('div',[
                m('span','P6IQFDD4XT7Q314W'),
                m('img',{src:'fuzhi'})
            ]),
            m('div',[
                m('span',{style:{marginRight:'200px'}},'上一步'),
                m('span','下一步')
            ])
        ])
    }
}