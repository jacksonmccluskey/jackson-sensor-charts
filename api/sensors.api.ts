import { config } from '../config';

export const fetchSensors = async ({
	jwt,
	deviceId,
	// deviceTypeId,
}): Promise<string[]> => {
	if (!jwt) {
		return [];
	}

	const sensorResponse = await fetch(
		config.internalAPIURL + config.sensorEndpoint + '?feature=Next',
		{
			method: 'POST',
			headers: {
				Authorization: jwt ?? config.jwtTester,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				deviceIdList: deviceId,
			}), // TODO: Change deviceIdList: [deviceId] to deviceTypeId: deviceTypeId
		}
	);

	const { data } = await sensorResponse.json();

	const sensors = Array.isArray(data)
		? data.map((sensor) => sensor.displayName)
		: [];

	return sensors;
};
