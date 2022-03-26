import luxon from "luxon";

const FOREX_MARKETS_TIME_ZONE_IANA = luxon.IANAZone.create("America/New_York");

let forexCurrentlyOpen = false;

export function isForexOpen(dateToCheck) {
	const now = luxon.DateTime.fromJSDate(dateToCheck).setZone(FOREX_MARKETS_TIME_ZONE_IANA);
	const weekday = now.weekday;
	const hour = now.hour;
	const dateOfMonth = now.day;
	const month = now.month;

	const isClosed =
		// XMas
		(month === 12 && dateOfMonth >= 25 && dateOfMonth <= 27)
			||
		// New Year's Eve
		(month === 1 && dateOfMonth >= 1 && dateOfMonth <= 3)
			||
		// Friday after 4PM
		(weekday === 5 && hour >= 16)
			||
		// Saturday
		(weekday === 6)
			||
		// Sunday before 5PM
		(weekday === 7 && hour < 17);

	return !isClosed;
}

let refreshIntervalId = null;

export function isForexPair(pairIndex) {
	return pairIndex >= 21 && pairIndex <= 30;
}

export function startForexMonitoring(forcedDate = null) {
	if(refreshIntervalId !== null) {
		throw new Error("Forex monitoring is already started.");
	}

	const checkIfForexOpen = () => isForexOpen(forcedDate ?? new Date());

	forexCurrentlyOpen = checkIfForexOpen();

	refreshIntervalId = setInterval(() => {
		forexCurrentlyOpen = checkIfForexOpen();
	}, 10 * 1000);
};

export function stopForexMonitoring() {
	if(refreshIntervalId === null) {
		throw new Error("Forex monitoring was not started.");
	}

	clearInterval(refreshIntervalId);

	refreshIntervalId = null;
}

export const isForexCurrentlyOpen = () => forexCurrentlyOpen;

