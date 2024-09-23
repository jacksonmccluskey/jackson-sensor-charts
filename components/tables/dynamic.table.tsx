import React from 'react';
import {
	Flex,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Checkbox,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

const DynamicTable = ({
	columnsConfig,
	data,
	selectedRows = [],
	onSelectRow = null,
	onSelectAllRows = null,
	sortOrder = null,
	onSort = null,
	handleCheckboxClick = null,
	styles = {},
}) => {
	const handleRowClick = (id) => {
		if (onSelectRow) onSelectRow(id);
	};

	const allRowsSelected = data.every((row) => selectedRows.includes(row.id));
	const someRowsSelected = data.some((row) => selectedRows.includes(row.id));

	return (
		<Flex
			width='100%'
			height='100%'
			flexDirection='column'
			overflowX='auto'
			{...styles}
		>
			<Table size='sm' width='100%'>
				<Thead position='sticky' top={0} zIndex='docked' bg='white'>
					<Tr>
						{onSelectAllRows && (
							<Th>
								<Checkbox
									isChecked={allRowsSelected}
									isIndeterminate={!allRowsSelected && someRowsSelected}
									onChange={onSelectAllRows}
									borderColor='black'
								/>
							</Th>
						)}
						{columnsConfig.map((col) => (
							<Th
								key={col.accessor}
								onClick={() => (onSort ? onSort(col.accessor) : null)}
								cursor='pointer'
								whiteSpace='nowrap'
								color='brand.black'
							>
								{col.label}
								{sortOrder &&
									sortOrder.column === col.accessor &&
									(sortOrder.ascending ? (
										<ChevronUpIcon ml={2} />
									) : (
										<ChevronDownIcon ml={2} />
									))}
							</Th>
						))}
					</Tr>
				</Thead>
				<Tbody overflowY='auto'>
					{data.map((row) => (
						<Tr
							key={row.id}
							cursor='pointer'
							bg={selectedRows.includes(row.id) ? 'brand.base' : 'transparent'}
							onClick={() => handleRowClick(row.id)}
						>
							{handleCheckboxClick && selectedRows && (
								<Td onClick={(e) => e.stopPropagation()}>
									<Checkbox
										isChecked={selectedRows.includes(row.id)}
										onChange={(e) => {
											e.stopPropagation();
											handleCheckboxClick(e, row.id);
										}}
										borderColor='black'
									/>
								</Td>
							)}
							{columnsConfig.map((col) => (
								<Td
									key={col.accessor}
									isTruncated
									whiteSpace='nowrap'
									color='brand.black'
								>
									{row[col.accessor]}
								</Td>
							))}
						</Tr>
					))}
				</Tbody>
			</Table>
		</Flex>
	);
};

export default DynamicTable;
