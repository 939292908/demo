const DI18n = require('di18n-translate')
import config from '../config'

class _DI18n {
    EV_DI18N_READY = "EV_DI18N_READY"
    EV_DI18N_UPD = "EV_DI18N_UPD"
    EV_CHANGELOCALE_UPD = "EV_CHANGELOCALE_UPD"

    locale = 'zh'
    langList = {
        "en": {
            "英文": "注释",
            "key": "en",
            "language": "English",
            "imgName": "English_icon",
            "open": 0
        },
        "zh": {
            "简体中文": "注释",
            "key": "zh",
            "language": "简体中文",
            "imgName": "china_icon",
            "open": 0
        },
        "tw": {
            "繁体中文": "注释",
            "key": "tw",
            "language": "繁体中文",
            "imgName": "china_icon",
            "open": 0
        },
        "kr": {
            "韩语": "注释",
            "key": "kr",
            "language": "한국어",
            "imgName": "Korean",
            "open": 0
        },
        "jp": {
            "日语": "注释",
            "key": "jp",
            "language": "日本语",
            "imgName": "Japanese",
            "open": 0
        },
        "ar": {
            "阿拉伯语": "注释",
            "key": "ar",
            "language": "اللغة العربية",
            "imgName": "Arabic",
            "open": 0
        },
        "in": {
            "印地语": "注释",
            "key": "in",
            "language": "भारत गणराज्य",
            "imgName": "Hindi",
            "open": 0
        },
        "de": {
            "德语": "注释",
            "key": "de",
            "language": "Deutsch",
            "imgName": "German",
            "open": 0
        },
        "tr": {
            "土耳其语": "注释",
            "key": "tr",
            "language": "Türkiye",
            "imgName": "Turkish",
            "open": 0
        },
        "th": {
            "泰语": "注释",
            "key": "th",
            "language": "ไทย",
            "imgName": "Thai",
            "open": 0
        },
        "fr": {
            "法语": "注释",
            "key": "fr",
            "language": "Français",
            "imgName": "French",
            "open": 0
        },
        "es": {
            "西班牙语": "注释",
            "key": "es",
            "language": "Español",
            "imgName": "Spanish",
            "open": 0
        },
        "pt": {
            "葡萄牙语": "注释",
            "key": "pt",
            "language": "Português",
            "imgName": "Portuguese",
            "open": 0
        },
        "ru": {
            "俄语": "注释",
            "key": "ru",
            "language": "Русский",
            "imgName": "Russian",
            "open": 0
        },
        "vn": {
            "越南语": "注释",
            "key": "vn",
            "language": "Tiếng Việt",
            "imgName": "Vietnamese",
            "open": 0
        }
    }
    constructor() {
        let s = this
        let localStorageLang = localStorage.getItem('language')
        let locale = localStorageLang || (navigator.language || navigator.userLanguage).substr(0, 2)
        s.locale = locale

        s.di18n = new DI18n({
            locale: locale,       // 语言环境
            isReplace: false,   // 是否开启运行时功能(适用于没有使用任何构建工具开发流程)
            messages: s.initOpenLang()
        })
        // s.setLocaleMessages(locale, arg =>{
        //     gEVBUS.emit(s.EV_DI18N_READY, {ev: s.EV_DI18N_READY, lang: locale })
        // })


    }

    initOpenLang(){
        let s = this
        let langList = {
            // en: require('./resource/en.json'),
            // zh: require('./resource/zh.json'),
        }
        
        for(let key in s.langList){
            if(config.langList.includes(key)){
                s.langList[key].open = 1
                langList[key] = require(`./resource/${key}.json`)
            }
        }   

        return langList
    }

    setLocaleMessages(lang, cb){
        let s = this
        require.ensure([], function (require) {
            let obj = require(`./resource/${lang}.json`);
            s.setMessages(lang, obj)
            cb(obj)
        }, `lang_${lang}`);
    }

    setLocale(lang, cb){
        let s = this
        s.di18n.setLocale(lang, arg =>{
            s.locale = lang
            localStorage.setItem('language', lang)
            cb && cb(lang)
        })
        // s.setLocaleMessages(lang, arg => {
        //     s.di18n.setLocale(lang, cb)
        // })
    }

    $t(str, options){
        let s = this
        return s.di18n.$t(str, options)
    }

}


export default _DI18n