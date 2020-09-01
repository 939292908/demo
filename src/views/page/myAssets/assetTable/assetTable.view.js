const m = require('mithril');
module.exports = {
    view(vnode) {
        const table = [];
        table.push(
            m('div.columns.body-4.has-text-level-3', {}, [
                m('div.column.is-1', {}, ['币种']),
                m('div.column.is-2', {}, ['类型']),
                m('div.column.is-2', {}, ['数量']),
                m('div.column.is-2', {}, ['手续费']),
                m('div.column.is-2', {}, ['状态']),
                m('div.column.is-2', {}, ['时间']),
                m('div.column.is-1.has-text-right', {}, ['备注'])
            ])
        );
        if (!vnode.attrs.list.length) {
            table.push(m('div.is-align-items-center.ma-8.pa-8', {}, ['暂无数据']));
        } else {
            for (const item of vnode.attrs.list) {
                table.push(
                    m('div.columns.body-4.has-text-level-3.my-7', {}, [
                        m('div.column.is-1', {}, [item.coin]),
                        m('div.column.is-2', {}, [item.des]),
                        m('div.column.is-2', {}, [item.num + ' ' + item.coin]),
                        m('div.column.is-2', {}, [(item.fee || 0) + ' ' + item.coin]),
                        m('div.column.is-2', {}, [item.status]),
                        m('div.column.is-2', {}, [item.time]),
                        m('div.column.is-1.has-text-right', {}, [
                            (item.info ? item.info.length : false)
                                ? m('a.has-text-primary', {
                                    onclick: e => {
                                        item.showInfo = !item.showInfo;
                                    }
                                },
                                ['详情', m('i.iconfont', { class: item.showInfo ? 'icon-xiala' : 'icon-xiala' }, [])])
                                : '--'
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