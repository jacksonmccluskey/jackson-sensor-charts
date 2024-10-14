import { config } from '../config';
import { constructTime } from './time.api';

export const getCustomerQueryString = ({
	fileFormat,
	timeRange,
	apiKey,
	selectedDevices,
	orgId,
	selectedSensors,
	coordinateFormat,
}) => {
	const time = constructTime(timeRange.startDate, timeRange.endDate);

	return `?apiKey=${apiKey}&commIDs=${selectedDevices.join(
		','
	)}&${time}&fileFormat=${fileFormat}&fieldList=${selectedSensors
		.map((selectedSensor) => selectedSensor.displayName)
		.join(',')}&orgId=${orgId}${
		coordinateFormat
			? '&coordinateFormat=' + coordinateFormat.toLowerCase()
			: ''
	}`;
};

export const getCustomerAPIURL = ({
	fileFormat,
	timeRange,
	apiKey,
	selectedDevices,
	orgId,
	selectedSensors,
	coordinateFormat,
}) => {
	return (
		config.customerAPIURL +
		getCustomerQueryString({
			fileFormat,
			timeRange,
			apiKey,
			selectedDevices,
			orgId,
			selectedSensors,
			coordinateFormat,
		})
	);
};
