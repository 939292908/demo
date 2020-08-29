const broadcast = require('@/broadcast/broadcast');
module.exports = {
    currency: 'BTC',
    hideZeroFlag: false, // 是否隐藏0资产 默认为false
    dataLength: 0, // 暂无数据
    columnData: { // 表格列
        wallet: [],
        coin: [],
        contract: [],
        legal: []
    },
    setCurrency: function(param) {
        this.currency = param;
        this.initColumnData();
    },
    setDataType: function(param) {
        this.dataType = param;
    },
    setDataLength: function (param) {
        this.dataLength = param;
    },
    initColumnData: function () {
        this.columnData = {
            wallet: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '锁定', val: 'depositLock' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '充值', to: '地址' }, { operation: '提现', to: '地址' }, { operation: '划转', to: '地址' }] }
            ],
            coin: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '冻结', val: 'Frz' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '地址' }, { operation: '去交易', to: '地址' }] }
            ],
            contract: [
                { col: '币种', val: 'wType' },
                { col: '账户权益', val: 'MgnBal' },
                { col: '未实现盈亏', val: 'UPNL' },
                { col: '可用保证金', val: 'NL' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '地址' }, { operation: '去交易', to: '地址' }] }
            ],
            legal: [
                { col: '币种', val: 'wType' },
                { col: '总额', val: 'TOTAL' },
                { col: '可用', val: 'NL' },
                { col: '冻结', val: 'otcLock' },
                { col: this.currency + '估值', val: this.currency === 'BTC' ? 'valueForBTC' : 'valueForUSDT' },
                { col: '操作', val: [{ operation: '划转', to: '地址' }, { operation: '去交易', to: '地址' }] }
            ]
        };
    },
    copyAry: function (ary) {
        const res = [];
        for (let i = 0; i < ary.length; i++) {
            res.push(ary[i]);
        }
        return res;
    },
    tableAction: function (searchContent, type) {
        const table = document.getElementsByTagName('table')[0];
        const rowsLength = table.rows.length;
        if (type === 'search') {
            let count = 1;
            if (searchContent !== "") {
                for (let i = 1; i < rowsLength; i++) {
                    const searchText = table.rows[i].cells[0].innerHTML;
                    if (searchText.toUpperCase().indexOf(searchContent.toUpperCase()) !== -1) {
                        // 显示行操作
                        table.rows[i].style.display = '';
                    } else {
                        // 隐藏行操作
                        table.rows[i].style.display = 'none';
                        count = count + 1;
                    }
                }
                if (count === rowsLength) {
                    table.rows[rowsLength - 1].style.display = '';
                }
            } else if (searchContent === "") {
                table.rows[rowsLength - 1].style.display = 'none';
                for (let j = 1; j < rowsLength - 1; j++) {
                    table.rows[j].style.display = '';
                }
            }
        } else if (type === 'hideZero') {
            this.hideZeroFlag = !this.hideZeroFlag;
            let count = 1;
            if (this.hideZeroFlag) {
                for (let i = 1; i < rowsLength - 1; i++) {
                    const value = table.rows[i].cells[1].innerHTML;
                    if (value !== '0.00000000') {
                        // 显示行操作
                        table.rows[i].style.display = '';
                    } else {
                        // 隐藏行操作
                        table.rows[i].style.display = 'none';
                        count = count + 1;
                    }
                }
                if (count === rowsLength - 1) {
                    table.rows[rowsLength - 1].style.display = '';
                }
            } else {
                table.rows[rowsLength - 1].style.display = 'none';
                for (let i = 1; i < rowsLength - 1; i++) {
                    // 显示行操作
                    table.rows[i].style.display = '';
                }
            }
        }
    },
    createFn: function (vnode) {
        console.log(vnode.attrs.hideZeroFlag, 'create.....');
        this.hideZeroFlag = vnode.attrs.hideZeroFlag;
        broadcast.onMsg({
            key: 'view-pages-Myassets-TablegB',
            cmd: broadcast.CHANGE_SW_CURRENCY,
            cb: (arg) => {
                this.setCurrency(arg);
            }
        });
        setTimeout(() => {
            this.initColumnData();
            this.setDataLength(vnode.attrs.tableData.length);
            if (this.dataLength === 0) {
                document.getElementsByTagName('table')[0].rows[document.getElementsByTagName('table')[0].rows.length - 1].style.display = '';
            } else {
                document.getElementsByTagName('table')[0].rows[document.getElementsByTagName('table')[0].rows.length - 1].style.display = 'none';
            }
        }, '100');
    },
    removeFn: function () {
        broadcast.offMsg({
            key: 'view-pages-Myassets-TablegB',
            isall: true
        });
    }
};