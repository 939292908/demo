const I18n = require("../../../../languages/I18n").default;

const logic = {
    // 菜单标题click
    handlerMenuTitleClick(item) {
        if (logic.openMenuIdList.some(id => id === item.id)) { // 有id
            logic.openMenuIdList = logic.openMenuIdList.filter(id => id !== item.id);
        } else { // 没有id
            logic.openMenuIdList.push(item.id);
        }
    },
    // 菜单click
    handlerMenuClick (item) {
        if (item.link) {
            const link = I18n.getLocale() === 'en' && item.helpCenter ? item.link.replace('zh-cn', 'en-001') : item.link;
            window.open(link);
        } else if (item.email) {
            window.location = `mailto:${item.email}`;
        } else if (item.href) {
            window.open(item.href);
        }
    },
    // icon列表
    getIconList() {
        return [
            {
                link: "https://weibo.com/u/7365095584",
                name: "icon-Weibo"
            },
            {
                name: "icon-WeChat"
                // img: require("@/assets/img/home/Communitywechat.png").default
            },
            {
                link: "https://www.facebook.com/xmex6688/",
                name: "icon-Facebook"
            },
            {
                link: "https://twitter.com/XMEX66371613",
                name: "icon-Twitter"
            },
            {
                link: "https://t.me/xmex_co",
                name: "icon-Aircraft"
            }
        ];
    },
    // 菜单列表
    getMenuList() {
        return [
            {
                id: 1,
                class: 'body-3',
                label: I18n.$t('10492'), // "产品展示",
                list: [
                    {
                        label: I18n.$t('10493'), // "合约说明",
                        link: "https://help.xmex.co/hc/zh-cn/sections/360006753313",
                        helpCenter: true
                    },
                    {
                        label: I18n.$t('10494'), // "操作指引",
                        link: "https://help.xmex.co/hc/zh-cn/sections/360006745774",
                        helpCenter: true
                    },
                    {
                        label: I18n.$t('10495'), // "新手指南",
                        link: "https://help.xmex.co/hc/zh-cn/categories/360002866853",
                        helpCenter: true
                    },
                    {
                        label: I18n.$t('10496'), // "费率标准",
                        link: "https://help.xmex.co/hc/zh-cn/articles/360041409353",
                        helpCenter: true
                    }
                ]
            },
            {
                id: 2,
                label: I18n.$t('10497'), // "支持",
                list: [
                    {
                        label: I18n.$t('10498'), // "帮助中心",
                        link: "https://help.xmex.co/hc/zh-cn",
                        helpCenter: true
                    },
                    {
                        label: I18n.$t('10495'), // "新手指南",
                        link: "https://help.xmex.co/hc/zh-cn/categories/360002866853",
                        helpCenter: true
                    }
                ]
            },
            {
                id: 3,
                label: I18n.$t('10499'), // "条款",
                list: [
                    {
                        label: I18n.$t('10500'), // "服务条款",
                        link: "https://help.xmex.co/hc/zh-cn/articles/360040811494",
                        helpCenter: true
                    },
                    {
                        label: I18n.$t('10038'), // "法律声明", // I18n.$t('10038')
                        link: "https://help.xmex.co/hc/zh-cn/articles/360040796114",
                        helpCenter: true
                    },
                    {
                        label: I18n.$t('10501'), // "隐私政策",
                        link: "https://help.xmex.co/hc/zh-cn/articles/360041288893",
                        helpCenter: true
                    }
                ]
            },
            {
                id: 4,
                label: I18n.$t('10045'), // "联系我们", // I18n.$t('10045')
                list: [
                    {
                        class: 'body-4',
                        label: I18n.$t('10502'), // "客服及投诉建议",
                        email: "suggest@xmex.co"
                    },
                    {
                        class: 'body-4',
                        label: I18n.$t('10503'), // "商务合作",
                        email: "bd@xmex.co"
                    },
                    {
                        class: 'body-4',
                        label: I18n.$t('10504'), // "求职招募",
                        email: "Allen.wang@xmex.co"
                    }
                ]
            }
        ];
    },
    // 菜单开启状态的id
    openMenuIdList: []
};

module.exports = logic;