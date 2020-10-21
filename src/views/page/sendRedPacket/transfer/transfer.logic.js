const wlt = require('@/models/wlt/wlt');
const Http = require('@/api').webApi;
const broadcast = require('@/broadcast/broadcast');
const utils = require('@/util/utils').default;
const I18n = require('@/languages/I18n').default;

const logic = {
    isShow: false, // 显示划转弹框
    transferMoney: "", // 划转金额
    maxMoney: 0, // 可用金额
    coin: "", // 币种

    allWalletList: [], // 所有账户
    contractList: [], // 合约账户
    bibiList: [], // 币币账户
    myWalletList: [], // 我的钱包
    legalTenderList: [], // 法币账户
    baseWltList: [
        {
            id: "01",
            label: I18n.$t('20073')/* 合约账户 */
        },
        {
            id: "02",
            label: I18n.$t('20074')/* 币币账户 */
        },
        {
            id: "03",
            label: I18n.$t('20075')/* 我的钱包 */
        },
        {
            id: "04",
            label: I18n.$t('20076')/* 法币账户 */
        }
    ],
    // 更新划转弹框数据
    updateOption(params) {
        Object.keys(params).forEach(key => (this[key] = params[key]));
        this.reset(); // 重置
        this.init();
        logic.setMaxTransfer(); // 设置 最大划转
    },
    onOk() {
        this.submit();
    },
    onClose() {
        this.updateOption({ isShow: !this.isShow });
    },
    // form钱包 列表
    fromWltList: [],
    // to钱包 列表
    toWltList: [
        {
            id: "03",
            label: I18n.$t('20075')/* 我的钱包 */
        }
    ],
    // form钱包 下拉组件配置
    fromDropdown: {
        evenKey: "fromMenuOption",
        showMenu: false,
        currentId: "01",
        menuHeight: 120,
        updateOption (option) {
            Object.keys(option).forEach(key => (this[key] = option[key]));
        },
        menuClick (item) {
            logic.setMaxTransfer(); // 设置 最大划转
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
        currentId: "03",
        menuHeight: 120,
        updateOption (option) {
            Object.keys(option).forEach(key => (this[key] = option[key]));
        },
        menuClick (item) {
        },
        menuList() {
            return logic.toWltList;
        }
    },
    // 初始化 划转信息
    init () {
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
        this.initAuthWalletListByCoin(); // 初始化 有权限的钱包list
        this.setMaxTransfer(); // 设置 最大划转
    },
    // 初始化 有权限的钱包list coin: 合约）
    initAuthWalletListByCoin () {
        // 遍历不同种类钱包
        this.authWltList = this.allWalletList.map(wallet => {
            // 当前钱包是否有该币种
            const hasWType = wallet.list.some(item1 => item1.wType === logic.coin);
            if (hasWType) {
                // 有就用该id 去base钱包中找
                return this.baseWltList.find(item3 => item3.id === wallet.id);
            }
        });
        this.authWltList = this.authWltList.filter(item => item); // 钱包列表 去空
        console.log(9999, this.authWltList);
        this.fromWltList = this.authWltList.filter(item => item.id !== this.toDropdown.currentId); // 来源钱包下拉
    },
    // 设置 最大划转 (依赖钱包名称, 币种)
    setMaxTransfer () {
        // 所有钱包 和 从xx钱包id 都存在
        if (wlt.wallet) {
            // 对应钱包
            const wallet = wlt.wallet[logic.fromDropdown.currentId];
            // 对应币种
            const arr = wallet.filter(t => {
                return t.wType === logic.coin;
            });
            if (arr.length > 0) {
                this.maxMoney = utils.toFixedForFloor(arr[0].wdrawable || 0, 4); // 设置最大可以金额
            } else {
                this.maxMoney = "--";
            }
        } else {
            this.maxMoney = "--";
        }
        // m.redraw();
    },
    // 提交
    submit () {
        // api
        const params = {
            aTypeFrom: this.fromDropdown.currentId,
            aTypeTo: this.toDropdown.currentId,
            wType: this.coin,
            num: this.transferMoney
        };
        Http.postTransfer(params).then(res => {
            if (res.result.code === 0) {
                this.updateOption({ isShow: !this.isShow });// 划转弹框隐藏
                this.reset(); // 重置
                wlt.init(); // 更新数据
                window.$message({ content: I18n.$t('10414')/* 资金划转成功！ */, type: 'success' });
            } else {
                window.$message({ content: I18n.$t('20077')/* 资金划转失败！ */, type: 'danger' });
            }
        }).catch(err => {
            console.log(err);
        });
    },
    // 校验
    verifyForm() {
        // 划转金额不能大于可用金额
        if ((logic.transferMoney * 1 <= logic.maxMoney * 1) && (logic.transferMoney * 1)) {
            return true;
        }
        return false;
    },
    // 重置
    reset() {
        this.transferMoney = "";
        this.fromDropdown.currentId = "01";
    },
    oninit(vnode) {
        wlt.init(); // 更新数据
        broadcast.onMsg({
            key: "Transfer",
            cmd: broadcast.MSG_WLT_READY,
            cb: () => {
                // this.initTransferInfo();
            }
        });
        broadcast.onMsg({
            key: "Transfer",
            cmd: broadcast.MSG_WLT_UPD,
            cb: () => {
                // this.initTransferInfo();
            }
        });
    },
    onremove(vnode) {
        wlt.remove();
        broadcast.offMsg({
            key: "Transfer",
            cmd: broadcast.MSG_WLT_READY,
            isall: true
        });
        broadcast.offMsg({
            key: "Transfer",
            cmd: broadcast.MSG_WLT_UPD,
            isall: true
        });
    }
};
module.exports = logic;
