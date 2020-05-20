const utils = {}


Date.prototype.format = function (format) {
  var o = {
      "Y+": this.getYear(),
      "M+": this.getMonth() + 1, //month
      "d+": this.getDate(), //day
      "h+": this.getHours(), //hour
      "m+": this.getMinutes(), //minute
      "s+": this.getSeconds(), //second
      "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
      "S+": this.getMilliseconds() //millisecond
  }

  if (/(y+)/.test(format)) {
      format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }

  for (var k in o) {
      if (new RegExp("(" + k + ")").test(format)) {
          //format = format.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
          if (k === "S+")
              format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("000" + o[k]).substr(("" + o[k]).length));
          else
              format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
      }
  }
  return format;
};

Number.prototype.toFixed2 = function (n) {
    var num2 = this.toFixed(n + 1);
    if (n == 0) {
        return num2.substring(0, num2.lastIndexOf('.') + n)
    } else {
        return num2.substring(0, num2.lastIndexOf('.') + n + 1)
    }
};

Number.prototype.toSubstrFixed = function (n) {
    var num2 = '' + this;
    let i = num2.lastIndexOf('.') == -1? num2.length:num2.lastIndexOf('.')
    if (n == 0) {
        return num2.substring(0, i + n)
    } else {
        return num2.substring(0, i + n + 1)
    }
};
Number.prototype.toCeilFixed = function(n){  //小数位向上取整
    let num = Math.pow(10,n)
    let val = (Math.ceil((this * num).toFixed(8)) / num).toFixed(n)
    return val
}

/**
 * 数字保留有效数字，并保持最大小数位为maxLen位
 * @n 保留有效数字的位数
 * @maxLen 最大小数位数
 */

Number.prototype.toPrecision2 = function(n, maxLen){
    //保留n个有效数字
    let num = this.toPrecision(n)
    //处理科学计数法数字
    let str = num.toString();
    if (/e/i.test(str)) {
        num = Number(num).toFixed(18).replace(/\.?0+$/, "");
    }

    //处理最长小数位为maxLen位
    if(maxLen || maxLen === 0){
        str = num.toString()
        if(str.indexOf('.') > -1){
            str = num.toString().split('.');
            if(str[1].length > maxLen){
                num = str[0]+'.'+str[1].substr(0,maxLen)
            }
        }
    }
    
    return num
}

//禁止冒泡
window.stopBubble = function(e) { 
    //如果提供了事件对象，则这是一个非IE浏览器 
    if ( e && e.stopPropagation ) 
        //因此它支持W3C的stopPropagation()方法 
        e.stopPropagation(); 
    else 
        //否则，我们需要使用IE的方式来取消事件冒泡 
        window.event.cancelBubble = true; 
}

/**
 * @assetD 合约详情，以Sym为key
 * @Sym 合约名称
 */
utils.getSymDisplayName = function(assetD, Sym){
  let ass = assetD[Sym]
  if(ass){
    if (ass.TrdCls == 3) {
        if((ass.Flag&1) == 1){
            return gDI18n.$t('10002', {value: ass.ToC})//ass.ToC + ' 永续'
        }else{
            return gDI18n.$t('10104', {value1: ass.ToC,value2 :ass.SettleCoin})//ass.ToC + '/' + ass.SettleCoin + ' 永续'
        }
    } else if (ass.TrdCls == 1) {
        if(Sym && Sym.includes(`@`)){
            return Sym.split('@')[0]
        }else{
            return Sym
        }
    }else if(ass.TrdCls == 2){
        return gDI18n.$t('10255', {value1: ass.SettleCoin,value2 :new Date(ass.Expire).format('MMdd')})//ass.SettleCoin + ' 季度' + new Date(ass.Expire).format('MMdd')
    } else {
        return Sym
    }
  }else if(Sym && Sym.includes(`@`)){
      return Sym.split('@')[0]
  }else {
      return Sym
  }
}

utils.setSubArrType = function (type, params) { // 将数组内容转换为可订阅内容，ps： tick_BTC1812
    let arr = [];
    params.forEach(item => {
        if (item && type == 'tick' && item.indexOf('GMEX_CI_') > -1) {
            arr.push('index_' + item)
        } else {
            arr.push(type + '_' + item)
        }

    })
    return arr;
}

/**
 * @assetD 合约详情，以Sym为key
 * @Sym 合约名称
 */
utils.getGmexCi = function (assetD, Sym) {//获取合约对应的指数
    let ass = assetD[Sym]
    if (!ass) return false;
    let gmexci = '';
    if (ass.TrdCls == 3) {
        gmexci = 'GMEX_CI_' + ass.ToC
    } else {
        gmexci = 'GMEX_CI_' + ass.SettleCoin
    }
    return gmexci

}

/**
 * @assetD 合约详情，以Sym为key
 * @AssetEx 合约参数补充，以Sym为key
 * @tick tick行情数据
 * @oldTick 行情老数据
 * @indexTick 合约对应的指数行情
 */
utils.getTickObj = function(assetD, AssetEx, tick, oldTick, indexTick){
    let Sym = tick.Sym
    let ass = assetD[Sym]
    let assEx = AssetEx[Sym]
    let obj = {
        Sym: Sym,
        disSym: '--',
        LastPrz: '--', // 最新成交价
        rateValue: '--', // 估值 ：最新成交价 * 汇率
        rfpre: '--', // 涨跌幅
        rf: '--',
        Volume24: '--', // 24小时成交量
        color: '',
    }

    let PrzMinIncSize = 0;
    let VolMinValSize = 0;
    let rateValueSize = 2;
    if (Sym && Sym.indexOf('GMEX_CI_') > -1) {
        obj.disSym = (Sym).split('_')[2] + gDI18n.$t('10413')//指数
    } else {
        obj.disSym = utils.getSymDisplayName(Sym)
    }
    if (tick) {
        
        
        let oldPrz = Number(oldTick && oldTick.LastPrz || 0)
        if(oldTick){
            if (tick.LastPrz > oldPrz) {
                obj.color = 1;
            } else if (tick.LastPrz < oldPrz) {
                obj.color = -1;
            } else {
                obj.color = 0;
            }
        }
        if (Sym.indexOf('GMEX_CI_') > -1) {
            PrzMinIncSize = 8//indexPrzSize[Sym]
            obj.LastPrz = Number(tick.Prz).toFixed(PrzMinIncSize);
            let rfpre = tick.Prz24 == 0 ? 0 : (tick.Prz - tick.Prz24) / tick.Prz24 * 100
            obj.rfpre = (rfpre).toFixed(2) + '%'
            obj.rfpreColor = rfpre>0?1:-1
            obj.rf = (Number(tick.Prz) - Number(tick.Prz24)).toFixed(PrzMinIncSize)
            obj.Volume24 = Number(tick.Volume24).toFixed(VolMinValSize)
        } else if (ass && ass.TrdCls == 1) {
            PrzMinIncSize = utils.getFloatSize(utils.getFullNum(ass.PrzMinInc));
            VolMinValSize = 0//utils.getFloatSize(ass.Mult);
            
            if(assEx && (assEx.RiseR || assEx.FallR)){
                let rfpre = (!ass.PrzCls || ass.PrzCls == 0) ? 0 : (tick.LastPrz - ass.PrzCls) / ass.PrzCls * 100
                obj.rfpre = (rfpre).toFixed(2) + '%'
                obj.rfpreColor = rfpre>0?1:-1
                obj.rf = Number(tick.LastPrz || 0) == 0 || Number(ass.PrzCls || 0) == 0 ? 0:(Number(tick.LastPrz) - Number(ass.PrzCls)).toFixed(PrzMinIncSize)
            }else{
                let rfpre = tick.Prz24 == 0 ? 0 : (tick.LastPrz - tick.Prz24) / tick.Prz24 * 100
                obj.rfpre = (rfpre).toFixed(2) + '%'
                obj.rfpreColor = rfpre>0?1:-1
                obj.rf = Number(tick.LastPrz) == 0 || Number(ass.Prz24) == 0 ? 0:(Number(tick.LastPrz) - Number(tick.Prz24)).toFixed(PrzMinIncSize)
            }
            
            //最新价格
            obj.LastPrz = Number(tick.LastPrz).toFixed(PrzMinIncSize);
            //24H成交量
            obj.Volume24 = Number(tick.Volume24).toFixed(VolMinValSize);
            obj.Volume24ForUSDT = (Number(tick.Volume24) * tick.LastPrz).toFixed(4);
            //标记价格
            obj.SettPrz =  Number(tick.SettPrz).toFixed(PrzMinIncSize);
            //指数价格
            obj.indexPrz = indexTick?Number(indexTick.Prz || 0).toFixed(PrzMinIncSize):'--';
            //24小时最高
            obj.High24 = Number(tick.High24).toFixed(PrzMinIncSize);
            //24小时最低
            obj.Low24 = Number(tick.Low24).toFixed(PrzMinIncSize);

            obj.TrdCls = ass.TrdCls
            obj.FromC = ass.FromC
            obj.ToC = ass.ToC
        } else if(ass){
            if (ass) {
                PrzMinIncSize = utils.getFloatSize(ass.PrzMinInc || 0);
                VolMinValSize = 0//utils.getFloatSize(ass.Mult);
            }
            let rfpre = tick.Prz24 == 0 ? 0 : (tick.LastPrz - tick.Prz24) / tick.Prz24 * 100
            obj.rfpre = (rfpre).toFixed(2) + '%'
            obj.rfpreColor = rfpre>0?1:-1
            obj.rf = (Number(tick.LastPrz) - Number(tick.Prz24)).toFixed(PrzMinIncSize)
            //最新价格
            obj.LastPrz = Number(tick.LastPrz).toFixed(PrzMinIncSize);
            //24H成交量
            obj.Volume24 = Number(tick.Volume24).toFixed(VolMinValSize);
            obj.Volume24ForUSDT = (Number(tick.Volume24) * tick.LastPrz).toFixed(4);
            //24H持仓量
            obj.Turnover24 = Number(tick.Turnover24).toFixed(VolMinValSize);
            obj.Turnover24ForUSDT = (Number(tick.Turnover24) * tick.LastPrz).toFixed(4);
            //标记价格
            obj.SettPrz =  Number(tick.SettPrz).toFixed(PrzMinIncSize);
            //指数价格
            obj.indexPrz = indexTick?Number(indexTick.Prz || indexTick.LastPrz || 0).toFixed(PrzMinIncSize):'--';
            //24小时最高
            obj.High24 = Number(tick.High24).toFixed(PrzMinIncSize);
            //24小时最低
            obj.Low24 = Number(tick.Low24).toFixed(PrzMinIncSize);
            //当前周期资金费率
            obj.FundingLongR = Number(tick.FundingLongR || 0).toFixed(4)+'%';
            //下个周期预测的资金费率
            obj.FundingPredictedR = Number(tick.FundingPredictedR || 0).toFixed(4)+'%';

            obj.TrdCls = ass.TrdCls
            obj.FromC = ass.FromC
            obj.ToC = ass.ToC

        }else if(!ass){
            obj = false
        }   
    }
    return obj
}

//按状态获取颜色class
utils.getColorStr = function(status, type){
    let colorClass = ''
    switch(status){
        case 1:
            colorClass = type == 'font'?' has-text-success':' is-success'
            break;
        case -1:
            colorClass = type == 'font'?' has-text-danger':' is-danger'
            break;
        default:
            colorClass = type == 'font'?'':' is-white'
    }
    return colorClass
}

///获取小数位数
utils.getFloatSize = function (val) {
    if (val.toString().indexOf(".") == -1) {
        return 0
    }
    var _v = val.toString().split(".");
    if (_v.length > 1) return _v[1].length
    return 0;
}

// 科学计数法转正常数
utils.getFullNum = function (num) { 
    //处理非数字
    if (isNaN(num)) {
        return num
    }
    ;
    //处理不需要转换的数字
    var str = '' + num;
    if (!/e/i.test(str)) {
        return num;
    }
    ;
    return (num).toFixed(18).replace(/\.?0+$/, "");
}

//处理k线小数位
utils.KLine_pow = function (assetD, Sym) {
    if (!Sym) return
    let n = 2
    if (Sym.indexOf('GMEX_CI_') != -1) {
        let symb = (Sym).split('_')[2]
        switch (symb) {
            case 'BTC':
                n = 2
                break;
            case 'ETH':
                n = 3
                break;
            case 'ADA':
                n = 5
                break;
            case 'XRP':
                n = 4
                break;
            case 'ONT':
                n = 4
                break;
            case 'BCHSV':
                n = 3
                break;
            case 'BCHABC':
                n = 3
                break;
            case 'NEO':
                n = 3
                break;
            case 'LTC':
                n = 3
                break;
            case 'ETC':
                n = 3
                break;
            case 'EOS':
                n = 4
                break;
            case 'GAEA':
                n = 8
                break;
            default:
                n = 6
                break;
        }
    } else {
        let ass = assetD[Sym]
        n = ass?utils.getFloatSize(utils.getFullNum(ass.PrzMinInc)):2;
    }
    return n
}

utils.setItem = function (key, val) {
    try {
        window.localStorage.setItem(key, JSON.stringify(val));
    } catch(e) {
        console.log(JSON.stringify(e));
    }
};

utils.getItem = function (key) {
    try {
        return JSON.parse(window.localStorage.getItem(key));
    } catch(e) {
        return null;
    }
};
utils.removeItem = function (key) {
    try {
        window.localStorage.removeItem(key);
    } catch(e) {
        console.log(JSON.stringify(e));
    }
};

// 资金中心及node提示错误码
utils.getWebApiErrorCode = function (code) {
    let obj = {
        "8001": gDI18n.$t('10256'),//"签名验证失败"
        "8002": gDI18n.$t('10257'),//"资产余额不足"
        "8003": gDI18n.$t('10258'),//"序列号已存在",
        "8004": gDI18n.$t('10259'),//"序列号已超时",
        "8005": gDI18n.$t('10260'),//"用户令牌错误",
        "8006": gDI18n.$t('10261'),//"用户令牌超时",
        "8007": gDI18n.$t('10262'),//"不支持的操作",
        "8008": gDI18n.$t('10263'),//"系统出错",
        "8009": gDI18n.$t('10264'),//"输入错误",
        "8010": gDI18n.$t('10265'),//"序列号不存在",
        "8011": gDI18n.$t('10266'),//"状态错误",
        "8012": gDI18n.$t('10267'),//"资产数量错误",
        "8013": gDI18n.$t('10268'),//"资产密码错误",
        "8014": gDI18n.$t('10269'),//"资产密码为空",
        "10005": gDI18n.$t('10270'),//"邮件验证失败",
        "10004": gDI18n.$t('10271'),//"短信验证失败",
        "10002": gDI18n.$t('10272'),//"谷歌验证失败",
        "123": gDI18n.$t('10273'),//"5分钟内请勿重复发送",
        "124": gDI18n.$t('10274'),//"请勿频繁发送验证",
        "9000": gDI18n.$t('10275'),//"系统繁忙请稍后再试",
        "9001": gDI18n.$t('10276'),//"输入信息有误",
        "9002": gDI18n.$t('10277'),//"登录过期，请重新登录",
        "9003": gDI18n.$t('10277'),//"登录过期，请重新登录",
        "9004": gDI18n.$t('10278'),//"请输入有效的邮箱地址",
        "9005": gDI18n.$t('10279'),//"两次输入密码不一致",
        "9006": gDI18n.$t('10280'),//"用户不存在",
        "9007": gDI18n.$t('10281'),//"用户已存在",
        "9008": gDI18n.$t('10282'),//"钱包地址重复",
        "9009": gDI18n.$t('10283'),//"钱包地址验证失败",
        "9010": gDI18n.$t('10284'),//"用户名或密码错误",
        "9011": gDI18n.$t('10285'),//"邮箱未验证",
        "9012": gDI18n.$t('10286'),//"邮箱已验证，不可再次验证",
        "9013": gDI18n.$t('10287'),//"验证码失效",
        "9014": gDI18n.$t('10288'),//"密码错误",
        "9015": gDI18n.$t('10289'),//"设置无变化",
        "9016": gDI18n.$t('10290'),//"身份认证(已审核通过)不可再更改",
        "9017": gDI18n.$t('10291'),//"币种错误",
        "9018": gDI18n.$t('10292'),//"手机号不存在",
        "9019": gDI18n.$t('10293'),//"手机号已存在",
        "9020": gDI18n.$t('10294'),//"谷歌已存在",
        "9021": gDI18n.$t('10294'),//"谷歌已存在",
        "9022": gDI18n.$t('10295'),//"密码修改,密码重置 或 2FA解绑后，24h内禁止提币",
        "9023": gDI18n.$t('10296'),//"状态错误",
        "9024": gDI18n.$t('10297'),//"配置错误",
        "9025": gDI18n.$t('10298'),//"超出购买数量限制",
        "9026": gDI18n.$t('10299'),//"购买数量不足最小购买量",
        "9027": gDI18n.$t('10300'),//"购买次数超过最大次数限制",
        "9028": gDI18n.$t('10301'),//"资产不足",
        "9029": gDI18n.$t('10302'),//"操作失败",
        "9030": gDI18n.$t('10303'),//"资产密码不可与登录密码相同",
        "9101": gDI18n.$t('10304'),//"系统繁忙请稍后再试",
        "9102": gDI18n.$t('10304'),//"系统繁忙请稍后再试",
        "9025": gDI18n.$t('10305'),//"每日资产划转额度限制",
        "-10": gDI18n.$t('10306'),//"没有打开活动",
        "-11": gDI18n.$t('10307'),//"多次入金",
        "-20": gDI18n.$t('10308'),//"道具使用失败",
        "-23": gDI18n.$t('10309'),//"活动不在有效期",
        "9032": gDI18n.$t('10310'),//"必须输入邀请人ID",
        "9033": gDI18n.$t('10311'),//"邀请码错误",
        "9034": gDI18n.$t('10311'),//"邀请码错误",
        "9035": gDI18n.$t('10312'),//"暂未开始",
        "9036": gDI18n.$t('10313'),//"已结束",
        "9037": gDI18n.$t('10314'),//"签名错误",
        "9038": gDI18n.$t('10315'),//"服务器内部错误",
        "9040": gDI18n.$t('10316'),//"划转已提交审核",
        "9039": gDI18n.$t('10317'),//"额度已使用完毕",
        "20000": gDI18n.$t('10318'),//"非法操作，请先通过二次验证",
        "20001": gDI18n.$t('10319'),//"未实名认证",
        "20002": gDI18n.$t('10320'),//"登录状态下不能注册",
        "20003": gDI18n.$t('10321'),//"非法渠道号",
        "20004": gDI18n.$t('10322'),//"注册功能已受限",
        "999999": gDI18n.$t('10323'),//"账号注册异常",
        "-1": gDI18n.$t('10324'),//"极验验证异常",
    }

    return obj[code] || gDI18n.$t('10203'/*'未知错误'*/) + `(${code})`
};

utils.copyTab = function (a, b) {
    for (var key in b) {
        a[key] = b[key]
    }
}

/**
 * 获取交易类型
 * @OTpye 交易类型
 * @assetD 合约详情
 */
utils.getOtypeByStr = function (OTpye, assetD) {
    let ms = ""
    if (!assetD || assetD.TrdCls == 1) {
        switch (OTpye) {
            case 1:
                ms = gDI18n.$t('10185');//"限价";
                break;
            case 2:
                ms = gDI18n.$t('10081');//"市价";
                break;
            case 3:
                ms = gDI18n.$t('10325');//'止盈止损';
                break;
            default:
                break;
        }
    } else {
        switch (OTpye) {
            case 1:
                ms = gDI18n.$t('10185');//"限价";
                break;
            case 2:
                ms = gDI18n.$t('10081');//"市价";
                break;
            case 3:
                ms = gDI18n.$t('10119');//'限价计划';
                break;
            case 4:
                ms = gDI18n.$t('10120');//'市价计划';
                break;
            default:
                break;
        }
    }
    return ms;
}

utils.getDirByStr = function(dir){
    let obj = {
        '1': gDI18n.$t('10326'/*'买入'*/),
        '-1': gDI18n.$t('10327'/*'卖出'*/)
    }
    return obj[dir]
}

utils.getPosDirByStr = function(dir){
    let obj = {
        '1': gDI18n.$t('10170'/*'多仓'*/),
        '-1': gDI18n.$t('10171'/*'空仓'*/)
    }
    return obj[dir]
}

utils.getStopPLByStr = function(dir){
    let obj = {
        '0': gDI18n.$t('10048'/*'标记价'*/),
        '1': gDI18n.$t('10046'/*'最新价'*/),
        '2': gDI18n.$t('10070'/*'指数价'*/),
    }
    return obj[dir]
}

/**
 * @pos 仓位数据信息
 * @assetD 仓位对应合约的合约详情
 */
utils.getPosInfo = function(pos,assetD){
    if(assetD){
        let obj = {}
        this.copyTab(obj, pos)

        let PrzMinIncSize = utils.getFloatSize(utils.getFullNum(assetD.PrzMinInc || 6));
        let VolMinValSize = utils.getFloatSize(assetD.Mult || 2);

        //杠杆
        if(assetD.MIR){
          let maxLever = Number(1/Math.max(assetD.MIR || 0, obj.MIRMy || 0)).toFixed2(2)
          obj.displayLever = obj.Lever== 0? gDI18n.$t('10068',{value :maxLever}/*'全仓'+maxLever+'X'*/):gDI18n.$t('10069',{value :Number(obj.Lever || 0).toFixed2(2)}/*'逐仓'+Number(obj.Lever || 0).toFixed2(2)+'X'*/)
          obj.displayLever = (obj.Sz > 0? gDI18n.$t('10071'/*'多@'*/):obj.Sz < 0?gDI18n.$t('10328'/*'空@'*/):'')+obj.displayLever
        }else{
          obj.displayLever = '--'
        }

        obj.dirStr = obj.Sz > 0?gDI18n.$t('10329'/*'多'*/):obj.Sz < 0?gDI18n.$t('10330'/*'空'*/):''
        
        //开仓均价
        obj.PrzIni = Number(obj.PrzIni).toFixed2(PrzMinIncSize)
        // 强平价
        obj.aPrzLiq = Number(obj.aPrzLiq || 0).toFixed2(PrzMinIncSize)
        //持仓数量
        obj.Sz = Number(obj.Sz).toFixed2(VolMinValSize)
        //仓位保证金
        obj.aMM = Number(obj.aMM || 0)> 1000?Number(obj.aMM || 0).toFixed2(4):Number(obj.aMM || 0).toPrecision2(6,8)
        //未实现盈亏
        let UPNL = 1?(obj.aUPNLforLast || 0):(obj.aUPNLforM  || 0)
        obj.aUPNL = Number(UPNL)> 1000?Number(UPNL).toFixed2(4):Number(UPNL).toPrecision2(6,8)
        obj.UPNLColor = Number(UPNL)>0?1:Number(UPNL)<0?-1:0
        // 已实现盈亏
        obj.RPNL = Number(obj.RPNL)> 1000?Number(obj.RPNL).toFixed2(4):Number(obj.RPNL).toPrecision2(6,8)
        obj.PNLColor = Number(obj.RPNL)>0?1:Number(obj.RPNL)<0?-1:0
        //风险度
        obj.aMgnRateforPrzMStr = (Number(obj.aMgnRateforPrzM || 0)*100).toFixed2(2)+'%'
        //风险度参考值
        obj.aMgnRateforLiqStr = (Number(obj.aMgnRateforLiq || 0)*100).toFixed2(2)+'%'
        //回报率
        obj.aProfitPerStr = (Number(obj.aProfitPer || 0)*100).toFixed2(2)+'%'
        obj.aProfitPerColor = Number(obj.aProfitPer || 0)>0?1:Number(obj.aProfitPer || 0)<0?-1:0
        //止盈价
        obj.StopP = obj.StopP?Number(obj.StopP || 0).toFixed2(PrzMinIncSize):''
        //止损价
        obj.StopL = obj.StopL?Number(obj.StopL || 0).toFixed2(PrzMinIncSize):''

        obj.SettleCoin = assetD.SettleCoin

        obj.loading = false

        return obj
    }else{
        return false
    }
}

utils.getTradeErrorCode = function (errCode) {
    let con = {
        "-9999": gDI18n.$t('10331'),//"网络超时",
        "-491": gDI18n.$t('10332'),//"只能登录一次", //'只能登录一次',
        "-429": gDI18n.$t('10333'),//"请求次数过于频繁", //'请求次数过于频繁',
        "-406": gDI18n.$t('10334'),//"无效的签名", //'无效的签名',
        "-405": gDI18n.$t('10335'),//"json解析失败", //'json解析失败',
        "-404": gDI18n.$t('10336'),//"未找到", //'未找到',
        "-403": gDI18n.$t('10337'),//'交易限制',
        "-401": gDI18n.$t('10338'),//'未登录',
        "-400": gDI18n.$t('10339'),//"api-key无权限", //'api-key无权限',
        "-1": gDI18n.$t('10340'),//"API错误！",
        "0": gDI18n.$t('10341'),//"没有错误！",
        "1": gDI18n.$t('10342'),//"数据错误！",
        "2": gDI18n.$t('10343'),//"数量超出最大限制！",
        "3": gDI18n.$t('10344'),//"服务器未实现！",
        "4": gDI18n.$t('10345'),//"可用资产不足或逐仓委托将直接导致强平！",
        "5": gDI18n.$t('10346'),//"严重错误！",
        "6": gDI18n.$t('10347'),//"该笔委托不存在！",
        "7": gDI18n.$t('10348'),//"委托方向错误！",
        "8": gDI18n.$t('10349'),//"操作码错误！",
        "9": gDI18n.$t('10350'),//"已存在！",
        "10": gDI18n.$t('10347'),//"该笔委托不存在！",
        "11": gDI18n.$t('10351'),//"价格错误！",
        "12": gDI18n.$t('10352'),//"合约到期，无法交易！",
        "13": gDI18n.$t('10353'),//"可用资产不足！",
        "14": gDI18n.$t('10354'),//"被动委托执行失败！",
        "15": gDI18n.$t('10355'),//"FOK委托已被撤单",
        "16": gDI18n.$t('10356'),//"超出各种限制！",
        "17": gDI18n.$t('10357'),//'单笔委托量超出最低或最高限制',
        "18": gDI18n.$t('10358'),//"价格或者数量超出限制！",
        "19": gDI18n.$t('10359'),//"超过最大持仓限额！",
        "20": gDI18n.$t('10360'),//"禁止开仓！",
        "21": gDI18n.$t('10361'),//"交易暂停！",
        "22": gDI18n.$t('10362'),//"超过强平价格！",
        "23": gDI18n.$t('10363'),//"超过最大挂单数量！",
        "24": gDI18n.$t('10364'),//"超出开仓时间限制！",
        "25": gDI18n.$t('10365'),//"MD5签名验证错误！",
        "26": gDI18n.$t('10366'),//"下单限速！",
        "27": gDI18n.$t('10367'),//"委托已撤销！",
        "28": gDI18n.$t('10368'),//'可用资产不足！',//"无法找到钱包！",
        "29": gDI18n.$t('10369'),//'该交易对交易未开启',//vm.$t('10607'), //"未找到交易对！",
        "30": gDI18n.$t('10370'),//"超过最大委托价值！",
        "31": gDI18n.$t('10371'),//"可用资产不足或逐仓委托将直接导致强平！",
        "32": gDI18n.$t('10372'),//"非交易时间！",
        "33": gDI18n.$t('10373'),//"该委托价格超过涨跌停价格！",
        "34": gDI18n.$t('10374'),//"超出最小价格限制！",
        "35": gDI18n.$t('10375'),//"超出交易量限制！剩余交易量",
        "36": gDI18n.$t('10376'),//"超出交易次数限制！",
        "37": gDI18n.$t('10377'),//"委托价超出最高或最低限价！",
        "39": 'EXCEED_TRDSUM',//TRDSUM限制
        "40": gDI18n.$t('10378'),//'超出当日买卖累计数量',
        "41": 'TOO_MANY_POS',
        "42": 'CHANNEL_BUSY',
        "43": 'CANT_ADD_MGN',
        "44": gDI18n.$t('10379'),//'将导致平仓',//将导致平仓
        "45": gDI18n.$t('10380'),//'只减仓平仓委托已撤销！',
        "46": gDI18n.$t('10381'),//'自动撤单',//自动撤单
        "64": gDI18n.$t('10382'),//"没有指定风险限额！",
        "65": gDI18n.$t('10383'),//'不是一个逐仓',
        "99": gDI18n.$t('10384'),//'操作超时，请稍后重试',
        "255": 'EMPTY_RESPONSE'
    };
    return con[errCode] || ((errCode || 'error') + gDI18n.$t('10203'/*'未知错误'*/))
}

utils.getSpotName = function(coin1, coin2, AssetDs){ //用币种获取相关交易对名称
    let symAsset = AssetDs
    for(let key in symAsset){
        if( key.indexOf(`${coin1}/${coin2}`) == 0 ){
            return key
        }
    }
    return `${coin1}/${coin2}`
}

utils.getFutureName = function(coin1, coin2, AssetDs){ //用币种获取相关合约名称
    let symAsset = AssetDs
    for(let key in symAsset){
        if( key.indexOf(`${coin1}.${coin2}`) == 0 ){
            return key
        }
    }
    return `${coin1}.${coin2}`
}

utils.WltViaStr = function (value, type) {
    let obj = {
        '4': gDI18n.$t('10385'),//'强制平仓',
        '5': gDI18n.$t('10386'),//'自动减仓',
        '6': gDI18n.$t('10387'),//'交割结算',
        '7': gDI18n.$t('10388'),//'普通交易',
        '8': gDI18n.$t('10063'),//'手续费',
        '9': gDI18n.$t('10389'),//'账户划入',
        '10': gDI18n.$t('10390'),//'账户划出',
        '11': gDI18n.$t('10391'),//'资金费用',
        '13': gDI18n.$t('10385'),//'强制平仓',
        '14': gDI18n.$t('10392'),//'平仓结算',
        '17': gDI18n.$t('10393'),//'合约赠金'
    }
    if(type && type == 'object'){
        return obj
    }else{
        return obj[value] || ''
    }

}

utils.isMobile = function() {
    let userAgentInfo = navigator.userAgent;
 
    let mobileAgents = [ "Android", "iPhone", "SymbianOS", "Windows Phone", "iPad","iPod"];
 
    let mobile_flag = false;
 
    //根据userAgent判断是否是手机
    for (let v = 0; v < mobileAgents.length; v++) {
        if (userAgentInfo.indexOf(mobileAgents[v]) > 0) {
            mobile_flag = true;
            break;
        }
    }
 
    let screen_width = window.screen.width;
    let screen_height = window.screen.height;    
 
    //根据屏幕分辨率判断是否是手机
    if(screen_width < 500 && screen_height < 800){
        mobile_flag = true;
    }

    return mobile_flag;
}

utils.ordersStatusStr = function (type) {
    let ms = ""
    switch (type) {
        case 0:
            ms = gDI18n.$t('10394');//"全部";
            break;
        case 1:
            ms = gDI18n.$t('10395');//"排队中"; //正在排队
            break;
        case 2:
            ms = gDI18n.$t('10396');//"挂单"; //有效
            break;
        case 3:
            ms = gDI18n.$t('10397');//"错单"; //提交失败
            break;
        case 4:
            ms = gDI18n.$t('10398');//"全部成交"; //全部成交
            break;
        case 5:
            ms = gDI18n.$t('10399');//"已撤单"; //取消
            break;
        case 6:
            ms = gDI18n.$t('10400');//"部分撤单";
            break;
        case 7:
            ms = gDI18n.$t('10401');//"撤单(执行失败)";
            break;
        case 10:
            ms = gDI18n.$t('10400');//"部分撤单"; //已撤单，但有成交量
            break;
        default:
            break;
    }
    return ms;
}

utils.getOrderFrom = function(Via) {
    if(Via == 4 || Via == 5 || Via == 6 || Via == 13) {
        return gDI18n.$t('10402');//"系统委托"
    }else if(Via == 21) {
        return gDI18n.$t('10403');//"计划委托"
    }else if(Via == 15) {
        return gDI18n.$t('10325');//"止盈止损"
    }else {
        return gDI18n.$t('10404');//"用户委托"
    }
}

export default utils