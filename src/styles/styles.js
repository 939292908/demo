const primary = Object.freeze({
    lighten: '#FF8B00',
    darken: '#FF8B00'
});

const success = Object.freeze({
    lighten: '#42DC3F',
    lighten1: '#57BD7D',
    darken: '#42DC3F',
    darken1: '#57BD7D'
});

const error = Object.freeze({
    lighten: '#F33309',
    lighten1: '#E55764',
    darken: '#F33309',
    darken1: '#E55764'
});

const font = Object.freeze({
    lighten: '#1E2846',
    lighten1: '#404862',
    lighten2: '#61687E',
    lighten3: '#9A9EAC',
    darken: '#E9E9E9',
    darken1: '#555A69',
    darken2: '#414450'
});

const line = Object.freeze({
    lighten: 'rgba(30, 40, 70, .02)',
    lighten1: 'rgba(30, 40, 70, .04)',
    lighten2: 'rgba(30, 40, 70, .06)',
    lighten3: 'rgba(30, 40, 70, .08)',

    darken: '#1D212B',
    darken1: '#2C3240',
    darken2: '#2C3240'
});

const background = Object.freeze({
    lighten: '#EBECEF',
    lighten1: '#FFFFFF',
    lighten2: '#F7F7FA',
    lighten3: '#F2F2F7',
    lighten4: 'rgba(16, 21, 37, 0.8)',
    lighten5: '#C4C4C4',
    darken: '#101217',
    darken1: '#171A21',
    darken2: '#1E222B',
    darken3: 'rgba(0, 189, 189, .1)',
    darken4: '#1E222B',
    darken5: '#20252F'
});

const mode = Object.freeze({
    lighten: 'rgba(16, 18, 23, .8)',
    darken: 'rgba(16, 18, 23, .8)'
});

// 图标颜色
const chart = Object.freeze({
    lighten: '#2AD7AA',
    lighten1: '#22B992',
    darken: '#22B992',
    darken1: '#22B992'
});
// 主题颜色合集
const theme = {
    primary,
    success,
    error,
    font,
    line,
    background,
    mode,
    chart
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
    level7: '20px',
    level8: '24px',
    level9: '32px',
    level10: '64px',
    level11: '72px'
};
const iconsz = {
    level0: '6px',
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
    level1: '5px',
    level2: '10px',
    level3: '15px'
};

const fontweight = {
    level1: 400,
    level2: 500,
    level3: 600
};

const styles = {
    fontsz,
    iconsz,
    padding,
    margin,
    radius,
    fontweight,
    button
};

export default { styles, theme };