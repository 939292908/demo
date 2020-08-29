/**
 * 可传参数
 * transferTo: 默认选中 到xx钱包 ('01': 合约账户, '02': 币币账户, '03': 我的钱包, '04': 法币账户)
 * transferFrom: 默认选中 从xx钱包 ('01': 合约账户, '02': 币币账户, '03': 我的钱包, '04': 法币账户)
 * coin: 默认选中 币种 (USDT)
 */
const wlt = require('@/models/wlt/wlt');
const I18n = require('@/languages/I18n').default;
const Http = require('@/api').webApi;

const model = {
    vnode: {},
    showCurrencyMenu: false, // show币种菜单
    showFromMenu: false, // show from菜单
    showMenuTo: false, // show to菜单
    wallets: wlt.wallet, // all数据
    form: {
        coin: "USDT", // 合约下拉列表 value
        transferFrom: '03', // 从xx钱包 value
        transferTo: '01', // 到xx钱包 value
        num: '',
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
    // 初始化语言
    initLanguage () {
        this.baseWltList = [
            {
                id: '01',
                label: '合约账户'
            },
            {
                id: '02',
                label: '币币账户'
            },
            {
                id: '03',
                label: '我的钱包'
            },
            {
                id: '04',
                label: '法币账户'
            }
        ];
    },
    // 初始化 划转信息
    initTransferInfo () {
        this.contractList = wlt.wallet['01'].filter(item => item.Setting.canTransfer); // '合约账户',
        this.bibiList = wlt.wallet['02'].filter(item => item.Setting.canTransfer); // '币币账户',
        this.myWalletList = wlt.wallet['03'].filter(item => item.Setting.canTransfer); // '我的钱包',
        this.legalTenderList = wlt.wallet['04'].filter(item => item.Setting.canTransfer); // '法币账户',

        // 账户列表
        this.allWalletList = [
            {
                id: "01",
                list: this.contractList
            },
            {
                id: "02",
                list: this.bibiList
            },
            {
                id: "03",
                list: this.myWalletList
            },
            {
                id: "04",
                list: this.legalTenderList
            }
        ];

        // 获取币种下拉列表（ this.canTransferCoin ）：逻辑：每一项至少出现在2个钱包 且 列表去重
        this.allWalletList.forEach((data, index) => {
            // 遍历每个钱包的币种
            data.list.forEach(item => {
                // 币种是否出现在2个钱包
                const hasMore = this.allWalletList.some((data2, index2) => index !== index2 && data2.list.some(item2 => item2.wType === item.wType));
                // 币种是否重复
                if (hasMore && !this.canTransferCoin.some(item3 => item3.wType === item.wType)) {
                    item.id = item.wType;
                    item.label = item.wType;
                    this.canTransferCoin.push(item); // push
                }
            });
        });
        console.log("币种下拉", this.canTransferCoin, this.allWalletList);

        // if (this.canTransferCoin[0]) this.form.coin = this.canTransferCoin[0].wType  // 合约下拉列表 默认选中第一个
        this.initCoinValue();// 初始化 币种value

        this.initWalletListByWTypeAndValue(this.form.coin); // 初始化钱包 list 和 value

        this.setMaxTransfer(); // 设置 最大划转
    },
    // 初始化 钱包list和value
    initWalletListByWTypeAndValue (wType) {
        this.initAuthWalletListByWType(wType);// 1. 有权限的钱包list 初始化
        this.initFromAndToValueByAuthWalletList(); // 2. 钱包value  初始化
        this.initFromAndToWalletListByValue(); // 3. 2个钱包list 初始化 （依赖钱包value）
    },
    // 有权限的钱包列表 初始化（wType: 合约）
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
    // 初始化 币种value
    initCoinValue() {
        if (this.canTransferCoin[0]) { // 有币种下拉
            if (this.canTransferCoin.some(item => item.wType === this.vnode.attrs.coin)) { // 有传value
                this.form.coin = this.vnode.attrs.coin;
            } else { // 没传
                this.form.coin = this.canTransferCoin[0].wType; // 默认选中第1个
            }
        }
    },
    // 初始化 2个钱包value
    initFromAndToValueByAuthWalletList () {
        // 校验钱包value是否有权限 如果没权限默认选中第一个
        const verifyWalletValueByValue = (value) => {
            if (this.authWltList.some(item => item.id === value)) {
                return value;
            } else {
                return this.authWltList[0] && this.authWltList[0].id;
            }
        };

        // 从xx钱包
        this.form.transferFrom = verifyWalletValueByValue(this.vnode.attrs.transferFrom || '03');
        // 到xx钱包
        this.form.transferTo = verifyWalletValueByValue(this.vnode.attrs.transferTo || '01');
    },
    // 2个钱包list 初始化 （依赖钱包value）
    initFromAndToWalletListByValue () {
        this.fromWltList = this.authWltList.filter(item => item.id !== this.form.transferTo);
        this.toWltList = this.authWltList.filter(item => item.id !== this.form.transferFrom);
        console.log("this.authWltList", this.authWltList, "this.fromWltList", this.fromWltList, "this.toWltList", this.toWltList);
    },
    // 切换按钮click handler
    handlerSwitchBtnClick () {
        this.form.num = '';
        this.switchTransfer(); // 2个钱包value切换
        this.initFromAndToWalletListByValue(); // 2个钱包列表 初始化 （依赖钱包value）
        this.setMaxTransfer(); // 设置 最大划转
    },
    // 数量输入框input handler
    handlerNumOnInput (e) {
        // console.log(e.target.value);
        // value最小为0
        this.form.num = Number(e.target.value) < 0 ? 0 : e.target.value;
    },
    // 划转全部数量click handler
    handlerSetAllNumClick() {
        this.form.num = this.form.maxTransfer;
    },
    // 钱包value切换
    switchTransfer () {
        [this.form.transferFrom, this.form.transferTo] = [this.form.transferTo, this.form.transferFrom];
    },
    // 设置 最大划转 (依赖钱包名称, 币种)
    setMaxTransfer () {
        if (wlt.wallet && this.form.transferFrom) { // 所有钱包 和 从xx钱包id 都存在
            const wallet = wlt.wallet[this.form.transferFrom]; // 对应钱包
            for (const item of wallet) {
                if (item.wType === this.form.coin) { // 找到对应币种
                    this.form.maxTransfer = item.wdrawable || 0; // 设置最大可以金额
                }
            }
        } else {
            this.form.maxTransfer = "--";
        }
    },
    // 提交
    submit () {
        // 校验
        if (this.form.num === '0') {
            return window.$message({ title: I18n.$t('10037'/* "提示" */), content: I18n.$t('10221'/* '划转数量不能为0' */), type: 'danger' });
        } else if (!this.form.num) {
            return window.$message({ title: I18n.$t('10037'/* "提示" */), content: I18n.$t('10222'/* '划转数量不能为空' */), type: 'danger' });
        } else if (Number(this.form.num) === 0) {
            return window.$message({ title: I18n.$t('10037'/* "提示" */), content: I18n.$t('10221'/* '划转数量不能为0' */), type: 'danger' });
        } else if (Number(this.form.num) > Number(this.form.maxTransfer)) {
            return window.$message({ title: I18n.$t('10037'/* "提示" */), content: I18n.$t('10223'/* '划转数量不能大于最大可划' */), type: 'danger' });
        }
        model.setMaxTransfer(); // 设置 最大划转
        // api
        Http.postTransfer(model.form).then(res => {
            if (res.result.code === 0) {
                window.$message({ content: I18n.$t('10224'/* '划转成功！' */), type: 'success' });
                model.form.num = '';
                model.initFromAndToValueByAuthWalletList(); // 2. 钱包value  初始化
            } else {
                // 往法币划转
                if (Number(res.result.code) === 9040) {
                    // 提示弹框
                    window.$message({ title: I18n.$t('10037'/* "提示" */), content: "法币划转提示", type: 'danger' });
                    // obj.isShowModal = true
                }
                window.$message({ title: I18n.$t('10037'/* "提示" */), content: res.result.msg, type: 'danger' });
            }
        }).catch(err => {
            console.log(err);
        });
        // console.log("我提交了", this.form, 666);
    },
    // 币种 菜单配置
    getCurrencyMenuOption() {
        return {
            evenKey: `myDropdown${Math.floor(Math.random() * 10000)}`,
            activeId: cb => cb(model.form, 'coin'),
            showMenu: model.showCurrencyMenu,
            setShowMenu: type => {
                model.showCurrencyMenu = type;
            },
            onClick (itme) {
                model.setMaxTransfer(); // 设置 最大划转
            },
            getList () {
                return model.canTransferCoin;
            }
        };
    },
    // 从xx钱包 菜单配置
    getFromMenuOption() {
        return {
            evenKey: `myDropdown${Math.floor(Math.random() * 10000)}`,
            activeId: cb => cb(model.form, 'transferFrom'),
            showMenu: model.showFromMenu,
            setShowMenu: type => {
                model.showFromMenu = type;
            },
            onClick (itme) {
                console.log(itme, model.form.transferFrom);
                model.initFromAndToWalletListByValue(); // 初始化 2个钱包下拉列表 （依赖钱包value）
                model.setMaxTransfer(); // 设置 最大划转
            },
            getList () {
                return model.fromWltList;
            }
        };
    },
    // 到xx钱包 菜单配置
    getToMenuOption() {
        return {
            evenKey: `myDropdown${Math.floor(Math.random() * 10000)}`,
            activeId: cb => cb(model.form, 'transferTo'),
            showMenu: model.showMenuTo,
            setShowMenu: type => {
                model.showMenuTo = type;
            },
            onClick (itme) {
                console.log(itme, model.form.transferTo);
                model.initFromAndToWalletListByValue(); // 初始化 2个钱包下拉列表 （依赖钱包value）
                model.setMaxTransfer(); // 设置 最大划转
            },
            getList () {
                return model.toWltList;
            }
        };
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
        // console.log(wlt);
        // console.log("this.authWltList", this.authWltList, "this.fromWltList", this.fromWltList, "this.toWltList", this.toWltList);
    },
    onremove (vnode) {
        wlt.remove();
        this.rmEVBUS();
    }
};

module.exports = model;