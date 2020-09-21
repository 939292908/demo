
const logic = {
    isShow: true, // 显示划转弹框
    updateOption(params) {
        Object.keys(params).forEach(key => (this[key] = params[key]));
    },
    onOk() {
        this.updateOption({ isShow: !this.isShow });
    },
    onClose() {
        this.updateOption({ isShow: !this.isShow });
    },
    // form钱包 列表
    fromWltList: [
        {
            id: "01",
            label: "合约账户"
        },
        {
            id: "02",
            label: "币币账户"
        },
        {
            id: "03",
            label: "我的钱包"
        },
        {
            id: "04",
            label: "法币账户"
        }
    ],
    // form钱包 下拉组件配置
    fromDropdown: {
        evenKey: "fromMenuOption",
        showMenu: false,
        currentId: "",
        menuHeight: 120,
        updateOption (option) {
            Object.keys(option).forEach(key => (this[key] = option[key]));
        },
        menuClick (item) {
            console.log(item);
        },
        menuList() {
            return logic.fromWltList;
        }
    },
    // to钱包 下拉组件配置
    toDropdown: {
        evenKey: "toMenuOption",
        showMenu: false,
        currentId: "",
        menuHeight: 120,
        updateOption (option) {
            Object.keys(option).forEach(key => (this[key] = option[key]));
        },
        menuClick (item) {
        },
        menuList() {
            return logic.fromWltList;
        }
    }
};
module.exports = logic;
