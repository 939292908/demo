// 个人总览页面内模块>币币账户
let m = require('mithril')

module.exports = { 
    oncreate: function(){

    },
    view:function(){
        return m('div.container.right.money',{style:{border:'1px solid red'}},[
            m('span.container.right.money.tit','资产总览'),
            m('div.container.right.money.nav',[
                m('ul',[
                    m('li',{style:'float:left;margin-left:15px;'},'资产总览'),
                    m('li',{style:'float:left;margin-left:15px;'},'我的钱包'),
                    m('li',{style:'float:left;margin-left:15px;'},'合约账户'),
                    m('li',{style:'float:left;margin-left:15px;'},'币币账户'),
                    m('li',{style:'float:left;margin-left:15px;'},'法币账户'),
                    m('div',{style:{clear:'both'}}),
                ])
            ]),
            m('div.container.right.money.desc',[
                m('div.container.right.money.desc.left',{style:'width：30%;float:left'},[
                    m('span','资产总额'),
                    m('br'),
                    m('span','0.00000000 BTC'),
                    m('br'),
                    m('span','资产估值'),
                    m('br'),
                    m('span','0.00000000')
                ]),
                m('div.container.right.money.desc.center',{style:'width：30%;float:left'},[
                    m('span','即刻充值，开启您的交易之旅~')
                ]),
                m('div.container.right.money.desc.right',{style:'width：30%;float:left'},[
                    m('span','我的钱包'),
                    m('br'),
                    m('span','￥100.0000'),
                    m('br'),
                    m('span','币币账户'),
                    m('br'),
                    m('span','￥80.0000')
                ])
            ]),
            m('div',{style:{clear:'both'}}),
        ])
    }
}