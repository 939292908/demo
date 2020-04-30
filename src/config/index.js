let config = {}
try {
    config = require('./config.js')
} catch (error) {
    config = require('./config_default.js')
}
export default config