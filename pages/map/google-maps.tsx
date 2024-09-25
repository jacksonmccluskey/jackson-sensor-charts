import React from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { config } from '../../config';

const mapContainerStyle = { width: '100vw', height: '100vh' };
const center = { lat: 32, lng: -70 };

export const GoogleMaps = () => {
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: config.googleMapsAPIKey,
	});

	if (loadError) return <div>Error Loading Maps</div>;
	if (!isLoaded) return <div>Loading Maps</div>;

	return (
		<GoogleMap
			mapContainerStyle={mapContainerStyle}
			zoom={3}
			center={center}
			options={{
				gestureHandling: 'greedy',
				disableDefaultUI: true,
			}}
		/>
	);
};

export default GoogleMaps;
