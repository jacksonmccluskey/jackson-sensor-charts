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
				lng: locations.length ? locations[0].longitude - 90 : -70,
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
								url: require('../../public/basic.svg'),
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
