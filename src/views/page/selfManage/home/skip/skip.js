const m = require('mithril');
const Block = require('../block');
const l180n = require('@/languages/I18n').default;
const broadcast = require('@/broadcast/broadcast');
const globalModels = require('@/models/globalModels');
require('./skip.scss');

module.exports = {
    name: 'skip',
    info: {},
    oninit: function () {
        this.getExtList(globalModels.getAccount());
        if (Object.keys(globalModels.getAccount()).length < 1) {
            broadcast.onMsg({
                key: this.name,
                cmd: broadcast.GET_USER_INFO_READY,
                cb: this.getExtList.bind(this)
            });
        }
    },
    getExtList: function (item) {
        this.info = item;
    },
    skipTo: function (item) {
        if (!item.urlTo) return window.$message({ title: l180n.$t('10410') /* '提示' */, content: l180n.$t('10594') /* 功能暂未开放，敬请期待 */, type: 'primary' });
        window.router.push(item.urlTo);
    },
    view: function () {
        return m('.self-manage-skip content-width dis-flex justify-between align-center', [
            m('div.skip-item', { onclick: this.skipTo.bind(this, '/securityManage') }, m(Block, {
                Icon: m('div.imgBox', m('i.iconfont icon-AccountSecurity')),
                title: l180n.$t('10181') /* '账户安全' */,
                subhead: l180n.$t('10150') /* '帮助您提高账户的安全等级' */
            }, m('i.iconfont icon-arrow-right'))),
            // 二期扩展
            m('div.skip-item', { onclick: this.skipTo.bind(this, '/') }, m(Block, {
                Icon: m('div.imgBox', m('i.iconfont icon-Authentication1')),
                title: l180n.$t('10182') /* '身份认证' */,
                subhead: `${l180n.$t('10222') /* '您的等级：' */} ${this.info?.iStatus === 1 ? l180n.$t('10523') /* '确认中' */ : this.info?.iStatus === 2 ? l180n.$t('10223') /* '未认证' */ : this.info?.iStatus === 9 ? l180n.$t('10146') /* '已认证' */ : l180n.$t('10223') /* '未认证' */}`
            }, m('i.iconfont icon-arrow-right')))
        ]);
    },
    onremove: function () {
        broadcast.offMsg({
            key: this.name,
            cmd: broadcast.GET_USER_INFO_READY,
            isall: true
        });
    }
};