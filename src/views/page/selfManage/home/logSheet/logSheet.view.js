const m = require('mithril');
require('./logSheet.scss');
module.exports = {
    view: function () { // self-manage-content-block 资产内的样式
        return m('.self-manage-content-block logSheet-block', [
            // block header
            m('.asset-header dis-flex justify-between align-center', [
                m('div.asset-title', [
                    m('span', '账户活动')
                ])
            ]),
            m('div.invitattion-qrcode-box pa-8', [
                m('div.mb-7', [
                    m('div.logText dis-flex justify-between align-center mb-1', [
                        m('div', 'web'),
                        m('div', 'web')
                    ]),
                    m('div.logAddress dis-flex justify-between align-center', [
                        m('div', 'Japan'),
                        m('div', '2020-07-15 05:20:12')
                    ])
                ])
            ])
        ]);
    }
};