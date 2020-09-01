const utils = require('@/util/utils').default;
const globalModels = require('@/models/globalModels');

const header = {
    loginOut: function() {
        utils.removeItem("ex-session");
        utils.setItem('loginState', false);
        globalModels.setAccount({});
    }
};

module.exports = header;