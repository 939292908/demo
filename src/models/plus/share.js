const share = {
    sinaweibo: null,
    tencentweibo: null,
    weixin: null,
    qq: null
};
// share.sweixin = null;
/**
 * 分享
 * @param id //分享服务标识： "sinaweibo" - 表示新浪微博； "tencentweibo" - 表示腾讯微博； "weixin" - 表示微信； "qq" - 表示腾讯QQ
 */
share.photo = function(img, cb, errcb) {
    if (window.plus) {
        let bitmap = null;
        let path = null;
        bitmap = new window.plus.nativeObj.Bitmap('share');
        bitmap.loadBase64Data(img, function() {
            path = '_doc/share' + new Date().getTime() + '.jpg';
            bitmap.save(path, { quality: 100 }, function(i) {
                window.plus.gallery.save(path, function() {
                    bitmap.clear();
                    cb && cb();
                    window.$message('保存图片成功', 'success');
                });
            }, function(e1) {
                errcb && errcb();
                window.$message('保存图片失败', 'error');
            });
        }, function(err) {
            errcb && errcb();
            window.$message(`加载Base64图片数据失败${err.code + err.message}`,
                'error');
        });
    } else {
        errcb && errcb();
    }
};
/**
 * 分享
 * @param id //分享服务标识： "sinaweibo" - 表示新浪微博； "tencentweibo" - 表示腾讯微博； "weixin" - 表示微信； "qq" - 表示腾讯QQ
 * @param img //图片
 * @param type //分享类型好友或朋友圈（WXSceneSession,WXSceneTimeline）
 */
share.ShareIDForUrl = function(id, img, type, cb, errcb) {
    // 发送分享
    function doShare(srv, msg) {
        srv.send(msg, function() {
            // vm.$message(`分享到${srv.description}成功！`, 'success');
            cb && cb();
        }, function(e) {
            // vm.$message(`分享到${srv.description}失败`, 'error');
            errcb && errcb();
        });
    }

    if (!share[id]) {
        errcb && errcb();
        window.plus.nativeUI.alert('当前环境不支持微信操作!');
    }
    var msg = {
        pictures: [img],
        extra: {
            scene: type || 'WXSceneSession'
        }
    };
    msg.content = '';
    // 发送分享
    if (share[id].authenticated) {
        cb && cb();
        doShare(share[id], msg);
    } else {
        cb && cb();
        share[id].authorize(function() {
            doShare(share[id], msg);
        }, function(e) {
            errcb && errcb();
            if (e.code === -8) {
                window.$message(`客户端未安装`, 'error');
            } else {
                window.$message(`${e.message}`, 'error');
            }
        });
    }
};
/**
 * 分享base 64
 * @param id //分享服务标识： "sinaweibo" - 表示新浪微博； "tencentweibo" - 表示腾讯微博； "weixin" - 表示微信； "qq" - 表示腾讯QQ
 * @param img //图片
 * @param type //分享类型好友或朋友圈（WXSceneSession,WXSceneTimeline）
 */
share.ShareID = function(id, img, type, cb, errcb) {
    let bitmap = null;
    let path = null;
    bitmap = new window.plus.nativeObj.Bitmap('share');
    bitmap.loadBase64Data(img, function() {
        path = '_doc/share' + new Date().getTime() + '.jpg';
        bitmap.save(path, { quality: 100 }, function(i) {
            // plus.gallery.save(path, function () {
            // vm.$message(vm.$t('11206') /*'保存图片成功'*/ , 'success');
            bitmap.clear();

            // 发送分享
            function doShare(srv, msg) {
                srv.send(msg, function() {
                    // vm.$message(`分享到${srv.description}成功！`, 'success');
                    cb && cb();
                }, function(e) {
                    // vm.$message(`分享到${srv.description}失败`, 'error');
                    errcb && errcb();
                });
            }

            if (!share[id]) {
                errcb && errcb();
                window.plus.nativeUI.alert('当前环境不支持微信操作!');
            }
            var msg = {
                pictures: [path],
                extra: {
                    scene: type || 'WXSceneSession'
                }
            };
            msg.content = '';
            // 发送分享
            if (share[id].authenticated) {
                cb && cb();
                doShare(share[id], msg);
            } else {
                cb && cb();
                share[id].authorize(function() {
                    doShare(share[id], msg);
                }, function(e) {
                    errcb && errcb();
                    if (e.code === -8) {
                        window.$message(`客户端未安装`, 'error');
                    } else {
                        window.$message(`${e.message}`, 'error');
                    }
                });
            }
            // });
        }, function(e1) {
            errcb && errcb();
            window.$message(window.$t('11207') /* '保存图片失败' */, 'error');
        });
    }, function(err) {
        errcb && errcb();
        window.$message(window.$t(`加载Base64图片数据失败${err.code + err.message}`), 'error');
    });
};
share.ShareService = function(id, img, type, cb, errcb) { // 获取可用的分享列表
    if (window.plus) {
        window.plus.share.getServices(function(services) {
            for (const item of services) {
                if (item.id === id) {
                    share[id] = item;
                    share.ShareID(id, img, type, cb, errcb);
                }
            }
        },
        function(err) {
            errcb && errcb();
            window.$message(`获取分享服务列表失败：: ${err.code + err.message}`, 'error');
        });
    } else {
        errcb && errcb();
    }
};
share.ShareServiceForUrl = function(id, img, type, cb, errcb) { // 获取可用的分享列表
    if (window.plus) {
        window.plus.share.getServices(function(services) {
            for (const item of services) {
                if (item.id === id) {
                    share[id] = item;
                    share.ShareIDForUrl(id, img, type, cb, errcb);
                }
            }
        },
        function(err) {
            errcb && errcb();
            window.$message(`获取分享服务列表失败：: ${err.code + err.message}`, 'error');
        });
    } else {
        errcb && errcb();
    }
};

export default share;
