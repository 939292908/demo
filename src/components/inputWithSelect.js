let m = require('mithril')

import('@/styles/components/inputWithSelect.scss')

module.exports = ({selectList, selectedOptions, inputOptions ,componentOptions}) => {
    let selectView = [];
    if (selectList.length) {
        for (let i of selectList) {
            selectView.push(m('option', {}, [i]));
        }
    }

    return m('div.input-with-select', componentOptions, [
        m('div.input.px-0', {}, [
            m('span.select', {}, [
                m('select.without-border', selectedOptions, selectView),
            ]),
            m('span.line',{},[]),
            m('input.input.without-border', inputOptions, []),
        ])
    ]);
}