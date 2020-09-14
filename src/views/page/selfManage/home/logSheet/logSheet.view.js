const m = require('mithril');
const LogSheet = require('./logSheet.logic');
const l180n = require('@/languages/I18n').default;
require('./logSheet.scss');
module.exports = {
    oninit: function () {
        LogSheet.oninit();
    },
    view: function () { // self-manage-content-block 资产内的样式
        return m('.self-manage-content-block logSheet-block', [
            // block header
            m('.asset-header dis-flex justify-between align-center  py-3 px-5', [
                m('div.asset-title title-small has-text-level-1', [
                    m('span', l180n.$t('10216') /* '账户活动' */)
                ])
            ]),
            m('div.invitattion-qrcode-box pa-8', [
                LogSheet.logList.map((item, index) => index < 2 ? m('div.mb-7', [
                    m('div.logText body-4 has-text-level-4 dis-flex justify-between align-center mb-1', [
                        m('div', item.country || '--'),
                        m('div', item.ip || '--')
                    ]),
                    m('div.logAddress body-5 dis-flex justify-between align-center', [
                        m('div', item.regionName || '--'),
                        m('div', item.time || '--')
                    ])
                ]) : null)
            ])
        ]);
    }
};