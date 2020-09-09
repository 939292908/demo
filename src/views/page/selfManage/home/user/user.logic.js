const m = require('mithril');
const img = require('./Image.png').default;
require('./user.scss');

module.exports = {
    view: function () {
        return m('div.self-manage-user dis-flex justify-between align-center', [
            m('div.userInfo dis-flex align-center', [
                m('.headPortrait', m('.imgBox', m('img', { src: img }))),
                m('.userMessage', [
                    m('.name', [
                        m('span', '188388908765'),
                        m('span', 'VIP8')
                    ]),
                    m('.user-uid', [
                        m('span', '123456789'),
                        m('i.iconfont icon-xiala')
                    ])
                ])
            ]),
            m('div.logInLog', [
                m('div', '上次登录时间 2020-07-13 17：14：42'),
                m('div', 'IP: 202.79.165.190')
            ])
        ]);
    }
};