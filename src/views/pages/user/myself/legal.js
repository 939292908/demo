// 个人总览页面内模块>法币账户
let m = require('mithril')

module.exports = { 
    oncreate: function(){

    },
    view:function(){
        return m('div', [
            m('div', { style: 'float:left' }, [
                m('span', '资产总额'),
                m('br'),
                m('span', '0.00000000 BTC'),
                m('br'),
                m('span', '资产估值'),
                m('br'),
                m('span', '0.00000000')
            ]),
            m('div', { style: 'float:left' }, [
                m('button.button', '买'),
                m('button.button', '卖'),
                m('button.button', '划转')
            ]),
            m('div', { style: 'float:left' }, [
            ]),
            m('div', { style: { clear: 'both' } }),
        ])
    }
}