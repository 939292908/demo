const m = require('mithril');
const pinyin = require('pinyin');

module.exports = {
    selectList: [], // 选择列表
    showList: [], // 过滤后的显示列表
    search: '', // 过滤文字
    show: false, // 下拉列表显示
    /**
     * 列表过滤
     * @param item
     * @returns {boolean}
     */
    listFilter(item) {
        let py = ''; // 拼音
        for (const i of pinyin(item.cn_name, { style: pinyin.STYLE_NORMAL })) {
            py += i;
        }
        const code = '+' + item.code;
        return py.indexOf(this.search) >= 0 || // 拼音
            item.cn_name.indexOf(this.search) >= 0 || // 中文名
            item.us_name.toUpperCase().indexOf(this.search.toUpperCase()) >= 0 || // 英文名
            code.indexOf(this.search) >= 0; // 区号
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
    /**
     * 点击事件禁止传递
     * @param e
     */
    stopFunc(e) {
        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    },
    /**
     * 项目点击事件
     * @param vnode
     * @param item
     */
    itemClick(vnode, item) {
        if (item.support === '0') {
            window.$message({ content: '该地区暂未开放，请选择其他区号', type: 'danger' });
        } else {
            vnode.attrs.onSelect(item.code);
            this.search = '';
            this.onupdate(vnode);
            this.show = false;
        }
    }
};