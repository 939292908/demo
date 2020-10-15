const { gMktApi, gTrdApi } = require('@/api').wsApi;

module.exports = {
    getRiskLimits: function() { // 获取钱包计算所需风险限额
        // ReqTrdGetRiskLimits
        const that = this;
        const Authrized = gTrdApi.RT.Authrized;// aObj.AUTH_ST_OK
        const AssetD = gMktApi.AssetD;
        if (Authrized === gTrdApi.AUTH_ST_OK && Object.keys(AssetD).length > 0) {
            const aymArr = [];
            for (const key in AssetD) {
                const item = AssetD[key];
                if (item.TrdCls !== 1) {
                    aymArr.push(item.Sym);
                }
            }
            if (aymArr.length > 0) {
                if (this.isReqRiskLimits) {
                    return;
                }
                this.isReqRiskLimits = true;
                gTrdApi.ReqTrdGetRiskLimits({
                    AId: gTrdApi.RT.UserId + "01",
                    Sym: aymArr.join(',')
                }, function() {
                    that.isReqRiskLimits = false;
                });
            }
        }
    }
};