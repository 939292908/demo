let config = {}
try {
    config = require('./config.js')
} catch (error) {
    config = require('./config_default.js')
}

config = require('./config_default.js')

console.log('config', config)

export default config