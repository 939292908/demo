const m = require('mithril');
require('./index.scss');
const FromDataMode = require('./formData');
const ICON = require('./Tooltip.png').default;
const VerifyView = require('@/pages/components/dialogVerify');
// const VerifyView = require('@/pages/components/validate/validateView');

module.exports = {
    oninit () {
        FromDataMode.oninit();
    },
    handleSelectChange: function (e) {
        FromDataMode.currentSelect = FromDataMode.selectList[e.target.selectedIndex];
        FromDataMode.getlinkButtonListData();
    },
    handleLabelVal: function (e) {
        FromDataMode.extractCoin.linkName = e.target.value;
    },
    handleLinNameButClick: function (e) {
        FromDataMode.currenLinkBut = e.attr;
    },
    handleAddressVal: function (e) {
        FromDataMode.extractCoin.address = e.target.value;
    },
    handleExtractCoinNameVal: function (e) {
        FromDataMode.extractCoin.coinNum = e.target.value;
        if (e.target.value < FromDataMode.currentFees.withdrawMin || e.target.value > FromDataMode.currentExtractableNum) {
            FromDataMode.errorShow.unmber = true;
        } else {
            FromDataMode.errorShow.unmber = false;
        }
    },
    handleClickAll: function () {
        FromDataMode.extractCoin.coinNum = FromDataMode.currentExtractableNum;
        FromDataMode.errorShow.unmber = false;
    },
    handleCloseDialog: function () {
        FromDataMode.popUpData.show = false;
    },
    view: function () {
        return m('div.page-extract-coin-from has-bg-level-2', [
            m('div.form-block', [
                m('div.formModule', [
                    m('div.label has-text-title body-5', '币种'),
                    m('div.control', [
                        // { selected: true }
                        m('div.select is-fullwidth', m('select', { onchange: this.handleSelectChange }, [
                            FromDataMode.selectList && FromDataMode.selectList.map(item => m('option', item.wType))
                        ]))
                    ])
                ]),
                FromDataMode.currentSelect.Setting && FromDataMode.currentSelect.Setting.memo ? m('div.formModule', [
                    m('div.label has-text-title body-5', [
                        m('span', '标签'),
                        m('img', { src: ICON })
                    ]),
                    m('div.control line-label', [
                        m('input.input body-5', { type: 'text', placeholder: '1234562', onchange: this.handleLabelVal })
                    ])
                ]) : null,
                FromDataMode.linkButtonList.length > 0 ? m('div.formModule', [
                    m('div.label has-text-title body-5', [
                        m('span', '链名称'),
                        m('img', { src: ICON })
                    ]),
                    m('div.control dis-flex', [
                        FromDataMode.linkButtonList.map(item => m(`div.butItem`, { class: item.attr === FromDataMode.currenLinkBut ? 'butItemActive' : '', onclick: this.handleLinNameButClick.bind(this, item) }, m('div', item.name)))
                    ])
                ]) : null,
                m('div.formModule', [
                    m('div.label has-text-title body-5', '提币地址'),
                    m('div.control address', [
                        m('input.input body-5', { type: 'text', placeholder: '', onchange: this.handleAddressVal })
                    ]),
                    FromDataMode.errorShow.address ? m('div.errorToTal body-4', '地址错误') : null
                ]),
                m('div.formModule', [
                    m('div.label has-text-title body-5', [
                        m('span', '数量'),
                        m('img', { src: ICON })
                    ]),
                    m('div.control extract-num', [
                        m('input.input body-5', { type: 'number', placeholder: `最小提币量：${FromDataMode.currentFees.withdrawMin}`, onchange: this.handleExtractCoinNameVal, value: FromDataMode.extractCoin.coinNum }),
                        m('div.icon-right-all', [
                            m('span', FromDataMode.currentSelect.wType),
                            m('span.clickAll', { onclick: this.handleClickAll }, '全部')
                        ])
                    ]),
                    FromDataMode.errorShow.unmber ? m('div.errorToTal body-4', '数量错误') : null,
                    m('div.dis-flex item-space charge body-4', [
                        m('div', `可提：${FromDataMode.currentExtractableNum}${FromDataMode.currentSelect.wType}`),
                        m('div', `手续费：${FromDataMode.currentFees.withdrawFee}${FromDataMode.currentSelect.wType}`)
                    ])
                ]),
                m('button.button is-info is-fullwidth', { onclick: () => { FromDataMode.handleSubmit(); } }, '确定')
            ]),
            FromDataMode.popUpData.show ? m(VerifyView, { close: this.handleCloseDialog, ...FromDataMode.popUpData }) : null,
            m('div.promptText', [
                m('div.promptTitle body-5', '温馨提示'),
                FromDataMode.promptText.split('*').map(item => m('div.rulesText body-4', '*' + item))
            ])
        ]);
    }
};