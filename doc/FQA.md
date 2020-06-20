# 前端交易对接常见问题

## 行情相关

1. 如何获取当前可订阅的合约列表？  

    首先获取[合约配置AssetD](./WebSocket_API_for_GMEX_v1.md#%E8%A1%8C%E6%83%85api)，合约配置中存在的的合约即当前可订阅合约。

2. 行情相关的价格和数量小数位如何取值？

    价格的小数位取[合约配置AssetD](./WebSocket_API_for_GMEX_v1.md#%E8%A1%8C%E6%83%85api)中的`PrzMinInc`字段的小数的位数；  
    数量的小数位取[合约配置AssetD](./WebSocket_API_for_GMEX_v1.md#%E8%A1%8C%E6%83%85api)中的`Mult`字段的小数的位数。  
    注：交易相关的仓位、委托、成交等相关数据内的价格和数量的小数位同上。

3. 5档或者10档盘口怎么取？  

    可通过订阅20档盘口，在20档盘口的数据取5档或者10档对应的数据。  
    20档盘口数据订阅如下：  

``` js
// 发送订阅请求消息
{
    "req":"Sub",
    "rid":"20",
    "expires":1537708219903,
    "args":["order20_BTC.USDT"]
}

// 收到订阅返回消息
{
    "rid":"20",
    "code":0,
    "data":"OK"
}

// 收到推送消息
{
    "subj":"order20",
    "data":{
        // 合约名称
        "Sym":"BTC.USDT",
        "At":1592394937165,
        // 卖盘盘口 [价格, 数量]
        "Asks":[[9482,7155],[9482.5,9285],[9483,10842],[9483.5,8413],[9484,13800],[9484.5,7666],[9485,6102],[9485.5,13718],[9486,13171],[9486.5,7325],[9487,6618],[9487.5,7588],[9488,12873],[9488.5,14150],[9489,7639],[9489.5,6262],[9490,14471],[9490.5,8085],[9491,9217],[9491.5,11728]],
        // 买盘盘口 [价格, 数量]
        "Bids":[[9479.5,5939],[9479,13998],[9478.5,10587],[9478,13281],[9477.5,5189],[9477,8132],[9476.5,5975],[9476,13555],[9475.5,13417],[9475,7111],[9474.5,13190],[9474,5719],[9473.5,11870],[9473,14980],[9472.5,9170],[9472,12755],[9471.5,11320],[9471,14141],[9470.5,9064],[9470,17492]]
    }
}
```


## 交易相关

> 当前支持的交易模式有【单仓位模式】、【多空双仓位模式】、【下单即开仓模式】、【多仓位模式】

### 单仓位模式

1. 什么是单仓位模式？  

    单仓位，即一个合约只能有一个仓位存在，并且这个合约的所有操作都指向同一仓位

2. 单仓位模式的前端处理逻辑是什么？  

    下单时，下单参数中的`PId`传当前合约已有的`PId`或者传空字符串。


### 多空双仓位模式

1. 什么是多空双仓位模式？  

    多空双仓位模式，即用户一个合约只能存在一个多仓和一个空仓。

2. 多空双仓位模式前端的处理逻辑是什么？  

    + 下单参数中的`OrdFlag`要添加【只开仓】标识和【仓位合并】标识。下单参数示例如下:

    ``` JS
    let p = {
            Sym: 'BTC.USDT,
            PId: 'XXX',
            AId: 'XXX',
            COrdId: 'XXX',
            Dir: 1,
            OType: 1,
            Prz: 9880.5,
            Qty: 100,
            QtyDsp: 0,
            Tif: 0,
            OrdFlag: 0,
            PrzChg: 0
        }
    // 只开仓标识
    p.OrdFlag = (p.OrdFlag | 4)
    // 仓位合并标识
    p.OrdFlag = (p.OrdFlag | 1024)
    ```
    + 下单时，如果当前合约没有仓位，下单参数的`PId`填空字符串；  
    + 下单时，如果当前合约已有仓位，则需要根据仓位中的`Flg`参数来区分做多和做空可选择的仓位。如果有可选择的仓位，则下单参数`PId`填对应仓位的`PId`。如果没有可选仓位，则`PId`填空字符串。筛选多空仓位`JavaScript`示例如下:  

    ```JavaScript  

        /**
         * 参数说明
         * @Poss 以PId为key的Object
         * @Sym 合约名称
         * 
         * 下边是用到的字段说明
         * @Sz 仓位的持仓量
         * @aQtyBuy 仓位对应的买委托量
         * @aQtySell 仓位对应的卖委托量
        */
        const FilterPId = (Poss, Sym)=>{
            let PIdForBuy = [], PIdForSell = [], PIdArrForBuy = [], PIdArrForSell = [], PIdArrForSz0 = [];
            // 筛选买卖仓位
            for(let key in Poss){
                let item = Poss[key]
                if(item.Sym == Sym){
                    if(item.hasOwnProperty('Flg') && (item.Flg&8) != 0){ //禁止做空标志
                        if(item.Sz > 0 || item.aQtyBuy > 0){
                            PIdArrForBuy.push(item.PId)
                        }else{
                            PIdArrForBuy.push(item.PId)
                        }
                    }else if(item.hasOwnProperty('Flg') && (item.Flg&16) != 0){//禁止做多标志
                        if(item.Sz < 0 || item.aQtySell > 0){
                            PIdArrForSell.push(item.PId)
                        }else{
                            PIdArrForSell.push(item.PId)
                        }
                    }else{
                        if(item.Sz > 0 || item.aQtyBuy > 0){
                            PIdArrForBuy.push(item.PId)
                        }else if(item.Sz < 0 || item.aQtySell > 0){
                            PIdArrForSell.push(item.PId)
                        }else {
                            PIdArrForSz0.push(item.PId)
                        }
                    }
                }
            }
            
            // 选取买卖仓位PId
            if(PIdArrForBuy.length > 0){
                PIdForBuy = PIdArrForBuy[0]
            }else{
                PIdForBuy = PIdArrForSz0[0] || ''
            }
            PIdArrForSz0 = PIdArrForSz0.filter(item => {
                return item != PIdForBuy
            })
            if(PIdArrForSell.length > 0){
                PIdForSell = PIdArrForSell[0]
            }else{
                PIdForSell = PIdArrForSz0[0] || ''
            }

            return {PIdForBuy, PIdForSell}
        }
            
    ```


### 下单只开仓模式

1. 什么是下单只开仓模式？  

    下单只开仓，即下单面板每次下单都会开出新的仓位，不会对现有仓位加仓。  

2. 下单只开仓模式前端的处理逻辑是什么？  

    + 下单时，下单参数中的`OrdFlag`要加上【只开仓】标识，`PId`参数要传new。示例如下：  
    ```js
        let p = {
            Sym: 'BTC.USDT,
            PId: 'new',
            AId: 'XXX',
            COrdId: 'XXX',
            Dir: 1,
            OType: 1,
            Prz: 9880.5,
            Qty: 100,
            QtyDsp: 0,
            Tif: 0,
            OrdFlag: 0,
            PrzChg: 0
        }
        // 只开仓标识
        p.OrdFlag = (p.OrdFlag | 4)
    ```

### 多仓位模式

1. 什么是多仓位模式？

    多仓位，即一个合约可以有多个仓位存在。

2. 多仓位模式前端的处理逻辑是什么？

    + 提供仓位列表，让用户能够对下单面板要操作的仓位进行选择。列表内要提供新增仓位的按钮； 新增仓位请求示例如下：  
     
    ```js
        // 发送新增仓位请求消息
        {
            "req":"PosOp",
            "rid":"36",
            "args":{
                "Sym":"BTC.USDT",
                "PId":"",
                "Op":0,
                "AId":"1113046001",
                "UId":"11130460"
            },
            "expires":1592557814735
        }

        // 收到新增仓位返回消息
        {
            "rid":"36",
            "code":0,
            "data":{}
        }

        // 收到推送消息
        {
            "subj":"onPosition",
            "data":{
                "UId":"11130460",
                "PId":"01EB5WSSGVGQSDSHQQ7Q6RXTE4",
                "AId":"1113046001",
                "Sym":"BTC.USDT",
                "WId":"1113046001USDT",
                "Sz":0,
                "PrzIni":0,
                "MgnISO":0,
                "PNLISO":0,
                "DF":291
            }
        }
    ```

### 杠杆
