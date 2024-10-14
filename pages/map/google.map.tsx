import React, { useEffect, useState } from 'react';
import {
	GoogleMap,
	useLoadScript,
	OverlayView,
	Polyline,
} from '@react-google-maps/api';
import { config } from '../../config';
import {
	IDevice,
	IGoogleLocation,
	useDataContext,
} from '../../context/data/data.context';
import { Image, Flex, Text, Button, Circle } from '@chakra-ui/react';
import { getTrack } from '../../api/track.api';
import { useAuthContext } from '../../context/auth/auth.context';

export const GoogleMaps = () => {
	const { jwt } = useAuthContext();
	const {
		locations,
		setShowMapModal,
		timeRange,
		selectedDevices,
		devices,
		track,
		setTrack,
	} = useDataContext();
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: config.googleMapsAPIKey,
	});

	const [mapCenter, setMapCenter] = useState<IGoogleLocation>({
		lat: 0,
		lng: 0,
	});

	useEffect(() => {
		const getInitialTrack = async () => {
			try {
				if (selectedDevices.length) {
					const deviceSelected = devices.find(
						(device) =>
							device.commId == selectedDevices[selectedDevices.length - 1]
					);
					if (deviceSelected) {
						setShowMapModal({ isShowing: true, device: deviceSelected });
					}

					const track = await getTrack({
						jwt,
						deviceIdList: deviceSelected.deviceId,
						startDateTime: timeRange.startDate,
						endDateTime: timeRange.endDate,
					});
					setTrack(track);
				} else {
					setTrack([]);
				}
			} catch {
				setTrack([]);
			}
		};

		getInitialTrack();
	}, [selectedDevices, timeRange, locations]);

	if (loadError) return <div>Error Loading Maps</div>;
	if (!isLoaded) return <div>Loading Maps</div>;

	const handleDeviceClick = async (device: IDevice) => {
		const newTrack = await getTrack({
			jwt,
			deviceIdList: device.deviceId,
			startDateTime: timeRange.startDate,
			endDateTime: timeRange.endDate,
		});
		setTrack(newTrack);
		setShowMapModal({
			isShowing: true,
			device,
		});
	};

	return (
		<GoogleMap
			mapContainerStyle={{ width: '100%', height: '100%' }}
			center={mapCenter}
			zoom={1}
			options={{
				gestureHandling: 'greedy',
				disableDefaultUI: true,
				tilt: 45,
				mapId: config.googleMapsAPIKey,
				fullscreenControl: true,
				mapTypeControl: true,
			}}
		>
			{track?.length > 1 && (
				<Polyline
					path={track}
					options={{
						geodesic: true,
						strokeColor: '#FF0000',
						strokeOpacity: 1.0,
						strokeWeight: 2,
					}}
				/>
			)}
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
										top='-24px'
										left='-32px'
									>
										<Button
											onClick={() => {
												handleDeviceClick(location);
											}}
											aria-label={location.deviceName}
											backgroundColor='transparent'
											_hover={{
												backgroundColor: 'transparent',
											}}
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
										</Button>
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

export default GoogleMaps;
