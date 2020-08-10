const m = require('mithril');

import('@/styles/components/inputWithComponent.scss');

/**
 * 输入框扩展
 * @param options 输入框属性
 * @param leftComponents 左组件
 * @param rightComponents 右组件
 * @param addClass 添加的样式class
 */
module.exports = ({ options, leftComponents, rightComponents, addClass = '' }) => {
    const inside = [];
    if (leftComponents) {
        inside.push(leftComponents);
        inside.push(m('span.line', {}, []));
    }
    inside.push(m('input.input.without-border', options, []));
    if (rightComponents) {
        inside.push(m('span.line', {}, []));
        inside.push(rightComponents);
    }

    return m('div.input-with-components', {
        class: addClass
    }, [
        m('div.input.px-0', {}, inside)
    ]);
};