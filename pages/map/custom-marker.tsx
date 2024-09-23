// components/CustomMarker.tsx
import React from 'react';
import { OverlayView } from '@react-google-maps/api';
import { FaBullseye } from 'react-icons/fa6';
import { theme } from '../../theme';

interface CustomMarkerProps {
	position: google.maps.LatLngLiteral;
}

const CustomMarker: React.FC<CustomMarkerProps> = ({ position }) => {
	return (
		<OverlayView
			position={position}
			mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
		>
			<div style={{ fontSize: '24px', color: theme.colors.brand.black }}>
				<FaBullseye />
			</div>
		</OverlayView>
	);
};

export default CustomMarker;
