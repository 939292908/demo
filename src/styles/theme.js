const primary = Object.freeze({
    lighten: '#00BDBD',
    darken: '#4DC49F'
});

const success = Object.freeze({
    lighten: '#2AD7AA',
    lighten2: '#22B992',
    darken: '#4DC49F'
});

const error = Object.freeze({
    lighten: '#F57340',
    lighten1: '#CB5F35',
    darken: '#4DC49F'
});

const font = Object.freeze({
    lighten: '#081111',
    lighten1: '#869595',
    lighten2: '#A2ADAD',
    darken: '#4DC49F'
});

const line = Object.freeze({
    lighten: '#EFF5F5',
    lighten1: '#E9ECEC',
    lighten2: '#E9ECEC',

    darken: '#4DC49F'
});

const background = Object.freeze({
    lighten: '#EDF1F1',
    lighten1: '#FFFFFF',
    lighten2: '#F1F6F6',
    lighten3: '#F1F6F6',
    darken: '#4DC49F'
});

const theme = {
    primary,
    success,
    error,
    font,
    line,
    background
}
console.log(theme)
for(let key in theme){
    let item = theme[key]
    for(let k in item){
        let it = item[k]
        window.document.children[0].style.setProperty(`--${key}-${k}`,it)
    }
}

export default theme