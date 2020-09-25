/* eslint-disable no-case-declarations */
module.exports = {
    plusCopyToClipboard: function(text) {
        switch (window.plus.os.name) {
        case 'iOS':
            // 获取剪切板
            const UIPasteboard = window.plus.ios.importClass('UIPasteboard');
            const generalPasteboard = UIPasteboard.generalPasteboard();
            // 设置文本内容
            generalPasteboard.setValueforPasteboardType(text.toString(), 'public.utf8-plain-text');
            break;
        case 'Android':
            const Context = window.plus.android.importClass('android.content.Context');
            const main = window.plus.android.runtimeMainActivity();
            const clip = main.getSystemService(Context.CLIPBOARD_SERVICE);
            window.plus.android.invoke(clip, 'setText', text.toString());
            break;
        default:
            // sh
        }
    }
};