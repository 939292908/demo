const m = require('mithril');
const I18n = require('@/languages/I18n').default;
const Header = require('@/views/components/indexHeader/indexHeader.view');
const APIManager = require('./apiManager.model');
const config = require('@/config.js');
const VerifyView = require('@/views/components/dialogVerify/dialogVerify.view');
const Modal = require('@/views/components/common/Modal');
const regExp = require('@/models/validate/regExp');
const Loading = require('@/views/components/loading/loading.view');
const Tooltip = require('@/views/components/common/Tooltip/Tooltip.view');
const utils = require('@/util/utils').default;
require('./apiManager.scss');
module.exports = {
    oninit() { APIManager.oninit(); },
    onremove() { APIManager.onremove(); },
    view() {
        const tableBody = [];
        for (const item of APIManager.table) {
            tableBody.push(
                m('div.columns.is-variable.is-3', {}, [
                    m('div.column.is-1.py-4.body-4.font-weight-medium', {}, [item.name]),
                    m('div.column.is-2.py-4.body-4.font-weight-medium', {}, [APIManager.getAuth(item.role)]),
                    m('div.column.is-3.py-4.body-4.font-weight-medium', {}, [item.k]),
                    m('div.column.is-3.py-4.body-4.font-weight-medium', {}, [
                        m(Tooltip, {
                            label: m('div.ip-content.w100', {}, [item.cidr || '--']),
                            content: item.cidr.length > 40 ? item.cidr : '',
                            class: 'w100 break-word',
                            width: '300px'
                        })
                    ]),
                    m('div.column.is-2.py-4.body-4.font-weight-medium', {}, [utils.formatDate(new Date(item.ctime * 1000))]),
                    m('div.column.is-1.py-4.body-4.font-weight-medium.has-text-right', {}, [
                        m('a.has-text-primary.cursor-pointer', {
                            onclick() { APIManager.delete(item.k); }
                        }, [I18n.$t('10272')/* 删除 */])
                    ])
                ])
            );
        }
        return m('div.theme--light.page-user-api-manager', {}, [
            m('div.has-bg-sub-level-1.header-bg', {}, [
                m(Header, {
                    highlightFlag: 2,
                    navList: [
                        { to: '/selfManage', title: I18n.$t('10051') } /* 个人总览 */,
                        { to: '/securityManage', title: I18n.$t('10181') } /* 账户安全 */,
                        // { to: '/selfManage', title: I18n.$t('10182') } /* 身份认证 */,
                        { to: '/apiManager', title: I18n.$t('10183') } /* API管理 */
                        // { to: '/selfManage', title: I18n.$t('10184') } /* 邀请返佣 */
                    ]
                }),
                m('div.is-align-items-center', {}, [
                    m('div.mt-8.has-text-white.title-small.content-width', {}, [I18n.$t('10183')/* 'API管理' */])
                ]),
                m('div.is-align-items-center', {}, [
                    m('div.mt-3.has-text-level-4.body-4.content-width', {},
                        I18n.$ft('10322')// '本平台为您提供了强大的API，您可以通过 API 使用行情查询、自动交易等服务。通过 API文档 查看 如何使用。'
                    )
                ])
            ]),
            m('div.has-bg-level-1.pb-8', {}, [
                m('div.content-width.has-bg-level-2.border-radius-medium.content-center.content-bg', {}, [
                    m('div.mx-5.py-3.title-small', {}, [I18n.$t('10614')/* '创建API' */]),
                    m('hr.ma-0'),
                    m('div.columns.pa-8', {}, [
                        m('div.column.body-5.has-text-level-1', {}, [
                            m('div.mb-2', {}, [I18n.$t('10092')/* '备注' */]),
                            m('input.input', {
                                oninput(e) {
                                    APIManager.keyName = e.target.value;
                                    APIManager.showKeyNameValid = true;
                                },
                                onblur() {
                                    APIManager.showKeyNameValid = true;
                                },
                                value: APIManager.keyName
                            }),
                            m('div.body-3.has-text-tip-error', { hidden: !APIManager.showKeyNameValid }, [regExp.validAPIKeyName(APIManager.keyName) || APIManager.hasSame()]),
                            m('div.mb-2.mt-5', {}, [I18n.$t('10318')/* '权限设置' */]),
                            m('i.iconfont.mr-7.iconfont-medium.cursor-pointer', {
                                disabled: true,
                                class: APIManager.onlyRead ? 'icon-u_check-square has-text-primary' : 'icon-Unselected'
                                // onclick() { APIManager.onlyRead = !APIManager.onlyRead; }
                            }, [
                                m('span.ml-1.body-4.checkbox-text.not-select', {}, [I18n.$t('10319')/* 只读 */])
                            ]),
                            m('i.iconfont.iconfont-medium.cursor-pointer', {
                                class: APIManager.canTrade ? 'icon-u_check-square has-text-primary' : 'icon-Unselected',
                                onclick() { APIManager.canTrade = !APIManager.canTrade; }
                            }, [
                                m('span.ml-1.body-4.checkbox-text.not-select', {}, [I18n.$t('10320')/* 交易 */])
                            ]),
                            m('div.mb-2.mt-5', {}, [I18n.$t('10321')/* '绑定的IP地址/IP段（选填）' */]),
                            m('div.control', {}, [
                                m('textarea.textarea.has-fixed-size', {
                                    oninput(e) { APIManager.ip = e.target.value; },
                                    value: APIManager.ip
                                }, [])
                            ]),
                            m('div.body-3.has-text-tip-error', {}, [regExp.validAPIIP(APIManager.ip) || APIManager.has20IP()]),
                            m("button.button.has-bg-primary.button-large.is-fullwidth.has-text-white.mt-7", {
                                onclick() { APIManager.submit(); },
                                disabled: regExp.validAPIIP(APIManager.ip) || regExp.validAPIKeyName(APIManager.keyName) || APIManager.hasSame() || APIManager.has20IP()
                            }, [I18n.$t('10337')/* '确定' */])
                        ]),
                        m('div.column.is-2', {}, []),
                        m('div.column.has-text-level-4.body-4.tips-line-height.pr-8', {}, [
                            m('div.body-5.mb-2', {}, [I18n.$t('10082')/* '温馨提示' */]),
                            m('div', {},
                                ['* '].concat(
                                    // '本平台为您提供了强大的API，您可以通过 API 使用行情查询、自动交易等服务。通过 API文档 查看如何使用。'
                                    I18n.$ft('10322', [{
                                        class: 'cursor-pointer has-text-primary',
                                        onclick() {
                                            window.open('https://github.com/vbit-lab/api-doc');
                                        }
                                    }])
                                )
                            ),
                            m('div', {},
                                ['* ' + I18n.$t('10323', { value: 5 })/* '每个用户最多创建5组APIKEY' */]
                            ),
                            m('div', {},
                                ['* ' + I18n.$t('10324') +/* '请不要泄露您的APIKEY，以免造成资产损失。出于安全考虑，建议为APIKEY绑定IP，每个APIKEY最多绑定20个IP地址或IP段。单个IP地址或IP段直接填写，多个IP地址或IP段用半角逗号分隔，如：' */
                                    '192.168.1.1,192.168.1.2,192.168.0.1/24'
                                ]
                            )
                        ])
                    ])
                ]),
                m('div.content-width.has-bg-level-2.border-radius-medium.content-center.mt-5.content-bg', {}, [
                    m('div.mx-5.py-3.title-small', {}, [I18n.$t('10325')/* 我的APIKEY */]),
                    m('hr.ma-0'),
                    APIManager.loading ? m('div.is-align-items-center.py-8', {}, [m(Loading)])
                        : tableBody.length
                            ? m('div.mx-5.my-3', {}, [
                                m('div.columns.is-variable.is-3', {}, [
                                    m('div.column.is-1.body-4.has-text-level-4.font-weight-medium.tips-line-height', {}, [I18n.$t('10092')/* '备注' */]),
                                    m('div.column.is-2.body-4.has-text-level-4.font-weight-medium.tips-line-height', {}, [I18n.$t('10326')/* '权限' */]),
                                    m('div.column.is-3.body-4.has-text-level-4.font-weight-medium.tips-line-height', {}, [I18n.$t('10327')/* '访问密钥' */]),
                                    m('div.column.is-3.body-4.has-text-level-4.font-weight-medium.tips-line-height', {}, [I18n.$t('10328')/* '绑定IP地址' */]),
                                    m('div.column.is-2.body-4.has-text-level-4.font-weight-medium.tips-line-height', {}, [I18n.$t('10091')/* '时间' */]),
                                    m('div.column.is-1.body-4.has-text-level-4.font-weight-medium.tips-line-height.has-text-right', {}, [I18n.$t('10068')/* '操作' */])
                                ]),
                                tableBody
                            ])
                            : m('div', {}, [
                                m('div.is-align-items-center.mt-8.nodata-icon', {}, [
                                    m('div.has-bg-level-1.mb-3.is-align-items-center', {}, [
                                        m('img', { src: require(`@/assets/img/myAssets/noneData.svg`).default })
                                    ])
                                ]),
                                m('div.is-align-items-center.pb-8', {}, [
                                    m('div.has-text-level-4', {}, I18n.$t('10515')/* '暂无数据' */)
                                ])]
                            )
                ])
            ]),
            APIManager.showValid ? m(VerifyView, {
                close: () => {
                    APIManager.showValid = false;
                },
                isHandleVerify: true,
                title: {
                    logo: config.exchName,
                    text: I18n.$t('10113')/* "安全验证" */
                }
            }) : null,
            m(Modal, {
                isShow: APIManager.showBindEmail, // 弹框显示/隐藏
                onClose() {
                    window.router.go(-1);
                },
                slot: {
                    header: I18n.$t('10082'), // '温馨提示',
                    body: I18n.$t('10617'), // '为了正常使用API功能，请先绑定邮箱',
                    footer: m("button.button.is-primary.font-size-2.has-text-white.modal-default-btn.button-large", {
                        onclick() {
                            window.router.push({ path: '/bind', data: { type: 'email' } });
                        }
                    }, [I18n.$t('10229')/* '邮箱验证' */])
                }
            }),
            m(Modal, {
                isShow: APIManager.showAPIKey, // 弹框显示/隐藏
                onClose () {
                    APIManager.showAPIKey = false;
                },
                slot: {
                    header: m('div.w100', {}, [
                        m('div', {}, [I18n.$t('10330')/* "创建成功", */]),
                        m('article.body-4.has-text-level-3.message.is-warning.mt-4.mr-4.flex-shrink-initial', {}, [
                            m('div.message-body.border-1.has-text-level-1.body-4.font-weight-medium', {}, [
                                I18n.$t('10331')/* 密钥仅显示一次，丢失不可找回，请妥善保管！ */
                            ])
                        ])
                    ]),
                    body: m('div', {}, [
                        m('div.body-4.has-text-level-4', {}, [I18n.$t('10327')/* 访问秘钥 */]),
                        m('div.body-5.has-text-level-1.break-word', {}, [
                            m('span.font-weight-bold', {}, [APIManager.modal.key]),
                            m('i.iconfont.icon-copy.has-text-primary.iconfont-medium.cursor-pointer.ml-1', {
                                onclick() { utils.copyText(APIManager.modal.key); }
                            }, [])
                        ]),
                        m('div.body-4.has-text-level-4.mt-7', {}, [I18n.$t('10332')/* 访问密码 */]),
                        m('div.body-5.has-text-level-1.break-word', {}, [
                            m('span.font-weight-bold', {}, [APIManager.modal.password]),
                            m('i.iconfont.icon-copy.has-text-primary.iconfont-medium.cursor-pointer.ml-1', {
                                onclick() { utils.copyText(APIManager.modal.password); }
                            }, [])
                        ]),
                        m('div.body-4.has-text-level-4.mt-7', {}, [I18n.$t('10326')/* 权限 */]),
                        m('div.body-5.has-text-level-1.font-weight-bold', {}, [APIManager.modal.auth]),
                        m('div.body-4.has-text-level-4.mt-7', {}, [I18n.$t('10334')/* 绑定ip */]),
                        m('div.body-5.has-text-level-1.break-word.font-weight-bold', {}, [APIManager.modal.ip || '--']),
                        m('div.body-5.has-text-level-4.mt-7', {}, [I18n.$t('10082')/* '温馨提示' */]),
                        m('div.body-4.has-text-level-4.mt-2', {}, [
                            '* ' + I18n.$t('10335')/* '请不要泄露您的访问密钥和secretkey，以免造成资产损失。' */
                        ]),
                        m('div.body-4.has-text-level-4', {}, [
                            '* ' + I18n.$t('10336')/* '如果您忘记了secretkey，请申请新的密钥对。' */
                        ])
                    ])
                }
            })
        ]);
    }
};
