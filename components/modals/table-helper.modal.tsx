import React from 'react';
import { Checkbox, Flex, Text } from '@chakra-ui/react';

export const TableHelperModal = ({ showHelperModal, styles = {} }) => {
	return showHelperModal ? (
		<Flex
			flexDirection='column'
			maxHeight='100%'
			maxWidth='fit-content'
			backgroundColor='brand.black'
			borderRadius='8px'
			padding='32px'
			{...styles}
		>
			<Flex flexDirection='row' minWidth='fit-content'>
				<Checkbox isChecked={true} borderColor='white' />
				<Text fontWeight='bold' color='brand.white' marginLeft='16px'>
					Click A Checkbox To Add That Row
				</Text>
			</Flex>
			<Flex flexDirection='row' justifyContent='center' alignItems='center'>
				<Text marginTop='16px' color='brand.white'>
					OR
				</Text>
			</Flex>
			<Flex
				flexDirection='row'
				justifyContent='center'
				alignItems='center'
				borderWidth='1px'
				borderColor='brand.white'
				padding='8px'
				marginTop='16px'
				minWidth='fit-content'
			>
				<Text fontWeight='bold' color='brand.white' maxWidth='fit-content'>
					Click The Row To Select Only One
				</Text>
			</Flex>
		</Flex>
	) : null;
};

export default TableHelperModal;
