const m = require('mithril');
const Block = require('../block');
const safety30 = require('./Authentication.svg').default;
const attestation30 = require('./AccountSecurity.svg').default;
const { Conf } = require('@/api');
require('./skip.scss');

const safety = {
    30: safety30
};
const attestation = {
    30: attestation30
};

const Skip = {
    list: [
        {
            leftVnode: {
                icon: safety[Conf.exchId],
                title: '账户安全',
                subhead: '帮助您提高账户的安全等级'
            },
            rightVnode: 'iconfont icon-arrow-right',
            urlTo: ''
        },
        {
            leftVnode: {
                icon: attestation[Conf.exchId],
                title: '身份认证',
                subhead: '您的等级：未认证'
            },
            rightVnode: 'iconfont icon-arrow-right',
            urlTo: ''
        }
    ]
};

module.exports = {
    skipTo: function (e) {
        console.log(e);
    },
    view: function () {
        return m('.self-manage-skip content-width dis-flex justify-between align-center', [
            Skip.list.map(item => m('div.skip-item', m(Block, {
                Icon: m('img', { src: item.leftVnode.icon }),
                title: item.leftVnode.title,
                subhead: item.leftVnode.subhead,
                onclick: this.skipTo.bind(this, item)
            }, m('i', { class: item.rightVnode }))))
        ]);
    }
};