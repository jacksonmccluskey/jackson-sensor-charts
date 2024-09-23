import React from 'react';
import DynamicTable from './dynamic.table';
import { useDataContext } from '../../context/data.context';

interface IRawDataTableProps {
	styles?: any;
}

const RawDataTable = ({ styles }: IRawDataTableProps) => {
	const { rawDeviceData, selectedSensors } = useDataContext();

	const allSensors = selectedSensors.filter(
		(sensor, index, self) => self.indexOf(sensor) === index
	);

	const baseColumns = [
		{ label: 'Data ID', accessor: 'DataId' },
		{ label: 'Comm ID', accessor: 'CommId' },
		{ label: 'Device Name', accessor: 'DeviceName' },
		{ label: 'Device Date Time', accessor: 'DeviceDateTime' },
	];

	const sensorColumns = allSensors.map((sensor) => ({
		label: sensor,
		accessor: sensor,
	}));

	const columnsConfig = [...baseColumns, ...sensorColumns];

	const sensorToDataKey = {};
	allSensors.forEach((sensor, index) => {
		sensorToDataKey[sensor] = `Sensor${index + 1}`;
	});

	const transformedData = rawDeviceData.map((entry) => {
		const newEntry = { ...entry };

		allSensors.forEach((sensor) => {
			const dataKey = sensorToDataKey[sensor];
			if (dataKey && dataKey in entry) {
				newEntry[sensor] = entry[dataKey];
			} else {
				newEntry[sensor] = null;
			}
		});

		return newEntry;
	});

	return (
		<DynamicTable
			columnsConfig={columnsConfig}
			data={transformedData}
			styles={styles}
		/>
	);
};

export default RawDataTable;
