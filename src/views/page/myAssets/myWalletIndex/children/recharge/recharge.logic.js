const wlt = require('@/models/wlt/wlt');
const m = require('mithril');
const Qrcode = require('qrcode');
const I18n = require('@/languages/I18n').default;
const gM = require('@/models/globalModels');
const broadcast = require('@/broadcast/broadcast');
const Http = require('@/api').webApi;

const rechargeLogic = {
    selectList: [], // 币种下拉列表
    rechargeAddrSrc: '', // 充币地址二维码
    labelTips: '', // 标签提示
    chainSelected: null, // 链名称默认选中第一个
    chainList: [], // 链名称列表
    wTypeParam: null, // 传参的币种
    tipsAry: [], // 温馨提示列表
    isLoadingShow: true, // 加载中是否显示
    nameTips: null, // 链名称提示
    item: {
        wType: null, // 币种名称
        memo: null, // 是否显示标签
        openChains: null, // 是否显示链名称
        uId: null, // 用户uId
        rechargeAddr: null, // 充币地址
        networkNum: null, // 网络数
        promptRecharge: null // 充值提示
    },
    // 设置温馨提示
    initTipsAry() {
        rechargeLogic.tipsAry = []; // 初始化温馨提示列表
        // 小部分温馨提示
        const fractionTip =
        /* 禁止向{value}地址充币除{value}之外的资产,任何充入{value}地址的非{value}资产将不可找回 */
        I18n.$t('10083', { value: rechargeLogic.option.currentId }) +

        /* 使用{value1}地址充币需要{value2}个网络确认才能到账 */
        '*' + I18n.$t('10084', { value1: rechargeLogic.option.currentId, value2: rechargeLogic.item.networkNum }) +

        /* 关于标签{value}充币时同时需要一个充币地址和{value}标签。标签是一种保证您的充币地址唯一性的数字串，与充币地址成对出现并一一对应。请您务必遵守正确的{value}充币步骤，在提币时输入完整的信息，否则将面临丢失币的风险！ */
        (rechargeLogic.option.currentId === 'EOS' || rechargeLogic.option.currentId === 'XRP' ? '*' + I18n.$t('10545', { value: rechargeLogic.option.currentId }) : '') +

        /* '默认充入我的钱包，您可以通过“资金划转”将资金转至交易账户或者其他账户' */
        '*' + I18n.$t('10085');

        const tip = rechargeLogic.item.promptRecharge !== 0
            ? rechargeLogic.item.promptRecharge + '*' + fractionTip
            : fractionTip;

        for (const i of tip.split('*')) {
            if (i !== '') {
                rechargeLogic.tipsAry.push(i);
            }
        }
        m.redraw();

        // console.log(rechargeLogic.tipsAry);
    },
    setLabelTips() {
        /* '充值{VALUE}同时需要一个充币地址和{VALUE}标签；警告：如果未遵守正确的{VALUE}充币步骤，币会有丢失风险！'; */
        rechargeLogic.labelTips = I18n.$t('10518', { VALUE: rechargeLogic.option.currentId });
    },
    // 充币地址二维码地址
    initQrCodeImg() {
        Qrcode.toDataURL(rechargeLogic.item.rechargeAddr || '无')
            .then(url => {
                rechargeLogic.rechargeAddrSrc = url;
            }).catch(err => {
                console.log(err);
            });
    },
    // 初始化币种列表
    initSelectList() {
        if (JSON.stringify(wlt.wallet['03']) !== '[]') {
            rechargeLogic.selectList = []; // 初始化
            for (const i of wlt.wallet['03']) {
                if (i.Setting.canRecharge) {
                    rechargeLogic.selectList.push({ label: i.wType + ' | ' + wlt.coinInfo[i.wType].name, id: i.wType });
                }
            }

            // 设置当前选中币种
            rechargeLogic.wTypeParam === undefined
                ? rechargeLogic.option.currentId = rechargeLogic.selectList[0].id
                : rechargeLogic.option.currentId = rechargeLogic.wTypeParam;
        }
    },
    // 初始化链名称
    initChainList() {
        if (wlt.coinInfo.USDT !== undefined) {
            rechargeLogic.chainList = wlt.coinInfo.USDT.chains;
            // console.log(rechargeLogic.chainList);
            rechargeLogic.chainSelected = rechargeLogic.chainList[0].name;
        }
    },
    initItem() {
        if (rechargeLogic.option.currentId !== 1) {
            const type = rechargeLogic.option.currentId === 'USDT'
                ? ((rechargeLogic.chainSelected).toUpperCase() === 'OMNI' ? 'USDT' : 'USDT' + rechargeLogic.chainSelected)
                : rechargeLogic.option.currentId;
            // console.log(type);
            for (const i of wlt.wallet['03']) {
                if (i.wType === rechargeLogic.option.currentId) {
                    rechargeLogic.item.promptRecharge = i.promptRecharge; // 温馨提示
                    rechargeLogic.item.memo = i.Setting.memo; // 是否显示标签
                    rechargeLogic.item.openChains = i.Setting.openChains; // 是否显示链名称
                    rechargeLogic.item.wType = i.wType; // 币种
                    Http.GetRechargeAddr({
                        wType: type
                    }).then(function(arg) {
                        // console.log('nzm', 'GetRechargeAddr success', arg);
                        rechargeLogic.item.rechargeAddr = arg.rechargeAddr; // 充币地址
                        rechargeLogic.item.networkNum = arg.trade.networkNum; // 网络数
                        // 切换币种设置标签提示
                        rechargeLogic.setLabelTips();
                        // 切换币种设置二维码
                        rechargeLogic.initQrCodeImg();
                        // 切换币种设置温馨提示
                        rechargeLogic.initTipsAry();
                        m.redraw();
                    }).catch(function(err) {
                        console.log('nzm', 'GetRechargeAddr error', err);
                    });
                }
            }
        }
        // console.log(JSON.stringify(rechargeLogic.item), 'rechargeLogic.item', 1111111111111);
        if (rechargeLogic.item.wType === rechargeLogic.option.currentId) {
            rechargeLogic.isLoadingShow = false;
            m.redraw();
        } else {
            rechargeLogic.isLoadingShow = true;
        }
    },
    // 币种 菜单配置
    option: {
        evenKey: "optionkey",
        showMenu: false,
        currentId: 1,
        updateOption (option) {
            this.showMenu = option.showMenu;
            this.currentId = option.currentId ? option.currentId : this.currentId;
        },
        menuClick() {
            rechargeLogic.initItem();
        },
        renderHeader(item) {
            return m('div', { class: `selectDiv` }, [
                m('span', { class: `has-text-primary` }, item?.label)
            ]);
        },
        menuList() {
            return rechargeLogic.selectList;
        }
    },
    // 复制文本
    copyText() {
        var div = document.getElementsByClassName('currencyAddr-text')[0];
        if (this.rechargeAddr !== '') {
            if (document.body.createTextRange) {
                const range = document.body.createTextRange();
                range.moveToElementText(div);
                range.select();
            } else if (window.getSelection) {
                var selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(div);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                console.warn("none");
            }
            document.execCommand("Copy"); // 执行浏览器复制命令
            return window.$message({ title: I18n.$t('10410') /* '提示' */, content: I18n.$t('10546') /* '复制成功' */, type: 'success' });
        }
    },
    inits() {
        rechargeLogic.initSelectList();
        rechargeLogic.initChainList();
        rechargeLogic.initItem();
    },
    // 链名称提示初始化
    initNameTips() {
        this.nameTips =
        [
            I18n.$t('10400') /* 'USDT-ERC20是Tether泰达公司基于ETH网络发行的USDT，充币地址是ETH地址，充提币走ETH网络，USDT-ERC20使用的是ERC20协议。' */,
            I18n.$t('10507') /* 'USDT-TRC20(USDT-TRON)是Tether泰达公司基于TRON网络发行的USDT，充币地址是TRON地址，充提币走TRON网络，USDT-TRC20(USDT-TRON)使用的是TRC20协议。' */,
            I18n.$t('10508')/* 'USDT-Omni是Tether泰达公司基于BTC网络发行的USDT，充币地址是BTC地址，充提币走BTC网络，USDT-Omni使用的协议是建立在BTC区块链网络上的omni layer协议。' */
        ];
    },
    initFn() {
        wlt.init();
        let i = 0;
        rechargeLogic.wTypeParam = window.router.getUrlInfo().params.wType;

        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.MSG_WLT_READY,
            cb: () => {
                if (i === 0) {
                    rechargeLogic.inits();
                    // console.log('MSG_WLT_READY.........');
                }
                i = i + 1;
            }
        });
        rechargeLogic.inits();

        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.MSG_LANGUAGE_UPD,
            cb: () => {
                rechargeLogic.initTipsAry();
                rechargeLogic.setLabelTips();
                rechargeLogic.initNameTips();
            }
        });
        rechargeLogic.initNameTips();

        broadcast.onMsg({
            key: 'index',
            cmd: broadcast.GET_USER_INFO_READY,
            cb: () => {
                rechargeLogic.item.uId = gM.getAccount().uid;
            }
        });
        rechargeLogic.item.uId = gM.getAccount().uid;

        rechargeLogic.chainSelected = null; // 链名称默认选中第一个
    },
    updateFn() {
    },
    removeFn() {
        broadcast.offMsg({
            key: 'index',
            isall: true
        });
        wlt.remove();
    }
};
module.exports = rechargeLogic;