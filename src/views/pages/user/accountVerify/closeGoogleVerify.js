// 关闭谷歌验证
const m = require('mithril');

module.exports = {
    oncreate: function () {

    },
    view: function () {
        return m('div.container.left', { style: { border: '1px solid blue', float: 'left' } }, [
            m('div', [
                m('img', { src: 'fanhui', style: { marginRight: '100px' } }),
                m('img', { src: 'GoogleIcon' }),
                m('span', '您正在关闭谷歌验证')
            ]),
            m('div', [
                m('img', 'marn'),
                m('span', '出于安全考虑，修改账户安全项之后，24h内禁止提币、内部转出与卖币操作')
            ]),
            m('div', [
                m('span', '邮箱验证码（123****@qq.com）'),
                m('br'),
                m('input', { style: { width: '300px', height: '35px', marginRight: '10px' } }),
                m('button.button.is-success.is-outlined', '获取验证码'),
                m('br'),
                m('span', '原谷歌验证码'),
                m('br'),
                m('input', { style: { width: '410px', height: '35px', marginRight: '10px' } }),
                m('br'),
                m('button.button.is-success.is-light', { style: { width: '410px' } }, '获取验证码')
            ])
        ]);
    }
};