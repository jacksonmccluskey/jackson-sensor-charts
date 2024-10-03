import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { config } from '../../config';
import { useDataContext } from '../../context/data/data.context';

const mapContainerStyle = { width: '100vw', height: '100vh' };

export const GoogleMaps = () => {
	const { locations } = useDataContext();
	const { isLoaded, loadError } = useLoadScript({
		googleMapsApiKey: config.googleMapsAPIKey,
	});

	if (loadError) return <div>Error Loading Maps</div>;
	if (!isLoaded) return <div>Loading Maps</div>;

	return (
		<GoogleMap
			mapContainerStyle={mapContainerStyle}
			zoom={3}
			center={{
				lat: locations.length ? locations[0].latitude : 32,
				lng: locations.length ? locations[0].longitude : -70,
			}}
			options={{
				gestureHandling: 'greedy',
				disableDefaultUI: true,
			}}
		>
			{locations.length
				? locations.map((location, index) => (
						<Marker
							key={index}
							position={{ lat: location.latitude, lng: location.longitude }}
							icon={{
								path: 'M9 2a1 1 0 0 1 1 1v1h4V3a1 1 0 1 1 2 0v1h1a3 3 0 0 1 3 3v1h1a1 1 0 1 1 0 2h-1v4h1a1 1 0 1 1 0 2h-1v1a3 3 0 0 1-3 3h-1v1a1 1 0 1 1-2 0v-1h-4v1a1 1 0 1 1-2 0v-1H7a3 3 0 0 1-3-3v-1H3a1 1 0 1 1 0-2h1v-4H3a1 1 0 0 1 0-2h1V7a3 3 0 0 1 3-3h1V3a1 1 0 0 1 1-1zm2 8h2a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1z',
								fillColor: 'black',
								fillOpacity: 1,
								strokeWeight: 1,
								strokeColor: 'white',
								rotation: 45,
								scale: 2,
								anchor: new window.google.maps.Point(5, 5),
							}}
						/>
				  ))
				: null}
		</GoogleMap>
	);
};

export default GoogleMaps;
