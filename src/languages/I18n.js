import DI18n from 'di18n-translate';
import m from 'mithril';
import broadcast from '../broadcast/broadcast';

const localStorageLang = localStorage.getItem('language');
let locale = localStorageLang || (navigator.language || navigator.userLanguage).substr(0, 2);
const di18n = new DI18n({
    locale: locale, // 语言环境
    isReplace: false, // 是否开启运行时功能(适用于没有使用任何构建工具开发流程)
    messages: {}
});

import(`./resource/${locale}.json`).then(arg =>{
    const msg = {}
    msg[locale] = arg.default
    di18n.setMessages(msg)
});

export default {
    EV_DI18N_READY: 'EV_DI18N_READY',
    EV_DI18N_UPD: 'EV_DI18N_UPD',
    EV_CHANGELOCALE_UPD: 'EV_CHANGELOCALE_UPD',
    langList: {
        zh: {
            简体中文: "注释",
            key: "zh",
            language: "简体中文",
            imgName: "china_icon",
            open: 1
        },
        en: {
            英文: "注释",
            key: "en",
            language: "English",
            imgName: "English_icon",
            open: 1
        },
        tw: {
            繁体中文: "注释",
            key: "tw",
            language: "繁体中文",
            imgName: "china_icon",
            open: 1
        },
        kr: {
            韩语: "注释",
            key: "kr",
            language: "한국어",
            imgName: "Korean",
            open: 0
        },
        jp: {
            日语: "注释",
            key: "jp",
            language: "日本语",
            imgName: "Japanese",
            open: 0
        },
        ar: {
            阿拉伯语: "注释",
            key: "ar",
            language: "اللغة العربية",
            imgName: "Arabic",
            open: 0
        },
        in: {
            印地语: "注释",
            key: "in",
            language: "भारत गणराज्य",
            imgName: "Hindi",
            open: 0
        },
        de: {
            德语: "注释",
            key: "de",
            language: "Deutsch",
            imgName: "German",
            open: 0
        },
        tr: {
            土耳其语: "注释",
            key: "tr",
            language: "Türkiye",
            imgName: "Turkish",
            open: 0
        },
        th: {
            泰语: "注释",
            key: "th",
            language: "ไทย",
            imgName: "Thai",
            open: 0
        },
        fr: {
            法语: "注释",
            key: "fr",
            language: "Français",
            imgName: "French",
            open: 0
        },
        es: {
            西班牙语: "注释",
            key: "es",
            language: "Español",
            imgName: "Spanish",
            open: 0
        },
        pt: {
            葡萄牙语: "注释",
            key: "pt",
            language: "Português",
            imgName: "Portuguese",
            open: 0
        },
        ru: {
            俄语: "注释",
            key: "ru",
            language: "Русский",
            imgName: "Russian",
            open: 0
        },
        vn: {
            越南语: "注释",
            key: "vn",
            language: "Tiếng Việt",
            imgName: "Vietnamese",
            open: 0
        }
    },
    setLocaleMessages(lang, cb) {
        import(`./resource/${lang}.json`).then(arg =>{
            const msg = {}
            msg[lang] = arg.default
            di18n.setMessages(msg)
            cb && cb(arg)
        })
    },
    setLocale(lang) {
        this.setLocaleMessages(lang, arg => {
            di18n.setLocale(lang, res => {
                locale = lang;
                localStorage.setItem('language', lang);
                broadcast.emit({cmd:broadcast.MSG_LANGUAGE_UPD,data:lang});
                m.redraw();
            });
        });
    },
    getLocale() {
        return locale;
    },
    $t(str, options) {
        if (Object.keys(di18n.messages).length > 0) {
            return di18n.$t(str, options);
        } else {
            return str;
        }
    },
    /**
     * 含pre标签的字符串处理
     * @param s 含pre标签的字符串
     * @returns {[]}
     */
    preToArr(s) {
        let str = s;
        const arr = [];
        while (str.indexOf('<pre>') !== -1 && str.indexOf('</pre>') !== -1) {
            const start = str.indexOf('<pre>');
            const end = str.indexOf('</pre>');
            if (start - 1 !== -1) {
                arr.push({
                    type: 'normal',
                    value: str.slice(0, start)
                });
            }
            arr.push({
                type: 'pre',
                value: str.slice(start + 5, end)
            });
            str = str.substring(end + 6, str.length);
        }
        if(str.length) {
            arr.push({
                type: 'normal',
                value: str
            });
        }
        return arr;
    },
    /**
     * 含pre的多语言处理
     * @param str 多语言id
     * @param obj span的vnode参数数组
     * @returns {[]|*}
     */
    $ft(str, obj = []) {
        const arr = [];
        if (Object.keys(di18n.messages).length > 0) {
            let preArr = this.preToArr(di18n.$t(str));
            let count = 0;
            for(const item of preArr) {
                if(item.type === 'normal') {
                    arr.push(m('span',{},[item.value]));
                } else {
                    arr.push(m('span',obj[count] || {},[item.value]));
                    count++;
                }
            }
            return arr;
        } else {
            return str;
        }
    }
};