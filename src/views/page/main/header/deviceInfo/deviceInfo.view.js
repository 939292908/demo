const m = require('mithril');
const config = require('@/config.js');
const deviceInfo = require('./deviceInfo.logic.js');
const apiLines = require('@/models/network/lines.js');

module.exports = {
    view: function() {
        return m('div', {}, [
            m('div.has-text-level-1.font-weight-bold.body-5.mb-7', {}, [
                m('p', {}, [
                    `${config.exchName} 基础信息检测`
                ]),
                m('p', {}, [
                    '(Basic information Monitoring)'
                ])
            ]),
            Object.keys(deviceInfo.info).map(item => {
                return m('div.has-text-level-1.font-weight-bold.body-5.mb-7', {}, [
                    m('p', {}, [
                        deviceInfo.info[item].name
                    ]),
                    m('p.has-text-level-2.font-weight-regular.body-4', {}, [
                        deviceInfo.info[item].value
                    ])
                ]);
            }),
            m('div.has-text-level-1.font-weight-bold.body-5.mb-7', {}, [
                m('p', {}, [
                    `Ws响应速度(Ws response speed)`
                ]),
                m('p.has-text-level-2.font-weight-regular.body-4', {}, [
                    apiLines.netLines.map((item, i) => {
                        return m('span.pr-5', {}, [
                            m('span.pr-2', {}, [
                                item.Name
                            ]),
                            m('span', {}, [
                                apiLines.wsResponseSpeed[i] + 'ms'
                            ])
                        ]);
                    })
                ])
            ]),
            m('div.has-text-level-1.font-weight-bold.body-5', {}, [
                m('p', {}, [
                    `Api响应速度(Api response speed)`
                ]),
                m('p.has-text-level-2.font-weight-regular.body-4', {}, [
                    apiLines.netLines.map((item, i) => {
                        return m('span.pr-5', {}, [
                            m('span.pr-2', {}, [
                                item.Name
                            ]),
                            m('span', {}, [
                                apiLines.apiResponseSpeed[i] + 'ms'
                            ])
                        ]);
                    })
                ])
            ])
        ]);
    }
};