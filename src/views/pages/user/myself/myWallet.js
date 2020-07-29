// 个人总览页面内模块>我的钱包
let m = require('mithril')

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.container.right.money.desc', [
            m('div.container.right.money.desc.left', { style: 'width：30%;float:left' }, [
                m('span', '资产总额'),
                m('br'),
                m('span', '0.00000000 BTC'),
                m('br'),
                m('span', '资产估值'),
                m('br'),
                m('span', '0.00000000')
            ]),
            m('div.container.right.money.desc.center', { style: 'width：30%;float:left' }, [
                m('span', '即刻充值，开启您的交易之旅~')
            ]),
            m('div.container.right.money.desc.right', { style: 'width：30%;float:left' }, [
                m('span', '我的钱包'),
                m('br'),
                m('span', '￥100.0000'),
                m('br'),
                m('span', '币币账户'),
                m('br'),
                m('span', '￥80.0000')
            ]),
            m('div', { style: { clear: 'both' } }),
        ])
    }
}