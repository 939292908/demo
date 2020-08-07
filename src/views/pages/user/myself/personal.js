// 个人总览
const m = require('mithril')
let assetMenu = require('./assetMenu');

module.exports = {
    oncreate: function(){

    },
    view:function(){
        return m('div.container.right',{style:{float:'left'}},[
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
            m(assetMenu),
            m('div.container.right.invitation',[
                m('div.container.right.invitation.left',{style:{float:'left'}},[
                    m('span','邀请返佣'),
                    m('div',{style:{border:'1px solid #ccc',height:'100px'}},[
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
                m('div.container.right.invitation.right',{style:{float:'right',marginLeft:'10px'}},[
                    m('span','账户活动'),
                    m('div',{style:{border:'1px solid #ccc',height:'100px'}},[
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