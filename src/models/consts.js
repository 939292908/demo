module.exports = {
    OrdFlg: {
        POSTONLY:1,
//如果委托会导致增加仓位，则不发送此委托
        REDUCEONLY:2,
//触发后平仓 TODO 目前未实现
//	CLOSEONTRIGGER 	= 4;
//条件指定为 如果价格大于StopBy
        IF_GREATERTHAN:8,
//条件指定为 如果价格低于StopBy
        IF_LESSTHAN:16,
//行情追踪委托的激活状态
        TRACE_ACTIVE:32,
//行情追踪委托的触发状态
        TRACE_FIRE:64,
//设定此标志以跟踪最大值的回调。不设定此标志以跟踪最小值的回调
        TRACE_AT_MAX:128,
//是否允许第三币种支付手续费
        FEE_IN_TPCOIN:256,
    }
    //必然具备的字段
    , Wlt: {
        Depo:0
        ,Wdrw:0
        ,PNL:0
        ,Spot:0
        ,MM:0
        ,MI:0
        ,PNLG:0
        ,GIFT:0
        ,Wdrawable:0
    }
    ,Ord: {
        QtyF:0
    }
    ,OrdStatus: {
        //正在排队
        Queueing:1,
        // 有效
        Matching :2,
        // 提交失败
        PostFail : 3,
        // 已执行
        Executed : 4,

        Status_5: 5,
        Status_6: 6,

    }
    ,Via: {
        //web浏览器
        "1":"Web",
        //客户端App
        "2":"App",
        //直接访问API
        "3":"Api",
        //平仓 Liquidate
        "4":"Liquidate",
        //ADL 减仓操作
        "5":"ADLEngine",
        //结算
        "6":"Settlement",
        //交易
        "7":"Trade",
        //手续费
        " 8":"Fee",
        //存
        " 9":"Depo",
        //取
        " 10":"Wdrw",
        //Funding
        "11":"Funding",
        //配售
        "12":"Offer",
        //给予Gift
        "17":"Gift_Give",
        //WltSettle 钱包结算
        "  18":"Wlt_Settle",
        //WltSettle 钱包结算
        "  19":"Gift_Settle",
    },
    PosDefault: {
        UId: "",
        PId: "",
        AId: "",
        Sym: "",
        WId: "",
        Sz: 0,
        PrzIni: 0,
        RPNL: 0,
        Lever: 0,
        MgnISO: 0,
        PNLISO: 0,
        LeverMax: 0,
        MMR: 0,
        MIR: 0,
        PNLGISO: 0,
    
        Val: 0,
        MMnF: 0,
        MI: 0,
    
        UPNL: 0,
        PrzLiq: 0,
        PrzBr: 0,
        FeeEst: 0,
        ROE: 0,
        ADLLight: 0,
        SymM: "",
        MIRMy: 0,
      },
}


