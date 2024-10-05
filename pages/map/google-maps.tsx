import React, { useState } from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { config } from '../../config';
import { IDevice, useDataContext } from '../../context/data/data.context';
import buoyBase64 from '../../components/base64/buoy';
import { Image, Flex, Text, Button } from '@chakra-ui/react';

export const GoogleMaps = () => {
	const { locations, setShowMapModal } = useDataContext();
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: config.googleMapsAPIKey,
	});

	if (loadError) return <div>Error Loading Maps</div>;
	if (!isLoaded) return <div>Loading Maps</div>;

	const handleDeviceClick = (_device: IDevice) => {
		setShowMapModal(true);
	};

	const mapCenter = locations.length
		? { lat: locations[0].latitude, lng: locations[0].longitude }
		: { lat: 32, lng: -70 };

	return (
		<GoogleMap
			mapContainerStyle={{ width: '100%', height: '100%' }}
			zoom={3}
			center={mapCenter}
			options={{
				gestureHandling: 'greedy',
				disableDefaultUI: true,
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
									position={{ lat: location.latitude, lng: location.longitude }}
									mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
								>
									<Flex
										flexDirection='column'
										alignItems='center'
										justifyContent='center'
										minWidth='fit-content'
									>
										<Button
											onClick={() => handleDeviceClick(location.device)}
											aria-label={location.device.deviceName}
											backgroundColor='transparent'
											_hover={{
												backgroundColor: 'transparent',
											}}
										>
											<Image src={buoyBase64} width='32px' height='32px' />
										</Button>
										<Text
											fontSize='12px'
											color='brand.black'
											marginTop='4px'
											whiteSpace='nowrap'
										>
											{location.device.deviceName}
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

export default GoogleMaps;
