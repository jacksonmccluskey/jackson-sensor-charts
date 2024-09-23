'use client';

import React, { useState } from 'react';
import DynamicTable from './dynamic.table';
import { useDataContext } from '../../context/data.context';
import { Flex } from '@chakra-ui/react';

const SensorTable = () => {
	const { sensorSets, selectedSensors, setSelectedSensors, devices } =
		useDataContext();

	const deviceTypeIdToName = devices.reduce((acc, device) => {
		if (!acc[device.deviceTypeId]) {
			acc[device.deviceTypeId] = `Device Type ${device.deviceTypeId}`;
		}
		return acc;
	}, {});

	const [sortOrder, setSortOrder] = useState({
		column: 'sensor',
		ascending: true,
	});

	const handleSort = (column: string) => {
		setSortOrder((prev) => ({
			column,
			ascending: prev.column === column ? !prev.ascending : true,
		}));
	};

	return (
		<Flex flexDirection='row'>
			{sensorSets.map((sensorSet) => {
				const { deviceTypeId, sensors } = sensorSet;

				const deviceTypeName =
					deviceTypeIdToName[deviceTypeId] || `Device Type ${deviceTypeId}`;

				const columnsConfig = [{ label: deviceTypeName, accessor: 'sensor' }];

				const tableData = sensors.map((sensor: string) => ({
					id: sensor,
					sensor,
				}));

				const sortedData = [...tableData].sort((a, b) => {
					if (!sortOrder.column) return 0;
					const isAsc = sortOrder.ascending ? 1 : -1;
					if (typeof a[sortOrder.column] === 'string') {
						return (
							isAsc * a[sortOrder.column].localeCompare(b[sortOrder.column])
						);
					}
					return isAsc * (a[sortOrder.column] - b[sortOrder.column]);
				});

				const handleSelectRow = (sensor: string) => {
					if (selectedSensors.length === 1 && selectedSensors[0] === sensor) {
						setSelectedSensors([]);
					} else {
						setSelectedSensors([sensor]);
					}
				};

				const handleCheckboxClick = (e: any, sensor: string) => {
					e.stopPropagation();
					setSelectedSensors((prevSelectedSensors) =>
						prevSelectedSensors.includes(sensor)
							? prevSelectedSensors.filter(
									(selectedSensor: string) => selectedSensor !== sensor
							  )
							: [...prevSelectedSensors, sensor]
					);
				};

				const handleSelectAllRows = () => {
					const sensorsInTable = sensors;

					const allSelected = sensorsInTable.every((sensor) =>
						selectedSensors.includes(sensor)
					);

					if (allSelected) {
						setSelectedSensors((prevSelectedSensors: string[]) =>
							prevSelectedSensors.filter(
								(sensor: string) => !sensorsInTable.includes(sensor)
							)
						);
					} else {
						setSelectedSensors((prevSelectedSensors: string[]) => [
							...prevSelectedSensors,
							...sensorsInTable,
						]);
					}
				};

				return (
					<DynamicTable
						key={deviceTypeId}
						columnsConfig={columnsConfig}
						data={sortedData}
						selectedRows={selectedSensors}
						onSelectRow={handleSelectRow}
						onSelectAllRows={handleSelectAllRows}
						sortOrder={sortOrder}
						onSort={handleSort}
						handleCheckboxClick={handleCheckboxClick}
					/>
				);
			})}
		</Flex>
	);
};

export default SensorTable;
