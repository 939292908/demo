// 参数说明
// getList() {return [{ id:xxx, label:xxx,... }, { id:xxx, label:xxx,... }]} 菜单数据 (id, label必须项) (必填)
// evenKey body事件key (必填)

// onClick(item) {} 点击事件 可获取item (选填)
// activeId 默认选中id(fn) (必填)
// type 触发类型：active / hover (选填)默认active

// placeholder 提示文字 (选填)
// class 类名 (选填)
// btnClass 按钮 类名 (选填)

// btnWidth 按钮 宽 (选填)
// btnHeight 按钮 高 (选填)
// menuWidth 菜单 宽 (选填)
const broadcast = require('@/broadcast/broadcast');
module.exports = {
    // 初始化 全局广播
    initEVBUS (vnode) {
        // 订阅 body点击事件广播
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
        // 删除 body点击事件广播
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
