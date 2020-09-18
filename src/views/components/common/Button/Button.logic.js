
module.exports = {
    // class
    getClass (vnode) {
        var classStr = `my-button button ${typeof vnode.attrs.class === 'function' ? vnode.attrs.class() : (vnode.attrs.class || '')} `;
        if (vnode.attrs.loading) classStr += 'is-loading ';
        return classStr;
    },

    // style
    getStyle (vnode) {
        var styleStr = '';
        if (vnode.attrs.width) styleStr += 'width:' + (vnode.attrs.width <= 1 ? vnode.attrs.width * 100 + '%;' : vnode.attrs.width + 'px;');
        return styleStr;
    }
};
