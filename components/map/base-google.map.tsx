import React from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { config } from '../../config';
import { Image, Flex, Text, Circle } from '@chakra-ui/react';

export const BaseGoogleMap = ({ locations }) => {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: config.googleMapsAPIKey,
	});

	if (loadError) return <div>Error Loading Maps</div>;
	if (!isLoaded) return <div>Loading Maps</div>;

	return (
		<GoogleMap
			mapContainerStyle={{ width: '100%', height: '100%' }}
			zoom={1}
			options={{
				center: { lat: 0, lng: 0 },
				gestureHandling: 'greedy',
				disableDefaultUI: true,
				tilt: 45,
				mapId: config.googleMapsAPIKey,
			}}
		>
			{locations.length
				? locations.map((location, index) => {
						if (
							location.latitude !== undefined &&
							location.longitude !== undefined
						) {
							return (
								<OverlayView
									key={index}
									position={{
										lat: location.latitude,
										lng: location.longitude,
									}}
									mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
								>
									<Flex
										position='relative'
										flexDirection='column'
										alignItems='center'
										justifyContent='center'
										minWidth='fit-content'
									>
										{location.iconFileName ? (
											<Image
												src={
													config.localIconPath +
													(location.iconFileName ?? 'buoy-icon.png')
												}
												width='24px'
												height='24px'
											/>
										) : (
											<Circle size='24px' backgroundColor='brand.white' />
										)}
										<Text
											fontSize='12px'
											color='brand.black'
											marginTop='4px'
											whiteSpace='nowrap'
										>
											{location.deviceName}
										</Text>
									</Flex>
								</OverlayView>
							);
						}
						return null;
				  })
				: null}
		</GoogleMap>
	);
};

export default BaseGoogleMap;
