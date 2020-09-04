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

class Dropdown {
    constructor () {
        this.showMenu = false;
        this.curItem = {};
        this.curId = "";
        this.menuList = [
            {
                id: 1,
                label: "111"
            },
            {
                id: 2,
                label: "222"
            }
        ];
        this.oninit = vnode => {
            // this.initCurItem(vnode);
            // this.initEVBUS(vnode);
        };

        this.oncreate = vnode => {
        };

        this.onupdate = vnode => {
            // this.initCurItem(vnode);
        };

        this.onremove = vnode => {
            // this.rmEVBUS(vnode);
        };
    }

    setShowMenu (type) {
        this.showMenu = type;
        console.log(type);
    }

    menuClick () {
        console.log(this.curItem);
    }
}

module.exports = new Dropdown();

// module.exports = {
//     // ============= 状态 =============
//     showMenu: false,
//     curItem: {},
//     curId: "", // 临时保存id
//     openClickBody: true, // body事件 节流

//     // ============= 方法 =============
//     // 初始化 选中item
//     initCurItem (vnode) {
//         // 临时保存 当前选中id
//         vnode.attrs.activeId && vnode.attrs.activeId((p, k) => {
//             return (vnode.state.curId = p[k]);
//         });
//         // 当前选中item
//         const item = vnode.attrs.getList().find(item => {
//             return item.id === vnode.state.curId;
//         });
//         vnode.state.curItem = item || {};

//         // console.log(vnode.state.curId, vnode.state.curItem, 66);
//         // if (curItem) {
//         //     vnode.state.btnText = curItem.label;
//         // } else {
//         //     vnode.state.btnText = vnode.attrs.placeholder || "--";
//         // }
//         // console.log(curItem, vnode.state.btnText, 77777777777);
//         m.redraw();
//     },
//     // 初始化 全局广播
//     initEVBUS (vnode) {
//         // 订阅 body点击事件广播
//         broadcast.onMsg({
//             key: vnode.attrs.evenKey,
//             cmd: broadcast.EV_ClICKBODY,
//             cb: function () {
//                 vnode.attrs.setShowMenu(false);
//             }
//         });
//         // this.EV_ClICKBODY_unbinder = window.gEVBUS.on(gEVBUS.EV_ClICKBODY, arg => {
//         //     if (vnode.state.openClickBody) vnode.attrs.showMenu((p, k) => p[k] = false) // body事件 节流
//         //     vnode.state.openClickBody = true
//         // })
//     },
//     // 删除全局广播
//     rmEVBUS (vnode) {
//         broadcast.offMsg({
//             key: vnode.attrs.evenKey,
//             isall: true
//         }); // 删除 body点击事件广播
//     },
//     // ============= 生命周期 =============
//     oninit (vnode) {
//         this.initCurItem(vnode);
//         this.initEVBUS(vnode);
//     },
//     oncreate (vnode) {
//     },
//     onupdate (vnode) {
//         this.initCurItem(vnode);
//     },
//     onremove: function (vnode) {
//         this.rmEVBUS(vnode);
//     }
// };
