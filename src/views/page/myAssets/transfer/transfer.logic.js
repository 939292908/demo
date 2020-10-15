/**
 * 可传参数
 * transferTo: 默认选中 到xx钱包 ('01': 合约账户, '02': 币币账户, '03': 我的钱包, '04': 法币账户)
 * transferFrom: 默认选中 从xx钱包 ('01': 合约账户, '02': 币币账户, '03': 我的钱包, '04': 法币账户)
 * coin: 默认选中 币种 (USDT)
 */
var m = require("mithril");
const wlt = require('@/models/wlt/wlt');
const I18n = require('@/languages/I18n').default;
const Http = require('@/api').webApi;
const errCode = require('@/util/errCode').default;
const config = require('@/config.js');
const follow = require('@/models/follow/followData');

const model = {
    vnode: {},
    isShowTransferModal: false, // 划转弹框 显示/隐藏
    showFromMenu: false, // show from菜单
    showMenuTo: false, // show to菜单
    showlegalTenderModal: false, // show 法币提示弹框
    wallets: wlt.wallet, // all数据
    form: {
        // coin: "", // 币种 value
        // transferFrom: "", // 从xx钱包 value
        // transferTo: "", // 到xx钱包 value
        num: '', // 数量
        maxTransfer: 0 // 最大划转
    },
    canTransferCoin: [], // 币种下拉
    allWalletList: [], // 所有账户
    contractList: [], // 合约账户
    bibiList: [], // 币币账户
    myWalletList: [], // 我的钱包
    legalTenderList: [], // 法币账户
    baseWltList: [], // 钱包列表 所有
    authWltList: [], // 钱包列表 当前币种有权限
    fromWltList: [], // 钱包列表 从xx  （from与to钱包 不能同一种类型相互划转）
    toWltList: [], // 钱包列表 到xx
    successCallback () {}, // 划转成功回调
    /**
     * @method 设置资金划转弹框
     * @param { {
     * isShow: false, // 弹窗显示隐藏
     * transferFrom: '03', // from钱包默认选中
     * coin: 'USDT', // 币种 默认选中
     * successCallback(){} // 划转成功回调
     * } } option
     */
    setTransferModalOption(option) {
        this.reset(); // 重置
        model.isShowTransferModal = option.isShow;
        if (option.successCallback) model.successCallback = option.successCallback;
        if (option.transferFrom) model.fromMenuOption.currentId = option.transferFrom;
        if (option.coin) model.coinMenuOption.currentId = option.coin;
        this.initTransferInfo(); // 初始化 划转信息
    },
    // 初始化语言
    initLanguage () {
        this.baseWltList = [
            {
                id: '01',
                label: I18n.$t('10072') // '合约账户'
            },
            {
                id: '02',
                label: I18n.$t('10073') // '币币账户'
            },
            {
                id: '03',
                label: I18n.$t('10055') // '我的钱包'
            },
            {
                id: '04',
                label: I18n.$t('10074') // '法币账户'
            }
        ];
        if (config.openFollow) {
            this.baseWltList.push({
                id: '06',
                label: I18n.$t('10548') // 跟单
            });
        }
    },
    // 初始化 划转信息
    initTransferInfo () {
        this.initLanguage(); // 初始化语言
        this.contractList = wlt.wallet['01'].filter(item => item.Setting.canTransfer); // 合约钱包 币种list
        this.bibiList = wlt.wallet['02'].filter(item => item.Setting.canTransfer); // 币币钱包 币种list
        this.myWalletList = wlt.wallet['03'].filter(item => item.Setting.canTransfer); // 我的钱包 币种list
        this.legalTenderList = wlt.wallet['04'].filter(item => item.Setting.canTransfer); // 法币钱包 币种list
        this.followList = config.openFollow ? follow.wallet.filter(item => item.Setting.canTransfer) : []; //  跟单 币种list
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
        if (config.openFollow) {
            this.allWalletList.push({
                id: '06',
                list: this.followList
            });
        }
        this.initCoinList(); // 初始化 币种下拉列表
        this.initCoinValue();// 初始化 币种下拉value
        this.initWalletListByWTypeAndValue(this.coinMenuOption.currentId); // 初始化钱包 list和value
        this.setMaxTransfer(); // 设置 最大划转
    },
    // 初始化 币种下拉列表
    initCoinList () {
        this.canTransferCoin = [];
        // this.canTransferCoin：逻辑：每一项至少出现在2个钱包 且 列表去重
        this.allWalletList.forEach((data, index) => {
            // 遍历每个钱包的币种
            data.list.forEach(item => {
                // 币种是否出现在2个钱包
                // const hasMore = this.allWalletList.some((data2, index2) => index !== index2 && data2.list.some(item2 => item2.wType === item.wType));
                // 币种是否重复
                // if (hasMore && !this.canTransferCoin.some(item3 => item3.wType === item.wType)) {
                if (!this.canTransferCoin.some(item3 => item3.wType === item.wType)) {
                    item.id = item.wType;
                    item.label = item.wType;
                    item.coinName = wlt.wltFullName[item.wType].name;
                    item.render = (params, currentId) => {
                        return m('div', { class: `` }, [
                            m('span', { class: `mr-2` }, params.label),
                            m('span', { class: params.id === currentId ? `has-active` : `has-hover has-text-level-4` }, params.coinName)
                        ]);
                    };
                    this.canTransferCoin.push(item); // push
                }
            });
        });
        // 初始化 币种默认选中
        if (this.canTransferCoin[0]) {
            this.curItem = this.canTransferCoin.find(item => item.id === this.coinMenuOption.currentId) || this.canTransferCoin[0];
        }
        // console.log("币种下拉", this.canTransferCoin);
    },
    // 初始化 币种下拉value
    initCoinValue() {
        if (this.canTransferCoin[0]) { // 有币种下拉
            this.coinMenuOption.currentId = this.coinMenuOption.currentId ? this.coinMenuOption.currentId : this.canTransferCoin[0].wType; // 默认选中第1个
        }
    },
    // 初始化 钱包list和value
    initWalletListByWTypeAndValue (wType) {
        this.initAuthWalletListByWType(wType);// 1. 有权限的钱包list 初始化
        this.initFromAndToValueByAuthWalletList(); // 2. 钱包value  初始化
        this.initFromAndToWalletListByValue(); // 3. 2个钱包list 初始化 （依赖钱包value）
    },
    // 初始化 有权限的钱包list （wType: 合约）
    initAuthWalletListByWType (wType) {
        // 遍历不同种类钱包
        this.authWltList = this.allWalletList.map(wallet => {
            // 当前钱包是否有该币种
            const hasWType = wallet.list.some(item1 => item1.wType === wType);
            if (hasWType) {
                // 有就用该id 去base钱包中找
                return this.baseWltList.find(item3 => item3.id === wallet.id);
            }
        });
        this.authWltList = this.authWltList.filter(item => item); // 钱包列表 去空
    },
    // 初始化 2个钱包value
    initFromAndToValueByAuthWalletList () {
        // form钱包value
        const buildFromWalletValue = value => {
            // 有权限
            if (this.authWltList.some(item => item.id === value)) {
                return value;
            } else {
                // 无权限
                return this.authWltList[0] && this.authWltList[0].id;
            }
        };
        // to钱包value
        const buildToWalletValue = value => {
            // 有权限 且 不等于from钱包value
            if (this.authWltList.some(item => item.id === value) && value !== this.fromMenuOption.currentId) {
                return value;
            } else {
                // 无权限 默认除不能和from钱包value相同的第1条
                const toWlt = this.authWltList.filter(item => item.id !== this.fromMenuOption.currentId);
                return toWlt[0] && toWlt[0].id;
            }
        };

        // 从xx钱包
        this.fromMenuOption.currentId = buildFromWalletValue(this.fromMenuOption.currentId || '03');
        // 到xx钱包
        this.toMenuOption.currentId = buildToWalletValue(this.toMenuOption.currentId);
        console.log(this.fromMenuOption.currentId, this.toMenuOption.currentId);
    },
    // 初始化 2个钱包list （依赖钱包value 和 coin）
    initFromAndToWalletListByValue () {
        // this.fromWltList = this.authWltList.filter(item => item.id !== this.toMenuOption.currentId);
        this.fromWltList = this.authWltList;
        this.toWltList = this.authWltList.filter(item => {
            if (item.id !== this.fromMenuOption.currentId) {
                if (this.fromMenuOption.currentId === '06') {
                    return item.id === '03';
                }
                return true;
            }
            return false;
        });
        // console.log("this.authWltList", this.authWltList, "this.fromWltList", this.fromWltList, "this.toWltList", this.toWltList);
    },
    // handler 切换按钮click
    handlerSwitchBtnClick () {
        this.form.num = '';
        this.switchTransfer(); // 2个钱包value切换
        this.initFromAndToWalletListByValue(); // 2个钱包列表 初始化 （依赖钱包value）
        this.setMaxTransfer(); // 设置 最大划转
    },
    // handler 数量输入框oninput
    handlerNumOnInput (e) {
        // value最小为0
        this.form.num = Number(e.target.value) < 0 ? 0 : e.target.value;
    },
    // handler 划转全部click
    handlerSetAllNumClick() {
        this.form.num = this.form.maxTransfer;
    },
    // handler 关闭划转弹框
    handlerCloseTransferModal () {
        this.setTransferModalOption({ isShow: false }); // 弹框隐藏
        this.reset(); // 重置
    },
    // handler 法币弹框确认click
    handlerLegalTenderModalClick() {
        this.showlegalTenderModal = false; // 弹框隐藏
        wlt.init(); // 更新数据
        this.reset(); // 重置
    },
    // 钱包value切换
    switchTransfer () {
        [this.fromMenuOption.currentId, this.toMenuOption.currentId] = [this.toMenuOption.currentId, this.fromMenuOption.currentId];
    },
    // 设置 最大划转 (依赖钱包名称, 币种)
    setMaxTransfer () {
        if (wlt.wallet && this.fromMenuOption.currentId) { // 所有钱包 和 从xx钱包id 都存在
            const wallet = wlt.wallet[this.fromMenuOption.currentId]; // 对应钱包
            for (const item of wallet) {
                if (item.wType === this.coinMenuOption.currentId) { // 找到对应币种
                    console.log(item.wdrawable, item, '设置最大可以金额');
                    this.form.maxTransfer = item.wdrawable || 0; // 设置最大可以金额
                }
            }
        } else {
            this.form.maxTransfer = "--";
        }
    },
    // 配置 币种菜单
    coinMenuOption: {
        evenKey: "coinMenuOption",
        showMenu: false,
        currentId: "",
        menuHeight: 260,
        updateOption (option) {
            Object.keys(option).forEach(key => (this[key] = option[key]));
        },
        menuClick (item) {
            model.setMaxTransfer(); // 设置 最大划转
            model.initWalletListByWTypeAndValue(this.currentId); // 初始化钱包 list和value
        },
        menuList() {
            return model.canTransferCoin;
        }
    },
    // 配置 从xx钱包菜单
    fromMenuOption: {
        evenKey: "fromMenuOption",
        showMenu: false,
        currentId: "",
        menuHeight: 180,
        updateOption (option) {
            Object.keys(option).forEach(key => (this[key] = option[key]));
        },
        menuClick (item) {
            console.log(model.fromMenuOption.currentId, model.toMenuOption.currentId);
            model.initWalletListByWTypeAndValue(model.coinMenuOption.currentId); // 初始化 2个钱包value/下拉列表
            model.setMaxTransfer(); // 设置 最大划转
        },
        menuList() {
            return model.fromWltList;
        }
    },
    // 配置 到xx钱包菜单
    toMenuOption: {
        evenKey: "toMenuOption",
        showMenu: false,
        currentId: "",
        menuHeight: 180,
        updateOption (option) {
            Object.keys(option).forEach(key => (this[key] = option[key]));
        },
        menuClick (item) {
            // console.log(model.fromMenuOption.currentId, model.toMenuOption.currentId);
            model.initWalletListByWTypeAndValue(model.coinMenuOption.currentId); // 初始化 2个钱包value/下拉列表
            model.setMaxTransfer(); // 设置 最大划转
        },
        menuList() {
            return model.toWltList;
        }
    },
    // 提交
    submit () {
        // 校验
        if (this.form.num === '0') {
            return window.$message({ title: I18n.$t('10410' /** 提示 */), content: I18n.$t('10411' /** 划转数量不能为0 */), type: 'danger' });
        } else if (!this.form.num) {
            return window.$message({ title: I18n.$t('10410' /** 提示 */), content: I18n.$t('10412' /** 划转数量不能为空 */), type: 'danger' });
        } else if (Number(this.form.num) === 0) {
            return window.$message({ title: I18n.$t('10410' /** 提示 */), content: I18n.$t('10411' /** 划转数量不能为0 */), type: 'danger' });
        } else if (Number(this.form.num) > Number(this.form.maxTransfer)) {
            return window.$message({ title: I18n.$t('10410' /** 提示 */), content: I18n.$t('10413' /** 划转数量不能大于最大可划 */), type: 'danger' });
        }
        model.setMaxTransfer(); // 设置 最大划转

        if (this.fromMenuOption.currentId === '06' || this.toMenuOption.currentId === '06') {
            const params = {
                num: this.form.num,
                coin: this.coinMenuOption.currentId,
                aTypeFrom: this.fromMenuOption.currentId === '06' ? '018' : this.fromMenuOption.currentId,
                aTypeTo: this.toMenuOption.currentId === '06' ? '018' : this.toMenuOption.currentId
            };
            Http.followTransrer(params).then(res => {
                if (res.code === 0) {
                    model.setTransferModalOption({ isShow: false }); // 划转弹框隐藏
                    this.reset(); // 重置
                    wlt.init(); // 更新数据
                    window.$message({ title: I18n.$t('10410' /** 提示 */), content: I18n.$t('10414' /** 资金划转成功！ */), type: 'success' });
                    model.initFromAndToValueByAuthWalletList(); // 2. 钱包value  初始化
                } else {
                    window.$message({ title: I18n.$t('10410' /** 提示 */), content: errCode.getWebApiErrorCode(res.code), type: 'danger' });
                }
                this.successCallback(); // 成功回调
            });
        } else {
            const params = {
                aTypeFrom: this.fromMenuOption.currentId,
                aTypeTo: this.toMenuOption.currentId,
                wType: this.coinMenuOption.currentId,
                num: this.form.num
            };
            Http.postTransfer(params).then(res => {
                if (res.result.code === 0) {
                    model.setTransferModalOption({ isShow: false }); // 划转弹框隐藏
                    this.reset(); // 重置
                    wlt.init(); // 更新数据
                    window.$message({ title: I18n.$t('10410' /** 提示 */), content: I18n.$t('10414' /** 资金划转成功！ */), type: 'success' });
                    model.initFromAndToValueByAuthWalletList(); // 2. 钱包value  初始化
                } else {
                    // 往法币划转
                    if (Number(res.result.code) === 9040) {
                        model.setTransferModalOption({ isShow: false }); // 划转弹框隐藏
                        model.showlegalTenderModal = true; // 法币弹框显示
                        m.redraw();
                    } else {
                        window.$message({ title: I18n.$t('10410' /** 提示 */), content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
                    }
                }
                this.successCallback(); // 成功回调
            }).catch(err => {
                console.log(err);
            });
        }
        // console.log("我提交了", this.form, 666);
    },
    // 重置
    reset() {
        this.coinMenuOption.currentId = ""; // 币种 value
        this.fromMenuOption.currentId = ""; // 从xx钱包 value
        this.toMenuOption.currentId = ""; // 到xx钱包 value
        this.form.num = ""; // 数量
        this.form.maxTransfer = ""; // 最大划转
    },
    initEVBUS () {
    },
    rmEVBUS () {
    },
    oninit (vnode) {
        this.vnode = vnode;
        wlt.init();
        this.initTransferInfo();
        this.initLanguage();
    },
    oncreate (vnode) {
        this.initEVBUS();
        this.initTransferInfo();
    },
    onupdate (vnode) {
    },
    onremove (vnode) {
        wlt.remove();
        this.rmEVBUS();
    }
};

module.exports = model;