module.exports = {
    exchId: 30,
    official: 'https://www.vbit.one', // 平台官网地址
    exchName: 'Vbit',
    themeDark: true,
    exchInfo: {
        exchId: 30,
        exchName: "Vbit",
        exchCoin: "",
        exchLogo: "",
        MTType: "012",
        DOCTitle: "Vbit",
        leverStatus: 0,
        helpCenter: {
            langs: { zh: "zh-cn", tw: "zh-cn", en: "en-us" },
            website: "https://vbithelp.zendesk.com"
        },
        warrants: "",
        downloadType: 0,
        hideDownload: false,
        bottomNavHomeIcon: "icon-nav-vbit",
        hideWXShareBtn: false,
        openGuidePage: 0,
        guidePageVer: "",
        customIcon: 0,
        isKlineDark: false,
        klineTargetListType: 1
    },
    future: {
        UPNLPrzActive: '2', // 未实现盈亏计算选择，'1':最新价， '2'：标记价
        MMType: 1, // 保证金率公式选择，0: 默认，1: 开仓价值/杠杆
        PrzLiqType: 0 // 强平价计算公式选择，0: 默认，1: 默认公式中的MMR风险修改为MAX(MIRMy/2，MMR风险)
    },
    openFollow: false // 跟单，资金记录，资产等显示
};