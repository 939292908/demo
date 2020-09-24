const transferLogic = require('@/views/page/sendRedPacket/transfer/transfer.logic');
const globalModels = require('@/models/globalModels');
const Qrcode = require('qrcode');
const Http = require('@/api').webApi;
const md5 = require('md5');
const m = require('mithril');
const share = require('../main/share/share.logic.js');
const { HtmlConst, GetBase64 } = require('@/models/plus/index.js');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');

const logic = {
    // 币种按钮list
    coinBtnList: [],
    // 当前选中币种
    currentCoin: 'BTC',
    // 红包类型 // 1：普通/ 2：拼手气
    redPacketType: 1,
    // 钱包可用金额
    wltMoney: '100',
    // 红包link地址
    redPacketLink: "",
    // 分享结果 弹框
    isShowShareModal: false,
    // 取消分享提示 弹框
    isShowNotShareModal: false,
    // 发红包 必须的权限 弹框 (实名认证/资金密码)
    isShowVerifyAuthModal: false,

    // 发红包 必须的权限
    mustAuth: {
        authentication: true,
        moneyPassword: true
    },
    // 二维码链接
    ewmLink: "www.baidu.com",
    // 二维码img
    ewmImg: "",
    allWalletList: [],
    contractList: [], // 合约钱包 币种list
    bibiList: [], // 币币钱包 币种list
    myWalletList: [], // 我的钱包 币种list
    legalTenderList: [], // 法币钱包 币种list
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
    buildCoinBtnList(list) {
        this.coinBtnList = list.map(item => {
            const btnOption = {
                label: item.coin,
                class: () => `is-primary is-rounded mr-2 font-weight-bold ${logic.currentCoin === item.coin ? '' : 'is-outlined'}`,
                size: 'size-2',
                onclick() {
                    logic.currentCoin = item.coin; // 更新数据
                    logic.formModel.verifyFormData(); // 校验表单
                }
            };
            return btnOption;
        });
        m.redraw();
    },
    // 头部 组件配置
    headerOption: {
        left: {
            onclick() {
                console.log(this.label);
                logic.sendgift();
            }
        },
        right: {
            label: '我的红包',
            onclick() {
                window.router.push('/myRedPacket');
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
    sendRedPModal: {
        isShow: false,
        updateOption(params) {
            Object.keys(params).forEach(key => (this[key] = params[key]));
        },
        onOk() {
            console.log(logic.formModel.getFormData());
            if (logic.passwordModel.verifyPassword()) {
                logic.bindgift(); // 绑定红包
            }
        }
    },
    // 生成二维码
    updateEwm(link = logic.ewmLink) {
        // 生成二维码
        Qrcode.toDataURL(link || '无').then(url => {
            logic.ewmImg = url;
            m.redraw();
        }).catch(err => {
            console.log(err);
        });
    },
    // 划转按钮click
    transferBtnClick() {
        transferLogic.updateOption({
            isShow: true,
            usableMoney: logic.wltMoney,
            coin: logic.currentCoin
        });
    },
    // 设置 最大划转 (依赖钱包名称, 币种)
    setMaxTransfer () {
        if (wlt.wallet) { // 所有钱包 和 从xx钱包id 都存在
            const wallet = wlt.wallet["03"]; // 对应钱包
            for (const item of wallet) {
                if (item.wType === this.coinMenuOption.currentId) { // 找到对应币种
                    this.wltMoney = item.wdrawable || 0; // 设置最大可以金额
                }
            }
        } else {
            this.wltMoney = "--";
        }
        console.log(this.wltMoney, wlt.wallet, 77777);
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
    // 塞币进红包 click
    coinToRedPacketBtnClick() {
        if (logic.mustAuth.authentication && logic.mustAuth.moneyPassword) { // 实名认证/资金密码全部开通
            logic.sendRedPModal.updateOption({ isShow: true }); // 发红包弹框
        } else {
            logic.isShowVerifyAuthModal = true; // 实名认证/资金密码 弹框
        }
    },
    // 实名认证/资金密码弹框 OKbtn click
    verifyAuthModalOkBtnClick() {
        logic.isShowVerifyAuthModal = false; // 关闭自己
        // // 必须实名认证/设置资金密码
        // if (logic.mustAuth.authentication && logic.mustAuth.moneyPassword) {
        //     logic.sendRedPModal.updateOption({ isShow: true });
        // }
    },
    // 发红包接口
    sendgift() {
        const params = {
            vp: 0,
            guid: '123',
            coin: 'USDT',
            type: 0,
            quota: 10,
            count: 10,
            des: '留言',
            passd: md5('123456')
        };
        Http.sendgift(params).then(function(arg) {
            console.log('sendRedPacket success', arg);
        }).catch(function(err) {
            console.log('sendRedPacket error', err);
        });
    },
    // 绑定红包接口
    bindgift() {
        const that = this;
        const params = {
            uid: "11",
            tel: "13911223344",
            email: "123456@qq.com"
        };
        Http.bindgift(params).then(function(arg) {
            console.log('bindgift success', arg);
            logic.sendRedPModal.updateOption({ isShow: !logic.sendRedPModal.isShow }); // 关闭发红包弹框
            logic.updateEwm("链接地址"); // 更新二维码
            // logic.isShowShareModal = true; // 分享结果弹框
            console.log('share', share);
            that.toShare();
        }).catch(function(err) {
            console.log('bindgift error', err);
        });
    },
    // 跳转过来继续发红包
    continueSendRedPacket() {
        console.log("logic.redPacketLink", logic.redPacketLink);
        logic.redPacketLink = m.route.param().redPacketLink;
        if (logic.redPacketLink) {
            logic.updateEwm(logic.redPacketLink); // 更新二维码
            logic.isShowShareModal = true; // 分享结果弹框
        }
    },
    // 重置
    reset() {
        logic.currentCoin = "BTC";// 币种
        logic.moneyFormItem.value = ""; // 金额
        logic.numberFormItem.value = ""; // 数量
        logic.infoFormItem.value = ""; // 祝福
        logic.passwordModel.value = ""; // 密码
    },
    // 初始化划转
    initTransferInfo () {
        // console.log(123, wlt.wallet);

        this.contractList = wlt.wallet['01'].filter(item => item.Setting.canTransfer); // 合约钱包 币种list
        this.bibiList = wlt.wallet['02'].filter(item => item.Setting.canTransfer); // 币币钱包 币种list
        this.myWalletList = wlt.wallet['03'].filter(item => item.Setting.canTransfer); // 我的钱包 币种list
        this.legalTenderList = wlt.wallet['04'].filter(item => item.Setting.canTransfer); // 法币钱包 币种list
        // 钱包列表
        this.allWalletList = [
            { // 我的钱包
                id: "03",
                list: this.myWalletList
            },
            { // 合约钱包
                id: "01",
                list: this.contractList
            },
            { // 币币钱包
                id: "02",
                list: this.bibiList
            },
            { // 法币钱包
                id: "04",
                list: this.legalTenderList
            }
        ];
        this.initCoinList(); // 初始化 币种下拉列表
        // m.redraw();
        // this.initCoinValue();// 初始化 币种下拉value
        // this.initWalletListByWTypeAndValue(this.coinMenuOption.currentId); // 初始化钱包 list和value
        this.setMaxTransfer(); // 设置 最大划转
    },
    // 初始化 币种下拉列表
    initCoinList () {
        this.coinBtnList = [];
        // this.coinBtnList：逻辑：每一项至少出现在2个钱包 且 列表去重
        this.allWalletList.forEach((data, index) => {
            // 遍历每个钱包的币种
            data.list.forEach(item => {
                // 币种是否重复
                if (!this.coinBtnList.some(item3 => item3.wType === item.wType)) {
                    item.id = item.wType;
                    item.label = item.wType;
                    item.coinName = wlt.wltFullName[item.wType].name;
                    this.coinBtnList.push(item); // push
                }
            });
        });
        // 初始化 币种默认选中
        if (this.coinBtnList[0]) {
            this.currentCoin = m.route.param().currentCoin || this.coinBtnList[0].coin;
        }
        this.buildCoinBtnList(this.coinBtnList);
        console.log(this.coinBtnList, 9999999999);
        // console.log("币种下拉", this.coinBtnList);
    },
    oninit(vnode) {
        wlt.init(); // 更新数据
        this.initTransferInfo();
        logic.continueSendRedPacket(); // 跳转过来继续发红包
        broadcast.onMsg({
            key: "sendRedP",
            cmd: broadcast.MSG_WLT_READY,
            cb: () => {
                this.initTransferInfo();
            }
        });
        broadcast.onMsg({
            key: "sendRedP",
            cmd: broadcast.MSG_WLT_UPD,
            cb: () => {
                // this.initTransferInfo();
                // console.log(456, wlt.wallet);
            }
        });
    },
    oncreate(vnode) {
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
        wlt.remove();
        broadcast.offMsg({
            key: "sendRedP",
            cmd: broadcast.MSG_WLT_READY,
            isall: true
        });
        broadcast.offMsg({
            key: "sendRedP",
            cmd: broadcast.MSG_WLT_UPD,
            isall: true
        });
    },
    toShare: function() {
        if (window.plus) {
            const demo = HtmlConst.demo('test webview img', 'http://192.168.2.89:8888/imgs/banner/30_zh_b0ed4c346df49b17476de3528efbe58e.jpg');
            console.log(demo);
            GetBase64.loadImageUrlArray(['http://192.168.2.89:8888/imgs/banner/30_zh_b0ed4c346df49b17476de3528efbe58e.jpg'], arg => {
                console.log('GetBase64 loadImageUrlArray', arg);
                GetBase64.getWebView({
                    data: HtmlConst.demo('test webview img', arg[0]),
                    w: '375px',
                    h: '667px'
                }, res => {
                    console.log('GetBase64 getWebView', res);
                    share.openShare({ needShareImg: res });
                });
            });
        }
    }
};

module.exports = logic;