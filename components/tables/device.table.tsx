import React, { useState } from 'react';
import DynamicTable from './dynamic.table';
import { Icon } from '@chakra-ui/react';
import { FaWifi } from 'react-icons/fa';

const getStatusIcon = (status) => {
	const statusColors = {
		Activated: 'light-green',
		Active: 'green',
		Suspended: 'orange',
		Deployed: 'blue',
		Testing: 'red',
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
		{ label: 'IMEI', accessor: 'imei' },
		{ label: 'Device Name', accessor: 'deviceName' },
		{ label: 'Last Transmit (Date)', accessor: 'lastTransmitDate' },
		{ label: 'Last Transmit (Ago)', accessor: 'lastTransmitAgo' },
		{ label: 'Status', accessor: 'status' },
	];

	const data = [
		{
			id: 1,
			imei: 123456789012345,
			deviceName: 'Ocean Drifter 1',
			lastTransmitDate: '2024-09-10 14:22:35',
			lastTransmitAgo: '2 days ago',
			status: getStatusIcon('Active'),
		},
		{
			id: 2,
			imei: 987654321098765,
			deviceName: 'Ocean Drifter 2',
			lastTransmitDate: '2024-09-08 08:15:12',
			lastTransmitAgo: '4 days ago',
			status: getStatusIcon('Suspended'),
		},
		{
			id: 3,
			imei: 135791357913579,
			deviceName: 'Ocean Drifter 3',
			lastTransmitDate: '2024-09-05 22:45:00',
			lastTransmitAgo: '1 week ago',
			status: getStatusIcon('Deployed'),
		},
		{
			id: 4,
			imei: 246824682468246,
			deviceName: 'Ocean Drifter 4',
			lastTransmitDate: '2024-09-03 09:32:21',
			lastTransmitAgo: '1 month ago',
			status: getStatusIcon('Testing'),
		},
		{
			id: 5,
			imei: 246824682468247,
			deviceName: 'Ocean Drifter 5',
			lastTransmitDate: '2024-09-03 09:32:21',
			lastTransmitAgo: '2 months ago',
			status: getStatusIcon('Testing'),
		},
		{
			id: 6,
			imei: 246824682468248,
			deviceName: 'Ocean Drifter 6',
			lastTransmitDate: '2024-09-03 09:32:21',
			lastTransmitAgo: '3 months ago',
			status: getStatusIcon('Testing'),
		},
		{
			id: 7,
			imei: 246824682468249,
			deviceName: 'Ocean Drifter 6',
			lastTransmitDate: '2024-09-03 09:32:21',
			lastTransmitAgo: '4 months ago',
			status: getStatusIcon('Testing'),
		},
		{
			id: 8,
			imei: 246824682468250,
			deviceName: 'Ocean Drifter 7',
			lastTransmitDate: '2024-09-03 09:32:21',
			lastTransmitAgo: '5 months ago',
			status: getStatusIcon('Testing'),
		},
	];

	const [selectedColumns, setSelectedColumns] = useState(
		columnsConfig.map((col) => col.accessor)
	);
	const [selectedRows, setSelectedRows] = useState([]);
	const [searchFilter, setSearchFilter] = useState('');
	const [sortOrder, setSortOrder] = useState({ column: '', ascending: true });

	const filteredData = data
		.filter((row) =>
			selectedColumns.some((col) =>
				String(row[col]).toLowerCase().includes(searchFilter.toLowerCase())
			)
		)
		.sort((a, b) => {
			if (!sortOrder.column) return 0;
			const isAsc = sortOrder.ascending ? 1 : -1;
			if (typeof a[sortOrder.column] === 'string') {
				return isAsc * a[sortOrder.column].localeCompare(b[sortOrder.column]);
			}
			return isAsc * (a[sortOrder.column] - b[sortOrder.column]);
		});

	const handleSelectRow = (id) => {
		setSelectedRows((prev) =>
			prev.includes(id) && prev.length == 1 ? [] : [id]
		);
	};

	const handleCheckboxClick = (e, id) => {
		e.stopPropagation();
		setSelectedRows((prev) =>
			prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
		);
	};

	const handleSelectAllRows = () => {
		setSelectedRows((prev) =>
			prev.length === data.length ? [] : data.map((row) => row.id)
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
