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
// import buoyBase64 from '../../components/base64/buoy';
import { Image, Flex, Text, Button, Circle } from '@chakra-ui/react';
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

	const [mapCenter, setMapCenter] = useState<IGoogleLocation>(
		locations[0] && locations[0].latitude && locations[0].longitude
			? {
					lat: locations[0].latitude,
					lng: locations[0].longitude,
			  }
			: { lat: 0, lng: 0 }
	);

	const getMapCenter = () => {
		setMapCenter((prev) =>
			(showMapModal?.device?.latitude && showMapModal?.device?.longitude) ||
			locations.length
				? {
						lat: showMapModal?.device?.latitude ?? locations[0].latitude ?? 0,
						lng: showMapModal?.device?.longitude ?? locations[0].longitude ?? 0,
				  }
				: prev
		);
	};

	useEffect(() => {}, []);

	useEffect(() => {
		if (
			(showMapModal?.device?.latitude && showMapModal?.device?.longitude) ||
			locations.length
		) {
			setMapCenter({
				lat: showMapModal?.device?.latitude ?? locations[0].latitude ?? 0,
				lng: showMapModal?.device?.longitude ?? locations[0].longitude ?? 0,
			});
		}
	}, [showMapModal, locations]);

	useEffect(() => {
		const getInitialTrack = async () => {
			try {
				if (selectedDevices.length) {
					const track = await getTrack({
						jwt,
						deviceIdList:
							devices.find(
								(device) =>
									device.commId == selectedDevices[selectedDevices.length - 1]
							).deviceId + '',
						startDateTime: timeRange.startDate.toISOString(),
						endDateTime: timeRange.endDate.toISOString(),
					});
					setPolylinePath(track);
				} else {
					setPolylinePath([]);
				}
			} catch {
				setPolylinePath([]);
			}
		};

		getInitialTrack();
	}, [selectedDevices, timeRange, locations]);

	if (loadError) return <div>Error Loading Maps</div>;
	if (!isLoaded) return <div>Loading Maps</div>;

	const handleDeviceClick = async (device: IDevice) => {
		getMapCenter();

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
