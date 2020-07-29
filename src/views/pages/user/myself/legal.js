// 个人总览页面内模块>法币账户
let m = require('mithril')

module.exports = { 
    oncreate: function(){

    },
    view:function(){
        return m('div', [
            m('div', { style: 'width：30%;float:left' }, [
                m('span', '资产总额'),
                m('br'),
                m('span', '0.00000000 BTC'),
                m('br'),
                m('span', '资产估值'),
                m('br'),
                m('span', '0.00000000')
            ]),
            m('div', { style: 'width：30%;float:left' }, [
                m('button.button', '买'),
                m('button.button', '卖'),
                m('button.button', '划转')
            ]),
            m('div', { style: 'width：30%;float:left' }, [
                m('span', '我的钱包'),
                m('br'),
                m('span', '￥100.0000'),
                m('br'),
                m('span', '币币账户'),
                m('br'),
                m('span', '￥80.0000')
            ])
        ])
    }
}