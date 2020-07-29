import styles from '@/styles/styles'
import utils from "@/util/utils"

let styleStr = ':root{'
// 设置主题颜色相关html的css变量
for(let key in styles){
    let item = styles[key]
    for(let k in item){
        let it = item[k]
        for(let j in it){
            let v = it[j]
            styleStr+=`--c-${k}-${j}: ${v};`
        }
    }
}


styleStr+='}'
var style = document.createElement('style'); 
style.type = 'text/css'; 
style.innerHTML=styleStr; 
document.getElementsByTagName('head').item(0).appendChild(style); 


// 设置全局变量

let themeDark = false
let _themeDark = utils.getItem('themeDark')
if(_themeDark === true || _themeDark === false){
    themeDark = _themeDark
}
window.themeDark = themeDark
window._styles = styles



