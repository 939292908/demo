let account = '03';
module.exports = {
    setAccount(val) {
        account = val;
    },
    getAccount() {
        return account;
    }
};