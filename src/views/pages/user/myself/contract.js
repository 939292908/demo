// 个人总览页面内模块>合约账户
let m = require('mithril')

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div', [
            m('div.left',{style:{width:'70%'}}, [
                m('div.left.top', [
                    m('span','账户权益'),
                    m('img','xianshi'),
                    m('br'),
                    m('span','0.00000000 BTC ≈ ￥0.00000000')
                ]),
                m('div.left.bottom', [
                    m('div.left.bottom.left',{style:{width:'45%',float:'left'}}, [
                        m('span','保证金余额'),
                        m('br'),
                        m('span','0.00000000 BTC'),
                        m('br'),
                        m('span','≈ ￥0.00000000'),
                    ]),
                    m('div.left.bottom.right',{style:{width:'45%',float:'left'}}, [
                        m('span','未实现盈亏'),
                        m('br'),
                        m('span','0.00000000 BTC'),
                        m('br'),
                        m('span','≈ ￥0.00000000'),

                    ]),
                    m('div', { style: { clear: 'both' } }),
                ])
            ]),
            m('div.right',{style:{width:'25%'}}, [

            ])
        ])
    }
}