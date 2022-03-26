import winston from "winston";

const consoleLogFormat = winston.format.printf(({ timestamp, label, level, message, ...meta }) => {
	const metaFormatted = Object.getOwnPropertyNames(meta).length > 0 ? ` |> ${JSON.stringify(meta, null, 2)}` : "";

	return `(${timestamp}) [${label}] ${level} ${message}${metaFormatted}`;
});

export function createLogger(label, logLevel = 'warn') {
	return winston.createLogger({
		transports: [
			new winston.transports.Console({
				level: logLevel,
				format: winston.format.combine(
							winston.format.timestamp(),
							winston.format.label( { label } ),
							winston.format.colorize(),
							consoleLogFormat)
			})
		],
	});
}
