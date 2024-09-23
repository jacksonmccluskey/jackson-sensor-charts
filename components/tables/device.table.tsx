import React, { useEffect, useState } from 'react';
import DynamicTable from './dynamic.table';
import { Icon } from '@chakra-ui/react';
import { FaWifi } from 'react-icons/fa';
import { useDataContext } from '../../context/data.context';

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

const ParentComponent = () => {
	const columnsConfig = [
		{ label: 'Comm ID', accessor: 'commId' },
		{ label: 'Device Name', accessor: 'deviceName' },
		{ label: 'Last Transmit (Date)', accessor: 'lastTransmitDate' },
		{ label: 'Last Transmit (Ago)', accessor: 'lastTransmitAgo' },
		{ label: 'Status', accessor: 'status' },
	];

	const { devices, setSelectedDevices } = useDataContext();

	const [selectedColumns, setSelectedColumns] = useState(
		columnsConfig.map((col) => col.accessor)
	);
	const [selectedRows, setSelectedRows] = useState<string[]>([]);
	const [searchFilter, setSearchFilter] = useState('');
	const [sortOrder, setSortOrder] = useState({ column: '', ascending: true });

	useEffect(() => {
		setSelectedDevices(selectedRows);
	}, [selectedRows]);

	const filteredData = devices
		.map((device) => {
			return { ...device, status: getStatusIcon(device.status) };
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
		setSelectedRows((prev) => {
			return prev == deviceId && prev.length == 1 ? [] : [deviceId];
		});
	};

	const handleCheckboxClick = async (e, deviceId) => {
		e.stopPropagation();

		setSelectedRows((prev) =>
			prev.includes(deviceId)
				? prev.filter((rowId) => rowId !== deviceId)
				: [...prev, deviceId]
		);
	};

	const handleSelectAllRows = () => {
		setSelectedRows((prev) =>
			prev.length === devices.length
				? []
				: devices.map((device) => device.commId + '')
		);
	};

	const handleSort = (column) => {
		setSortOrder((prev) => ({
			column,
			ascending: prev.column === column ? !prev.ascending : true,
		}));
	};

	return (
		<DynamicTable
			columnsConfig={columnsConfig}
			data={filteredData}
			selectedRows={selectedRows}
			onSelectRow={handleSelectRow}
			onSelectAllRows={handleSelectAllRows}
			sortOrder={sortOrder}
			onSort={handleSort}
			handleCheckboxClick={handleCheckboxClick}
		/>
	);
};

export default ParentComponent;
