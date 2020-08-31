module.exports = {
    toPage: function (val) {
        // window.location.href = '#!/' + val;
        window.router.push(val);
    }
};