export const mockData = {
	type: 'FeatureCollection',
	name: 'drifter_paths',
	crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
	features: [
		{
			type: 'Feature',
			properties: {
				id: 'device-id-1',
				name: 'Drifter 1 [123456789012345]',
				color: '#FFF',
				feature_id: 'device-id-1',
				coordinates: [32, -117],
			},
			geometry: {
				type: 'MultiLineString',
				coordinates: [
					[
						[-117, 32],
						[-118, 33],
						[-120, 34],
						[-122, 35],
						[-124, 36],
						[-126, 37],
						[-127, 38],
						[-128, 39],
						[-128, 40],
						[-128, 41],
						[-128, 42],
						[-128, 43],
						[-129, 44],
						[-130, 45],
						[-131, 46],
						[-132, 47],
					],
				],
			},
		},
	],
};

export default mockData;
