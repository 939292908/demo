const m = require('mithril');
const I18n = require('@/languages/I18n').default;
const Loading = require('@/views/components/loading/loading.view');
const Modal = require('@/views/components/common/Modal');
const AssetTable = require('./assetTable.model');
require('./assetTable.scss');
module.exports = {
    view(vnode) {
        const table = [];
        table.push(
            m('div.columns.body-4.has-text-level-3', {}, [
                m('div.column.is-1', {}, [I18n.$t('10063')/* '币种' */]),
                m('div.column.is-3', {}, [I18n.$t('10088')/* '类型' */]),
                m('div.column.is-3', {}, [I18n.$t('10089')/* '数量' */]),
                // m('div.column.is-2', {}, [I18n.$t('10099')/* '手续费' */]),
                m('div.column.is-2', {}, [I18n.$t('10090')/* '状态' */]),
                m('div.column.is-2', {}, [I18n.$t('10091')/* '时间' */]),
                m('div.column.is-1.has-text-right', {}, [I18n.$t('10092')/* '备注' */])
            ])
        );
        if (vnode.attrs.loading) {
            table.push(m('div.is-align-items-center.py-8', {}, [m(Loading)]));
        } else if (!vnode.attrs.list.length) {
            table.push(m('div.is-align-items-center.mt-8.nodata-icon', {}, [
                m('div.has-bg-level-1.mb-3.is-align-items-center', {}, [
                    m('img', { src: require(`@/assets/img/myAssets/noneData.svg`).default })
                ])
            ]));
            table.push(m('div.is-align-items-center.mb-8', {}, [
                m('div.has-text-level-4', {}, I18n.$t('10515')/* '暂无数据' */)
            ]));
        } else {
            for (const item of vnode.attrs.list) {
                const other = [];
                if (item.stat === 110) {
                    other.push(m('a.has-text-primary', {
                        onclick: e => {
                            AssetTable.cancelTransferModel = item;
                            AssetTable.isShowCancel = true;
                        }
                    }, [I18n.$t('10544')/* '撤销申请' */]));
                } else if (item.info ? item.info.length : false) {
                    other.push(m('a.has-text-primary', {
                        onclick: e => {
                            item.showInfo = !item.showInfo;
                        }
                    }, [
                        I18n.$t('10096')/* '详情' */,
                        m('i.iconfont.iconfont-small', {
                            class: item.showInfo ? 'icon-xiala' : 'icon-xiala'
                        }, [])
                    ]));
                } else {
                    other.push('─ ─');
                }
                table.push(
                    m('div.columns.body-4.has-text-level-3.my-7', {}, [
                        m('div.column.is-1', {}, [item.coin]),
                        m('div.column.is-3', {}, [item.des]),
                        m('div.column.is-3', {}, [item.num + ' ' + item.coin]),
                        // m('div.column.is-2', {}, [(item.fee || 0) + ' ' + item.coin]),
                        m('div.column.is-2', {}, [item.status]),
                        m('div.column.is-2', {}, [item.time]),
                        m('div.column.is-1.has-text-right', {}, other)
                    ])
                );
                if (item.info ? item.info.length : false) {
                    const infoList = [];
                    for (const info of item.info) {
                        infoList.push(m('div.column.is-6.mb-3', {}, [
                            m('span', {}, [info.key + '：']),
                            m('span.has-text-level-1', {}, [info.value])
                        ]));
                    }
                    table.push(m('div.columns.is-multiline.body-4.has-text-level-3.has-bg-level-3.pt-3.px-4', {
                        style: `display:${item.showInfo ? 'flex' : 'none'}`
                    }, infoList));
                }
            }
        }
        return m('div', { class: vnode.attrs.class }, [
            m(Modal, {
                isShow: AssetTable.isShowCancel,
                onClose () {
                    AssetTable.isShowCancel = false;
                }, // 关闭事件
                slot: {
                    header: m('div', {}, [
                        // '撤销申请法币划转'
                        I18n.$t('10536')
                    ]),
                    body: m('div.columns', {}, [
                        m('div.column', {}, [I18n.$t('10537')/* '审核金额' */]),
                        m('div.column.has-text-right', {}, [AssetTable.cancelTransferModel.num + ' ' + AssetTable.cancelTransferModel.coin])
                    ]),
                    footer: [
                        m("button", {
                            class: "button is-primary is-outlined font-size-2 has-text-white modal-default-btn button-large has-text-primary",
                            onclick () {
                                AssetTable.isShowCancel = false;
                            }
                        }, [I18n.$t('10538')/* '取消' */]),
                        m('.spacer'),
                        m("button.button.is-primary.font-size-2.has-text-white.modal-default-btn.button-large", {
                            class: AssetTable.isLoading ? 'is-loading' : '',
                            onclick () {
                                AssetTable.cancelTransfer();
                            }
                        }, [I18n.$t('10337')/* "确定" */])
                    ]
                }
            }),
            m('div.assetTable', {}, [
                table
            ])
        ]);
    }
};