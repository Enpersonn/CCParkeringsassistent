import { DateTime } from "luxon";

const getExpiryTime = (): Date => {
	const now = DateTime.now().setZone("Europe/Oslo");
	let expiry = now.set({ hour: 17, minute: 0, second: 0, millisecond: 0 });

	if (now > expiry) {
		expiry = now.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
	}

	return expiry.toJSDate();
};

export default getExpiryTime;
