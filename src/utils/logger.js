import path from "node:path"
import winston from "winston";

const customLogFormat = winston.format.printf(({ timestamp, label, level, message, ...meta }) => {
	const metaFormatted = Object.getOwnPropertyNames(meta).length > 0 ? ` |> ${JSON.stringify(meta, null, 2)}` : "";

	return `(${timestamp}) [${label}] ${level} ${message}${metaFormatted}`;
});

export function createLogger(label, logLevel = 'warn') {
	const transports = [];

	if(process.env.ENABLE_CONSOLE_LOGGING === "true") {
		transports.push(new winston.transports.Console({
			level: logLevel,
			format: winston.format.combine(
						winston.format.timestamp(),
						winston.format.label( { label } ),
						winston.format.colorize(),
						customLogFormat)
		}));
	}

	if(process.env.ENABLE_FS_LOGGING === "true") {
		transports.push(new winston.transports.File({
			filename: path.join(process.cwd(), `./logs/${new Date(new Date(new Date().setSeconds(0)).setMilliseconds(0)).toISOString().replace(/:/g, '_')}/${label}.log`),
			level: logLevel,
			format: winston.format.combine(
				winston.format.timestamp(),
				winston.format.label( { label } ),
				customLogFormat)
		}));
	}

	return winston.createLogger({
		transports,
	});
}
