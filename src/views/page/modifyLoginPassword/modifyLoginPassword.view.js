const m = require('mithril');
require('@/views/page/modifyLoginPassword/modifyLoginPassword.scss');
const modifyLPLogic = require('@/views/page/modifyLoginPassword/modifyLoginPassword.logic');

const modifyLPView = {
    oninit: () => {
        modifyLPLogic.initFn();
    },
    view: () => {
        return m('div', { class: `views-page-accountSecurity-modifyLoginPassword theme--light` }, [
        ]);
    },
    onremove: () => {

    }
};
module.exports = modifyLPView;