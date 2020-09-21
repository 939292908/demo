// 主题色
const primary = Object.freeze({
    lighten: '#FF6F1E',

    darken: '#FF6F1E'
});
// 辅助色
const sub = Object.freeze({
    lighten: '#0E2039',
    lighten1: '#83D0E1',
    lighten2: '#D8D0C5',

    darken: '#0E2039',
    darken1: '#83D0E1',
    darken2: '#D8D0C5'
});
// 提示
const tip = Object.freeze({
    errorLighten: '#F33309',
    warningLighten: '#FFB524',
    successLighten: '#42DC3F',
    failLighten: '#878B98',

    errorDarken: '#F33309',
    warningDarken: '#FFB524',
    successDarken: '#42DC3F',
    failDarken: '#878B98'
});
// 涨绿 （行业色）
const green = Object.freeze({
    lighten: '#4DC49F',
    lighten1: '#57BD7D',

    darken: '#4DC49F',
    darken1: '#57BD7D'
});
// 跌红 （行业色）
const red = Object.freeze({
    lighten: '#EC6543',
    lighten1: '#E55764',

    darken: '#EC6543',
    darken1: '#E55764'
});
// 标记颜色
const sign = Object.freeze({
    lighten: '#83D0E1',
    lighten1: '#F33309',

    darken: '#83D0E1',
    darken1: '#F33309'
});
// 文字颜色
const font = Object.freeze({
    lighten: '#0E2039',
    lighten1: '#444A5A',
    lighten2: '#737783',
    lighten3: '#A1A4AD',

    darken: '#DEE2E9',
    darken1: '#96A5BB',
    darken2: '#747F90',
    darken3: '#515965'
});
const fontwhite = Object.freeze({
    base: '#FFFFFF'
});
const fontdark = Object.freeze({
    base: '#DDDFE5'
});
// 线条颜色
const line = Object.freeze({
    lighten: 'rgba(10, 13, 22, 0.04)',
    lighten1: 'rgba(30, 40, 70, 0.08)',
    lighten2: 'rgba(30, 40, 70, 0.12)',
    lighten3: 'rgba(30, 40, 70, 0.16)',

    darken: 'rgba(255, 255, 255, 0.04)',
    darken1: 'rgba(255, 255, 255, 0.08)',
    darken2: 'rgba(255, 255, 255, 0.12)',
    darken3: 'rgba(255, 255, 255, 0.16)'
});
// 背景颜色
const background = Object.freeze({
    lighten: '#F5F6F7',
    lighten1: '#FFFFFF',
    lighten2: '#FAFBFB',
    lighten3: '#F8F8F9',

    darken: '#09101E',
    darken1: '#0A162B',
    darken2: '#0C1B32',
    darken3: '#0F213B'
});
// 遮罩层颜色
const mode = Object.freeze({
    lighten: 'rgba(14, 32, 57, 0.6)',

    darken: 'rgba(14, 32, 57, 0.6)'
});

// 图表颜色
// const chart = Object.freeze({
//     lighten: '#2AD7AA',
//     lighten1: '#22B992',
//     darken: '#22B992',
//     darken1: '#22B992'
// });
// 主题颜色合集
const theme = {
    primary,
    sub,
    tip,
    green,
    red,
    sign,
    font,
    fontwhite,
    line,
    background,
    mode,
    fontdark
};

// 样式类
const fontsz = {
    level0: '6px',
    level1: '8px',
    level2: '10px',
    level3: '12px',
    level4: '14px',
    level5: '16px',
    level6: '18px',
    level7: '24px',
    level8: '32px',
    level9: '48px',
    level10: '64px',
    level11: '72px'
};
const iconsz = {
    level0: '6 px',
    level1: '10px',
    level2: '16px',
    level3: '24px',
    level4: '26px',
    level5: '32px',
    level6: '46px',
    level7: '68px'
};

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

const button = {
    level0: '28px',
    level1: '36px',
    level2: '44px'
};

const radius = {
    level1: '2px',
    level2: '4px',
    level3: '8px',
    level4: '16px',
    level5: '24px',
    level6: '32px'
};

const fontweight = {
    level1: 400,
    level2: 500,
    level3: 600
};

const opacity = {
    level0: 0,
    level1: 0.1,
    level2: 0.2,
    level3: 0.3,
    level4: 0.4,
    level5: 0.5,
    level6: 0.6,
    level7: 0.7,
    level8: 0.8,
    level9: 0.9
};

const styles = {
    fontsz,
    iconsz,
    padding,
    margin,
    radius,
    fontweight,
    button,
    opacity
};

export default { styles, theme };