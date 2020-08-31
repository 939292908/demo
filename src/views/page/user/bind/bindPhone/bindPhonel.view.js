const m = require('mithril');
require('@/views/page/user/bind/bind.scss');
require('./bindPhone.scss');

module.exports = {
    view() {
        return m('div', { class: `` }, [
            "手机绑定"
        ]);
    }
};