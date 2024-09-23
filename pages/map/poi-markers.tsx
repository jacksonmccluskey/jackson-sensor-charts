import React from 'react';
import CustomMarker from './custom-marker';

interface Location {
	lat: number;
	lng: number;
}

interface PoiMarkersProps {
	locations: Location[];
}

const PoiMarkers: React.FC<PoiMarkersProps> = ({ locations }) => {
	return (
		<>
			{locations.map((location, index) => (
				<CustomMarker key={index} position={location} />
			))}
		</>
	);
};

export default PoiMarkers;
