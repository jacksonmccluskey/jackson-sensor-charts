import { config } from '../config';
import { ISensor } from '../context/data/data.context';

export const fetchSensors = async ({ jwt, deviceId }): Promise<ISensor[]> => {
	if (!jwt) {
		return [];
	}

	const sensorResponse = await fetch(
		config.internalAPIURL + config.sensorEndpoint,
		{
			method: 'POST',
			headers: {
				Authorization: jwt ?? config.jwtTester,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				deviceIdList: deviceId,
			}),
		}
	);

	const { data } = await sensorResponse.json();

	const sensors = Array.isArray(data)
		? data.map((sensor) => {
				return {
					dataFieldId: sensor.dataFieldId,
					dataFieldName: sensor.dataFieldName,
					displayName: sensor.displayName,
				};
		  })
		: [];

	return sensors;
};
