'use client';

import React, { useState } from 'react';
import DynamicTable from './dynamic.table';

const SensorTable = () => {
	const sensors = [
		{ id: 1, sensor: 'Temperature Sensor' },
		{ id: 2, sensor: 'Pressure Sensor' },
		{ id: 3, sensor: 'My Sensor' },
		{ id: 4, sensor: 'Your Sensor' },
		{ id: 5, sensor: 'His Sensor' },
		{ id: 6, sensor: 'Her Sensor' },
	];

	const columnsConfig = [{ label: 'Sensor Name', accessor: 'sensor' }];

	const [selectedRows, setSelectedRows] = useState([]);
	const [sortOrder, setSortOrder] = useState({
		column: 'sensor',
		ascending: true,
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
			prev.length === sensors.length ? [] : sensors.map((row) => row.id)
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
			data={sensors}
			selectedRows={selectedRows}
			onSelectRow={handleSelectRow}
			onSelectAllRows={handleSelectAllRows}
			sortOrder={sortOrder}
			onSort={handleSort}
			handleCheckboxClick={handleCheckboxClick}
		/>
	);
};

export default SensorTable;
