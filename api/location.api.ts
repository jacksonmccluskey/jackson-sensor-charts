import { config } from '../config';
import { IDevice, ITimeRange } from '../context/data/data.context';
import { getFormattedDate } from '../helpers/get-formatted-date';

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
		const filters: any = {
			deviceIdList: deviceIdList.join(','),
		};

		if (timeRange.startDate) {
			filters.startDateTime = getFormattedDate(timeRange.startDate);
		}

		if (timeRange.endDate) {
			filters.endDateTime = getFormattedDate(timeRange.endDate);
		}

		const locationResponse = await fetch(
			config.internalAPIURL + config.locationEndpoint,
			{
				body: JSON.stringify(filters),
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
						lastTransmitDate: location.deviceDateTime,
					};
			  })
			: [];
	} catch {}

	return devices;
};
