import { config } from '../config';
import { IDevice } from '../context/data/data.context';

const convertDateStringToTimeAgo = (dateString: string): string => {
	const date = new Date(dateString);
	const now = new Date();
	const diffInMs = now.getTime() - date.getTime();

	const millisecondsInHour = 3600000;
	const millisecondsInDay = 24 * millisecondsInHour;
	const millisecondsInMonth = 30.5 * millisecondsInDay;
	const millisecondsInYear = 365.25 * millisecondsInDay;

	const diffInHours = Math.floor(diffInMs / millisecondsInHour);

	if (diffInHours < 24) {
		return `${diffInHours} hour${diffInHours == 1 ? '' : 's'} ago`;
	}

	const diffInDays = Math.floor(diffInMs / millisecondsInDay);

	if (diffInDays < 30) {
		return `${diffInDays} day${diffInDays == 1 ? '' : 's'} ago`;
	}

	const diffInMonths = Math.floor(diffInMs / millisecondsInMonth);

	if (diffInMonths < 12) {
		return `${diffInMonths} month${diffInMonths == 1 ? '' : 's'} ago`;
	}

	const diffInYears = Math.floor(diffInMs / millisecondsInYear);

	return `${diffInYears} year${diffInYears == 1 ? '' : 's'} ago`;
};

export const fetchDevices = async ({
	jwt,
	orgId,
}: {
	jwt: string | null;
	orgId: number | null;
}): Promise<IDevice[]> => {
	if (!jwt || !orgId) {
		return [] as IDevice[];
	}

	try {
		const deviceResponse = await fetch(
			config.internalAPIURL + config.deviceEndpoint,
			{
				method: 'POST',
				headers: {
					Authorization: jwt ?? config.jwtTester,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					orgId,
					getCommands: false,
					getBillingPlans: false,
					getSensorPackages: false,
				}),
			}
		);

		const { data } = await deviceResponse.json();

		const devices: IDevice[] = Array.isArray(data)
			? data.map((device) => {
					return {
						id: device.comm1,
						deviceId: device.deviceId,
						deviceTypeId: device.deviceTypeId,
						commId: device.comm1,
						deviceName: device.deviceName,
						lastTransmitDate: device.lastTransmission,
						lastTransmitAgo: convertDateStringToTimeAgo(
							device.lastTransmission
						),
						status: device.activationStatus,
						deployed: device.deployed,
						active: device.active,
					};
			  })
			: ([] as IDevice[]);

		return devices;
	} catch {}

	return [];
};
