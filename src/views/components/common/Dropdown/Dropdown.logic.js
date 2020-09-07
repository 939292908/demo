const broadcast = require('@/broadcast/broadcast');

module.exports = {
    // 获取 选中显示内容 / menuList: 菜单列表 currentId: 当前选中id
    getCurrentContent (menuList, currentId) {
        const currentItem = menuList.find(item => item.id === currentId);
        return currentItem?.render ? currentItem.render() : currentItem.label;
    },
    // 选中内容 click
    currentContentClick(vnode) {
        // 进入下一次事件队列，先让body事件关闭所有下拉，再开启自己
        console.log(vnode.attrs.currentId);
        const type = vnode.attrs.showMenu;
        setTimeout(() => {
            vnode.attrs.setOption({
                showMenu: !type
            });
        }, 0);
    },
    // 菜单 click
    menuClick(item, vnode) {
        vnode.attrs.onClick && vnode.attrs.onClick(item); // 传递数据
        vnode.attrs.setOption({
            showMenu: false,
            currentId: item.id
        });
    },
    // 初始化 全局广播
    initEVBUS (vnode) {
        // 点击body广播
        broadcast.onMsg({
            key: vnode.attrs.evenKey,
            cmd: broadcast.EV_ClICKBODY,
            cb: function () {
                vnode.attrs.setOption({
                    showMenu: false
                });
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
