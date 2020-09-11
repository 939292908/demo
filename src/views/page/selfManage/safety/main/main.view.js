const m = require('mithril');
const Block = require('../../home/block');
// const mainLogic = require('./main.logic');
require('./main.scss');
module.exports = {
    handleToUrl: function (item) {
        window.router.push(item);
    },
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
                        m('div.has-text-primary', '未认证')
                    ]))),
                    m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-FundPassword'), title: '资金密码', subhead: '用于内部转账和法币交易确认' }, m('div.dis-flex', [
                        m('div.but py-1 px-4', '修改')
                    ]))),
                    m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-AntiFishing'), title: '防钓鱼码', subhead: 'XXXX给您发送邮件内容将包含您设置的防钓鱼码' }, m('div.dis-flex', [
                        m('div.but py-1 px-4', '修改')
                    ])))
                ])
            ]),
            m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-GoogleVerification'), title: '登录密码', subhead: '通过设置登录密码，您将可以使用账号和登录密码直接登录' }, m('div.dis-flex', [
                m('div', { class: 'but py-1 px-4' }, '修改')
            ]))),
            m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-GoogleVerification'), title: '提币地址管理', subhead: '地址管理能够让您记录您的提现地址信息。可选的白名单功能允许您通过启用白名单地址来保护您的资金。' }, m('div.dis-flex', [
                m('div', { class: 'but py-1 px-4' }, '管理')
            ]))),
            m('div', m(Block, { Icon: m('i.iconfont icon-GoogleVerification'), title: '设备管理', subhead: '这是文案这是文案' }, m('div.dis-flex', [
                m('div', { class: 'but py-1 px-4' }, '管理')
            ])))
        ]);
    }
};