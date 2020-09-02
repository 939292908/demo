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
            m('div.has-text-level-1.font-weight-bold.body-5.mb-7', {}, [
                m('p', {}, [
                    `设备信息(userAgent)`
                ]),
                m('p.has-text-level-2.font-weight-regular.body-4', {}, [
                    deviceInfo.deviceInfo.userAgent
                ])
            ]),
            m('div.has-text-level-1.font-weight-bold.body-5.mb-7', {}, [
                m('p', {}, [
                    `操作系统(Platform)`
                ]),
                m('p.has-text-level-2.font-weight-regular.body-4', {}, [
                    '(Basic information Monitoring)'
                ])
            ]),
            m('div.has-text-level-1.font-weight-bold.body-5.mb-7', {}, [
                m('p', {}, [
                    `浏览器语言(Language)`
                ]),
                m('p.has-text-level-2.font-weight-regular.body-4', {}, [
                    deviceInfo.deviceInfo.language
                ])
            ]),
            m('div.has-text-level-1.font-weight-bold.body-5.mb-7', {}, [
                m('p', {}, [
                    `使用浏览器(Explore)`
                ]),
                m('p.has-text-level-2.font-weight-regular.body-4', {}, [
                    '(Basic information Monitoring)'
                ])
            ]),
            m('div.has-text-level-1.font-weight-bold.body-5.mb-7', {}, [
                m('p', {}, [
                    `用户IP(IP)`
                ]),
                m('p.has-text-level-2.font-weight-regular.body-4', {}, [
                    '(Basic information Monitoring)'
                ])
            ]),
            m('div.has-text-level-1.font-weight-bold.body-5.mb-7', {}, [
                m('p', {}, [
                    `用户所在地(Location)`
                ]),
                m('p.has-text-level-2.font-weight-regular.body-4', {}, [
                    deviceInfo.deviceInfo.location
                ])
            ]),
            m('div.has-text-level-1.font-weight-bold.body-5.mb-7', {}, [
                m('p', {}, [
                    `网络运营商(ISP)`
                ]),
                m('p.has-text-level-2.font-weight-regular.body-4', {}, [
                    '(Basic information Monitoring)'
                ])
            ]),
            m('div.has-text-level-1.font-weight-bold.body-5', {}, [
                m('p', {}, [
                    `Api响应速度(Api response speed)`
                ]),
                m('p.has-text-level-2.font-weight-regular.body-4', {}, [
                    apiLines.netLines.map((item, i) => {
                        return m('a', {
                            class: `navbar-item columns has-text-primary-hover min-width-200 ma-0 px-6 py-4 body-5 ${item.Id === apiLines.activeLine.Id ? 'is-active' : ''}`,
                            onclick: function() {
                                apiLines.setLinesActive(item.Id);
                            }
                        }, [
                            m('span.column.pr-8', {}, [
                                item.Name
                            ]),
                            m('span.column.has-text-left', {}, [
                                '延迟 ' + apiLines.apiResponseSpeed[i] + 'ms'
                            ])
                        ]);
                    })
                ])
            ])
        ]);
    }
};