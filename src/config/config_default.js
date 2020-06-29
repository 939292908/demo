// 请复制一份，命名为config.js
const config = {
    exchId: 0, //渠道ID
    loginType: 0, // 登录类型，0:默认,账号密码登录，1: token登录
    mobile: 1, // 是否适配移动端界面，0: 不适配，1: 开始适配
    theme:"light",//白天主题：light  黑夜主题：dark
    langList: ['zh', 'en','tw'], //多语言显示列表
    symSort: {'BTC':1, 'ETH':2, 'BCH':3, 'XRP':4, 'EOS':5, 'ETC':6}, //合约列表排序
    future: {
        tradeType: 3, // 下单面板交易模式，0: 默认（仓位选择+下单）， 1: 单仓位交易（暂不支持），2: 买卖双向开仓（暂不支持），3: 下单即开仓（下单面板没有仓位选择）
        UPNLPrzActive: '1', // 仓位未实现盈亏计算选择，'1':最新价， '2'：标记价
        MMType: 0, // 仓位保证金率公式选择，0: 默认，1: 开仓价值/杠杆 
        PrzLiqType: 0, // 仓位强平价计算公式选择，0: 默认，1: 默认公式中的MMR风险修改为MAX(MIRMy/2，MMR风险)
        maxPosNum: 10, // 同合约最大仓位数量
        setMIRMy: 1, // 全仓杠杠调节，0:关闭，1:开启
        //下单面板类型开关,0:关闭，1:开启
        placeOrder: {
            limitOrd: 1,
            marketOrd: 1,
            limitPlan: 1,
            marketPlan: 1,
        }, 
        //交易相关列表开关,0:关闭，1:开启
        orderList: {
            pos: 1,
            ord: 1,
            plan: 1,
            historyOrd: 1,
            historyTrd: 1,
            wlt: 1,
        }, 
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
            },
            menu: {
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
        },
        // 平仓
        someCloseMode: {
            type: 0,
        },
        // 调节保证金
        changeMgnMode: {
            type: 0,
        }
    },
    // 仓位按钮显示开关
    positionBtns: {
        mobile: {
            // 市价平仓
            marketClose: {
                positionList: 0,
                positionDes: 0,
            },
            // 反向开仓
            backOpen: {
                positionList: 1,
                positionDes: 1,
            },
            // 加倍开仓
            doubleOpen: {
                positionList: 0,
                positionDes: 0,
            },
            // 市价加仓
            narketAdd: {
                positionList: 1,
                positionDes: 1,
            },
            // 市价平仓（可选择数量平仓）
            marketSomeClose: {
                positionList: 1,
                positionDes: 1,
            },
            // 限价平仓（可选择数量平仓）
            limitSomeClose: {
                positionList: 1,
                positionDes: 1,
            },
            // 止盈止损设置
            stopPL: {
                positionList: 1,
                positionDes: 1,
            },
            // 杠杠调整
            leverage: {
                positionList: 1,
                positionDes: 1,
            },
            // 调节保证金
            changeMgn: {
                positionList: 1,
                positionDes: 1,
            }
        },
        desktop: {
            // 市价平仓
            marketClose: {
                open: 1,
            },
            // 反向开仓
            backOpen: {
                open: 1,
            },
            // 加倍开仓
            doubleOpen: {
                open: 1,
            },
            // 市价加仓
            narketAdd: {
                open: 1,
            },
            // 市价平仓（可选择数量平仓）
            marketSomeClose: {
                open: 1,
            },
            // 限价平仓（可选择数量平仓）
            limitSomeClose: {
                open: 1,
            },
            // 止盈止损设置
            stopPL: {
                open: 1,
            },
            // 杠杠调整
            leverage: {
                open: 1,
            },
            // 调节保证金
            changeMgn: {
                open: 1,
            }
        }
    }
}

module.exports = config