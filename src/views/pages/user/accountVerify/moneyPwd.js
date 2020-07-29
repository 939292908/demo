// 设置资金密码
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
                m('span','资产密码将用于转账、法币交易、红包等功能，请妥善保管,避免泄露.请不要忘记自己的资产密码资产密码遗忘后，需要将身份证及个人信息发送至客服邮箱，客服在24小时内处理')
            ]),
            m('div',[
                m('span','资金密码'),
                m('br'),
                m('input.input',{placeholder:'*******',style:{width:'410px'}}),
                m('br'),
                m('span','确认密码'),
                m('br'),
                m('input.input',{style:{width:'410px'}}),
                m('br'),
                m('span','邮箱验证码（123****@qq.com）'),
                m('br'),
                m('input',{style:{width:'300px',height:'35px',marginRight:'10px'}}),
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