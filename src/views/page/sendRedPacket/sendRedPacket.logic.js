const transferLogic = require('@/views/page/sendRedPacket/transfer/transfer.logic');
const Qrcode = require('qrcode');
const Http = require('@/api').webApi;
const md5 = require('md5');
const m = require('mithril');
const share = require('../main/share/share.logic.js');
const { HtmlConst, GetBase64 } = require('@/models/plus/index.js');
const wlt = require('@/models/wlt/wlt');
const broadcast = require('@/broadcast/broadcast');
const utils = require('@/util/utils').default;
const globalModels = require('@/models/globalModels');
const errCode = require('@/util/errCode').default;
const I18n = require('@/languages/I18n').default;
const models = require('@/models');

const logic = {
    isShowPassWord: false, // 显示密码
    // 红包校验配置
    verifyCfg: {
        maxcount: 20, // 单次红包最大个数
        low: 0, // 单人领取的最低额
        hight: 1, // 红包最高总金额
        dayquota: 100 // 单日金额限制
    },
    gid: '', // 红包id
    // 币种按钮list
    coinBtnList: [],
    // 当前选中币种
    currentCoin: '',
    // 红包类型 // >1：普通/ 0：拼手气
    redPacketType: 0,
    // 钱包可用金额
    wltMoney: '',
    // 取消分享提示 弹框
    isShowNotShareModal: false,
    // 发红包 必须的权限 弹框 (实名认证/资金密码)
    isShowVerifyAuthModal: false,
    // 发红包 必须的权限
    mustAuth: {
        authentication: false, // 是否实名认证
        moneyPassword: false // 是否设置资金密码
    },
    // 分享按钮 loading
    shareLoading: false,
    // 资金密码 模块
    passwordModel: {
        // 密码
        value: "",
        // 更新密码
        updateValue(password) {
            this.value = password;
        },
        // 校验密码
        verifyPassword() {
            if (this.value === "") {
                return this.updateErrMsg(I18n.$t('20083')/* 资金密码输入错误，请重新输入 */);
            }
            return true;
        },
        // 更新提示
        updateErrMsg(msg) {
            msg && window.$message({
                content: msg,
                type: 'danger'
            });
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
        // 校验金额
        verifyMoney(isUpdateMsg = true) {
            // console.log(this.getTotalCoin(), logic.wltMoney, 999);

            if (this.getTotalCoin() > logic.verifyCfg.hight) {
                isUpdateMsg && this.updateErrMsg(`${I18n.$t('20084')/* 单个红包最高发送金额 */}${logic.verifyCfg.hight}${logic.currentCoin}`);
                return false;
            }

            if (this.getTotalCoin() > logic.wltMoney * 1) {
                isUpdateMsg && this.updateErrMsg(I18n.$t('20085')/* 钱包可用资产不足，请及时划转！ */);
                return false;
            }

            if (logic.moneyFormItem.value < logic.verifyCfg.low) {
                // isUpdateMsg && this.updateErrMsg(`${I18n.$t('20086')/* 单笔最低发送 */}${utils.getNormalNumber(logic.verifyCfg.low)}${logic.currentCoin}`);
                isUpdateMsg && this.updateErrMsg(I18n.$t('20128', { value: utils.getNormalNumber(logic.verifyCfg.low) + logic.currentCoin })/* 单个红包最低发送金额{value} */);
                return false;
            }

            isUpdateMsg && this.updateErrMsg(''); // 清空提示
            return true;
        },
        // 校验红包个数
        verifyNumber(isUpdateMsg = true) {
            // const maxNum = parseInt(logic.wltMoney / logic.moneyFormItem.value); // 资金最多可发个数

            // 请输入红包个数
            if (logic.numberFormItem.value === '0') {
                isUpdateMsg && this.updateErrMsg(I18n.$t('20087')/* 请输入红包个数 */);
                return false;
            }
            // 红包个数为空（不提示）
            if (!logic.numberFormItem.value) {
                return false;
            }

            if (logic.redPacketType > 0) { // 普通
                // 一次最多可发xx个红包
                if (logic.numberFormItem.value > logic.verifyCfg.maxcount) {
                    isUpdateMsg && this.updateErrMsg(I18n.$t('20088', { value: logic.verifyCfg.maxcount })/* 一次最多可发{value}个红包 */);
                    return false;
                }
                if (this.getTotalCoin() > logic.wltMoney * 1) {
                    isUpdateMsg && this.updateErrMsg(I18n.$t('20085')/* 钱包可用资产不足，请及时划转！ */);
                    return false;
                }
                // // 账户金额最多可发
                // if (logic.numberFormItem.value > maxNum) {
                //     isUpdateMsg && this.updateErrMsg(`一次最多可发${maxNum}个红包`);
                //     return false;
                // }
            } else { // 拼手气
                // 一次最多可发xx个红包
                if (logic.numberFormItem.value > logic.verifyCfg.maxcount) {
                    isUpdateMsg && this.updateErrMsg(I18n.$t('20088', { value: logic.verifyCfg.maxcount })/* 一次最多可发{value}个红包 */);
                    return false;
                }
                //
                if (logic.numberFormItem.value * logic.verifyCfg.low > logic.moneyFormItem.value) {
                    isUpdateMsg && this.updateErrMsg(I18n.$t('20128', { value: utils.getNormalNumber(logic.verifyCfg.low) + logic.currentCoin })/* 单个红包最低发送金额{value} */);
                    return false;
                }
            }
            isUpdateMsg && this.updateErrMsg(''); // 清空提示
            return true;
        },
        // 校验表单 isUpdateMsg/是否更新错误消息
        verifyAll(isUpdateMsg = true) {
            if (!this.verifyMoney(isUpdateMsg)) return; // 钱包可用资产不足，请及时划转！
            if (!this.verifyNumber(isUpdateMsg)) return; // 校验红包个数
            return true;
        },
        // 更新提示
        updateErrMsg(msg) {
            msg && window.$message({
                content: msg,
                type: 'danger'
            });
        },
        // 获取总金额
        getTotalCoin() {
            if (logic.redPacketType > 0) { // 普通红包
                return utils.toFixedForFloor((logic.numberFormItem.value * logic.moneyFormItem.value || '0'), 4);
            } else { // 拼手气红包
                return utils.toFixedForFloor(logic.moneyFormItem.value || '0', 4);
            }
        }
    },
    // 切换红包类型
    switchRedPacketType() {
        this.redPacketType = this.redPacketType > 0 ? 0 : (logic.numberFormItem.value || 1);
        const isPass = logic.formModel.verifyNumber(); // 校验个数
        if (isPass) logic.formModel.verifyMoney(); // 校验金额
    },
    // 头部 组件配置
    headerOption: {
        left: {
            onclick() {
                window.router.back();
            }
        },
        right: {
            label: I18n.$t('20036'), // '我的红包'
            class: 'has-text-level-1',
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
            if (this.value < 0) {
                this.value = "";
            } else if (this.value > 0) {
                this.value = utils.toFixed2(this.value, 4);
            }
        }
    },
    // 红包个数 fomeItem组件配置
    numberFormItem: {
        value: '',
        updateOption(params) {
            // 输入数字 更新value
            if (/^[0-9]*$/.test(params.value)) {
                this.value = params.value;
            }
            // 一下情况清空value
            if (params.value === '' || params.value.substr(0, 1) === '.' || params.value.substr(0, 1) === '0') {
                this.value = "";
            }
            // console.log(this.value);
        }
    },
    // info信息 fomeItem组件配置
    infoFormItem: {
        value: I18n.$t('20089')/* 大吉大利，全天盈利 */,
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
            if (logic.passwordModel.verifyPassword()) {
                logic.sendgift(); // 发红包
            }
        }
    },
    // 划转按钮click
    transferBtnClick() {
        transferLogic.updateOption({
            isShow: true,
            coin: logic.currentCoin
        });
    },
    // 获取币种的人民币估值
    getRMBByCoinMoney() {
        if (logic.redPacketType * 1 === 0) { // 拼手气红包
            const rmb = wlt.getPrz(logic.currentCoin) * logic.moneyFormItem.value * wlt.prz;
            return utils.toFixedForFloor(rmb, 2);
        } else { // 普通红包
            const rmb = wlt.getPrz(logic.currentCoin) * logic.moneyFormItem.value * logic.numberFormItem.value * wlt.prz;
            return utils.toFixedForFloor(rmb, 2);
        }
    },
    // 塞币进红包 click
    coinToRedPacketBtnClick() {
        logic.verifyMustAuth(); // 校验 需要的权限
        // logic.sendRedPModal.updateOption({ isShow: true }); // -------------- 临时发红包 跳过权限验证 --------------
    },
    // 校验 需要的权限
    verifyMustAuth() {
        const account = globalModels.getAccount();
        // 实名认证通过 iStatus: 9
        if (account.iStatus === 9) {
            logic.mustAuth.authentication = true;
        }
        // if (account.iStatus === 0 || account.iStatus === 2) {
        //     // 为了您的账户安全，请按照提示实名认证！
        // }
        // if (account.iStatus === 1) {
        //     // 为了您的账户安全，实名认证通过后才可提现！
        // }
        // 设置资金密码通过 settingValue：'*'
        Http.getWalletPwdStatus({ settingType: 13, settingKey: 'ucp' }).then(res => {
            if (res.result.code === 0) {
                logic.mustAuth.moneyPassword = res?.settingValue === '*';
                if (logic.mustAuth.authentication && logic.mustAuth.moneyPassword) { // 实名认证和资金密码全部开通
                    logic.sendRedPModal.updateOption({ isShow: true }); // 发红包弹框
                    m.redraw();
                } else {
                    logic.isShowVerifyAuthModal = true; // 实名认证/资金密码 弹框
                }
            } else {
                window.$message({
                    content: errCode.getRedPacketErrorCode(res.result.code),
                    type: 'danger'
                });
            }
        });
    },
    // 实名认证/资金密码弹框 OK click
    verifyAuthModalOkBtnClick() {
        logic.isShowVerifyAuthModal = false; // 关闭自己
        // // 必须实名认证/设置资金密码
        if (logic.mustAuth.authentication && logic.mustAuth.moneyPassword) { // 实名认证/资金密码全部开通
            logic.sendRedPModal.updateOption({ isShow: true }); // 发红包弹框
        }
    },
    // 红包配置 接口
    getRedPackCfg() {
        const params = {};
        Http.getRedPackCfg(params).then(arg => {
            if (arg.result.code === 0) {
                console.log('红包配置 success', arg);
                logic.verifyCfg.maxcount = arg.result.cfgs.maxcount; // 单次红包最大个数
                logic.buildCoinBtnList(arg.result.coincfgs);
            } else {
                window.$message({
                    content: errCode.getRedPacketErrorCode(arg.result.code),
                    type: 'danger'
                });
            }
        }).catch(function(err) {
            console.log('红包配置 error', err);
        });
    },
    // 币种按钮list
    buildCoinBtnList(obj) {
        const list = [];
        for (const key in obj) {
            const item = obj[key];
            item.label = key;
            if (key === 'USDT') {
                list.unshift(item);
            } else {
                list.push(item);
            }
        }
        // 按钮list
        this.coinBtnList = list.map(item => {
            const btnOption = {
                label: item.label,
                class: () => `is-primary is-rounded mr-2 font-weight-bold ${logic.currentCoin === item.label ? '' : 'is-outlined'}`,
                size: 'size-2',
                data: item,
                onclick() {
                    logic.coinBtnClick(item);
                }
            };
            return btnOption;
        });
        const coin = logic.currentCoin ? logic.currentCoin : this.coinBtnList[0]?.label;
        logic.setCurrentCoin(coin); // 设置选中币种及相关配置
        this.setMaxTransfer(); // 设置最大划转
        m.redraw();
    },
    // 设置选中币种及相关配置
    setCurrentCoin(coin) {
        const currentItem = logic.coinBtnList.find(item => item.label === coin); // 当前币种对象
        logic.currentCoin = currentItem.label; // 当前选中币种
        logic.verifyCfg.low = currentItem.data.low;// 单人领取的最低额
        logic.verifyCfg.hight = currentItem.data.hight;// 红包最高总金额
        logic.verifyCfg.dayquota = currentItem.data.dayquota;// 单日金额限制
    },
    // 币种按钮click
    coinBtnClick(item) {
        logic.setCurrentCoin(item.label); // 设置选中币种及相关配置
        // console.log(logic.verifyCfg);
        logic.setMaxTransfer(); // 设置最大划转
        logic.formModel.verifyAll(); // 校验表单
        logic.reset(); // 重置
    },
    // 发红包接口
    sendgift() {
        const params = {
            coin: logic.currentCoin, // 币种
            type: logic.redPacketType > 0 ? logic.moneyFormItem.value : 0, // 类型 0:拼手气, >0:普通红包且数字是单个红包金额
            quota: logic.moneyFormItem.value, // 金额
            count: logic.numberFormItem.value, // 数量
            des: logic.infoFormItem.value || I18n.$t('20089')/* 大吉大利，全天盈利 */, // 留言
            passd: md5(logic.passwordModel.value) // 密码
        };
        // const account = globalModels.getAccount();
        // if (account.email) params.gemail = account.email;
        // if (account.phone) params.gtel = account.phone;

        logic.shareLoading = true;
        Http.sendgift(params).then(function(arg) {
            if (arg.result.code === 0) {
                wlt.init();
                logic.gid = arg.result.data.gid;
                logic.toShare({
                    link: window.location.origin + window.location.pathname + `/#!/receiveRedPacket?gid=${logic.gid}&r=${globalModels.getAccount().uid}`
                });
                console.log('发红包 success', arg.result.data);
            } else {
                let msgValue = "";
                // 单个红包最高发送金额{value}
                if (arg.result.code === "-1001") {
                    msgValue = logic.verifyCfg.hight + logic.currentCoin;
                }
                // 单个红包最低发送金额{value}
                if (arg.result.code === "-1006") {
                    msgValue = logic.verifyCfg.low + logic.currentCoin;
                }
                // 已超出单日发送限额{value}
                if (arg.result.code === "-1010") {
                    msgValue = logic.verifyCfg.dayquota + logic.currentCoin;
                }
                // 一次最多可发{value}个红包
                if (arg.result.code === "-1011") {
                    msgValue = logic.verifyCfg.maxcount;
                }
                window.$message({
                    content: errCode.getRedPacketErrorCode(arg.result.code, msgValue),
                    type: 'danger'
                });
                logic.shareLoading = false;
                logic.passwordModel.updateErrMsg(arg.result.data.err_msg);
            }
        }).catch(function(err) {
            console.log('发红包 error', err);
        });
    },
    // 取消分享后 弹框的知道了按钮
    notShareModalCancel() {
        logic.isShowNotShareModal = false;
    },
    // 取消分享后 弹框的继续分享按钮
    notShareModalToShareClick() {
        logic.isShowNotShareModal = false;
        logic.toShare({
            link: window.location.origin + window.location.pathname + `/#!/receiveRedPacket?gid=${logic.gid}`
        });
    },
    // 重置
    reset() {
        // logic.currentCoin = "";// 币种
        logic.redPacketType = 0;// 红包类型
        logic.moneyFormItem.value = ""; // 金额
        logic.numberFormItem.value = ""; // 数量
        logic.infoFormItem.value = I18n.$t('20089')/* 大吉大利，全天盈利 */; // 祝福
        logic.passwordModel.value = ""; // 密码
        logic.passwordModel.updateErrMsg('');// 密码错误消息
    },
    // 设置 最大划转 (依赖钱包名称, 币种)
    setMaxTransfer () {
        if (wlt.wallet) { // 所有钱包 和 从xx钱包id 都存在
            const wallet = wlt.wallet["03"]; // 对应钱包
            // console.log(77777, this.currentCoin, wallet);
            for (const item of wallet) {
                if (item.coin === this.currentCoin) { // 找到对应币种
                    this.wltMoney = utils.toFixedForFloor(item.wdrawable || 0, 4); // 设置最大可以金额
                }
            }
        } else {
            this.wltMoney = "--";
        }
        // console.log(this.wltMoney, "最大划转");
    },
    oninit(vnode) {
        // utils.getItem('loginState')
        if (!utils.getItem('ex-session')) {
            // window.open('/m/login/', '_self');
            window.open('/m/#/userLogin', '_self');
        }
        wlt.init(); // 更新数据
        broadcast.onMsg({
            key: "sendRedP",
            cmd: broadcast.MSG_WLT_UPD,
            cb: () => {
                this.setMaxTransfer();
                m.redraw();
            }
        });
        // 获取用户信息 成功
        broadcast.onMsg({
            key: "sendRedP_GET_USER_INFO_READY",
            cmd: broadcast.GET_USER_INFO_READY,
            cb: () => {
                // console.log(555555, "// 获取用户信息 成功");
                this.getRedPackCfg();
            }
        });
        // 获取用户信息 失败
        broadcast.onMsg({
            key: "sendRedP_GET_USER_INFO_ERROR",
            cmd: broadcast.GET_USER_INFO_ERROR,
            cb: () => {
                // console.log("// 获取用户信息 失败");
                window.open('/m/#/userLogin', '_self');
            }
        });

        models.getUserInfo();
    },
    oncreate(vnode) {
        // share.openShare({
        //     needShareImg: null,
        //     link: "link",
        //     cancelCallback(params) {
        //         logic.cancelCallback(params);
        //     }
        // }); // 打开分享弹框
    },
    onupdate(vnode) {
    },
    onremove(vnode) {
        wlt.remove();
        broadcast.offMsg({
            key: "sendRedP",
            cmd: broadcast.MSG_WLT_UPD,
            isall: true
        });
        broadcast.offMsg({
            key: "sendRedP_GET_USER_INFO_ERROR",
            cmd: broadcast.GET_USER_INFO_ERROR,
            isall: true
        });
        broadcast.offMsg({
            key: "sendRedP_GET_USER_INFO_READY",
            cmd: broadcast.GET_USER_INFO_READY,
            isall: true
        });
    },
    // 取消分享回调
    cancelCallback(params) {
        if (!params.isShare) {
            this.isShowNotShareModal = true;
            m.redraw();
        }
    },
    // 分享
    toShare: function(param) {
        const link = param.link; // 需要分享的链接
        const img1 = window.location.origin + window.location.pathname + require('@/assets/img/shareBg.jpg').default;
        const img2 = window.location.origin + window.location.pathname + require('@/assets/img/logo.png').default;
        console.log(img1, img2);
        // share.openShare({
        //     needShareImg: null,
        //     link: link,
        //     cancelCallback(params) {
        //         logic.cancelCallback(params);
        //     }
        // }); // 打开分享弹框
        if (window.plus) {
            Qrcode.toDataURL(link).then(base64 => {
                GetBase64.loadImageUrlArray([img1, img2, base64], arg => {
                    console.log('GetBase64 loadImageUrlArray', arg);
                    GetBase64.getWebView({
                        data: HtmlConst.shareRedPacket([I18n.$t('20050')/* 分享红包 */, I18n.$t('20051')/* 红包资产可用来提现，交易 */, I18n.$t('20064')/* 下载APP，轻松交易 */], arg),
                        W: 375,
                        H: 667
                    }, res => {
                        console.log('GetBase64 getWebView', res);
                        share.openShare({
                            needShareImg: res,
                            link: link,
                            cancelCallback(params) {
                                logic.cancelCallback(params);
                            }
                        }); // 打开分享弹框
                        logic.sendRedPModal.updateOption({ isShow: false });// 关闭发红包弹框
                        logic.reset(); // 重置
                        logic.shareLoading = false;
                        m.redraw();
                    });
                });
            }).catch(err => {
                logic.shareLoading = false;
                m.redraw();
                console.log(err);
            });
        } else {
            logic.sendRedPModal.updateOption({ isShow: false });// 关闭发红包弹框
            logic.reset(); // 重置
            logic.shareLoading = false;
            // h5分享红包
            window.router.push({
                path: "/shareH5", // h5分享红包
                data: {
                    link: link // 链接
                }
            });
        }
    }
};

module.exports = logic;