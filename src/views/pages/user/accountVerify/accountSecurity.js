// 账户安全
let m = require('mithril')

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.container.left',{style:{float:'left'}},[
            m('div','安全推荐（1/4）'),
            m('div',[
                m('span',{style:{marginRight:'20px'}},'开启2FA'),
                m('span',{style:{marginRight:'20px'}},'去认证'),
                m('span',{style:{marginRight:'20px'}},'设置防钓鱼码'),
                m('span',{style:{marginRight:'20px'}},'开启提币白名单')
            ]),
            m('div',[
                m('div',{style:{float:'left',border:'1px solid #ccc',marginRight:'10px'}},[
                    m('div',{style:{height:'90px',width:'450px'}},[
                        m('img',{src:'zhanwei',style:{float:'left',width:'20%'}}),
                        m('div',{style:{float:'left',width:'50%'}},[
                            m('span','谷歌验证'),
                            m('br'),
                            m('span','用于提现和修改安全设置')
                        ]),
                        m('button.button',{style:{float:'left',width:'15%',marginTop:'20px'},click:function(){}},'显示'),
                        m('div',{style:{clear:'both'}}),
                    ]),
                    m('div',{style:{height:'90px'}},[
                        m('img',{src:'zhanwei',style:{float:'left',width:'20%'}}),
                        m('div',{style:{float:'left',width:'50%'}},[
                            m('span','手机验证'),
                            m('br'),
                            m('span','用于提现、登录和修改安全设置')
                        ]),
                        m('button.button',{style:{float:'left',width:'15%',marginTop:'20px'}},'显示'),
                        m('div',{style:{clear:'both'}}),
                    ]),
                    m('div',{style:{height:'90px'}},[
                        m('img',{src:'zhanwei',style:{float:'left',width:'20%'}}),
                        m('div',{style:{float:'left',width:'50%'}},[
                            m('span','邮箱验证'),
                            m('br'),
                            m('span','用于提现、登录和修改安全设置')
                        ]),
                        m('button.button',{style:{float:'left',width:'15%',marginTop:'20px'}},'显示'),
                        m('div',{style:{clear:'both'}}),
                    ]),
                ]),
                m('div',{style:{float:'right'}},[
                    m('div',{style:{height:'80px',width:'450px',border:'1px solid #ccc'}},[
                        m('img',{src:'zhanwei',style:{float:'left',width:'20%'}}),
                        m('div',{style:{float:'left',width:'50%'}},[
                            m('span','身份认证'),
                            m('br'),
                            m('span','完成认证获得更高提币额度')
                        ]),
                        m('button.button',{style:{float:'left',width:'15%',marginTop:'20px'}},'设置'),
                        m('div',{style:{clear:'both'}}),
                    ]),
                    m('div',{style:{margin:'10px 0',height:'80px',width:'450px',border:'1px solid #ccc'}},[
                        m('img',{src:'zhanwei',style:{float:'left',width:'20%'}}),
                        m('div',{style:{float:'left',width:'50%'}},[
                            m('span','资金密码'),
                            m('br'),
                            m('span','用于内部转账和法币交易确认')
                        ]),
                        m('button.button',{style:{float:'left',width:'15%',marginTop:'20px'}},'设置'),
                        m('div',{style:{clear:'both'}}),
                    ]),
                    m('div',{style:{height:'80px',width:'450px',border:'1px solid #ccc'}},[
                        m('img',{src:'zhanwei',style:{float:'left',width:'20%'}}),
                        m('div',{style:{float:'left',width:'50%'}},[
                            m('span','防钓鱼码'),
                            m('br'),
                            m('span','XXXX给您发送邮件内容将包含您设置的防钓鱼码')
                        ]),
                        m('button.button',{style:{float:'left',width:'15%',marginTop:'20px'}},'设置'),
                        m('div',{style:{clear:'both'}}),
                    ]),
                ]),
            ]),
            m('div',{style:{clear:'both'}}),
            m('div',{style:{margin:'15px 0',height:'70px',paddingTop:'10px',border:'1px solid #ccc'}},[
                m('img',{src:'zhanwei',style:{float:'left',width:'10%'}}),
                m('div',{style:{float:'left',width:'75%'}},[
                    m('span','登录密码'),
                    m('br'),
                    m('span','通过设置登录密码，您将可以使用账号和登录密码直接登录')
                ]),
                m('button.button',{style:{float:'left',width:'8%'}},'修改'),
                m('div',{style:{clear:'both'}}),
            ]),
            m('div',{style:{margin:'15px 0',height:'170px',paddingTop:'10px',border:'1px solid #ccc'}},[
                m('img',{src:'zhanwei',style:{float:'left',width:'10%'}}),
                m('div',{style:{float:'left',width:'75%'}},[
                    m('span','地址管理'),
                    m('br'),
                    m('span','地址管理能够让您记录您的提现地址信息。可选的白名单功能允许您通过启用白名单地址来保护您的资金。')
                ]),
                m('button.button',{style:{float:'left',width:'8%'}},'管理'),
                m('div',{style:{clear:'both'}}),
                m('span','开启提现白名单'),m("input[type=checkbox]"),
            ])
        ])
    }
}