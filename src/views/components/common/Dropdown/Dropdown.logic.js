const broadcast = require('@/broadcast/broadcast');
var m = require("mithril");

module.exports = {
    // 获取 选中显示内容 / menuList: 菜单列表 currentId: 当前选中id
    getHeader (vnode) {
        const currentItem = vnode.attrs.menuList().find(item => item.id === vnode.attrs.currentId) || vnode.attrs.menuList()[0];
        // renderHeader
        if (vnode.attrs.renderHeader) {
            return vnode.attrs.renderHeader(currentItem || {});
        } else {
            return currentItem ? currentItem.render ? currentItem.render(currentItem) : currentItem.label : "";
        }
    },
    // 选中内容 click
    headerClick(vnode) {
        // console.log(vnode.attrs.currentId);
        // 进入下一次事件队列，先让body事件关闭所有下拉，再开启自己
        const type = vnode.attrs.showMenu; // 保存body事件前的状态
        setTimeout(() => {
            vnode.attrs.updateOption({ showMenu: !type });
            // m.redraw(); // body事件中已刷新,此处可省略
        }, 0);
    },
    // 菜单 click
    menuClick(item, vnode) {
        vnode.attrs.updateOption({
            showMenu: false,
            currentId: item.id
        });
        vnode.attrs.menuClick && vnode.attrs.menuClick(item); // 传递数据
    },
    // 初始化 全局广播
    initEVBUS (vnode) {
        // 点击body广播
        broadcast.onMsg({
            key: vnode.attrs.evenKey,
            cmd: broadcast.EV_ClICKBODY,
            cb() {
                vnode.attrs.updateOption({ showMenu: false }); // 关闭下拉
                setTimeout(() => { m.redraw(); }, 0); // 异步更新状态后需刷新组件
            }
        });
    },
    // 删除全局广播
    rmEVBUS (vnode) {
        // 点击body广播
        broadcast.offMsg({
            key: vnode.attrs.evenKey,
            isall: true
        });
    },
    oninit(vnode) {
        this.initEVBUS(vnode);
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
        this.rmEVBUS(vnode);
    }
};
