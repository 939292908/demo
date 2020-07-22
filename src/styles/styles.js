const primary = Object.freeze({
    lighten: '#00BDBD',
    darken: '#00BDBD'
});

const success = Object.freeze({
    lighten: '#2AD7AA',
    lighten1: '#22B992',
    darken: '#22B992',
    darken1: '#22B992'
});

const error = Object.freeze({
    lighten: '#F57340',
    lighten1: '#CB5F35',
    darken: '#CB5F35',
    darken1: '#CB5F35'
});

const font = Object.freeze({
    lighten: '#081111',
    lighten1: '#869595',
    lighten2: '#A2ADAD',
    darken: '#E9E9E9',
    darken1: '#555A69',
    darken2: '#414450'
});

const line = Object.freeze({
    lighten: '#EFF5F5',
    lighten1: '#E9ECEC',
    lighten2: '#E9ECEC',

    darken: '#1D212B',
    darken1: '#2C3240',
    darken2: '#2C3240'
});

const background = Object.freeze({
    lighten: '#EFF3F3',
    lighten1: '#FFFFFF',
    lighten2: '#F1F6F6',
    lighten3: 'rgba(0, 189, 189, .1)',
    lighten4: '#EFF5F5',
    lighten5: '#F7FBFB',
    darken: '#101217',
    darken1: '#171A21',
    darken2: '#1E222B',
    darken3: 'rgba(0, 189, 189, .1)',
    darken4: '#1E222B',
    darken5: '#20252F',
});

const mode = Object.freeze({
    lighten: 'rgba(16, 18, 23, .8)',
    darken: 'rgba(16, 18, 23, .8)',
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
}

// 样式类

const padding = {
    level1: '4px',
    level2: '8px',
    level3: '12px',
    level4: '16px',
    level5: '20px',
}

const margin = {
    level1: '4px',
    level2: '8px',
    level3: '12px',
    level4: '16px',
    level5: '20px',
}

const radius = {
    level1: '5px',
    level2: '10px',
    level3: '15px',
}

const fontweight = {
    level1: 400,
    level2: 500,
    level3: 600
}

const styles = {
    padding,
    margin,
    radius,
    fontweight
}


export default {styles, theme}