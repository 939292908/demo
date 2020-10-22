const m = require('mithril');
require('./Loading.scss');

module.exports = {
    view(vnode) {
        return m('div', { class: `` }, [
            m('div', { class: `` }, vnode.attrs.loading),
            "loading"
        ]);
    }
};