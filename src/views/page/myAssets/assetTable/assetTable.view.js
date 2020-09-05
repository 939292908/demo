const m = require('mithril');
const I18n = require('@/languages/I18n').default;
const Loading = require('@/views/components/loading/loading.view');
module.exports = {
    view(vnode) {
        const table = [];
        table.push(
            m('div.columns.body-4.has-text-level-3', {}, [
                m('div.column.is-1', {}, [I18n.$t('10063')/* '币种' */]),
                m('div.column', {
                    class: `${vnode.attrs.aType !== '03' ? 'is-3' : 'is-2'}`
                }, [I18n.$t('10088')/* '类型' */]),
                m('div.column', {
                    class: `${vnode.attrs.aType !== '03' ? 'is-3' : 'is-2'}`
                }, [I18n.$t('10089')/* '数量' */]),
                m('div.column.is-2', {
                    style: `display:${vnode.attrs.aType !== '03' ? 'none' : 'flex'}`
                }, [I18n.$t('10099')/* '手续费' */]),
                m('div.column.is-2', {}, [I18n.$t('10090')/* '状态' */]),
                m('div.column.is-2', {}, [I18n.$t('10091')/* '时间' */]),
                m('div.column.is-1.has-text-right', {}, [I18n.$t('10092')/* '备注' */])
            ])
        );
        if (vnode.attrs.loading) {
            table.push(m('div.is-align-items-center.py-8', {}, [m(Loading)]));
        } else if (!vnode.attrs.list.length) {
            table.push(m('div.is-align-items-center.mt-8', {}, [
                m('img', {
                    src: require(`@/assets/img/myAssets/noneData.svg`).default,
                    style: { height: `120px`, width: `88px` }
                })
            ]));
            table.push(m('div.is-align-items-center.mb-8', {}, [
                m('div.has-text-level-4', {}, '暂无数据')
            ]));
        } else {
            for (const item of vnode.attrs.list) {
                table.push(
                    m('div.columns.body-4.has-text-level-3.my-7', {}, [
                        m('div.column.is-1', {}, [item.coin]),
                        m('div.column', {
                            class: `${vnode.attrs.aType !== '03' ? 'is-3' : 'is-2'}`
                        }, [item.des]),
                        m('div.column', {
                            class: `${vnode.attrs.aType !== '03' ? 'is-3' : 'is-2'}`
                        }, [item.num + ' ' + item.coin]),
                        m('div.column.is-2', {
                            style: `display:${vnode.attrs.aType !== '03' ? 'none' : 'flex'}`
                        }, [(item.fee || 0) + ' ' + item.coin]),
                        m('div.column.is-2', {}, [item.status]),
                        m('div.column.is-2', {}, [item.time]),
                        m('div.column.is-1.has-text-right', {}, [
                            (item.info ? item.info.length : false)
                                ? m('a.has-text-primary', {
                                    onclick: e => {
                                        item.showInfo = !item.showInfo;
                                    }
                                },
                                [I18n.$t('10096')/* '详情' */, m('i.iconfont.iconfont-small', { class: item.showInfo ? 'icon-xiala' : 'icon-xiala' }, [])])
                                : '─ ─'
                        ])
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
        return m('div', { class: vnode.attrs.class }, table);
    }
};