'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import mockData from './mock-data';

const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

export const Earth = () => {
	const [cablePaths, setCablePaths] = useState([]);

	useEffect(() => {
		const currentCablePaths = [];

		mockData.features.forEach(({ geometry, properties }) => {
			geometry.coordinates.forEach((coords: any) =>
				currentCablePaths.push({ coords, properties })
			);
		});

		setCablePaths(currentCablePaths);
	}, []);

	return (
		<Globe
			globeImageUrl='//unpkg.com/three-globe/example/img/earth-dark.jpg'
			bumpImageUrl='//unpkg.com/three-globe/example/img/earth-topology.png'
			backgroundImageUrl='//unpkg.com/three-globe/example/img/night-sky.png'
			pathsData={cablePaths}
			pathPoints='coords'
			pathPointLat={(p) => p[1]}
			pathPointLng={(p) => p[0]}
			pathColor={(path: any) => path.properties.color}
			pathLabel={(path: any) => path.properties.name}
			pathDashLength={0.1}
			pathDashGap={0.008}
			pathDashAnimateTime={30000}
		/>
	);
};

export default Earth;
