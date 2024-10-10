'use client';

import React, { useState } from 'react';
import DynamicTable from './dynamic.table';
import { ISensor, useDataContext } from '../../context/data/data.context';
import LoadingSkeleton from '../modals/loading-skeleton.modal';
import { Flex } from '@chakra-ui/react';

const SensorTable = () => {
	const {
		sensorSets,
		selectedSensors,
		setSelectedSensors,
		devices,
		isSensorsLoading,
	} = useDataContext();

	const [sortOrder, setSortOrder] = useState({
		column: 'sensor',
		ascending: true,
	});

	const handleSort = (column: string) => {
		if (!isSensorsLoading) {
			setSortOrder((prev) => ({
				column,
				ascending: prev.column === column ? !prev.ascending : true,
			}));
		}
	};

	return (
		<LoadingSkeleton isLoading={isSensorsLoading}>
			<Flex width='100%' height='100%' overflow='auto'>
				{sensorSets.map((sensorSet, index) => {
					const { deviceTypeId, sensors } = sensorSet;

					const deviceTypeName = devices.find(
						(device) => device.deviceTypeId == deviceTypeId
					).deviceTypeName;

					const columnsConfig = [{ label: deviceTypeName, accessor: 'sensor' }];

					if (!sensors?.length) {
						return null;
					}

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
						if (!isSensorsLoading) {
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
						}
					};

					const handleCheckboxClick = (e: any, sensor: string) => {
						if (!isSensorsLoading) {
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
						}
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
							sortOrder={sortOrder}
							onSort={handleSort}
							handleCheckboxClick={handleCheckboxClick}
							isLoading={isSensorsLoading}
						/>
					);
				})}
			</Flex>
		</LoadingSkeleton>
	);
};

export default SensorTable;
