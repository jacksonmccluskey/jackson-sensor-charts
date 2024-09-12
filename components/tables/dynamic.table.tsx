'use client';

import React from 'react';
import {
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Checkbox,
	Box,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@chakra-ui/icons';

const DynamicTable = ({
	columnsConfig,
	data,
	selectedRows,
	onSelectRow,
	onSelectAllRows,
	sortOrder,
	onSort,
	handleCheckboxClick,
	styles = {},
}) => {
	const handleRowClick = (id) => {
		onSelectRow(id);
	};

	return (
		<Box
			overflowY='auto'
			overflowX='auto'
			width='100%'
			height='100%'
			{...styles}
		>
			<Table size='sm' width='100%'>
				<Thead>
					<Tr>
						<Th>
							<Checkbox
								isChecked={selectedRows.length === data.length}
								onChange={onSelectAllRows}
								borderColor='black'
							/>
						</Th>
						{columnsConfig.map((col) => (
							<Th
								key={col.accessor}
								onClick={() => onSort(col.accessor)}
								cursor='pointer'
								whiteSpace='nowrap'
							>
								{col.label}
								{sortOrder.column === col.accessor &&
									(sortOrder.ascending ? (
										<ChevronUpIcon ml={2} />
									) : (
										<ChevronDownIcon ml={2} />
									))}
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody>
					{data.map((row) => (
						<Tr
							key={row.id}
							cursor='pointer'
							maxHeight='32px'
							overflow='hidden'
							bg={selectedRows.includes(row.id) ? 'brand.base' : 'transparent'}
						>
							<Td onClick={(e) => handleCheckboxClick(e, row.id)}>
								<Checkbox
									isChecked={selectedRows.includes(row.id)}
									onChange={(e) => handleCheckboxClick(e, row.id)}
									borderColor='black'
								/>
							</Td>
							{columnsConfig.map((col) => (
								<Td
									key={col.accessor}
									isTruncated
									whiteSpace='nowrap'
									color='black'
									onClick={() => handleRowClick(row.id)}
								>
									{row[col.accessor]}
								</Td>
							))}
						</Tr>
					))}
				</Tbody>
			</Table>
		</Box>
	);
};

export default DynamicTable;
