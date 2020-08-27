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
                    m('div.control', [
                        m('div.select is-fullwidth', m('select', [
                            m('option', { selected: true }, 'Country1'),
                            m('option', { selected: false }, 'Country2'),
                            m('option', { selected: false }, 'Country3')
                        ]))
                    ])
                ]),
                m('div.formModule', [
                    m('div.label has-text-title body-5', [
                        m('span', '标签'),
                        m('i')
                    ]),
                    m('div.control', [
                        m('input.input', { type: 'text', placeholder: 'Normal input' })
                    ])
                ]),
                m('div.formModule', [
                    m('div.label has-text-title body-5', [
                        m('span', '链名称'),
                        m('i')
                    ]),
                    m('div.control', [
                        m('button.button', 'JOGGUU'),
                        m('button.button is-info', 'JOGGUU'),
                        m('button.button', 'JOGGUU')
                    ])
                ]),
                m('div.formModule', [
                    m('div.label has-text-title body-5', '提币地址'),
                    m('div.control', [
                        m('input.input', { type: 'text', placeholder: 'Normal input' })
                    ])
                ]),
                m('div.formModule', [
                    m('div.label has-text-title body-5', [
                        m('span', '数量'),
                        m('i')
                    ]),
                    m('div.control', [
                        m('input.input', { type: 'text', placeholder: 'Normal input' })
                    ]),
                    m('div', [
                        m('div', `可提：0BTC`),
                        m('div', `手续费：0.001BTC`)
                    ])
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