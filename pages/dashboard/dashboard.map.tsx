import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useAuthContext } from '../../context/auth/auth.context';
import { IDevice, useDataContext } from '../../context/data/data.context';
import { getLocations } from '../../api/location.api';

const BaseGoogleMap = dynamic(
	() => import('../../components/map/base-google.map'),
	{
		ssr: false,
	}
);

export const DashboardMap = () => {
	const { jwt } = useAuthContext();
	const { devices, locations, setLocations } = useDataContext();

	const getLatestLocations = async () => {
		const activeDevices = devices.filter((device) => {
			return device.active;
		});

		const updatedDevices: IDevice[] = await getLocations({
			deviceIdList: activeDevices.map(
				(selectedDeviceObject) => selectedDeviceObject.deviceId + ''
			),
			timeRange: {
				startDate: null,
				endDate: new Date(),
			},
			jwt,
			devices: activeDevices,
		});

		setLocations(updatedDevices);
	};

	useEffect(() => {
		if (devices.length) {
			getLatestLocations();
		}
	}, [devices]);

	return <BaseGoogleMap locations={locations} />;
};

export default DashboardMap;
