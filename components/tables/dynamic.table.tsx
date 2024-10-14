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

const DynamicTable = ({
	columnsConfig,
	data,
	selectedRows = [],
	onSelectRow = null,
	sortOrder = null,
	onSort = null,
	handleCheckboxClick = null,
	styles = {},
	isLoading,
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
			overflow='auto'
			{...styles}
		>
			<Table
				size='sm'
				width='100%'
				backgroundColor={showHelperModal ? 'brand.3' : 'white'}
			>
				<Thead
					position='sticky'
					top={0}
					zIndex={1}
					backgroundColor='brand.white'
				>
					<Tr>
						<Th maxWidth='fit-content'>
							<Icon
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
								name='question'
								width='16px'
								height='16px'
								borderRadius='8px'
								backgroundColor='brand.white'
							/>
						</Th>
						{columnsConfig.map((col) => (
							<Th
								key={col.accessor}
								onClick={() =>
									onSort && !isLoading ? onSort(col.accessor) : null
								}
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
				<Tbody overflowY='auto' maxHeight='100%'>
					{data.map((row, index) => (
						<Tr
							key={row.id + index}
							cursor='pointer'
							bg={selectedRows.includes(row.id) ? 'brand.base' : 'transparent'}
							onClick={() => {
								if (!isLoading) handleRowClick(row.id);
							}}
						>
							{handleCheckboxClick && selectedRows && (
								<Td
									width='40px'
									padding='0'
									textAlign='center'
									onClick={(e) => e.stopPropagation()}
								>
									<Checkbox
										isChecked={selectedRows.includes(row.id)}
										onChange={(e) => {
											e.stopPropagation();
											if (!isLoading) handleCheckboxClick(e, row.id);
										}}
										borderColor='black'
										size='md'
										margin='auto'
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
			{showHelperModal ? (
				<video
					autoPlay={true}
					style={{
						position: 'fixed',
						top: mousePosition.y + 16,
						left: mousePosition.x + 16,
						borderWidth: '4px',
						borderColor: 'black',
						borderRadius: '8px',
					}}
				>
					<source src='/table-helper-modal.mp4' type='video/mp4' />
				</video>
			) : null}
		</Flex>
	);
};

export default DynamicTable;
