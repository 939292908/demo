const m = require('mithril');
const I18n = require('@/languages/I18n').default;
const Header = require('@/views/components/indexHeader/indexHeader.view');
const APIManager = require('./apiManager.model');
require('./apiManager.scss');
module.exports = {
    view() {
        const tableBody = [];
        for (const item of APIManager.table) {
            tableBody.push(
                m('tr', {}, [
                    m('th.py-4.body-4.font-weight-medium', {}, [item.mark]),
                    m('th.py-4.body-4.font-weight-medium', {}, [item.auth]),
                    m('th.py-4.body-4.font-weight-medium', {}, [item.key]),
                    m('th.py-4.body-4.font-weight-medium', {}, [item.ip]),
                    m('th.py-4.body-4.font-weight-medium', {}, [item.time]),
                    m('th.py-4.body-4.font-weight-medium.has-text-right', {}, [
                        m('a.has-text-primary', {}, [I18n.$t('10272')/* 删除 */])
                    ])
                ])
            );
        }
        return m('div.theme--light.page-user-api-manager', {}, [
            m('div.has-bg-sub-level-1.header-bg', {}, [
                m(Header, {
                    highlightFlag: 3,
                    navList: [
                        { to: '/', title: I18n.$t('10051')/* '个人总览' */ },
                        { to: '/', title: I18n.$t('10181')/* '账户安全' */ },
                        { to: '/', title: I18n.$t('10182')/* '身份认证' */ },
                        { to: '/', title: I18n.$t('10183')/* 'API管理' */ },
                        { to: '/', title: I18n.$t('10184')/* '邀请返佣' */ }
                    ]
                }),
                m('div.is-align-items-center', {}, [
                    m('div.mt-8.has-text-white.title-small.content-width', {}, [I18n.$t('10183')/* 'API管理' */])
                ]),
                m('div.is-align-items-center', {}, [
                    m('div.mt-3.has-text-level-4.body-4.content-width', {},
                        [I18n.$t('10322')/* '本平台为您提供了强大的API，您可以通过 API 使用行情查询、自动交易等服务。通过 API文档 查看 如何使用。' */]
                    )
                ])
            ]),
            m('div.has-bg-level-1.pb-8', {}, [
                m('div.content-width.content-bg.has-bg-level-2.border-radius-medium.columns.pa-8.content-center', {}, [
                    m('div.column.body-5.has-text-level-1', {}, [
                        m('div.mb-2', {}, [I18n.$t('10092')/* '备注' */]),
                        m('input.input.mb-5', {}),
                        m('div.mb-2', {}, [I18n.$t('10318')/* '权限设置' */]),
                        m('i.iconfont.mr-7.iconfont-medium.checkbox-label', {
                            class: APIManager.onlyRead ? 'icon-u_check-square' : 'icon-Unselected',
                            onclick() { APIManager.onlyRead = !APIManager.onlyRead; }
                        }, [
                            m('span.ml-1.body-4.checkbox-text', {}, [I18n.$t('10319')/* 只读 */])
                        ]),
                        m('i.iconfont.iconfont-medium.checkbox-label', {
                            class: APIManager.canTrade ? 'icon-u_check-square' : 'icon-Unselected',
                            onclick() { APIManager.canTrade = !APIManager.canTrade; }
                        }, [
                            m('span.ml-1.body-4.checkbox-text', {}, [I18n.$t('10320')/* 交易 */])
                        ]),
                        m('div.mb-2.mt-5', {}, [I18n.$t('10321')/* '绑定的IP地址/IP段（选填）' */]),
                        m('div.control.mb-7', {}, [
                            m('textarea.textarea.has-fixed-size', {}, [])
                        ]),
                        m("button.button.has-bg-primary.button-large.is-fullwidth.has-text-white", {}, [
                            I18n.$t('10337') // '确定'
                        ])
                    ]),
                    m('div.column.is-2', {}, []),
                    m('div.column.has-text-level-4.body-4.tips-line-height', {}, [
                        m('div.body-5.mb-2', {}, [I18n.$t('10082')/* '温馨提示' */]),
                        m('div', {},
                            ['* ' + I18n.$t('10322')/* '本平台为您提供了强大的API，您可以通过 API 使用行情查询、自动交易等服务。通过 API文档 查看如何使用。' */]
                        ),
                        m('div', {},
                            ['* ' + I18n.$t('10323')/* '每个用户最多创建10组APIKEY' */]
                        ),
                        m('div', {},
                            ['* ' + I18n.$t('10324') +/* '请不要泄露您的APIKEY，以免造成资产损失。出于安全考虑，建议为APIKEY绑定IP，每个APIKEY最多绑定20个IP地址或IP段。单个IP地址或IP段直接填写，多个IP地址或IP段用半角逗号分隔，如：' */
                            '192.168.1.1,192.168.1.2,192.168.0.1/24'
                            ]
                        )
                    ]),
                    m('div.column.is-1', {}, [])
                ]),
                m('div.content-width.has-bg-level-2.border-radius-medium.content-center.mt-5.content-bg', {}, [
                    m('div.mx-5.py-3.title-small', {}, [I18n.$t('10325')/* 我的APIKEY */]),
                    m('hr.ma-0'),
                    m('div.mx-5.my-3', {}, [
                        m('table.w100', {}, [
                            m('thead', {}, [
                                m('tr', {}, [
                                    m('th.body-4.has-text-level-4.font-weight-medium.tips-line-height', {}, [I18n.$t('10092')/* '备注' */]),
                                    m('th.body-4.has-text-level-4.font-weight-medium.tips-line-height', {}, [I18n.$t('10326')/* '权限' */]),
                                    m('th.body-4.has-text-level-4.font-weight-medium.tips-line-height', {}, [I18n.$t('10327')/* '访问密钥' */]),
                                    m('th.body-4.has-text-level-4.font-weight-medium.tips-line-height', {}, [I18n.$t('10328')/* '绑定IP地址' */]),
                                    m('th.body-4.has-text-level-4.font-weight-medium.tips-line-height', {}, [I18n.$t('10091')/* '时间' */]),
                                    m('th.body-4.has-text-level-4.font-weight-medium.tips-line-height.has-text-right', {}, [I18n.$t('10068')/* '操作' */])
                                ])
                            ]),
                            m('tbody', {}, tableBody)
                        ])
                    ])
                ])
            ])
        ]);
    }
};