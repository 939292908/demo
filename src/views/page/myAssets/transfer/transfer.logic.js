const wlt = require('@/models/wlt/wlt');

module.exports = {
    showMenuCurrency: false, // show币种菜单
    showMenuFrom: false, // show from菜单
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
    fromWltList: [
        {
            id: 1,
            label: "q"
        },
        {
            id: 2,
            label: "w"
        }
    ], // 钱包列表 从xx  （from与to钱包 不能同一种类型相互划转）
    toWltList: [
        {
            id: 1,
            label: "e"
        },
        {
            id: 2,
            label: "r"
        }
    ], // 钱包列表 到xx
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
    // 切换按钮事件
    handlerSwitchClick() {
        this.initTransferInfo();
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
        if (this.canTransferCoin[0]) this.form.coin = this.canTransferCoin[0].wType; // 合约下拉列表 默认选中第一个

        this.initWalletListByWTypeAndValue(this.form.coin); // 初始化钱包 list 和 value

        // this.setMaxTransfer(); // 设置 最大划转
    },
    // 初始化钱包 list 和 value
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
    // 2个钱包value 初始化
    initFromAndToValueByAuthWalletList () {
        const pageMap = {
            1: '01',
            2: '02',
            3: '03',
            4: '04'
        };

        // 校验钱包value是否有权限 如果没权限默认选中第一个
        const verifyWalletValueByValue = (value) => {
            if (this.authWltList.some(item => item.id === value)) {
                return value;
            } else {
                return this.authWltList[0] && this.authWltList[0].id;
            }
        };

        // 从xx钱包
        this.form.transferFrom = verifyWalletValueByValue(pageMap[3]);

        // 到xx钱包
        this.form.transferTo = verifyWalletValueByValue(pageMap[1]);
    },
    // 2个钱包list 初始化 （依赖钱包value）
    initFromAndToWalletListByValue () {
        this.fromWltList = this.authWltList.filter(item => item.id !== this.form.transferTo);
        this.toWltList = this.authWltList.filter(item => item.id !== this.form.transferFrom);
        console.log("this.authWltList", this.authWltList, "this.fromWltList", this.fromWltList, "this.toWltList", this.toWltList);
    },
    oninit(vnode) {
        wlt.init();
        this.initTransferInfo();
        this.initLanguage();
    },
    oncreate(vnode) {
        this.initTransferInfo();
    },
    onupdate(vnode) {
        // console.log(this.wallets);
        // console.log("this.authWltList", this.authWltList, "this.fromWltList", this.fromWltList, "this.toWltList", this.toWltList);
    },
    onremove(vnode) {
        wlt.remove();
    }
};