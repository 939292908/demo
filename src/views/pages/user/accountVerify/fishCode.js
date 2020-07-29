// 设置钓鱼码
let m = require('mithril')

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.container.left',{style:{border:'1px solid blue',float:'left'}},[
            m('div',[
                m('img',{src:'fanhui',style:{marginRight:'100px'}}),
                m('img',{src:'GoogleIcon'}),
                m('span','您正在设置防钓鱼码'),
                m('img',{src:'tishi'})
            ]),
            m('div',[
                m('span','防钓鱼码'),
                m('br'),
                m('input.input',{placeholder:'*******',style:{width:'410px'}}),
                m('br'),
                m('span','请输入4-20未非特殊字符'),
                m('br'),
                m('span',{style:{marginRight:'250px'}},'谷歌验证码'),
                m('span','切换短信验证'),
                m('br'),
                m('input.input',{style:{width:'410px'}}),
                m('br'),
                m('button.button.is-success.is-light',{style:{width:'410px'}},'确认')
            ])
        ])
    }
}
