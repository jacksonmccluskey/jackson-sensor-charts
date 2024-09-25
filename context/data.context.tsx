import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useRef,
} from 'react';
import { useAuthContext } from './auth.context';
import { fetchDevices } from '../api/devices.api';
import { fetchSensors } from '../api/sensors.api';

export interface ITimeRange {
	startDate: Date | null;
	endDate: Date | null;
}

export interface IDevice {
	id: string;
	deviceId: string | number;
	deviceTypeId: number;
	commId: string;
	deviceName: string;
	lastTransmitDate: string;
	lastTransmitAgo: string;
	status: string;
	deployed: boolean;
	active: boolean;
}

export interface ISensors {
	deviceTypeId: number;
	sensors: string[];
}

interface ITransmission {
	deviceDateTime: Date;
	[key: string]: number | Date;
}

interface IDeviceData {
	deviceId: number;
	deviceName: string;
	deviceTypeId: number;
	deviceDataOverTime: ITransmission[];
}

interface IRawDeviceData {
	DataId: number;
	CommId: string | number;
	DeviceName: string;
	DeviceDateTime: Date | string;
	[key: string]: string | number | Date | boolean;
}

interface IOrganization {
	orgId: number;
	organizationName: string;
}

interface IDataContext {
	organization?: IOrganization;
	setOrganization?: React.Dispatch<React.SetStateAction<IOrganization>>;
	timeRange?: ITimeRange;
	setTimeRange?: React.Dispatch<React.SetStateAction<ITimeRange>>;
	devices?: IDevice[];
	setDevices?: React.Dispatch<React.SetStateAction<IDevice[]>>;
	selectedDevices?: string[];
	setSelectedDevices?: React.Dispatch<React.SetStateAction<string[]>>;
	sensorSets?: ISensors[];
	setSensorSets?: React.Dispatch<React.SetStateAction<ISensors[]>>;
	selectedSensors?: string[];
	setSelectedSensors?: React.Dispatch<React.SetStateAction<string[]>>;
	deviceDataSets?: IDeviceData[];
	setDeviceDataSets?: React.Dispatch<React.SetStateAction<IDeviceData[]>>;
	rawDeviceData?: IRawDeviceData[];
	setRawDeviceData?: React.Dispatch<React.SetStateAction<IRawDeviceData[]>>;
}

const DataContext = createContext<IDataContext>({});

const currentDate = new Date();

export const DataProvider = ({ children }) => {
	const { jwt, orgId } = useAuthContext();

	const [timeRange, setTimeRange] = useState<ITimeRange>({
		startDate: new Date(currentDate.getTime() - 3600000 * 24 * 30.5),
		endDate: currentDate,
	});

	const [devices, setDevices] = useState<IDevice[]>([]);

	const [selectedDevices, setSelectedDevices] = useState<string[]>([]);

	const [sensorSets, setSensorSets] = useState([]);

	const [selectedSensors, setSelectedSensors] = useState([]);

	const sensorsCacheRef = useRef({});

	const [deviceDataSets, setDeviceDataSets] = useState<IDeviceData[]>([]);

	const [rawDeviceData, setRawDeviceData] = useState<IRawDeviceData[]>(
		Array.from({ length: 1 }).map((_element, index) => {
			return {
				DataId: index,
				CommId: 'Select Devices',
				DeviceName: `Select Devices`,
				DeviceDateTime: new Date().toISOString(),
			};
		})
	);

	useEffect(() => {
		const fetchDeviceData = async () => {
			if (jwt && orgId) {
				const fetchedDevices = await fetchDevices({ jwt, orgId });

				setDevices(fetchedDevices);
			}
		};

		fetchDeviceData();
	}, [jwt, orgId]);

	useEffect(() => {
		const updateSensorSets = async () => {
			const selectedDevicesDetails = devices.filter((device) =>
				selectedDevices.includes(device.commId)
			);

			const deviceTypeIdsSet = new Set(
				selectedDevicesDetails.map((device) => device.deviceTypeId)
			);

			const deviceTypeIds = Array.from(deviceTypeIdsSet);

			const deviceTypeIdsToFetch = deviceTypeIds.filter(
				(deviceTypeId) => !(deviceTypeId in sensorsCacheRef.current)
			);

			if (deviceTypeIdsToFetch.length > 0) {
				await Promise.all(
					deviceTypeIdsToFetch.map(async (deviceTypeId) => {
						const deviceId = devices.find((device) => {
							device.deviceTypeId == deviceTypeId;
						});
						const sensors = await fetchSensors({ jwt, deviceId }); // TODO: Change To deviceTypeId
						sensorsCacheRef.current[deviceTypeId] = sensors;
					})
				);
			}

			const updatedSensorSets = deviceTypeIds.map((deviceTypeId) => ({
				deviceTypeId,
				sensors: sensorsCacheRef.current[deviceTypeId],
			}));

			setSensorSets(updatedSensorSets);
		};

		updateSensorSets();
	}, [selectedDevices]);

	useEffect(() => {
		const allSensors = sensorSets.flatMap((sensorSet) => sensorSet.sensors);
		setSelectedSensors((prevSelectedSensors) =>
			prevSelectedSensors.filter((sensor) => allSensors.includes(sensor))
		);
	}, [sensorSets]);

	return (
		<DataContext.Provider
			value={{
				timeRange,
				setTimeRange,
				devices,
				setDevices,
				selectedDevices,
				setSelectedDevices,
				sensorSets,
				setSensorSets,
				selectedSensors,
				setSelectedSensors,
				deviceDataSets,
				setDeviceDataSets,
				rawDeviceData,
				setRawDeviceData,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export const useDataContext = () => useContext(DataContext);
