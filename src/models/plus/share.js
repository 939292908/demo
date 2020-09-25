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
        console.log('savePhoto', img);
        bitmap = new window.plus.nativeObj.Bitmap('share');
        bitmap.loadBase64Data(img, function() {
            path = '_doc/share' + new Date().getTime() + '.jpg';
            bitmap.save(path, { quality: 100 }, function(i) {
                window.plus.gallery.save(path, function() {
                    bitmap.clear();
                    cb && cb();
                    window.$message({ content: '保存图片成功', type: 'success' });
                });
            }, function(e1) {
                errcb && errcb();
                window.$message({ content: '保存图片失败', type: 'danger' });
            });
        }, function(err) {
            errcb && errcb();
            window.$message({ content: `加载Base64图片数据失败${err.code + err.message}`, type: 'danger' });
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
share.ShareImgForUrl = function(id, img, type, cb, errcb) {
    // 发送分享
    function doShare(srv, msg) {
        srv.send(msg, function() {
            // vm.$message(`分享到${srv.description}成功！`, 'success');
            cb && cb();
        }, function(e) {
            // vm.$message(`分享到${srv.description}失败`, 'danger');
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
                window.$message({ content: `客户端未安装`, type: 'danger' });
            } else {
                window.$message({ content: e.message, type: 'danger' });
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
share.ShareBase64 = function(id, img, type, cb, errcb) {
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
                    // vm.$message(`分享到${srv.description}失败`, 'danger');
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
                        window.$message({ content: `客户端未安装`, type: 'danger' });
                    } else {
                        window.$message({ content: e.message, type: 'danger' });
                    }
                });
            }
            // });
        }, function(e1) {
            errcb && errcb(e1);
            window.$message({ content: '保存图片失败', type: 'danger' });
        });
    }, (err) => {
        errcb && errcb(err);
        window.$message({ content: `加载Base64图片数据失败${err.code + err.message}`, type: 'danger' });
    });
};
share.ShareService = function(id, img, type, cb, errcb) { // 获取可用的分享列表
    if (window.plus) {
        window.plus.share.getServices(function(services) {
            for (const item of services) {
                if (item.id === id) {
                    share[id] = item;
                    share.ShareBase64(id, img, type, cb, errcb);
                }
            }
        },
        function(err) {
            errcb && errcb();
            window.$message({ content: `获取分享服务列表失败：: ${err.code + err.message}`, type: 'danger' });
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
                    share.ShareImgForUrl(id, img, type, cb, errcb);
                }
            }
        },
        function(err) {
            errcb && errcb();
            window.$message({ content: `获取分享服务列表失败：: ${err.code + err.message}`, type: 'danger' });
        });
    } else {
        errcb && errcb();
    }
};

export default share;
