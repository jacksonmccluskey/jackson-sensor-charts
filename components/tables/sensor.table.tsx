'use client';

import React, { useState } from 'react';
import DynamicTable from './dynamic.table';
import { ISensor, useDataContext } from '../../context/data/data.context';
import { Flex } from '@chakra-ui/react';

const SensorTable = () => {
	const { sensorSets, selectedSensors, setSelectedSensors } = useDataContext();

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
			{sensorSets.map((sensorSet, index) => {
				const { deviceTypeId, sensors } = sensorSet;

				const deviceTypeName = `Device Type ${deviceTypeId}`;

				const columnsConfig = [{ label: deviceTypeName, accessor: 'sensor' }];

				const tableData = sensors.map((sensor: ISensor) => ({
					id: sensor.displayName,
					sensor: sensor.displayName,
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
					if (
						selectedSensors.length === 1 &&
						selectedSensors[0].displayName === sensor
					) {
						setSelectedSensors([]);
					} else {
						setSelectedSensors([
							sensors.find(
								(currentSensor) => currentSensor.displayName == sensor
							),
						]);
					}
				};

				const handleCheckboxClick = (e: any, sensor: string) => {
					e.stopPropagation();
					setSelectedSensors((prevSelectedSensors: ISensor[]) =>
						prevSelectedSensors.some(
							(prevSelectedSensor: ISensor) =>
								prevSelectedSensor.displayName == sensor
						)
							? prevSelectedSensors.filter(
									(selectedSensor: ISensor) =>
										selectedSensor.displayName !== sensor
							  )
							: [
									...prevSelectedSensors,
									sensors.find(
										(currentSensor: ISensor) =>
											currentSensor.displayName == sensor
									),
							  ]
					);
				};

				const handleSelectAllRows = () => {
					const allSelected = sensors.every((sensor) =>
						selectedSensors.some(
							(selectedSensor) =>
								selectedSensor.displayName == sensor.displayName
						)
					);

					setSelectedSensors(allSelected ? [] : sensors);
				};

				return (
					<DynamicTable
						key={index}
						columnsConfig={columnsConfig}
						data={sortedData}
						selectedRows={selectedSensors.map(
							(selectedRow) => selectedRow.displayName
						)}
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
