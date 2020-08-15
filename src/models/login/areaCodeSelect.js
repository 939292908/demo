const m = require('mithril');
const pinyin = require('pinyin');

module.exports = {
    selectList: [],
    showList: [],
    search: '',
    show: false,
    listFilter(item) {
        let py = '';
        for (const i of pinyin(item.cn_name, { style: pinyin.STYLE_NORMAL })) {
            py += i;
        }
        return py.indexOf(this.search) >= 0 ||
            item.cn_name.indexOf(this.search) >= 0 ||
            item.us_name.toUpperCase().indexOf(this.search.toUpperCase()) >= 0 ||
            item.code.indexOf(this.search) >= 0;
    },
    oninit(vnode) {
        this.selectList = vnode.attrs.selectList;
        this.showList = vnode.attrs.selectList.filter(
            item => {
                return this.listFilter(item);
            }
        );
        window.onclick = e => {
            this.show = false;
            m.redraw();
        };
    },
    onupdate(vnode) {
        this.selectList = vnode.attrs.selectList;
        this.showList = this.showList = vnode.attrs.selectList.filter(
            item => {
                return this.listFilter(item);
            }
        );
    },
    onremove(vnode) {
        window.onclick = null;
    },
    stopFunc(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
};