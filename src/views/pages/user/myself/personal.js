// 个人总览
let m = require('mithril')

module.exports = {
    oncreate: function(){

    },
    view:function(){
        return m('div.container.right',{style:{border:'1px solid red',float:'left'}},[
            m('div.container.right.info',{style:{border:'1px solid red'}},[
                m('div.container.right.info.left',{style:{float:'left'}},[
                    m('img.pic',{src:'zhanwei'})
                ]),
                m('div.container.right.info.right',{style:{float:'left'}},[
                    m('div.container.right.info.right.tel','183****6505'),
                    m('div.container.right.info.right.UID','UID:1145987'),
                    m('div.container.right.info.right.time',
                        '上次登录时间 2020-07-13 17:14:42   IP：209.79.165.190'
                    )
                ]),
                m('div',{style:{clear:'both'}}),
            ]),
            m('div.container.right.verify',{style:{border:'1px solid red'}},[
                m('img.pic',{src:'zhanwei'}),
                m('img.pic',{src:'zhanwei'}),
                m('img.pic',{src:'zhanwei'}),
                m('img.pic',{src:'zhanwei'}),
                m('img.pic',{src:'zhanwei'}),
            ]),
            m('div.container.right.money',{style:{border:'1px solid red'}},[
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
            ]),
            m('div.container.right.invitation',[
                m('div.container.right.invitation.left',{style:{border:'1px solid orange',float:'left'}},[
                    m('span','邀请返佣'),
                    m('div',{style:{border:'1px solid blue'}},[
                        m('div','我的专属邀请链接'),
                        m('div','https://w.xx.cc/topi/invited/?invite_ code=ck8m3'),
                        m('div',[
                            m('div',{style:{float:'left',textAlign:'center'}},[
                                m('span','我的返佣比例'),
                                m('br'),
                                m('span','30%'),
                            ]),
                            m('div',{style:{float:'right',textAlign:'center'}},[
                                m('span','佣金BTC估值'),
                                m('br'),
                                m('span','0.0000 BTC'),
                            ]),
                        ])
                    ])
                ]),
                m('div.container.right.invitation.right',{style:{border:'1px solid orange',float:'right'}},[
                    m('span','账户活动'),
                    m('div',{style:{border:'1px solid blue'}},[
                        m('div',[
                            m('span',{style:{marginRight:'80px'}},'web'),
                            m('span','12.6.12.6')
                        ]),
                        m('div',[
                            m('span',{style:{marginRight:'40px'}},'Japan'),
                            m('span','2020-07-15 05:20:12')
                        ]),
                        m('div',[
                            m('span',{style:{marginRight:'70px'}},'phone'),
                            m('span','12.6.12.6')
                        ]),
                        m('div',[
                            m('span',{style:{marginRight:'20px'}},'shanghai'),
                            m('span','2020-07-15 05:20:12')
                        ])
                    ])
                ]),
            ])
        ])
    }
}