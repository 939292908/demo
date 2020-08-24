let loginState = false;
module.exports = {
    getLoginState() {
        return loginState;
    },
    setLoginState(state) {
        loginState = state;
    }
};