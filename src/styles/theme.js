//主题色
const primary = Object.freeze({
    lighten: '#00BDBD',

    darken: '#00BDBD'
});
// 辅助色
const sub = Object.freeze({
    lighten: '#0E1C33',
    lighten1: '#FF8B00',
    lighten2: '#D8D0C5',

    darken: '#0E1C33',
    darken1: '#FF8B00',
    darken2: '#D8D0C5'
});
// 提示
const tip = Object.freeze({
    errorLighten: '#F57340',
    warningLighten: '#FFB524',
    successLighten: '#2AD7AA',
    failLighten: '#878B98',
    
    errorDarken: '#F33309',
    warningDarken: '#FFB524',
    successDarken: '#42DC3F',
    failDarken: '#878B98'
});
//涨绿 （行业色）
const green = Object.freeze({
    lighten: '#2AD7AA',
    lighten1: '#22B992',

    darken: '#22B992',
    darken1: '#22B992'
});
//跌红 （行业色）
const red = Object.freeze({
    lighten: '#F57340',
    lighten1: '#CB5F35',

    darken: '#CB5F35',
    darken1: '#CB5F35'
});
// 标记颜色
const sign = Object.freeze({
    lighten: '#00BDBD',
    lighten1: '#00BDBD',

    darken: '#00BDBD',
    darken1: '#00BDBD'
});
// 文字颜色
const font = Object.freeze({
    lighten: '#081111',
    lighten1: '#869595',
    lighten2: '#A2ADAD',
    lighten3: '#A2ADAD',

    darken: '#E9E9E9',
    darken1: '#555A69',
    darken2: '#414450',
    darken3: '#414450',
});
const fontwhite = Object.freeze({
    base: '#FFFFFF'
});
// 线条颜色
const line = Object.freeze({
    lighten: '#EFF5F5',
    lighten1: '#E9ECEC',
    lighten2: '#E9ECEC',
    lighten3: '#E9ECEC',

    darken: '#1D212B',
    darken1: '#2C3240',
    darken2: '#2C3240',
    darken3: '#2C3240',
});
// 背景颜色
const background = Object.freeze({
    lighten: '#EFF3F3',
    lighten1: '#FFFFFF',
    lighten2: '#F1F6F6',
    lighten3: '#F7FBFB',

    darken: '#101217',
    darken1: '#171A21',
    darken2: '#1E222B',
    darken3: '#20252F',
});
// 遮罩层颜色
const mode = Object.freeze({
    lighten: 'rgba(16, 18, 23, .8)',

    darken: 'rgba(16, 18, 23, .8)',
});

const padding = {
    level0: '0px',
    level1: '4px',
    level2: '8px',
    level3: '12px',
    level4: '16px',
    level5: '20px',
    level6: '24px',
    level7: '32px',
    level8: '64px',
    level9: '128px'
};

const margin = {
    level0: '0px',
    level1: '4px',
    level2: '8px',
    level3: '12px',
    level4: '16px',
    level5: '20px',
    level6: '24px',
    level7: '32px',
    level8: '64px',
    level9: '128px'
};

// 图标颜色
// const chart = Object.freeze({
//     lighten: '#2AD7AA',
//     lighten1: '#22B992',

//     darken: '#22B992',
//     darken1: '#22B992'
// });

const theme = {
    primary,
    green,
    red,
    font,
    line,
    background,
    mode,
    // chart,
    sub,
    tip,
    sign,
    fontwhite,
    padding,
    margin
}

let styleStr = ':root{'
// 设置html的css变量
for(let key in theme){
    let item = theme[key]
    for(let k in item){
        let it = item[k]
        styleStr+=`--${key}-${k}: ${it};`
    }
}
styleStr+='}'
var style = document.createElement('style'); 
style.type = 'text/css'; 
style.innerHTML=styleStr; 
document.getElementsByTagName('head').item(0).appendChild(style); 


export default theme