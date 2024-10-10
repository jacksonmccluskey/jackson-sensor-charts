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
import buoyBase64 from '../../components/base64/buoy';
import { Image, Flex, Text, Button } from '@chakra-ui/react';
import { getTrack } from '../../api/track.api';
import { getFormattedDate } from '../../helpers/get-formatted-date';
import { useAuthContext } from '../../context/auth/auth.context';

export const GoogleMaps = () => {
	const { jwt } = useAuthContext();
	const {
		locations,
		setShowMapModal,
		timeRange,
		selectedDevices,
		devices,
		isMapLoading,
		isTrackLoading,
		setIsTrackLoading,
		showMapModal,
	} = useDataContext();
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: config.googleMapsAPIKey,
	});
	const [polylinePath, setPolylinePath] = useState<IGoogleLocation[]>([]);

	const [mapCenter, setMapCenter] = useState<IGoogleLocation>({
		lat: 0,
		lng: 0,
	});

	const getMapCenter = () => {
		setMapCenter((prev) =>
			(showMapModal?.device?.latitude && showMapModal?.device?.longitude) ||
			locations.length
				? {
						lat: showMapModal?.device?.latitude ?? locations[0].latitude ?? 0,
						lng: showMapModal?.device?.latitude ?? locations[0].longitude ?? 0,
				  }
				: prev
		);
	};

	useEffect(() => {
		const getInitialTrack = async () => {
			if (selectedDevices.length) {
				setIsTrackLoading(true);

				const track = await getTrack({
					jwt,
					deviceIdList:
						devices.find(
							(device) =>
								device.commId == selectedDevices[selectedDevices.length - 1]
						).deviceId + '',
					startDateTime: getFormattedDate(timeRange.startDate),
					endDateTime: getFormattedDate(timeRange.endDate),
				});
				setPolylinePath(track);
			} else {
				setPolylinePath([]);
			}
		};

		getInitialTrack();
	}, [selectedDevices, timeRange]);

	useEffect(() => {
		if (polylinePath.length) {
			setIsTrackLoading(false);
		}
	}, [polylinePath]);

	if (loadError) return <div>Error Loading Maps</div>;
	if (!isLoaded) return <div>Loading Maps</div>;

	const handleDeviceClick = async (device: IDevice) => {
		if (!isMapLoading && !isTrackLoading) {
			getMapCenter();
			setIsTrackLoading(true);

			const track = await getTrack({
				jwt,
				deviceIdList: device.deviceId,
				startDateTime: getFormattedDate(timeRange.startDate),
				endDateTime: getFormattedDate(timeRange.endDate),
			});
			setShowMapModal({
				isShowing: true,
				device,
			});
			setPolylinePath(track);
		} else {
			setShowMapModal({ isShowing: false });
			setPolylinePath([]);
		}
	};

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
			{polylinePath?.length > 1 && (
				<Polyline
					path={polylinePath}
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
												if (!isMapLoading) handleDeviceClick(location);
											}}
											aria-label={location.deviceName}
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
