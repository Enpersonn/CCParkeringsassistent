import { DateTime } from "luxon";

const getExpiryTime = (): Date => {
	const now = DateTime.now().setZone("Europe/Oslo");
	let expiry = now.set({ hour: 17, minute: 0, second: 0, millisecond: 0 });

	if (now > expiry) {
		expiry = expiry.plus({ days: 1 });
	}

	return expiry.toJSDate();
};

export default getExpiryTime;
