const m = require('mithril');
const Block = require('../block');
const l180n = require('@/languages/I18n').default;
require('./skip.scss');

const Skip = {
    list: [
        {
            leftVnode: {
                icon: 'iconfont icon-AccountSecurity',
                title: l180n.$t('10181') /* '账户安全' */,
                subhead: l180n.$t('10150') /* '帮助您提高账户的安全等级' */
            },
            rightVnode: 'iconfont icon-arrow-right',
            urlTo: '/securityManage'
        },
        {
            leftVnode: {
                icon: 'iconfont icon-Authentication1',
                title: l180n.$t('10182') /* '身份认证' */,
                subhead: l180n.$t('10222') /* '您的等级：' */+ l180n.$t('10223')/* '未认证：' */
            },
            rightVnode: 'iconfont icon-arrow-right',
            urlTo: ''
        }
    ]
};

module.exports = {
    skipTo: function (item) {
        if (!item.urlTo) return window.$message({ title: l180n.$t('10410') /* '提示' */, content: '功能暂未开放，敬请期待', type: 'primary' });
        window.router.push(item.urlTo);
    },
    view: function () {
        return m('.self-manage-skip content-width dis-flex justify-between align-center', [
            Skip.list.map(item => m('div.skip-item', { onclick: this.skipTo.bind(this, item) }, m(Block, {
                Icon: m('div.imgBox', m('i', { class: item.leftVnode.icon })),
                title: item.leftVnode.title,
                subhead: item.leftVnode.subhead
            }, m('i', { class: item.rightVnode }))))
        ]);
    }
};