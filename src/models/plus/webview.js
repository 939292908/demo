class aWebview {
    constructor({ url, id, styles = {}, extras = {} }) {
        this.bitmap = null;
        if (!window.plus) return;
        this.WV = window.plus.webview.create(url, id, styles, extras);
    }

    // 显示webview窗口， 详见https://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject.show
    show(aniShow, duration, showedCB, extras) {
        this.WV.show(aniShow, duration, showedCB, extras);
    }

    // 加载新HTML数据，详见 https://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject.loadData
    loadNewHTML({ data, options = {} }) {
        this.WV.loadData(data, options);
    }

    // 创建原生图片对象，绘制页面
    // 原生图片对象 详见 https://www.html5plus.org/doc/zh_cn/nativeobj.html#plus.nativeObj.Bitmap

    drawAndSave({ successCallback, errorCallback }) {
        const s = this;
        s.bitmap = new window.plus.nativeObj.Bitmap('newBitmap');
        s.WV.draw(s.bitmap, function(event) {
            console.log('绘图成功');
            successCallback && successCallback(event);
        }, function(err) {
            console.log('绘图失败');
            errorCallback && errorCallback(err);
        }, { check: true });
    }

    /**
     *
     * 获取图片的base64
     */
    getBase64Data(cb) {
        let base64 = '';
        if (this.bitmap) {
            base64 = this.bitmap.toBase64Data();
        }
        if (cb) {
            cb(base64);
        }
    }

    /**
     * 截屏并保存文件到本地
     * 截屏绘制, 详见 https://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject.draw
     * 保存本地，详见 https://www.html5plus.org/doc/zh_cn/nativeobj.html#plus.nativeObj.Bitmap.save
     * @param {string} file 保存到本地的文件名,如果不填默认为时间戳
     */
    saveToFile({ file = Date.now(), successCallback, errorCallback }) {
        const s = this;
        s.bitmap.save(`_doc/${file}.png`, {
            format: 'png',
            quality: 100
        }, function(event) {
            successCallback && successCallback(event);
            s.bitmap.clear();
        }, function(err) {
            errorCallback && errorCallback(err);
            s.bitmap.clear();
            console.log('保存图片失败：' + JSON.stringify(err));
        });
    }

    // 保存文件到系统相册中,详见 https://www.html5plus.org/doc/zh_cn/gallery.html#plus.gallery.save
    saveToGallery(path, successCB, errorCB) {
        window.plus.gallery.save(path, successCB, errorCB);
    }

    // 关闭并销毁Webview窗口，可设置关闭动画和动画持续时间。详见 https://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject.close
    close(aniClose, duration, extras) {
        this.WV.close(aniClose, duration, extras);
    }

    // 添加webview窗口事件监听器 详见 https://www.html5plus.org/doc/zh_cn/webview.html#plus.webview.WebviewObject.addEventListener
    addEventListener(event, listener, capture) {
        this.WV.addEventListener(event, listener, capture);
    }

    // 移除Webview窗口事件监听器
    removeEventListener(event, listener) {
        this.WV.removeEventListener(event, listener);
    }
}

export default aWebview;