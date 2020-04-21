// 请复制一份，命名为config.js
const config = {
    exchId: 0, //渠道ID
    loginType: 0, // 登录类型，0:默认,账号密码登录，1: token登录
    future: {
        tradeType: 0, // 下单面板交易模式，0: 默认（仓位选择+下单）， 1: 单仓位交易（暂不支持），2: 买卖双向开仓（暂不支持），3: 下单即开仓（下单面板没有仓位选择）
        UPNLPrzActive: '1', // 仓位未实现盈亏计算选择，'1':最新价， '2'：标记价
        MMType: 0, // 仓位保证金率公式选择，0: 默认，1: 开仓价值/杠杆 
        PrzLiqType: 0, // 仓位强平价计算公式选择，0: 默认，1: 默认公式中的MMR风险修改为MAX(MIRMy，MIR风险)/2
    },
    views: {
        // type 0:默认， 1: 自定义
        header: {
            type: 0,
            logo: {
                type: 0,
            },
            left: {
                type: 0,
            },
            right: {
                type: 0,
            }
        },
        //内容总布局
        layout: {
            type: 0,
        },
        footer: {
            type: 0,
        },
        message: {
            type: 0,
        },
        // 头部行情
        headerTick: {
            left: {
                type: 0,
                symSelect: {
                    type: 0,
                }
            },
            right: {
                type: 0,
            },
        },
        //k线
        kline: {
            type: 0
        },
        // 盘口和成交模块
        dishAndNewTrd: {
            type: 0
        },
        //盘口
        dish: {
            content: {
                type: 0,
            },
            bottomBtns: {
                type: 0,
            }
        },
        // 最新成交
        newTrd: {
            type: 0,
        },
        // 下单面板
        placeOrd: {
            type: 0,
        },
        // 资产模块
        wallet: {
            type: 0,
        },
        // 合约信息
        spotInfo: {
            type: 0,
        },
        // 仓位等列表模块
        bottomList: {
            type: 0,
        },
        //登录
        login: {
            type: 0
        },
        //杠杠设置弹框
        leverageMode: {
            type: 0
        },
        // 止盈止损弹框
        stopPLMode: {
            type: 0
        },
        // 登录二次确认弹框
        validateMode:{
            type: 0,
        },
        // 市价加仓弹框
        marketAddMode: {
            type: 0,
        }
    }
}

module.exports = config