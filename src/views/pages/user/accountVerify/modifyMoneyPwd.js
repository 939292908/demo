// 修改资金密码
let m = require('mithril')

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.container.left',{style:{border:'1px solid blue',float:'left',width:'60%'}},[
            m('div',[
                m('img',{src:'fanhui',style:{marginRight:'100px'}}),
                m('img',{src:'GoogleIcon'}),
                m('span','您正在设置资金密码')
            ]),
            m('div',[
                m('img','marn'),
                m('span','出于安全考虑，修改账户安全项之后，24h内禁止提币、内部转出与卖币操作')
            ]),
            m('div',[
                m('span','原密码'),
                m('br'),
                m('input.input',{placeholder:'*******',style:{width:'410px'}}),
                m('br'),
                m('span','新密码'),
                m('br'),
                m('input.input',{placeholder:'*******',style:{width:'410px'}}),
                m('br'),
                m('span','确认信密码'),
                m('br'),
                m('input.input',{style:{width:'410px'}}),
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