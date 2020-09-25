
import Webview from "./webview.js";
// import share from "./share.js";
const getb64 = {
    scale: 3
};
let newWebview = null;

/**
* 获取webview
* data：节点数据
* w：width，
* h： height
*/
getb64.getWebView = (data, cb) => {
    if (!data) return;
    // 计算webview高度 end
    newWebview = new Webview({
        styles: {
            width: data.W,
            height: data.H,
            margin: 'auto',
            mask: 'rgba(0,0,0,0)'
        }
    });
    newWebview.loadNewHTML({ data: data.data });
    const u = navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; // g
    const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
    if (isAndroid) {
        // 这个是安卓操作系统
        newWebview.addEventListener('loaded', getb64.mewWebviewPreview1(res => {
            console.log("返回函数：=" + res);
            cb(res);
        }), false);
    }
    if (isIOS) {
        // 这个是ios操作系统
        newWebview.addEventListener('loaded', function() {
            newWebview.show();
        }, false);
        newWebview.addEventListener('show', getb64.mewWebviewPreview(res => {
            console.log("返回函数：=" + res);
            cb(res);
        }), false);
    }
};

getb64.mewWebviewPreview = (cb) => {
    if (!newWebview) return;
    setTimeout(function() {
        newWebview.drawAndSave({
            successCallback: arg => {
                newWebview.getBase64Data(res => {
                    newWebview.removeEventListener('show', getb64.mewWebviewPreview);
                    newWebview.close();
                    console.log('webview to img:', res);
                    if (cb) {
                        cb(res);
                    }
                });
            },
            errorCallback: err => {
                newWebview.removeEventListener('show', getb64.mewWebviewPreview);
                newWebview.close();
                console.log(err.code + err.message);
                window.$message({ content: err.code + err.message, type: 'danger' });
                if (cb) {
                    cb(err);
                }
            }
        });
    }, 500);
};
getb64.mewWebviewPreview1 = (cb) => {
    if (!newWebview) return;
    setTimeout(function() {
        newWebview.drawAndSave({
            successCallback: arg => {
                newWebview.getBase64Data(res => {
                    newWebview.removeEventListener('loaded', getb64.mewWebviewPreview);
                    newWebview.close();
                    console.log('webview to img:', res);
                    if (cb) {
                        cb(res);
                    }
                });
            },
            errorCallback: err => {
                newWebview.removeEventListener('loaded', getb64.mewWebviewPreview);
                newWebview.close();
                console.log(err.code + err.message);
                window.$message({ content: err.code + err.message, type: 'danger' });
                if (cb) {
                    cb(err);
                }
            }
        });
    }, 500);
};

// 判断文件地址为本地地址还是base64
getb64.loadImageUrl = (url, cb) => {
    let urlBase64 = '';

    const next = res => {
        urlBase64 = res;
        cb(urlBase64);
    };
    const close = res => {
        const param = -1;
        cb(param);
    };

    if (url.includes('file://')) {
        bitmapLoadImg(url, next, close);
    } else if (url.includes('https://') || url.includes('http://')) {
        loadImg(url, next, close);
    } else {
        urlBase64 = url;
    }
};

const plusDownload = ({ dUrl, sUrl = '/img/', next, close }) => {
    if (window.plus) {
        const download = window.plus.downloader.createDownload(dUrl, { filename: `_doc${sUrl}` }, function (d, status) {
        // 下载完成
            if (status === 200) {
                next(d);
            } else {
                close(status);
            }
        });
        download.start();
    } else {
        close('noplus');
    }
};

const bitmapLoadImg = (url, next, close) => {
    if (url.indexOf('file://') > -1) {
    // file:///android_asset/apps/com.block.app/www/ 目录不能直接读取，需要转换成本地绝对地址
        if (url.indexOf('android_asset') > -1) {
            url = url.split('/www/')[1];
            url = '_www/' + url;
        }

        const bitmap = new window.plus.nativeObj.Bitmap("bitmap1");
        bitmap.load(url, function() {
            const toBase64 = bitmap.toBase64Data();
            console.log('bitmap load img ', url, toBase64);
            bitmap.clear();
            next && next(toBase64);
        }, function(e) {
            console.log("logo加载失败" + JSON.stringify(e));
            window.$message({ content: "logo加载失败" + JSON.stringify(e), type: 'danger' });
            bitmap.clear();
            close && close(e);
        });
    } else {
    // console.log('next img ', url)
        next && next(url);
    }
};

const loadImg = (url, next, close) => {
    plusDownload({
        dUrl: url,
        next: function(res) {
            bitmapLoadImg('file://' + window.plus.io.convertLocalFileSystemURL(res.filename), next, close);
        },
        close
    });
};
// 判断文件地址为本地地址还是base64
getb64.loadImageUrlArray = (urlArray, cb) => {
    let i = 0;
    const urlBase64 = [];
    const next = res => {
    // console.log("i=",i);
        urlBase64[i] = res;
        if (i === urlArray.length - 1) {
            cb(urlBase64);
        } else {
            i++;
            load(urlArray[i], i);
        }
    };
    const close = res => {
        cb();
    };

    const load = (mUrl, idx) => {
    // console.log('loadImageUrlArray item',mUrl)
        if (mUrl.indexOf('file://') > -1) {
            bitmapLoadImg(mUrl, next, close);
        } else if (mUrl.indexOf('https://') > -1 || mUrl.indexOf('http://') > -1) {
            loadImg(mUrl, next, close);
        } else {
            urlBase64[idx] = mUrl;
            if (i === urlArray.length - 1) {
                cb(urlBase64);
            } else {
                i++;
                load(urlArray[i], i);
            }
        }
    };

    load(urlArray[i], i);
};

getb64.switchIngUrl = (url) => {
    if (window.plus && url.includes('./static')) {
        const _url = url.replace('./static', '_www/static');
        return 'file://' + window.plus.io.convertLocalFileSystemURL(_url);
    } else {
        return url;
    }
};

export default getb64;
