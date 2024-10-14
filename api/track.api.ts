import { config } from '../config';
import { IGoogleLocation } from '../context/data/data.context';
import { getFormattedDate } from '../helpers/get-formatted-date';

export interface IGetTrack {
	jwt?: string;
	deviceIdList: number | string;
	startDateTime: Date;
	endDateTime: Date;
}

export const getTrack = async ({
	jwt,
	deviceIdList,
	startDateTime,
	endDateTime,
}: IGetTrack): Promise<IGoogleLocation[]> => {
	try {
		const trackResponse = await fetch(
			config.internalAPIURL + config.trackEndpoint,
			{
				body: JSON.stringify({
					deviceIdList: deviceIdList + '',
					startDateTime: getFormattedDate(startDateTime),
					endDateTime: getFormattedDate(endDateTime),
				}),
				method: 'POST',
				headers: {
					Authorization: jwt ?? config.jwtTester,
					'Content-Type': 'application/json',
				},
			}
		);

		const trackResponseJSON = await trackResponse.json();

		const { data } = trackResponseJSON;

		if (data.length)
			return data.map((location) => {
				return {
					lat: location.latitude,
					lng: location.longitude,
				};
			});
	} catch {}
};
