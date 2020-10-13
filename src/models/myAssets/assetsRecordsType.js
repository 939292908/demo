const I18n = require('@/languages/I18n').default;
module.exports = {

    getTransferInfo(p) {
        const obj = {
            1: I18n.$t('10523'), // '确认中',
            2: I18n.$t('10094'), // 失败
            3: I18n.$t('10093'), // 成功
            11: I18n.$t('10524'), // '邮件确认中',
            12: I18n.$t('10525'), // '已取消',
            13: I18n.$t('10526'), // '等待中',
            14: I18n.$t('10525'), // '已取消',
            18: I18n.$t('10094'), // 失败
            19: I18n.$t('10094'), // 失败
            24: I18n.$t('10093'), // 成功
            25: I18n.$t('10525'), // '已取消',
            26: I18n.$t('10523'), // '确认中',
            30: I18n.$t('10094'), // 失败
            35: I18n.$t('10094'), // 失败
            36: I18n.$t('10525'), // '已取消',
            41: I18n.$t('10093'), // 成功
            42: I18n.$t('10527'), // '处理中',
            50: I18n.$t('10527'), // '处理中',
            51: I18n.$t('10094'), // 失败
            52: I18n.$t('10527'), // '处理中',
            101: I18n.$t('10093'), // 成功
            102: I18n.$t('10094'), // 失败
            110: I18n.$t('10528'), // '待审核',
            111: I18n.$t('10529'), // 审核失败
            112: I18n.$t('10530'), // 已撤销
            113: I18n.$t('10531') // 审核成功
        };
        return obj[p] || '';
    },

    getWithdrawArr(p) {
        const obj = {
            1: I18n.$t('10523'), // '确认中',
            2: I18n.$t('10094'), // 失败
            3: I18n.$t('10093'), // 成功
            11: I18n.$t('10524'), // '邮件确认中',
            12: I18n.$t('10525'), // '已取消',
            13: I18n.$t('10526'), // '等待中',
            14: I18n.$t('10525'), // '已取消',
            18: I18n.$t('10094'), // 失败
            19: I18n.$t('10094'), // 失败
            24: I18n.$t('10526'), // '等待中',
            25: I18n.$t('10525'), // '已取消',
            26: I18n.$t('10523'), // '确认中',
            30: I18n.$t('10094'), // 失败
            35: I18n.$t('10094'), // 失败
            36: I18n.$t('10093'), // 成功
            41: I18n.$t('10093'), // 成功
            42: I18n.$t('10527'), // '处理中',
            50: I18n.$t('10527'), // '处理中',
            51: I18n.$t('10094'), // 失败
            52: I18n.$t('10527'), // '处理中',
            101: I18n.$t('10093'), // 成功
            102: I18n.$t('10094'), // 失败
            110: I18n.$t('10528'), // '待审核',
            111: I18n.$t('10529'), // 审核失败
            112: I18n.$t('10530'), // 已撤销
            113: I18n.$t('10531') // 审核成功
        };
        return obj[p] || '';
    },

    getAccountName(aType) {
        const obj = {
            "01": I18n.$t('10072')/* '合约账户' */,
            "02": I18n.$t('10073')/* '币币账户' */,
            "03": I18n.$t('10055')/* '我的钱包' */,
            "04": I18n.$t('10074')/* '法币账户' */,
            "05": I18n.$t('10547')/* '算力账户' */,
            "06": I18n.$t('10548')/* '跟单账户' */
        };
        return obj[aType];
    },

    /**
     * 资金记录 mhType 4 根据addr字段所包含的字符获取显示类型
     * @param addr
     * @param wType
     * @returns {string|*}
     */
    getRecordsType4SearchStr(addr, wType) {
        const obj = {
            tout_16: I18n.$t('10149', { value: I18n.$t('10074') }), // '划至法币账户'
            otcuc: I18n.$t('10145', { value: I18n.$t('10074') }), // '法币账户转入'
            otcaf: I18n.$t('10145', { value: I18n.$t('10074') }), // '法币账户转入'
            tin_: I18n.$t('10145', { value: this.getAccountName(addr.split("_")[1]) }), // XX账户转入
            tout_: I18n.$t('10149', { value: this.getAccountName(addr.split("_")[1]) }), // 划至xx账户
            'gf->btc': 'GF' + I18n.$t('10350') + 'BTC', // 兑换
            EVTIN: I18n.$t('10351'), // '活动入金'
            EVTOUT: I18n.$t('10352'), // '活动出金'
            'BL/': wType === 'GF' ? I18n.$t('10353') : I18n.$t('10139'), // 百日矿池计划   系统兑换
            'BDL/': I18n.$t('10354'), // '锁定激活'
            'TASK-IN': I18n.$t('10355'), // '活动空投'
            'TASK-OUT': I18n.$t('10356'), // '活动清算'
            'TASK-GIFT': I18n.$t('10357'), // '活动奖励'
            'TASK-REG': I18n.$t('10358'), // 注册赠金
            'TASK-CHARGE0': I18n.$t('10359'), // 首充赠金
            'TASK-TRADE': I18n.$t('10360'), // 交易赠金
            'TASK-INVITE': I18n.$t('10361'), // 邀请赠金
            'TASK-CS': I18n.$t('10362'), // 客服赠金
            'TASK-SIGN3': I18n.$t('10363'), // 特殊签到
            'TASK-SIGN2': I18n.$t('10364'), // 签到暴击
            'TASK-SIGN1': I18n.$t('10365'), // 连续签到
            toutl_03: I18n.$t('10149', { value: I18n.$t('10055') }), // '划至我的钱包'
            M2O: I18n.$t('10145', { value: I18n.$t('10074') }), // '法币账户转入'
            O2M: I18n.$t('10149', { value: I18n.$t('10074') }) // '划至法币账户'
        };
        for (const k in obj) {
            if (addr.includes(k)) return obj[k];
        }
        return '';
    },

    /**
     *  资金记录 mhType 4 根据addr字段的字符获取显示类型
     * @param p
     * @param coin
     * @returns {*|string}
     */
    getRecordsType4Str(p, coin) {
        const obj = {
            inCoin: I18n.$t('10549'), /* '买权证扣本金', */
            inFee: I18n.$t('10550'), /* '买权证扣手续费', */
            renewFee: I18n.$t('10551'), /* '续期扣手续费', */
            outProCoin: I18n.$t('10552'), /* '买权证划拨权证币', */
            outFangzhou: I18n.$t('10553'), /* '方舟计划派发' + coin, */
            outInterest: I18n.$t('10554'), /* '合约派息', */
            outCoin: I18n.$t('10555'), /* '合约本金出金', */
            inProCoin: I18n.$t('10556'), /* '合约权证出金', */
            teamCoin: I18n.$t('10557'), /* '团队奖励', */
            groupCoin: I18n.$t('10558'), /* '社区分红', */
            productCoin: I18n.$t('10559'), /* '权证结算', */
            plateCoin: I18n.$t('10560'), /* '平台分红', */
            powCoin: I18n.$t('10561'), /* 'POW释放奖励', */
            userActiveAward: I18n.$t('10562'), /* '新会员推荐奖金', */
            x_pocbuy: I18n.$t('10563'), /* '矿机购买', */
            x_pochandlingfee: I18n.$t('10564'), /* '交易手续费', */
            x_poccashback: I18n.$t('10565'), /* '直推返利', */
            x_teamback: I18n.$t('10566'), /* '团队返利', */
            fangzhouLock: I18n.$t('10567'), /* '方舟余币锁仓', */
            fangzhouRelease: I18n.$t('10568'), /* '方舟余币释放', */
            incomeRelease: I18n.$t('10569')/* '派息锁仓释放' */
        };
        return obj[p] || '';
    },

    /**
     * 资金记录 mhType 5 根据addr字段所包含的字符获取显示类型
     * @param aType
     * @param addr
     * @returns {string|*}
     */
    getRecordsType5SearchStr(aType, addr) {
        const obj = {
            tml2dl: I18n.$t('10369'), // '矿池划转'
            dl2tml: I18n.$t('10369'), // '矿池划转'
            tm35: I18n.$t('10370'), // 赠送上级矿池
            tm36: I18n.$t('10371'), // 赠送上上级矿池
            // Warning: tm类型判断有先后顺序
            tm: I18n.$t('10372'), // '矿池出矿'
            adm: I18n.$t('10140'), // 其他类型 adm等类型未处理
            VOTE: I18n.$t('10373'), // 投票上币
            ahp_buy: I18n.$t('10374'), // 算力本金锁定
            ahp_earn: I18n.$t('10375'), // 挖矿收益
            ahp_draw: '提取算力本金',
            ce_in: I18n.$t('10376'), // 兑换获得
            ce_out: I18n.$t('10377') // 兑换消耗
        };
        const obj03 = {
            'foltra-1': I18n.$t('10145', { value: I18n.$t('10548') }), // 跟单账户转入
            foltra: I18n.$t('10149', { value: I18n.$t('10548') }) // 划至跟单账户
        };
        const obj06 = {
            'foltra-1': I18n.$t('10149', { value: I18n.$t('10055') }), // 划至我的钱包
            foltra: I18n.$t('10145', { value: I18n.$t('10055') }), // 我的钱包转入
            fw_pnl: I18n.$t('10378'), // 平仓盈利
            fw_fee: I18n.$t('10379'), // 交易手续费
            fw_cls_MI: I18n.$t('10380'), // '平仓解锁保证金'
            fw_open: I18n.$t('10381'), // 开仓锁定保证金
            fw_repnl: I18n.$t('10382'), // 推荐分红锁定
            fw_ldpnl: I18n.$t('10383'), // 带单分红锁定
            fw_res: I18n.$t('10384'), // 盈利释放到可用
            fw_loss: I18n.$t('10385') // 平仓亏损
        };
        for (const k in obj) {
            if (addr.includes(k)) return obj[k];
        }
        if (aType === '03') {
            for (const k in obj03) {
                if (addr.includes(k)) return obj03[k];
            }
        }
        if (aType === '06') {
            for (const k in obj06) {
                if (addr.includes(k)) return obj06[k];
            }
        }
        return '';
    },

    /**
     * 资金记录 mhType 5 类型分组判断
     * @param addr
     * @returns {string}
     */
    getRecordsType5Type(addr) {
        const transferAddr = ['foltra', 'foltra-1'];
        for (const i of transferAddr) {
            if (addr.includes(i)) return 'transfer';
        }
        return 'other';
    },

    /**
     *  资金记录 mhType 5 根据addr字段的字符获取显示类型
     * @param p
     * @param coin
     * @returns {*|string}
     */
    getRecordsType5Str(p, coin) {
        const obj = {
            ins_pay: I18n.$t('10588'), // '合约保险-保险金扣除',
            ins_back: I18n.$t('10589'), // '合约保险-保险金退款',
            ins_back2: I18n.$t('10589') // '合约保险-保险金退款',
        };
        let str = obj[p] || I18n.$t('10140');
        if (!str) {
            if (p.includes('INS_')) {
                str = I18n.$t('10590'); // '合约保险-获得赔付金额'
            } else {
                str = I18n.$t('10140'); // '其他类型'
            }
        }
        return str;
    }
};