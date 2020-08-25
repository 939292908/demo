import I18n from '../languages/I18n';

const hc = {};
hc.defaultConfig = {
    exchId: 0,
    exchName: '',
    exchCoin: '',
    exchLogo: '',
    MTType: '001',
    DOCTitle: '',
    helpCenter: {
        website: '',
        feeRatesId: ''
    }
};
// 初始化帮助中心
hc.init = function(config) {
    this.defaultConfig = config;
};
// 打开帮助中心首页
hc.open = function() {
    const locale = this.defaultConfig.helpCenter.langs[I18n.getLocale()] || 'zh-cn';
    window.open(`${this.defaultConfig.helpCenter.website}/hc/${locale}`);
};
// 打开费率标准
hc.openFeeRates = function() {
    this.openArticle(this.defaultConfig.helpCenter.feeRatesId);
};
// 打开合约参数解释
hc.openFutureReference = function() {
    this.openArticle(this.defaultConfig.helpCenter.futureReferenceId);
};
// 打开文章
hc.openArticle = function(articleId) {
    const locale = this.defaultConfig.helpCenter.langs[I18n.getLocale()] || 'zh-cn';
    window.open(
        `${this.defaultConfig.helpCenter.website}/hc/${locale}/articles/${articleId}`);
};
// 打开板块
hc.openSections = function(articleId) {
    const locale = this.defaultConfig.helpCenter.langs[I18n.getLocale()] || 'zh-cn';
    window.open(
        `${this.defaultConfig.helpCenter.website}/hc/${locale}/sections/${articleId}`);
};
export default hc;
