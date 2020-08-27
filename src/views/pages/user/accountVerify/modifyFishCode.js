// 修改防钓鱼码
const m = require('mithril')

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.container.left',{style:{border:'1px solid blue',float:'left'}},[
            m('div',[
                m('img',{src:'fanhui',style:{marginRight:'100px'}}),
                m('img',{src:'GoogleIcon'}),
                m('span','您正在修改防钓鱼码'),
                m('img',{src:'tishi'})
            ]),
            m('div',[
                m('span','原钓鱼码'),
                m('br'),
                m('input.input',{placeholder:'*******',style:{width:'410px'}}),
                m('br'),
                m('span','新钓鱼码'),
                m('br'),
                m('input.input',{placeholder:'*******',style:{width:'410px'}}),
                m('br'),
                m('span','确认新钓鱼码'),
                m('br'),
                m('input.input',{placeholder:'*******',style:{width:'410px'}}),
                m('br'),
                m('span','谷歌验证码'),
                m('br'),
                m('input.input',{style:{width:'410px'}}),
                m('br'),
                m('button.button.is-success.is-light',{style:{width:'410px'}},'确认')
            ])
        ])
    }
}