const m = require('mithril');
const Block = require('../block');
require('./skip.scss');

const Skip = {
    list: [
        {
            leftVnode: {
                icon: 'iconfont icon-xiala',
                title: '账户安全',
                subhead: '帮助您提高账户的安全等级'
            },
            rightVnode: 'iconfont icon-xiala',
            urlTo: ''
        },
        {
            leftVnode: {
                icon: 'iconfont icon-xiala',
                title: '身份认证',
                subhead: '您的等级：未认证'
            },
            rightVnode: 'iconfont icon-xiala',
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
                Icon: m('i', { class: item.leftVnode.icon }),
                title: item.leftVnode.title,
                subhead: item.leftVnode.subhead,
                onclick: this.skipTo.bind(this, item)
            }, m('i', { class: item.rightVnode }))))
        ]);
    }
};