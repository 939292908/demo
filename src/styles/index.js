import styles from '@/styles/styles';
// import utils from "@/util/utils";
let styleStr = ':root{';
// 设置主题颜色相关html的css变量
for (const key in styles) {
    const item = styles[key];
    for (const k in item) {
        const it = item[k];
        for (const j in it) {
            const v = it[j];
            styleStr += `--c-${k}-${j}: ${v};`;
        }
    }
}
styleStr += '}';
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = styleStr;
document.getElementsByTagName('head').item(0).appendChild(style);
// 设置全局变量
const themeDark = true;
// const _themeDark = utils.getItem('themeDark');
// if (_themeDark === true || _themeDark === false) {
//     themeDark = _themeDark;
// }
window.themeDark = themeDark;
window._styles = styles;