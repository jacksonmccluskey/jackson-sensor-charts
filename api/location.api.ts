import { config } from '../config';

export const getLocations = async ({
	deviceId,
	timeRange,
	jwt,
}): Promise<{ latitude?: number; longitude?: number }> => {
	try {
		const loginResponse = await fetch(
			config.internalAPIURL + config.locationEndpoint,
			{
				body: JSON.stringify({
					deviceIdList: deviceId,
					startDateTime: timeRange.startDate,
					endDateTime: timeRange.endDate,
				}),
				method: 'POST',
				headers: {
					Authorization: jwt ?? config.jwtTester,
					'Content-Type': 'application/json',
				},
			}
		);

		const loginResponseJSON = await loginResponse.json();

		console.log(JSON.stringify(loginResponseJSON));

		const { data } = loginResponseJSON;

		if (data.length)
			return {
				latitude: data[0].latitude,
				longitude: data[0].longitude,
			};
	} catch {}

	return {};
};
