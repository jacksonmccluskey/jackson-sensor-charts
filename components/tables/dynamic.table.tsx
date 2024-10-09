import React, { useState } from 'react';
import {
	Flex,
	Table,
	Thead,
	Tbody,
	Tr,
	Th,
	Td,
	Checkbox,
	Icon,
} from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';
import TableHelperModal from '../modals/table-helper.modal';

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

	const [showHelperModal, setShowHelperModal] = useState(false);

	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

	const handleMouseEnter = (e) => {
		setMousePosition({ x: e.clientX, y: e.clientY });
		setShowHelperModal(true);
	};

	const handleMouseLeave = () => {
		setShowHelperModal(false);
	};

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
								<Icon
									onMouseEnter={handleMouseEnter}
									onMouseLeave={handleMouseLeave}
									name='question'
									width='16px'
									height='16px'
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
					{data.map((row, index) => (
						<Tr
							key={row.id + index}
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
			<TableHelperModal
				showHelperModal={showHelperModal}
				styles={{
					position: 'fixed',
					top: mousePosition.y + 16,
					left: mousePosition.x + 16,
				}}
			/>
		</Flex>
	);
};

export default DynamicTable;
