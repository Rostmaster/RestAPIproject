const { createLogger, format, transports } = require('winston')
const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'server/logs/error.log', level: 'error' }),
        new transports.File({ filename: 'server/logs/warn.log', level: 'warn' }),
        new transports.File({ filename: 'server/logs/info.log', level: 'info' }),
        new transports.File({ filename: 'server/logs/debug.log', level: 'debug' }),
        new transports.File({ filename: 'server/logs/combined.log' })
    ]
});

module.exports = logger ;