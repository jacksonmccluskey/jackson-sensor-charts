import React, { useEffect, useState } from 'react';
import DynamicTable from './dynamic.table';
import { Icon } from '@chakra-ui/react';
import { FaWifi } from 'react-icons/fa';
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
		<Icon
			as={FaWifi}
			backgroundColor={statusColors[status]}
			color='white'
			height='16px'
			width='16px'
			padding='4px'
			borderRadius='8px'
		/>
	);
};

const DeviceTable = () => {
	const columnsConfig = [
		{ label: 'Comm ID', accessor: 'commId' },
		{ label: 'Device Name', accessor: 'deviceName' },
		{ label: 'Last Transmit (Date)', accessor: 'lastTransmitDate' },
		{ label: 'Last Transmit (Ago)', accessor: 'lastTransmitAgo' },
		{ label: 'Status', accessor: 'status' },
	];

	const { devices, setSelectedDevices, isDevicesLoading } = useDataContext();

	const [selectedColumns, setSelectedColumns] = useState(
		columnsConfig.map((col) => col.accessor)
	);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [searchFilter, setSearchFilter] = useState<string>('');
	const [sortOrder, setSortOrder] = useState({
		column: 'lastTransmitDate',
		ascending: false,
	});

	useEffect(() => {
		setSelectedDevices(selectedRows);
	}, [selectedRows]);

	const filteredData = devices
		.map((device) => {
			return {
				...device,
				status: getStatusIcon(device.status),
				lastTransmitDate: device.lastTransmitDate
					.replace('T', ' ')
					.replace('Z', ''),
			};
		})
		.filter((row) =>
			selectedColumns.some((col) =>
				String(row[col]).toLowerCase().includes(searchFilter.toLowerCase())
			)
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
			setSelectedRows((prev) => {
				return prev == deviceId && prev.length == 1 ? [] : [deviceId];
			});
		}
	};

	const handleCheckboxClick = async (e, deviceId) => {
		if (!isDevicesLoading) {
			e.stopPropagation();

			setSelectedRows((prev) =>
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
				selectedRows={selectedRows}
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
