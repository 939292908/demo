const m = require('mithril');
require('./FormItem.scss');
// const header = require('./header.logic.js');

module.exports = {
    oncreate() {
    },
    view(vnode) {
        return m('div', { class: `pub-form-item is-between is-align-center border-radius-small px-3 has-bg-level-1 ${vnode.attrs.class || ''}` },
            vnode.attrs.content ? vnode.attrs.content : [
                m('div', { class: `no-wrap has-text-level-1` }, typeof vnode.attrs.label === 'function' ? vnode.attrs.label() : (vnode.attrs.label || '')),
                m('div', { class: `is-between is-align-center` }, [
                    m('input', {
                        class: `input has-text-right has-text-level-1`,
                        value: vnode.attrs.value,
                        type: vnode.attrs.type || 'text',
                        placeholder: vnode.attrs.placeholder || '',
                        oninput(e) {
                            vnode.attrs.updateOption({ value: e.target.value });
                        }
                    }),
                    m('div', { class: `pub-form-item-unit no-wrap has-text-level-1`, onclick() { vnode.attrs.unitClick && vnode.attrs.unitClick(); } }, vnode.attrs.unit || '')
                ])
            ]);
    }
};