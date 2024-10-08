import { Button, Flex, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useDataContext } from '../../context/data/data.context';
import { MapModal } from './modal.map';

const GoogleMaps = dynamic(() => import('./google.map'), {
	ssr: false,
});

export const Map = () => {
	const { showMapModal, setShowMapModal } = useDataContext();

	return (
		<Flex
			flexDirection='column'
			height='100vh'
			width='100%'
			position='relative'
		>
			<GoogleMaps />
			{showMapModal.isShowing && (
				<Flex
					position='absolute'
					top='0'
					left='0'
					backgroundColor='rgba(255, 255, 255, 0.75)'
					width='100%'
					height='360px'
					justifyContent='center'
					alignItems='center'
					zIndex={2}
				>
					<Button
						position='absolute'
						top='16px'
						right='16px'
						onClick={() => setShowMapModal({ isShowing: false })}
						backgroundColor='transparent'
						_hover={{
							backgroundColor: 'transparent',
						}}
						height='24px'
						width='24px'
						zIndex={3}
					>
						<Text color='brand.black'>X</Text>
					</Button>
					<MapModal />
				</Flex>
			)}
		</Flex>
	);
};

export default Map;
