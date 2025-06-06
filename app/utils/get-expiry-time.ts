const getExpiryTime = (): Date => {
	const now = new Date();
	const expires = new Date(now);
	expires.setHours(17, 0, 0, 0);
	if (now > expires) {
		expires.setDate(expires.getDate() + 1);
		expires.setHours(0, 0, 0, 0);
	}
	return expires;
};

export default getExpiryTime;
