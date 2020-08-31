const m = require('mithril');
module.exports = {
    view(vnode) {
        const table = [];
        table.push(
            m('div.columns.body-4.has-text-level-3', {
                class: vnode.attrs.class
            }, [
                m('div.column.is-1', {}, ['币种']),
                m('div.column.is-2', {}, ['类型']),
                m('div.column.is-2', {}, ['数量']),
                m('div.column.is-2', {}, ['手续费']),
                m('div.column.is-2', {}, ['状态']),
                m('div.column.is-2', {}, ['时间']),
                m('div.column.is-1.has-text-right', {}, ['备注'])
            ])
        );
        for (const item of vnode.attrs.list) {
            table.push(
                m('div.columns.body-4.has-text-level-3.my-7', {}, [
                    m('div.column.is-1', {}, [item.coin]),
                    m('div.column.is-2', {}, [item.des]),
                    m('div.column.is-2', {}, [item.num]),
                    m('div.column.is-2', {}, [item.num]),
                    m('div.column.is-2', {}, [item.status]),
                    m('div.column.is-2', {}, [item.time]),
                    m('div.column.is-1.has-text-right', {}, ['--'])
                ])
            );
        }
        return table;
    }
};