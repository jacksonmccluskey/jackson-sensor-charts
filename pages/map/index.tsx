import dynamic from 'next/dynamic';

const GoogleMaps = dynamic(() => import('./google-maps'), {
	ssr: false,
});

export const Map = () => {
	return <GoogleMaps />;
};

export default Map;
