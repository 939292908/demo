const m = require('mithril');
const Block = require('../../home/block');
const mainLogic = require('./main.logic');
const utils = require('@/util/utils').default;
const l180n = require('@/languages/I18n').default;

require('./main.scss');
module.exports = {
    oninit: function () {
        mainLogic.oninit();
    },
    handleToUrl: function (item) {
        if (!item) return window.$message({ title: l180n.$t('10410') /* '提示' */, content: l180n.$t('10594') /* 功能暂未开放，敬请期待 */, type: 'primary' });
        window.router.push(item);
    },
    view: function () {
        return m('div.safety-man theme--light', [
            m('div.liftingBox content-width dis-flex justify-between align-stretch', [
                m('div.leftBox', [
                    m('div', m(Block, { Icon: m('i.iconfont icon-GoogleVerification'), title: l180n.$t('10227') /* '谷歌验证' */, subhead: l180n.$t('10243') /* '用于提现和修改安全设置' */ }, m('div.dis-flex', [
                        mainLogic.user?.setting2fa?.google ? m('div.but py-1 px-4', { onclick: this.handleToUrl.bind(this, '/closeGoogleVerify') }, l180n.$t('10245') /* '解绑' */) : m('div.but py-1 px-4', { onclick: this.handleToUrl.bind(this, '/openGoogleVerify') }, l180n.$t('10231') /* '绑定' */)
                    ]))),
                    m('div.addPadding py-5', m(Block, { Icon: m('i.iconfont icon-PhoneVerification'), title: l180n.$t('10228') /* '手机验证' */, subhead: l180n.$t('10243') /* '用于提现和修改安全设置' */ }, m('div.dis-flex', [
                        mainLogic.user?.phone ? m('div.has-text-primary', utils.hideAccountNameInfo(mainLogic.user?.phone)) : m('div.but py-1 px-4', { onclick: this.handleToUrl.bind(this, '/bindPhone') }, l180n.$t('10231') /* '绑定' */)
                    ]))),
                    m('div', m(Block, { Icon: m('i.iconfont icon-Mailbox'), title: l180n.$t('10229') /* '邮箱验证' */, subhead: l180n.$t('10243') /* '用于提现和修改安全设置' */ }, m('div.dis-flex', [
                        mainLogic.user?.email ? m('div.has-text-primary', utils.hideAccountNameInfo(mainLogic.user?.email)) : m('div.but py-1 px-4', { onclick: this.handleToUrl.bind(this, '/bindEmail') }, l180n.$t('10231') /* '绑定' */)
                    ])))
                ]),
                m('div.rightBox', [
                    m('div.mb-5', m(Block, { Icon: m('i.iconfont icon-Authentication'), title: l180n.$t('10182') /* '身份认证' */, subhead: l180n.$t('10234') /* '完成认证获得更高提币额度' */ }, m('div.dis-flex', [
                        m('div.has-text-primary', mainLogic.user?.iStatus === 1 ? l180n.$t('10523') /* '确认中' */ : mainLogic.user?.iStatus === 2 ? l180n.$t('10223') /* '未认证' */ : mainLogic.user?.iStatus === 9 ? l180n.$t('10146') /* '已认证' */ : l180n.$t('10223') /* '未认证' */)
                    ]))),
                    m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-FundPassword'), title: l180n.$t('10128') /* '资金密码 */, subhead: l180n.$t('10235') /* '用于内部转账和法币交易确认 */ }, m('div.dis-flex', [
                        m('div.but py-1 px-4', { onclick: this.handleToUrl.bind(this, '') }, mainLogic.moneyPasswordIsExist ? l180n.$t('10239') /* '修改' */ : l180n.$t('10233')/* '设置' */)
                    ]))),
                    m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-AntiFishing'), title: l180n.$t('10232') /* '防钓鱼码' */, subhead: l180n.$t('10247', { value: 'XXX' }) /* 'XXXX给您发送邮件内容将包含您设置的防钓鱼码' */ }, m('div.dis-flex', [
                        m('div.but py-1 px-4', { onclick: this.handleToUrl.bind(this, '') }, mainLogic.user?.antiFishCode ? l180n.$t('10239') /* '修改' */ : l180n.$t('10233')/* '设置' */)
                    ])))
                ])
            ]),
            m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-FundPassword'), title: l180n.$t('10512') /* '登录密码' */, subhead: l180n.$t('10241') /* '通过设置登录密码，您将可以使用账号和登录密码直接登录' */ }, m('div.dis-flex', [
                m('div', { class: 'but py-1 px-4', onclick: this.handleToUrl.bind(this, '/modifyLoginPassword') }, l180n.$t('10239') /* '修改' */)
            ])))
            // m('div', { class: 'mb-5' }, m(Block, { Icon: m('i.iconfont icon-WithdrawalAddress'), title: l180n.$t('10269') /* '提币地址管理' */, subhead: '地址管理能够让您记录您的提现地址信息。可选的白名单功能允许您通过启用白名单地址来保护您的资金。' }, m('div.dis-flex', [
            //     m('div', { class: 'but py-1 px-4', onclick: this.handleToUrl.bind(this, '') }, l180n.$t('10240') /* '管理' */)
            // ]))),
            // m('div', m(Block, { Icon: m('i.iconfont icon-EquipmentManagement'), title: l180n.$t('10238') /* '设备管理' */, subhead: '这是文案这是文案' }, m('div.dis-flex', [
            //     m('div', { class: 'but py-1 px-4', onclick: this.handleToUrl.bind(this, '') }, l180n.$t('10240') /* '管理' */)
            // ])))
        ]);
    },
    onremove: function () {
        mainLogic.onremove();
    }
};