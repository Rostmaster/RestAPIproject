const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, prettyPrint } = format;

const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp(),
        prettyPrint()
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ]
});

module.exports = logger ;