import React, { useEffect, useState } from 'react';
import DynamicTable from './dynamic.table';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { FaWifi, FaBolt, FaSatellite } from 'react-icons/fa';
import { useDataContext } from '../../context/data/data.context';
import LoadingSkeleton from '../modals/loading-skeleton.modal';

const getStatusIcon = (status: string) => {
	const statusColors = {
		Activated: 'green',
		Active: 'green',
		Suspended: 'orange',
		Deployed: 'blue',
		Testing: 'red',
		Deactivated: 'red',
	};

	return (
		<Flex
			flexDirection='row'
			justifyContent='flex-start'
			alignItems='flex-start'
		>
			{status == 'Activated' ? (
				<Icon
					as={FaSatellite}
					backgroundColor='blue'
					color='white'
					height='16px'
					width='16px'
					padding='4px'
					borderRadius='8px'
					marginRight='8px'
				/>
			) : null}
			<Icon
				as={FaWifi}
				backgroundColor={statusColors[status]}
				color='white'
				height='16px'
				width='16px'
				padding='4px'
				borderRadius='8px'
			/>
		</Flex>
	);
};

const getBatteryVoltage = (batteryVoltage: number) => {
	const getBatteryVoltageColor = () => {
		if (batteryVoltage > 10) {
			return 'green';
		} else if (batteryVoltage > 6) {
			return 'orange';
		} else {
			return 'red';
		}
	};

	return (
		<Flex flexDirection='row'>
			<Icon
				as={FaBolt}
				backgroundColor={getBatteryVoltageColor()}
				color='white'
				height='16px'
				width='16px'
				padding='4px'
				borderRadius='8px'
			/>
			<Text marginLeft='16px'>{batteryVoltage}</Text>
		</Flex>
	);
};

const DeviceTable = ({ isOnlyActive = false }) => {
	const columnsConfig = [
		{ label: 'Device Name', accessor: 'deviceName' },
		{ label: 'Comm ID', accessor: 'commId' },
		{ label: 'Last Transmit (Date)', accessor: 'lastTransmitDate' },
		{ label: 'Last Transmit (Ago)', accessor: 'lastTransmitAgo' },
		{ label: 'Status', accessor: 'status' },
		{ label: 'Battery Voltage', accessor: 'batteryVoltage' },
		{ label: 'WMO ID', accessor: 'wmoId' },
	];

	const { devices, selectedDevices, setSelectedDevices, isDevicesLoading } =
		useDataContext();

	useEffect(() => {
		setSelectedDevices(devices.map((device) => device.commId));
	}, []);

	const [selectedColumns, setSelectedColumns] = useState(
		columnsConfig.map((col) => col.accessor)
	);
	const [searchFilter, setSearchFilter] = useState<string>('');
	const [sortOrder, setSortOrder] = useState({
		column: 'lastTransmitDate',
		ascending: false,
	});

	const filteredData = devices
		.map((device) => {
			return {
				...device,
				status: getStatusIcon(device.status),
				lastTransmitDate: device.lastTransmitDate
					.replace('T', ' ')
					.replace('Z', ''),
				batteryVoltage: getBatteryVoltage(device.batteryVoltage),
			};
		})
		.filter(
			(row) =>
				selectedColumns.some((col) =>
					String(row[col]).toLowerCase().includes(searchFilter.toLowerCase())
				) && (isOnlyActive ? row.active : true)
		)

		.sort((a, b) => {
			if (!sortOrder.column) return 0;

			const isAsc = sortOrder.ascending ? 1 : -1;

			let usingColumn = sortOrder.column;

			if (sortOrder.column == 'lastTransmitAgo') {
				usingColumn = 'lastTransmitDate';
			}

			if (typeof a[usingColumn] === 'string') {
				return isAsc * a[usingColumn].localeCompare(b[usingColumn]);
			}

			return isAsc * (a[usingColumn] - b[usingColumn]);
		});

	const handleSelectRow = async (deviceId) => {
		if (!isDevicesLoading) {
			setSelectedDevices((prev) => {
				return prev == deviceId && prev.length == 1 ? [] : [deviceId];
			});
		}
	};

	const handleCheckboxClick = async (e, deviceId) => {
		if (!isDevicesLoading) {
			e.stopPropagation();

			setSelectedDevices((prev) =>
				prev.includes(deviceId)
					? prev.filter((rowId) => rowId !== deviceId)
					: [...prev, deviceId]
			);
		}
	};

	const handleSort = (column) => {
		if (!isDevicesLoading) {
			setSortOrder((prev) => ({
				column,
				ascending: prev.column === column ? !prev.ascending : true,
			}));
		}
	};

	return (
		<LoadingSkeleton isLoading={isDevicesLoading}>
			<DynamicTable
				columnsConfig={columnsConfig}
				data={filteredData}
				selectedRows={selectedDevices}
				onSelectRow={handleSelectRow}
				sortOrder={sortOrder}
				onSort={handleSort}
				handleCheckboxClick={handleCheckboxClick}
				isLoading={isDevicesLoading}
			/>
		</LoadingSkeleton>
	);
};

export default DeviceTable;
