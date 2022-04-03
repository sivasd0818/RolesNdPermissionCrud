const devLogger = require('./dev-logger');

let logger = null;

if(process.env.NODE_ENV && process.env.NODE_ENV.trim() == 'development'){
    logger = devLogger();
} else {
    logger = devLogger();
}

module.exports = logger
