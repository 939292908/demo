const m = require('mithril');
const Block = require('../../home/block');
const mainLogic = require('./main.logic');
require('./main.scss');
module.exports = {
    view: function () {
        return m('div.safety-man', [
            m('div.liftingBox dis-flex justify-between align-stretch', [
                m('div.leftBox', [
                    m('div', m(Block, {
                        Icon: m('img', ''),
                        title: '谷歌验证',
                        subhead: '用于提现和修改安全设置'
                    }, m('div.dis-flex', [
                        m('div', '关闭'), m('div', '解绑')
                    ]))),
                    m('div.', m(Block, {
                        Icon: m('img', ''),
                        title: '手机验证',
                        subhead: '用于提现和修改安全设置'
                    }, m('div.dis-flex', [
                        m('div', '关闭'), m('div', '解绑')
                    ]))),
                    m('div', m(Block, {
                        Icon: m('img', ''),
                        title: '邮箱验证',
                        subhead: '用于提现和修改安全设置'
                    }, m('div.dis-flex', [
                        m('div', '关闭'), m('div', '解绑')
                    ])))
                ]),
                m('div.rightBox', [
                    m('div.mb-5', m(Block, {
                        Icon: m('img', ''),
                        title: '身份认证',
                        subhead: '完成认证获得更高提币额度'
                    }, m('div.dis-flex', [
                        m('div', '关闭'), m('div', '解绑')
                    ]))),
                    [1, 2].map((item, index) => m('div', { class: index < 1 ? 'mb-5' : '' }, m(Block, {
                        Icon: m('img', ''),
                        title: '邮箱验证',
                        subhead: '用于提现和修改安全设置'
                    }, m('div.dis-flex', [
                        m('div', '关闭'), m('div', '解绑')
                    ]))))
                ])
            ]),
            mainLogic.BCData.map((item, index) => m('div', { class: index < 2 ? 'mb-5' : '' }, m(Block, {
                Icon: m('img', ''),
                title: item.title,
                subhead: item.subhead
            }, m('div.dis-flex', [
                item.buts.map(but => m('div', but))
            ]))))
        ]);
    }
};