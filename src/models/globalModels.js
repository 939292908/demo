let functions = {};
let forexRate = {};
let account = {};
module.exports = {
    getFunctions() {
        return functions;
    },
    setFunctions(val) {
        functions = val;
    },
    getForexRate() {
        return forexRate;
    },
    setForexRate(val) {
        forexRate = val;
    },
    getAccount() {
        return account;
    },
    setAccount(val) {
        account = val;
    }
};