import { config } from '../config';
import { constructTime } from './time.api';

export const getCustomerQueryString = ({
	fileFormat,
	timeRange,
	apiKey,
	selectedDevices,
	orgId,
	selectedSensors,
}) => {
	const time = constructTime(timeRange.startDate, timeRange.endDate);

	return `?apiKey=${apiKey}&commIDs=${selectedDevices.join(
		','
	)}&${time}&fileFormat=${fileFormat}&fieldList=${selectedSensors
		.map((selectedSensor) => selectedSensor.displayName)
		.join(',')}&orgId=${orgId}`;
};

export const getCustomerAPIURL = ({
	fileFormat,
	timeRange,
	apiKey,
	selectedDevices,
	orgId,
	selectedSensors,
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
		})
	);
};
