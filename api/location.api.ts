import { config } from '../config';
import { IDevice, ITimeRange } from '../context/data/data.context';

export const getLocations = async ({
	deviceIdList,
	timeRange,
	jwt,
	devices,
}: {
	deviceIdList: string[];
	timeRange: ITimeRange;
	jwt: string;
	devices: IDevice[];
}): Promise<IDevice[]> => {
	try {
		const locationResponse = await fetch(
			config.internalAPIURL + config.locationEndpoint,
			{
				body: JSON.stringify({
					deviceIdList: deviceIdList.join(','),
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

		return data.length
			? data.map((location) => {
					return {
						...devices.find((device) => device.deviceId == location.deviceId),
						latitude: location.latitude,
						longitude: location.longitude,
						temperature: location.sst,
						deviceTypeName: location.deviceTypeName,
						batteryVoltage: location.battVoltage,
						gpsQuality: location.gpsQuality,
					};
			  })
			: [];
	} catch {}

	return devices;
};
