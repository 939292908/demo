const m = require('mithril');
require('./index.scss');
const Data = require('./formData');
console.log(Data);

module.exports = {
    view: function () {
        return m('div.page-extract-coin-from has-bg-level-2', [
            m('div.form-block', [
                m('div.formModule', [
                    m('div.label has-text-title body-5', '币种'),
                    m('div.control has-icons-right', [
                        m('div.select is-fullwidth', m('select', [
                            m('option', { selected: true }, 'Country1'),
                            m('option', { selected: false }, 'Country2'),
                            m('option', { selected: false }, 'Country3')
                        ])),
                        m('span.icon is-small is-right', 'wefw')
                    ])
                ]),
                m('div.formModule', [
                    m('div.label has-text-title body-5', [
                        m('span', '标签'),
                        m('i.iconfont.icon-Personal')
                    ]),
                    m('div.control line-label', [
                        m('input.input body-5', { type: 'text', placeholder: 'Normal input', value: '121' })
                    ])
                ]),
                m('div.formModule', [
                    m('div.label has-text-title body-5', [
                        m('span', '链名称'),
                        m('i.iconfont.icon-Personal')
                    ]),
                    m('div.control dis-flex', [
                        m('div.butItem', m('div', 'JOGGUU')),
                        m('div.butItem butItemActive', m('div', 'JOGGUU')),
                        m('div.butItem', m('div', 'JOGGUU'))
                    ])
                ]),
                m('div.formModule', [
                    m('div.label has-text-title body-5', '提币地址'),
                    m('div.control address', [
                        m('input.input body-5', { type: 'text', placeholder: 'Normal input', value: '90909090' })
                    ]),
                    m('div.errorToTal body-4', '地址错误')
                ]),
                m('div.formModule', [
                    m('div.label has-text-title body-5', [
                        m('span', '数量'),
                        m('i')
                    ]),
                    m('div.control extract-num', [
                        m('input.input body-5', { type: 'number', placeholder: 'Normal input' })
                    ]),
                    m('div.dis-flex item-space charge body-4', [
                        m('div', `可提：0BTC`),
                        m('div', `手续费：0.001BTC`)
                    ]),
                    m('div.errorToTal body-4', '数量错误')
                ]),
                m('button.button is-info is-fullwidth', '确定')
            ]),
            m('div.promptText', [
                m('div.promptTitle body-5', '温馨提示'),
                Data.promptText.split('*').map(item => m('div.rulesText body-4', '*' + item))
            ])
        ]);
    }
};