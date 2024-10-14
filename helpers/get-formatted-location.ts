// Helper function to convert to Degrees Minutes
const convertToDM = (degrees: number) => {
	const absolute = Math.abs(degrees);
	const d = Math.floor(absolute);
	const m = (absolute - d) * 60;
	return {
		degrees: d,
		minutes: m,
		direction: degrees >= 0 ? (degrees > 0 ? 'N' : 'S') : 'S',
	};
};

const convertToDMS = (degrees: number) => {
	const absolute = Math.abs(degrees);
	const d = Math.floor(absolute);
	const m = Math.floor((absolute - d) * 60);
	const s = (absolute - d - m / 60) * 3600;
	return {
		degrees: d,
		minutes: m,
		seconds: s,
		direction: degrees >= 0 ? (degrees > 0 ? 'N' : 'S') : 'S',
	};
};

export type CoordinateFormat = 'D' | 'DM' | 'DMS';

export interface IGetFormattedLocation {
	coordinateFormat: CoordinateFormat;
	latitude: number;
	longitude: number;
}

export interface IFormattedLocation {
	formattedLatitude: number | string;
	formattedLongitude: number | string;
}

export const getFormattedLocation = ({
	coordinateFormat,
	latitude,
	longitude,
}: IGetFormattedLocation): IFormattedLocation => {
	if (latitude !== undefined && longitude !== undefined) {
		switch (coordinateFormat) {
			case 'D': {
				return {
					formattedLatitude: `${latitude.toFixed(6)}° ${
						latitude >= 0 ? 'N' : 'S'
					}`,
					formattedLongitude: `${latitude.toFixed(6)}° ${
						longitude >= 0 ? 'E' : 'W'
					}`,
				};
			}
			case 'DM': {
				const latitudeDM = convertToDM(latitude);
				const longitudeDM = convertToDM(latitude);
				return {
					formattedLatitude: `${
						latitudeDM.degrees
					}° ${latitudeDM.minutes.toFixed(3)}' ${latitudeDM.direction}`,
					formattedLongitude: `${
						longitudeDM.degrees
					}° ${longitudeDM.minutes.toFixed(3)}' ${longitudeDM.direction}`,
				};
			}
			case 'DMS': {
				const latitudeDMS = convertToDMS(latitude);
				const longitudeDMS = convertToDMS(longitude);
				return {
					formattedLatitude: `${latitudeDMS.degrees}° ${
						latitudeDMS.minutes
					}' ${latitudeDMS.seconds.toFixed(2)}" ${latitudeDMS.direction}`,
					formattedLongitude: `${longitudeDMS.degrees}° ${
						longitudeDMS.minutes
					}' ${longitudeDMS.seconds.toFixed(2)}" ${longitudeDMS.direction}`,
				};
			}
		}
	}
};
