const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} ${level}: ${stack || JSON.stringify(message)}`;
});

const prodLogger = () => {
    return createLogger({
        level : "debug",
        format: combine (
            format.colorize(),
            timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
            format.errors({stack: true}),
            logFormat
        ),
        transports: [new transports.Console()]
    });
}

module.exports = prodLogger