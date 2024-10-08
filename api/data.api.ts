import { config } from '../config';
import { constructTime } from './time.api';

export const getDataQueryString = ({ timeRange, deviceId, sensor }) => {
	return `?deviceId=${deviceId}&${constructTime(
		timeRange.startDate,
		timeRange.endDate,
		true
	)}&sensorShortName=${sensor}`;
};

export const getData = async ({
	timeRange,
	deviceId,
	sensor,
	jwt,
}: {
	timeRange: any;
	deviceId: number | string;
	sensor: string;
	jwt: string;
}) => {
	const dataURL =
		config.internalAPIURL +
		config.dataEndpoint +
		getDataQueryString({
			timeRange,
			deviceId,
			sensor,
		});

	const dataResponse = await fetch(dataURL, {
		headers: {
			Authorization: jwt,
			'Content-Type': 'application/json',
		},
	});

	return await dataResponse.json();
};
