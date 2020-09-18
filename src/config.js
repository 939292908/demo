module.exports = {
    exchId: 21,
    official: 'https://www.xmex.co', // 平台官网地址
    exchName: 'Xmex',
    DOCTitle: "【XMEX官网】XMEX交易所下载_XMEX全球数字货币合约交易领跑者",
    DOCTitleEn: "[XMEX Official Website] XMEX Exchange Download_XMEX Global Digital Currency Contract Trading Leader",
    themeDark: false,
    exchInfo: {
        exchCoin: "",
        exchLogo: "",
        leverStatus: 0,
        helpCenter: {
            langs: { zh: "zh-cn", tw: "zh-cn", en: "en-001" },
            website: "https://xmexhelp.zendesk.com",
            termsServiceId: "360040811494",
            privacyPolicyId: "360041288893",
            futureReferenceId: "360040901334",
            followIdentityExplain: "360008615533",
            followNewbie: "360008486274"
        },
        warrants: "",
        downloadType: 0,
        hideDownload: false,
        bottomNavHomeIcon: "icon-nav-ex21",
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
    }
};