var m = require("mithril");
require('./style.scss');
// const I18n = require('@/languages/I18n').default;
// const Modal = require('@/pages/components/common/Modal');
const Dropdown = require('@/pages/components/common/Dropdown');

// const obj = {
//     showMenuFrom: false,
//     showMenuTo: false,
//     isShowModal: false,
//     form: {
//         // coin: 'USDT', // 合约下拉列表 value
//         coin: window.gMkt.CtxPlaying.Sym, // 合约下拉列表 value
//         transferFrom: '03', // 从xx钱包 value
//         transferTo: '01', // 到xx钱包 value
//         num: '',
//         maxTransfer: 0 // 最大划转
//     },

//     allWalletList: [], // 所有账户
//     contractList: [], // 合约账户
//     bibiList: [], // 币币账户
//     myWalletList: [], // 我的钱包
//     legalTenderList: [], // 法币账户

//     canTransferListOpen: false, // 合约下拉开关
//     canTransferCoin: [],

//     baseWltList: [], // 钱包列表 所有
//     authWltList: [], // 钱包列表 当前币种有权限
//     fromWltList: [], // 钱包列表 从xx  （from与to钱包 不能同一种类型相互划转）
//     toWltList: [], // 钱包列表 到xx
//     wlt: {},
//     // 初始化全局广播
//     initEVBUS: function () {
//         // const that = this;
//         // 划转按钮广播
//         // if (this.EV_OPEN_TRANSFER_MODAL_unbinder) {
//         //     this.EV_OPEN_TRANSFER_MODAL_unbinder();
//         // }
//         // this.EV_OPEN_TRANSFER_MODAL_unbinder = window.gEVBUS.on(gEVBUS.EV_OPEN_TRANSFER_MODAL, (arg) => {
//         //     that.initFromAndToValueByAuthWalletList(); // 2个钱包value 初始化
//         //     that.initTransferInfo();
//         // });
//     },
//     initLanguage: function () {
//         this.baseWltList = [
//             {
//                 id: '01',
//                 label: I18n.$t('10217') // '合约账户',
//             },
//             {
//                 id: '02',
//                 label: I18n.$t('10218') // '币币账户',
//             },
//             {
//                 id: '03',
//                 label: I18n.$t('10219') // '我的钱包',
//             },
//             {
//                 id: '04',
//                 label: I18n.$t('10220') // '法币账户',
//             }
//         ];
//     },
//     // 删除全局广播
//     rmEVBUS: function () {
//         // 划转按钮广播
//         // if (this.EV_OPEN_TRANSFER_MODAL_unbinder) {
//         //     this.EV_OPEN_TRANSFER_MODAL_unbinder();
//         // }
//     },
//     onInputForNum: function (e) {
//         console.log(666);
//         if (Number(e.target.value) < 0) {
//             this.form.num = 0;
//         } else {
//             this.form.num = e.target.value;
//         }
//     },
//     // 切换按钮 click
//     switchBtnClick () {
//         this.form.num = '';
//         this.switchTransfer(); // 2个钱包value切换
//         this.initFromAndToWalletListByValue(); // 2个钱包列表 初始化 （依赖钱包value）
//         this.setMaxTransfer(); // 设置 最大划转
//     },
//     // 2个钱包value切换
//     switchTransfer () {
//         [this.form.transferFrom, this.form.transferTo] = [this.form.transferTo, this.form.transferFrom];
//     },
//     getWallet: function () {
//         const that = this;
//         if (window.gWebAPI.isLogin()) {
//             window.gWebAPI.ReqGetAssets({
//                 exChannel: window.$config.exchId
//             }, function (arg) {
//                 that.initTransferInfo();
//             });
//         }
//     },
//     // 初始化 划转信息
//     initTransferInfo () {
//         const wallets = window.gWebAPI.CTX.wallets; // all数据

//         this.contractList = wallets['01'].filter(item => item.Setting.canTransfer); // '合约账户',
//         this.bibiList = wallets['02'].filter(item => item.Setting.canTransfer); // '币币账户',
//         this.myWalletList = wallets['03'].filter(item => item.Setting.canTransfer); // '我的钱包',
//         this.legalTenderList = wallets['04'].filter(item => item.Setting.canTransfer); // '法币账户',

//         // 钱包列表
//         this.allWalletList = [
//             {
//                 id: "01",
//                 list: this.contractList
//             },
//             {
//                 id: "02",
//                 list: this.bibiList
//             },
//             {
//                 id: "03",
//                 list: this.myWalletList
//             },
//             {
//                 id: "04",
//                 list: this.legalTenderList
//             }
//         ];

//         // 获取币种下拉列表（ this.canTransferCoin ）：逻辑：每一项至少出现在2个钱包 且 列表去重
//         this.allWalletList.forEach((data, index) => {
//             // 遍历每个钱包的币种
//             data.list.forEach(item => {
//                 // 币种是否出现在2个钱包
//                 const hasMore = this.allWalletList.some((data2, index2) => index !== index2 && data2.list.some(item2 => item2.wType === item.wType));
//                 // 币种是否重复
//                 if (hasMore && !this.canTransferCoin.some(item3 => item3.wType === item.wType)) this.canTransferCoin.push(item); // push
//             });
//         });

//         // if (this.canTransferCoin[0]) this.form.coin = this.canTransferCoin[0].wType  // 合约下拉列表 默认选中第一个
//         if (this.canTransferCoin[0]) this.form.coin = window.gMkt.AssetD[window.gMkt.CtxPlaying.Sym].SettleCoin || this.canTransferCoin[0].wType; // 合约下拉列表 默认选中第一个

//         this.initWalletListByWTypeAndValue(obj.form.coin); // 初始化钱包 list 和 value

//         this.setMaxTransfer(); // 设置 最大划转
//     },
//     // 合约 下拉列表
//     getCoinList () {
//         return this.canTransferCoin.map(function (item, i) {
//             return m('a',
//                 {
//                     key: "canTransferCoinItem" + i,
//                     class: "dropdown-item cursor-pointer" + (obj.form.coin === item.wType ? ' has-text-primary' : ''),
//                     onclick: () => obj.coinClick(item)
//                 },
//                 [item.wType]
//             );
//         });
//     },
//     // 合约下拉列表 click
//     coinClick (item) {
//         this.setTransferCoin(item.wType);// 设置 coin
//         this.setMaxTransfer(); // 设置 最大划转
//         this.initWalletListByWTypeAndValue(item.wType); // 初始化钱包 list 和 value
//     },
//     // 初始化钱包 list 和 value
//     initWalletListByWTypeAndValue (wType) {
//         this.initAuthWalletListByWType(wType);// 1. 有权限的钱包list 初始化
//         this.initFromAndToValueByAuthWalletList(); // 2. 钱包value  初始化
//         this.initFromAndToWalletListByValue(); // 3. 2个钱包list 初始化 （依赖钱包value）
//     },
//     // 有权限的钱包列表 初始化（wType: 合约）
//     initAuthWalletListByWType (wType) {
//         // 遍历不同种类钱包
//         this.authWltList = this.allWalletList.map(wallet => {
//             // 当前钱包是否有该币种
//             const hasWType = wallet.list.some(item1 => item1.wType === wType);
//             if (hasWType) {
//                 // 有就用该id 去base钱包中找
//                 return this.baseWltList.find(item3 => item3.id === wallet.id);
//             }
//         });
//         this.authWltList = this.authWltList.filter(item => item); // 钱包列表 去空
//     },
//     // 2个钱包value 初始化
//     initFromAndToValueByAuthWalletList () {
//         const pageMap = {
//             1: '01',
//             2: '02',
//             3: '03',
//             4: '04'
//         };

//         // 校验钱包value是否有权限 如果没权限默认选中第一个
//         const verifyWalletValueByValue = (value) => {
//             if (this.authWltList.some(item => item.id === value)) {
//                 return value;
//             } else {
//                 return this.authWltList[0] && this.authWltList[0].id;
//             }
//         };

//         // 从xx钱包
//         this.form.transferFrom = verifyWalletValueByValue(pageMap[3]);

//         // 到xx钱包
//         this.form.transferTo = verifyWalletValueByValue(pageMap[window.gMkt.CtxPlaying.pageTradeStatus]);
//     },
//     // 2个钱包list 初始化 （依赖钱包value）
//     initFromAndToWalletListByValue () {
//         this.fromWltList = this.authWltList.filter(item => item.id !== obj.form.transferTo);
//         this.toWltList = this.authWltList.filter(item => item.id !== obj.form.transferFrom);
//         console.log("this.authWltList", this.authWltList, "this.fromWltList", this.fromWltList, "this.toWltList", this.toWltList);
//     },
//     // 设置 选中合约
//     setTransferCoin (param) {
//         this.form.coin = param;
//         this.canTransferListOpen = false;
//         this.form.num = '';
//     },
//     // 设置 最大划转
//     setMaxTransfer () {
//         // const coin = this.form.coin;
//         // switch (this.form.transferFrom) {
//         // // 合约
//         // case '01':
//         //     const wallet01 = window.gTrd.Wlts['01'];
//         //     for (const item of wallet01) {
//         //         if (item.Coin == coin) {
//         //             this.form.maxTransfer = Number(item.maxTransfer || 0).toFixed2(8);
//         //         }
//         //     }
//         //     break;
//         //     // 币币
//         // case '02':
//         //     const wallet02 = window.gTrd.Wlts['02'];
//         //     for (const item of wallet02) {
//         //         if (item.Coin == coin) {
//         //             this.form.maxTransfer = Number(item.Wdrawable || 0).toFixed2(8);
//         //         }
//         //     }
//         //     break;
//         //     // 我的钱包
//         // case '03':
//         //     const wallet03 = window.gWebAPI.CTX.wallets_obj['03'];
//         //     this.form.maxTransfer = Number(wallet03[coin] && wallet03[coin].mainBal || 0).toFixed2(8);
//         //     break;

//         //     // 法币
//         // case '04':
//         //     const wallet04 = window.gWebAPI.CTX.wallets_obj['04'];
//         //     this.form.maxTransfer = Number(wallet04[coin] && wallet04[coin].otcBal || 0).toFixed2(8);
//         //     break;
//         // default:
//         //     this.form.maxTransfer = "--";
//         // }
//     },
//     setTransferNum: function (param) {
//         this.form.num = param;
//     },
//     submit: function () {
//         console.log("提交");
//         // const that = this;

//         // if (this.form.num === '0') {
//         //     return $message({ title: I18n.$t('10037'/* "提示" */), content: I18n.$t('10221'/* '划转数量不能为0' */), type: 'danger' });
//         // } else if (!this.form.num) {
//         //     return $message({ title: I18n.$t('10037'/* "提示" */), content: I18n.$t('10222'/* '划转数量不能为空' */), type: 'danger' });
//         // } else if (Number(this.form.num) == 0) {
//         //     return $message({ title: I18n.$t('10037'/* "提示" */), content: I18n.$t('10221'/* '划转数量不能为0' */), type: 'danger' });
//         // } else if (Number(this.form.num) > Number(this.form.maxTransfer)) {
//         //     return $message({ title: I18n.$t('10037'/* "提示" */), content: I18n.$t('10223'/* '划转数量不能大于最大可划' */), type: 'danger' });
//         // }
//         // this.loading = true;
//         // window.gWebAPI.ReqTransfer({
//         //     aTypeFrom: this.form.transferFrom,
//         //     aTypeTo: this.form.transferTo,
//         //     wType: this.form.coin,
//         //     num: Number(this.form.num || 0)
//         // }, function (arg) {
//         //     if (arg.result.code == 0) {
//         //         setTimeout(function () {
//         //             $message({ content: I18n.$t('10224'/* '划转成功！' */), type: 'success' });
//         //             that.form.num = '';
//         //             that.loading = false;
//         //             that.getWallet();
//         //             obj.initFromAndToValueByAuthWalletList(); // 2个钱包value 初始化
//         //         }, 2500);
//         //         vnode.attrs.onOk && vnode.attrs.onOk();
//         //     } else {
//         //         // 往法币划转
//         //         if (arg.result.code == 9040) {
//         //             // 提示弹框
//         //             obj.isShowModal = true;
//         //         }
//         //         window.$message({ title: I18n.$t('10037'/* "提示" */), content: utils.getWebApiErrorCode(arg.result.code), type: 'danger' });
//         //         that.loading = false;
//         //     }
//         // }, function (error) {
//         //     $message({ content: I18n.$t('10225'/* '操作超时，请稍后重试！' */), type: 'danger' });
//         //     that.loading = false;
//         // });
//     }
// };
// const { data, methods, oninit, oncreate, onremove, onupdate } = require('./model');
const model = require('./model');

module.exports = {
    oninit: vnode => model.oninit(vnode),
    oncreate: vnode => model.oncreate(vnode),
    onremove: vnode => model.onremove(vnode),
    onupdate: vnode => model.onupdate(vnode),
    view () {
        return m('div', { class: `my-form my-transfer` }, [
            // 币种
            m('div', { class: `form-item` }, [
                m('div', { class: `form-item-title` }, [
                    '币种'
                ]),
                m('div', { class: `form-item-content` }, [
                    m(Dropdown, {
                        evenKey: `myDropdown${Math.floor(Math.random() * 10000)}`,
                        activeId: cb => cb(model.form, 'coin'),
                        showMenu: model.showMenuCurrency,
                        setShowMenu: type => {
                            model.showMenuCurrency = type;
                        },
                        onClick (itme) {
                            console.log(itme, model.form.coin);
                        },
                        getList () {
                            return model.canTransferCoin;
                        }
                    })
                ])
            ]),
            // 钱包
            m('div', { class: `columns` }, [
                // 从
                m('div', { class: `form-item column is-5` }, [
                    m('div', { class: `form-item-title has-text-level-4` }, [
                        '从'
                    ]),
                    m('div', { class: `form-item-content` }, [
                        m(Dropdown, {
                            evenKey: `myDropdown${Math.floor(Math.random() * 10000)}`,
                            activeId: cb => cb(model.form, 'transferFrom'),
                            showMenu: model.showMenuFrom,
                            setShowMenu: type => {
                                model.showMenuFrom = type;
                            },
                            onClick (itme) {
                                console.log(itme, model.form.transferFrom);
                                model.initFromAndToWalletListByValue(); // 初始化 2个钱包下拉列表 （依赖钱包value）
                            },
                            getList () {
                                return model.fromWltList;
                            }
                        })
                    ])
                ]),
                // 切换
                m('div', { class: `column is-align-items-center` }, [
                    m('span', {
                        class: `has-text-level-4 cursor-pointer`,
                        onclick() {
                            model.handlerSwitchClick();
                        }
                    }, "切换")
                ]),
                // 到
                m('div', { class: `form-item column is-5` }, [
                    m('div', { class: `form-item-title has-text-level-4` }, [
                        '到'
                    ]),
                    m('div', { class: `form-item-content` }, [
                        m(Dropdown, {
                            evenKey: `myDropdown${Math.floor(Math.random() * 10000)}`,
                            activeId: cb => cb(model.form, 'transferTo'),
                            showMenu: model.showMenuTo,
                            setShowMenu: type => {
                                model.showMenuTo = type;
                            },
                            onClick (itme) {
                                console.log(itme, model.form.transferTo);
                                model.initFromAndToWalletListByValue(); // 初始化 2个钱包下拉列表 （依赖钱包value）
                            },
                            getList () {
                                return model.toWltList;
                            }
                        })
                    ])
                ])
            ]),
            // 数量
            m('div', { class: `form-item` }, [
                m('div', { class: `form-item-title` }, [
                    '数量'
                ]),
                m('div', { class: `form-item-content form-item-content-btns` }, [
                    m('input', { class: `input`, placeholder: '请输入划转数量' }),
                    m('div', { class: `btns-box pr-3` }, [
                        m('span', { class: `pr-2` }, 'BTC'),
                        m('span', { class: `cursor-pointer has-text-primary` }, '全部')
                    ])
                ]),
                m('div', { class: `has-text-level-4 pt-2` }, [
                    '可用: 0 BTC'
                ])
            ])
            // m('div', { class: `` }, JSON.stringify(model.wallet)),
        ]);
    }
};
// module.exports = {
//     oninit: function (vnode) {
//         // obj.initLanguage();
//         obj.initFromAndToValueByAuthWalletList(); // 2个钱包value 初始化
//     },
//     oncreate: function (vnode) {
//         obj.initEVBUS();
//         obj.getWallet();
//         obj.initTransferInfo();
//     },
//     view: function (vnode) {
//         return m("div", { class: "pub-transfer has-text-left" }, [
//             // 币种 下拉
//             m('div', { class: "pub-transfer-coin-dropdown field pb-2" }, [
//                 m('div', { class: "dropdown" + (obj.canTransferListOpen ? ' is-active' : '') }, [
//                     m('div', { class: "dropdown-trigger" }, [
//                         m('button', {
//                             class: "button is-outline is-fullwidth pa-0",
//                             onclick: function () {
//                                 obj.canTransferListOpen = !obj.canTransferListOpen;
//                             }
//                         }, [
//                             m('div', { class: "button-content is-flex" }, [
//                                 m('span', { class: `pr-5 has-text-primary font-size-2` }, [
//                                     I18n.$t('10420')// '币种'
//                                 ]),
//                                 obj.form.coin,
//                                 m('.spacer'),
//                                 m('span', { class: "icon button-span-icon" }, [
//                                     m('i', { class: "iconfont icon-xiala has-text-primary font-size-8" })
//                                 ])
//                             ])
//                         ])
//                     ]),
//                     m('div', { class: "dropdown-menu" }, [
//                         m('div', { class: "dropdown-content" }, [
//                             obj.getCoinList()
//                         ])
//                     ])
//                 ])
//             ]),
//             // 划转
//             m('div', { class: "pub-transfer-transfer-select is-between field" }, [
//                 // 从 xx 钱包
//                 m('div', { class: `pub-transfer-transfer-select-left` }, [
//                     m('div', { class: `transfer-select-title` }, ["从"]),
//                     m(Dropdown, {
//                         btnHeight: 40,
//                         activeId: cb => cb(obj.form, 'transferFrom'),
//                         showMenu: obj.showMenuFrom,
//                         setShowMenu: type => {
//                             obj.showMenuFrom = type;
//                             obj.showMenuTo = false;
//                         },
//                         onClick (item) {
//                             // console.log(obj.form.transferFrom);
//                             obj.initFromAndToWalletListByValue(); // 初始化 2个钱包下拉列表 （依赖钱包value）
//                             obj.setMaxTransfer(); // 设置 最大划转
//                         },
//                         getList () {
//                             return obj.fromWltList;
//                         }
//                     })
//                 ]),
//                 // 划转按钮
//                 m("div", { class: "pub-transfer-transfer-select-center control is-expanded cursor-pointer" }, [
//                     m("div", {
//                         class: "pub-transfer-transfer-select-center control is-expanded cursor-pointer",
//                         onclick () {
//                             obj.switchBtnClick();
//                         }
//                     }, [
//                         m('span', { class: "icon is-medium" }, [
//                             m('i', { class: "iconfont iconswitch has-text-primary is-size-4" })
//                         ])
//                     ])
//                 ]),
//                 // 到 xx 钱包
//                 m('div', { class: `pub-transfer-transfer-select-right` }, [
//                     m('div', { class: `transfer-select-title` }, ["到"]),
//                     m(Dropdown, {
//                         btnHeight: 40,
//                         activeId: cb => cb(obj.form, 'transferTo'),
//                         showMenu: obj.showMenuTo,
//                         setShowMenu: type => {
//                             obj.showMenuTo = type;
//                             obj.showMenuFrom = false;
//                         },

//                         onClick (item) {
//                             // console.log(obj.form.transferTo);
//                             obj.initFromAndToWalletListByValue(); // 初始化 2个钱包下拉列表 （依赖钱包value）
//                             obj.setMaxTransfer(); // 设置 最大划转
//                         },
//                         getList () {
//                             return obj.toWltList;
//                         }
//                     })
//                 ])

//             ]),
//             // 数量
//             m("div", { class: "pub-transfer-num-input field" }, [
//                 m('div', { class: `` }, ["数量"]),
//                 m('div', { class: `pub-transfer-num-input-box` }, [
//                     m("input", {
//                         class: "input",
//                         type: 'number',
//                         placeholder: I18n.$t('10228'/* "请输划转入数量" */),
//                         value: obj.form.num,
//                         oninput: function (e) {
//                             obj.onInputForNum(e);
//                         }
//                     }),
//                     m('div', { class: `pub-transfer-num-input-btns` }, [
//                         m('div', { class: `pr-3` }, obj.form.coin),
//                         m('div', { class: `pub-transfer-num-input-btns-all has-text-primary`, onclick: () => obj.setTransferNum(obj.form.maxTransfer) }, "全部")
//                     ])

//                 ])
//             ]),
//             // 最大可划
//             m("div", {
//                 class: "pub-transfer-wlt field cursor-pointer is-size-7",
//                 onclick: function () {
//                     obj.setTransferNum(obj.form.maxTransfer);
//                 }
//             }, [
//                 I18n.$t('10229', { value: obj.form.maxTransfer })
//                 // '最大可划：'+obj.form.maxTransfer
//             ]),
//             m("div", { class: "pub-transfer-btn field mt-7" }, [
//                 m("button", { class: "button is-primary is-fullwidth" + (obj.loading ? ' is-loading' : ''), onclick: () => obj.submit() }, [
//                     I18n.$t('10230')// '划转'
//                 ])
//             ]),
//             // 划转法币 提示弹框
//             m(Modal, {
//                 isShow: obj.isShowModal,
//                 width: '493px',
//                 class: "has-text-left",
//                 onClose () {
//                     obj.isShowModal = false;
//                 }, // 关闭事件
//                 slot: {
//                     header: m('div', { class: `` }, ["法币审核提示"]),
//                     body: m('div', { class: `` }, [`为防止大额资金流动,您划转至法币账户的${obj.form.num + obj.form.coin}需进行人工审核,请耐心等候.`]),
//                     footer: [
//                         m('.spacer'),
//                         m("button", {
//                             class: "button",
//                             onclick () {
//                                 obj.isShowModal = false;
//                             }
//                         }, [
//                             "我知道了"
//                         ])
//                     ]
//                 }
//             })
//         ]);
//     },
//     onremove: function () {
//         obj.rmEVBUS();
//     }
// };