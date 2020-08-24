const header = require('@/pages/page/myAssets/header/HeaderView');

module.exports = {
    toPage: function (val) {
        window.location.href = '#!/' + val;
    },
    view: header
};