import React, { useEffect, useState } from 'react';
import { Checkbox, Flex, Text } from '@chakra-ui/react';
import { BsFillHandIndexThumbFill } from 'react-icons/bs';

export const TableHelperModal = ({ showHelperModal, styles = {} }) => {
	const [isFirstCheckboxClicked, setIsFirstCheckboxClicked] = useState(false);
	const [isSecondCheckboxClicked, setIsSecondCheckboxClicked] = useState(false);
	const [isFirstRowClicked, setIsFirstRowClicked] = useState(true);

	useEffect(() => {
		setTimeout(() => {
			setIsFirstRowClicked(!isFirstRowClicked);
			if (!isFirstRowClicked) {
				setIsFirstCheckboxClicked(false);
				setIsSecondCheckboxClicked(false);
			} else {
				setIsFirstCheckboxClicked(true);
				setTimeout(() => {
					setIsSecondCheckboxClicked(true);
				}, 500);
			}
		}, 1500);
	}, [isFirstRowClicked]);

	return showHelperModal ? (
		<Flex
			flexDirection='column'
			maxHeight='100%'
			maxWidth='fit-content'
			backgroundColor='brand.white'
			borderRadius='8px'
			borderWidth='4px'
			borderColor='brand.black'
			padding='16px'
			zIndex={100}
			{...styles}
		>
			<Flex
				flexDirection='row'
				backgroundColor={isFirstRowClicked ? 'brand.base' : 'brand.white'}
				paddingLeft='16px'
				paddingRight='16px'
				paddingTop='8px'
				paddingBottom='8px'
				marginTop='16px'
				borderTopWidth='1px'
				borderBottomWidth='1px'
				borderColor='brand.2'
			>
				{/* <Checkbox borderColor='brand.black' isChecked={isFirstRowClicked} /> */}
				<Flex
					flexDirection='row'
					justifyContent='center'
					alignItems='center'
					minWidth='fit-content'
					marginLeft='16px'
					width='100%'
				>
					<Text fontWeight='bold' color='brand.black' maxWidth='fit-content'>
						Select Only 1 Row With A Click →
					</Text>
					<BsFillHandIndexThumbFill
						style={{
							marginLeft: '8px',
						}}
					/>
				</Flex>
			</Flex>
			<Flex
				marginLeft='16px'
				marginRight='16px'
				flexDirection='row'
				justifyContent='center'
				alignItems='center'
			>
				<Text marginTop='16px' color='brand.black' fontWeight='bold'>
					or
				</Text>
			</Flex>
			<Flex
				flexDirection='row'
				minWidth='fit-content'
				justifyContent='flex-start'
				alignItems='center'
				margin='16px'
			>
				<Flex flexDirection='column'>
					<Checkbox
						isChecked={isFirstCheckboxClicked}
						borderColor='brand.black'
					/>
					<Checkbox
						isChecked={isSecondCheckboxClicked}
						borderColor='brand.black'
						marginTop='16px'
					/>
				</Flex>
				<Text fontWeight='bold' color='brand.black' marginLeft='16px'>
					{`Select Multiple Rows With Checkboxes`}
				</Text>
			</Flex>
		</Flex>
	) : null;
};

export default TableHelperModal;
