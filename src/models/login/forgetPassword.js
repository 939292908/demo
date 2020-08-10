const m = require('mithril');

module.exports = {
    loginType: 'phone',
    loginName: '',
    validInput: [],
    validateCode: [],
    validateAll() {
        window.validate.checkAll(this.validateCode);
    },
    setValidInput() {
        if (!this.validateCode.length) return;
        this.validInput = [];
        for (const item of this.validateCode) {
            this.validInput.push(m('div.py-0.mb-2', {}, [item.name]));
            this.validInput.push(m('input.input[type=text].mb-6', {
                oninput: e => {
                    item.code = e.target.value;
                },
                value: item.code
            }, []));
        }
        m.redraw();
    }
};