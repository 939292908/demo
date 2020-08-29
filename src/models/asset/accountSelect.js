let account = '03';
module.exports = {
    tradeAccount: ['01', '02', '04'],
    setAccount(val) {
        account = val;
    },
    getAccount() {
        return account;
    }
};