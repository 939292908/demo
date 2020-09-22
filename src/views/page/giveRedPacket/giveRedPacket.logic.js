const transferLogic = require('@/views/page/giveRedPacket/transfer/transfer.logic');
const globalModels = require('@/models/globalModels');

const logic = {
    // 币种按钮list
    coinBtnList: [],
    // 当前选中币种
    currentCoin: 'BTC',
    // 红包类型 // 1：普通/ 2：拼手气
    redPacketType: 1,
    // 钱包可用金额
    wltMoney: '100',
    // 资金密码 模块
    passwordModel: {
        // 密码
        value: "",
        // 错误提示
        errMsg: "",
        // 更新密码
        updateValue(password) {
            this.value = password;
        },
        // 校验密码
        verifyPassword() {
            if (this.value === "") {
                return this.updateErrMsg("资金密码输入错误，请重新输入");
            }
            return true;
        },
        // 更新提示
        updateErrMsg(msg) {
            this.errMsg = msg;
        }
    },
    // 发红包表单 模块
    formModel: {
        // 获取表单
        getFormData() {
            return {
                coin: logic.currentCoin, // 币种
                money: logic.moneyFormItem.value, // 金额
                num: logic.numberFormItem.value, // 数量
                info: logic.infoFormItem.value, // 祝福
                password: logic.passwordModel.value // 密码
            };
        },
        // 错误提示
        formErrMsg: "",
        // 校验金额
        verifyMoney(isUpdateMsg = true) {
            // 钱包可用资产不足，请及时划转！
            if (this.getTotalCoin() > logic.wltMoney * 1) {
                isUpdateMsg && this.updateErrMsg("钱包可用资产不足，请及时划转！");
                return false;
            }
            isUpdateMsg && this.updateErrMsg(''); // 清空提示
            return true;
        },
        // 校验红包个数
        verifyNumber(isUpdateMsg = true) {
            const data = this.getFormData(); // 表单数据
            const maxNum = parseInt(logic.wltMoney / data.money); // 最多可发个数

            // 请输入红包个数
            if (!data.num || data.num === '0') {
                isUpdateMsg && this.updateErrMsg("请输入红包个数");
                return false;
            }
            // ============= 普通 / 拼手气 红包校验 =============
            if (logic.redPacketType === 1) { // 普通
                // 一次最多可发xx个红包
                if (data.num > maxNum) {
                    isUpdateMsg && this.updateErrMsg(`一次最多可发${maxNum}个红包`);
                    return false;
                }
            } else { // 拼手气
                // 一次最多可发xx个红包
                if (data.num > 10000) {
                    isUpdateMsg && this.updateErrMsg(`一次最多可发${10000}个红包`);
                    return false;
                }
            }
            isUpdateMsg && this.updateErrMsg(''); // 清空提示
            return true;
        },
        // 校验表单 isUpdateMsg/是否更新错误消息
        verifyFormData(isUpdateMsg = true) {
            if (!this.verifyMoney(isUpdateMsg)) return; // 钱包可用资产不足，请及时划转！
            if (!this.verifyNumber(isUpdateMsg)) return; // 校验红包个数
            return true;
        },
        // 更新提示
        updateErrMsg(msg) {
            this.errMsg = msg;
        },
        // 获取总金额
        getTotalCoin() {
            if (logic.redPacketType === 1) { // 普通红包
                return (logic.numberFormItem.value * logic.moneyFormItem.value || '0');
            } else { // 拼手气红包
                return logic.moneyFormItem.value || '0';
            }
        }
    },
    // 切换红包类型
    switchRedPacketType() {
        this.redPacketType = this.redPacketType === 1 ? 2 : 1;
    },
    // 币种按钮list
    getCoinBtnList(list) {
        this.coinBtnList = list.map(item => {
            const btnOption = {
                label: item.name,
                class: () => `is-primary is-rounded mr-2 font-weight-bold ${logic.currentCoin === item.name ? '' : 'is-outlined'}`,
                size: 'size-2',
                onclick() {
                    logic.currentCoin = item.name; // 更新数据
                    logic.formModel.verifyFormData(); // 校验表单
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
        value: '',
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
            console.log(logic.formModel.getFormData());
            logic.passwordModel.verifyPassword() && this.updateOption({ isShow: !this.isShow });
        }
    },
    // 划转按钮click
    transferBtnClick() {
        transferLogic.updateOption({
            isShow: true,
            usableMoney: logic.wltMoney,
            coin: logic.currentCoin
        });
    },
    // 获取币种的人民币估值
    getRMBByCoinMoney() {
        const coinMoney = logic.moneyFormItem.value; // 币种金额
        const rate = globalModels.getForexRate().rate; // 换算人民币汇率
        if (rate) {
            return coinMoney * rate;
        } else {
            return 0;
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
        this.getCoinBtnList(data);
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
    }
};

module.exports = logic;