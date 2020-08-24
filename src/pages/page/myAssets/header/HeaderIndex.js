const header = require('@/pages/page/myAssets/header/HeaderView');

const h = {
    toPage: function (val) {
        window.location.href = '#!/' + val;
    }
};

module.exports = {
    view: function (vnode) {
        const props = {
            Header: h
        };
        return header(props, vnode);
    }
};