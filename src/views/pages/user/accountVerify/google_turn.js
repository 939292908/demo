//开启谷歌验证-下载app
const m = require('mithril')

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.container.left',{style:{border:'1px solid blue',float:'left'}},[
            m('div',[
                m('span','完成以下验证，开启谷歌验证')
            ]),
            m('div',[
                m('span','邮箱验证码（123****@qq.com）'),
                m('br'),
                m('input',{style:{width:'300px',height:'35px',marginRight:'10px'}}),
                m('button.button.is-success.is-outlined','获取验证码'),
                m('br'),
                m('span','谷歌验证码'),
                m('br'),
                m('input',{style:{width:'410px',height:'35px',marginRight:'10px'}}),
                m('br'),
                m('span',{style:'color:left'},'上一步'),
                m('button.button.is-success.is-light',{style:{width:'410px'}},'确认')
            ])
        ])
    }
}