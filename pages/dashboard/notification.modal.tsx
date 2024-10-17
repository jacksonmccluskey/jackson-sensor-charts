import { Flex, Text } from '@chakra-ui/react';

export const NotificationModal = ({ children, styles }) => {
	return (
		<Flex flexDirection='column' {...styles}>
			<Flex
				position='absolute'
				flex={0}
				top={0}
				left={0}
				backgroundColor='#444'
				width='100%'
				padding='16px'
			>
				<Text fontSize='small' fontWeight='bold' color='brand.white'>
					DEVICE NOTIFICATIONS
				</Text>
			</Flex>
			<Flex flexDirection='column' marginTop='64px' overflowY='auto'>
				{children}
			</Flex>
		</Flex>
	);
};

export default NotificationModal;
