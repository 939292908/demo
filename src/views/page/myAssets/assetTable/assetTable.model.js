const m = require('mithril');
const Http = require('@/api').webApi;
const errCode = require('@/util/errCode').default;
const globalModels = require('@/models/globalModels');
const broadcast = require('@/broadcast/broadcast');
module.exports = {
    isShowCancel: false,
    cancelTransferModel: {},
    isLoading: false,
    cancelTransfer() {
        const self = this;
        this.isLoading = true;
        Http.withdrawDeposit({
            token: globalModels.getAccount().token,
            op: 11,
            seq: this.cancelTransferModel.seq
        }).then(res => {
            self.isLoading = false;
            if (res.result.code === 0) {
                self.isShowCancel = false;
                broadcast.emit({ cmd: broadcast.MSG_ASSET_RECORD_UPD });
                m.redraw();
            } else {
                window.$message({ content: errCode.getWebApiErrorCode(res.result.code), type: 'danger' });
            }
        }).catch(err => {
            self.isLoading = false;
            console.log(err);
        });
    }
};