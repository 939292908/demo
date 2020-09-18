
const logic = {
    // 币种按钮list
    coinBtnList: [],
    // 当前选中币种
    currentCoin: 'BTC',
    // 红包类型
    redPacketType: 1, // 1：普通/ 2：拼手气
    // 切换 红包类型
    switchRedPacketType() {
        this.redPacketType = this.redPacketType === 1 ? 2 : 1;
    },
    // 币种按钮list
    buildCoinBtnList(list) {
        this.coinBtnList = list.map(item => {
            const btnOption = {
                label: item.name,
                class: () => `is-primary is-rounded ${logic.currentCoin === item.name ? '' : 'is-outlined'}`,
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
    moneyFormItemOption: {
        label: '总金额',
        unit: 'USDT',
        value: '',
        placeholder: '输入红包金额',
        updateOption(value) {
            this.value = value;
        }
    },
    // 红包个数 fomeItem组件配置
    numberFormItemOption: {
        label: '红包个数',
        unit: '个',
        value: '',
        placeholder: '输入红包个数',
        updateOption(value) {
            this.value = value;
        }
    },
    // info信息 fomeItem组件配置
    infoFormItemOption: {
        content: "大吉大利，全天盈利"
    },
    // 塞币进红包 Button组件配置
    coinToRedButtonOption: {
        label: "塞币进红包",
        // class: 'is-primary',
        width: 1,
        disabled: () => logic.redPacketType === 2,
        onclick() {
        }
    },
    // 划转按钮click
    transferBtnClick() {
        logic.transferModalOption.isShow = true;
    },
    // 划转 Modal组件配置
    transferModalOption: {
        isShow: false,
        updateOption(type) {
            this.isShow = type;
        },
        onOk() {
            this.isShow = !this.isShow;
        },
        onClose() {
            this.isShow = !this.isShow;
        }
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
                name: 'ABC'
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