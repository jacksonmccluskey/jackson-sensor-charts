import { config } from '../config';

export const getLocations = async ({
	deviceId,
	timeRange,
	jwt,
}): Promise<{
	latitude?: number;
	longitude?: number;
	temperature?: number;
	deviceTypeName?: string;
	batteryVoltage?: number;
	gpsQuality?: number;
}> => {
	try {
		const locationResponse = await fetch(
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

		const locationResponseJSON = await locationResponse.json();

		const { data } = locationResponseJSON;

		if (data.length)
			return {
				latitude: data[0].latitude,
				longitude: data[0].longitude,
				temperature: data[0].sst,
				deviceTypeName: data[0].deviceTypeName,
				batteryVoltage: data[0].battVoltage,
				gpsQuality: data[0].gpsQuality,
			};
	} catch {}

	return {};
};
