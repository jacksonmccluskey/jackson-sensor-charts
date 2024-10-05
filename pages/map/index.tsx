import { Button, Flex, Text } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import { useDataContext } from '../../context/data/data.context';

const GoogleMaps = dynamic(() => import('./google-maps'), {
	ssr: false,
});

export const Map = () => {
	const { showMapModal, setShowMapModal } = useDataContext();

	return (
		<Flex flexDirection='column' height='100vh' width='100w'>
			<GoogleMaps />
			{showMapModal ? (
				<Flex
					position='relative'
					translateY={128}
					backgroundColor='brand.white'
					width='100%'
					height='256px'
					justifyContent='center'
					alignItems='center'
				>
					<Button
						onClick={() => setShowMapModal(false)}
						backgroundColor='transparent'
						_hover={{
							backgroundColor: 'transparent',
						}}
					>
						<Text color='brand.black'>X</Text>
					</Button>
				</Flex>
			) : null}
		</Flex>
	);
};

export default Map;
