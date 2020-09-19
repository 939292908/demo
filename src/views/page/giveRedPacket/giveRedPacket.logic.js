const transferLogic = require('@/views/page/giveRedPacket/transfer/transfer.logic');

const logic = {
    // 币种按钮list
    coinBtnList: [],
    // 当前选中币种
    currentCoin: 'BTC',
    // 红包类型
    redPacketType: 1, // 1：普通/ 2：拼手气
    // 资金密码
    password: "",
    // 资金密码 错误提示
    passwordErrMsg: "",
    // 资金密码 校验
    passwordVerify(password) {
        if (password === "") return "资金密码输入错误，请重新输入";
    },
    // 资金密码 input事件
    passwordInput(e) {
        logic.password = e.target.value;
        logic.passwordErrMsg = logic.passwordVerify(logic.password);
    },
    // 切换 红包类型
    switchRedPacketType() {
        this.redPacketType = this.redPacketType === 1 ? 2 : 1;
    },
    // 币种按钮list
    buildCoinBtnList(list) {
        this.coinBtnList = list.map(item => {
            const btnOption = {
                label: item.name,
                class: () => `is-primary is-rounded mr-2 ${logic.currentCoin === item.name ? '' : 'is-outlined'}`,
                size: 'size-2',
                onclick() {
                    logic.currentCoin = item.name;
                }
            };
            return btnOption;
        });
    },
    // 头部 组件配置
    headerOption: {
        left: {
            onclick() {
                console.log(this.label);
            }
        },
        right: {
            label: '我的红包',
            onclick() {
                console.log(this.label);
            }
        }
    },
    // 金额 fomeItem组件配置
    moneyFormItem: {
        // label: () => logic.redPacketType === 1 ? '单个金额' : '总金额',
        // unit: 'USDT',
        value: '',
        // placeholder: '输入红包金额',
        updateOption(params) {
            Object.keys(params).forEach(key => (this[key] = params[key]));
        }
    },
    // 红包个数 fomeItem组件配置
    numberFormItem: {
        value: '',
        updateOption(params) {
            Object.keys(params).forEach(key => (this[key] = params[key]));
        }
    },
    // info信息 fomeItem组件配置
    infoFormItem: {
        value: "大吉大利，全天盈利",
        updateOption(params) {
            Object.keys(params).forEach(key => (this[key] = params[key]));
        }
    },
    // 发红包 Modal组件配置
    giveRedPModal: {
        isShow: false,
        updateOption(params) {
            Object.keys(params).forEach(key => (this[key] = params[key]));
        },
        onOk() {
            this.updateOption({ isShow: !this.isShow });
        }
    },
    // 划转按钮click
    transferBtnClick() {
        transferLogic.updateOption({
            isShow: true
        });
    },
    oninit(vnode) {
        const data = [
            {
                id: 1,
                name: 'USDT'
            },
            {
                id: 2,
                name: 'BTC'
            },
            {
                id: 3,
                name: 'ETH'
            },
            {
                id: 4,
                name: 'EOS'
            },
            {
                id: 5,
                name: 'ABC1'
            },
            {
                id: 6,
                name: 'ABC2'
            },
            {
                id: 7,
                name: 'ABC3'
            }
        ];
        this.buildCoinBtnList(data);
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;