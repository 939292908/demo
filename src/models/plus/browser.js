const browser = {
    lastOpenTm: 0
};

// 判断是否打开
browser.isVisible = function() {
    return this.nw ? this.nw.isVisible() : false;
};

// 初始化
browser.init = function(url, options) {
    const _self = this;
    this.initWebview(url, options);
    this.nw.addEventListener('loaded', () => {
        _self.loaded();
    }, false);
};
// 初始化webview相关
browser.initWebview = function(url, options) {
    const _self = this;
    const line = window.themeDark ? window._styles.secondary.darken4 : window._styles.secondary.lighten2;
    const primary = window._styles.primary.base;
    const font = window.themeDark ? window._styles.secondary.lighten4 : window._styles.secondary.base;
    const background = window.themeDark ? window._styles.secondary.darken3 : window._styles.background.base;
    // 创建webview
    let titleNView = {
        height: '1px',
        progress: { // 进度条
            color: primary,
            height: '1px'
        },
        backgroundColor: background
    };
    if (!options.hideTitle) {
        titleNView = {
            backgroundColor: background,
            progress: { // 进度条
                color: primary,
                height: '1px'
            },
            splitLine: { // 底部分割线
                color: line,
                height: '1px'
            },
            buttons: [
                {
                    background: background,
                    color: font,
                    type: 'back',
                    float: 'left',
                    onclick: function() {
                        _self.back();
                    }
                }
            ]
        };
    }
    _self.nw = window.plus.webview.create(url, 'browser', {
        popGesture: 'hide',
        titleNView: titleNView,
        plusrequire: options.plusrequire, // 不注入5+ API
        cachemode: 'noCache',
        background: background
    });
    _self.nw.show('pop-in');
};

browser.canBackCb = function(event) {
    const _self = this;
    // const line = window.themeDark?window._styles.secondary.darken4:window._styles.secondary.lighten2
    // const primary = window._styles.primary.base
    const font = window.themeDark ? window._styles.secondary.lighten4 : window._styles.secondary.base;
    const background = window.themeDark ? window._styles.secondary.darken3 : window._styles.background.base;
    console.log('button font color ', font);
    if (event.canBack) {
        // alert('添加按钮：' + _self.nw.id);
        this.nw.setStyle({
            titleNView: {
                buttons: [
                    {
                        background: background,
                        color: font,
                        type: 'back',
                        float: 'left',
                        onclick: function() {
                            _self.back();
                        }
                    }, {
                        background: background,
                        color: font,
                        type: 'close',
                        float: 'right',
                        onclick: function() {
                            _self.nw.close('pop-out');
                        }
                    }]
            }
        });
    } else {
        // alert('删除按钮：' + _self.nw.id);
        this.nw.setStyle({
            titleNView: {
                buttons: [
                    {
                        background: background,
                        color: font,
                        type: 'back',
                        float: 'left',
                        onclick: function() {
                            _self.back();
                        }
                    }]
            }
        });
    }
};

browser.loaded = function() {
    const _self = this;
    this.nw.canBack(() => {
        _self.canBackCb();
    });
};

// 显示浏览器
browser.open = function(
    url,
    options = {
        target: '_blank',
        hideTitle: false, // 是否隐藏头部导航
        plusrequire: 'none' // 是否注入plus API 可取值： "ahead" - 尽量提前注入，拦截页面中网络js请求实现提前注入，如果没有拦截到js请求则在页面loaded时注入； "normal" - 页面loaded时注入； "later" - 较晚在注入，在loaded事件发生后2s再注入，plusready事件同样延迟触发； "none" - 不注入，页面无法调用5+ API，不触发plusready事件。 默认值为"normal"。
    }
) {
    const tm = Date.now();
    if (tm - this.lastOpenTm < 1000) {
        return;
    }
    this.lastOpenTm = tm;
    if (navigator.userAgent.indexOf('Html5Plus') === -1) {
        window.open(url, options.target);
    } else {
        if (window.plus) {
            this.init(url, options);
        } else {
            document.addEventListener('plusready', this.init(url, options));
        }
    }
};
// 显示浏览器
/**
 * 异步打开页面只能在当前页面打开，否则手机浏览器会拦截新弹窗
 * @param url
 */
browser.asyncOpen = function(
    url,
    options = {
        target: '_self',
        hideTitle: false, // 是否隐藏头部导航
        plusrequire: 'none' // 是否注入plus API 可取值： "ahead" - 尽量提前注入，拦截页面中网络js请求实现提前注入，如果没有拦截到js请求则在页面loaded时注入； "normal" - 页面loaded时注入； "later" - 较晚在注入，在loaded事件发生后2s再注入，plusready事件同样延迟触发； "none" - 不注入，页面无法调用5+ API，不触发plusready事件。 默认值为"normal"。
    }
) {
    if (navigator.userAgent.indexOf('Html5Plus') === -1) {
        window.open(url, options.target);
    } else {
        if (window.plus) {
            this.init(url, options);
        } else {
            document.addEventListener('plusready', this.init(url, options));
        }
    }
};
// 后退
browser.back = function() {
    const _self = this;
    _self.nw.canBack(function(e) {
        if (e.canBack) {
            _self.nw.back();
        } else {
            _self.nw.close('pop-out');
        }
    });
};

export default browser;
