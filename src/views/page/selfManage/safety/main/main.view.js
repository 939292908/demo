const m = require('mithril');
const Block = require('../../home/block');
// const mainLogic = require('./main.logic');
require('./main.scss');
module.exports = {
    view: function () {
        return m('div.safety-man', [
            m('div.liftingBox content-width dis-flex justify-between align-stretch', [
                m('div.leftBox', [
                    m('div', m(Block, { Icon: m('i.iconfont icon-GoogleVerification'), title: '谷歌验证', subhead: '用于提现和修改安全设置' }, m('div.dis-flex', [
                        m('div.but py-1 px-4', '开启')
                    ]))),
                    m('div.addPadding py-5', m(Block, { Icon: m('i.iconfont icon-PhoneVerification'), title: '手机验证', subhead: '用于提现和修改安全设置' }, m('div.dis-flex', [
                        m('div.but py-1 px-4', '开启')
                    ]))),
                    m('div', m(Block, { Icon: m('i.iconfont icon-Mailbox'), title: '邮箱验证', subhead: '用于提现和修改安全设置' }, m('div.dis-flex', [
                        m('div.but py-1 px-4', '开启')
                    ])))
                ]),
                m('div.rightBox', [
                    m('div.mb-5', m(Block, { Icon: m('i.iconfont icon-Authentication'), title: '身份认证', subhead: '完成认证获得更高提币额度' }, m('div.dis-flex', [
                        m('div', '关闭')
                    ]))),
                    m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-FundPassword'), title: '资金密码', subhead: '用于内部转账和法币交易确认' }, m('div.dis-flex', [
                        m('div.but py-1 px-4', '修改')
                    ]))),
                    m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-AntiFishing'), title: '防钓鱼码', subhead: 'XXXX给您发送邮件内容将包含您设置的防钓鱼码' }, m('div.dis-flex', [
                        m('div.but py-1 px-4', '修改')
                    ])))
                ])
            ]),
            m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-GoogleVerification'), title: '', subhead: '' }, m('div.dis-flex', [
                m('div', { class: 'but py-1 px-4' }, 'buy')
            ]))),
            m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-GoogleVerification'), title: '', subhead: '' }, m('div.dis-flex', [
                m('div', { class: 'but py-1 px-4' }, 'buy')
            ]))),
            m('div', m(Block, { Icon: m('i.iconfont icon-GoogleVerification'), title: '', subhead: '' }, m('div.dis-flex', [
                m('div', { class: 'but py-1 px-4' }, 'buy')
            ])))
        ]);
    }
};