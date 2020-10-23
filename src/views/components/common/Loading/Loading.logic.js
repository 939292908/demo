// {
//     loading: true, // 布尔：true , 对象：{ xx：true， xx2: true }, 数组 [ true, true ]
//     type: null, // loading 样式 1
// }
const logic = {
    loading: false, // loading 状态
    type: null, // loading 样式
    oninit(vnode) {
        window.$loading = option => {
            // loading 样式
            logic.type = option.type;

            // 布尔类型直接赋值loading
            if (typeof option.loading === 'boolean') {
                logic.loading = option.loading;
            }

            // 对象或数组 每一项为true才打开loading
            if (typeof option.loading === 'object') {
                logic.loading = Object.values(option.loading).every(item => item);
            }
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
