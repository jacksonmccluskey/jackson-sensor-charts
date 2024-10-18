import React from 'react';
import { Flex, Input, IconButton } from '@chakra-ui/react';
import { FaCircleCheck, FaTrash } from 'react-icons/fa6';

export const SearchFilterModal = ({
	setIsShowing,
	inputValue,
	setSearchFilter,
	styles = {},
}) => {
	return (
		<Flex
			flexDirection='row'
			justifyContent='flex-start'
			alignItems='center'
			maxHeight='100%'
			maxWidth='fit-content'
			backgroundColor='brand.white'
			borderRadius='8px'
			borderWidth='1px'
			borderColor='brand.black'
			padding='8px'
			zIndex={100}
			{...styles}
		>
			<Input
				width='100%'
				height='100%'
				value={inputValue}
				onChange={(e) => {
					setSearchFilter((prev) => {
						return { value: e.target.value.trim() ?? '', col: prev.col };
					});
				}}
			/>
			<IconButton
				as={FaCircleCheck}
				aria-label='Save'
				size='16px'
				color='brand.5'
				_hover={{ color: 'brand.3', backgroundColor: 'transparent' }}
				backgroundColor='transparent'
				onClick={() => {
					setIsShowing(false);
				}}
				marginLeft='8px'
			/>
			<IconButton
				as={FaTrash}
				aria-label='Save'
				size='16px'
				color='brand.5'
				_hover={{ color: 'brand.3', backgroundColor: 'transparent' }}
				backgroundColor='transparent'
				onClick={() => {
					setSearchFilter({ value: '' });
					setIsShowing(false);
				}}
				marginLeft='8px'
			/>
		</Flex>
	);
};

export default SearchFilterModal;
