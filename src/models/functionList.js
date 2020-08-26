let functions = {};
let forexRate = {};
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
    }
};