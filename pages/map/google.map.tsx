import React from 'react';
import { GoogleMap, useLoadScript, OverlayView } from '@react-google-maps/api';
import { config } from '../../config';
import { IDevice, useDataContext } from '../../context/data/data.context';
import buoyBase64 from '../../components/base64/buoy';
import { Image, Flex, Text, Button } from '@chakra-ui/react';

export const GoogleMaps = () => {
	const { locations, setShowMapModal, showMapModal } = useDataContext();
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: config.googleMapsAPIKey,
	});

	if (loadError) return <div>Error Loading Maps</div>;
	if (!isLoaded) return <div>Loading Maps</div>;

	const handleDeviceClick = (device: IDevice) => {
		setShowMapModal({ isShowing: true, device });
	};

	const mapCenter = locations.length
		? {
				lat: locations[0].location.latitude,
				lng: locations[0].location.longitude,
		  }
		: { lat: 32, lng: -70 };

	return (
		<GoogleMap
			mapContainerStyle={{ width: '100%', height: '100%' }}
			zoom={3}
			center={mapCenter}
			options={{
				gestureHandling: 'greedy',
				disableDefaultUI: true,
				tilt: 45,
				mapId: config.googleMapsAPIKey,
				fullscreenControl: true,
				mapTypeControl: true,
			}}
		>
			{locations.length
				? locations.map((location, index) => {
						if (
							location.location.latitude !== undefined &&
							location.location.longitude !== undefined
						) {
							return (
								<OverlayView
									key={index}
									position={{
										lat: location.location.latitude,
										lng: location.location.longitude,
									}}
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
