// {
//     loading: true, // 布尔：true , 对象：{ xx：true， xx2: true }, 数组 [ true, true ]
//     type: null, // loading 样式 1
// }
const logic = {
    loading: false, // loading 状态
    type: null, // loading 样式
    option: {},
    oninit(vnode) {
        window.$loadingInit = option => {
            logic.option = option;
        };
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;
