import React from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { config } from '../../config';
import PoiMarkers from './poi-markers';

const mapContainerStyle = { width: '100vw', height: '100vh' };
const center = { lat: 32, lng: -70 };

const locations = [
	{ lat: 32.1, lng: -117.1 },
	{ lat: 32.2, lng: -117.2 },
	{ lat: 32.4, lng: -117.3 },
	{ lat: 32.6, lng: -117.4 },
	{ lat: 32.8, lng: -117.4 },
];

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
		>
			<PoiMarkers locations={locations} />
		</GoogleMap>
	);
};

export default GoogleMaps;
