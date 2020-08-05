let m = require('mithril')

import('@/styles/components/inputWithComponents.scss')

/**
 * 带下拉输入框
 */
module.exports = ({options, leftComponents, rightComponents}) => {
    let inside = [];
    if (leftComponents) {
        inside.push(leftComponents);
        inside.push(m('span.line', {}, []));
    }
    inside.push(m('input.input.without-border', options, []));
    if (rightComponents) {
        inside.push(m('span.line', {}, []));
        inside.push(rightComponents);
    }

    return m('div.input-with-components', {}, [
        m('div.input.px-0', {}, inside)
    ]);
}