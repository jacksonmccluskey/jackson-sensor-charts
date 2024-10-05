import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useRef,
} from 'react';
import { useAuthContext } from '../auth/auth.context';
import { fetchDevices } from '../../api/devices.api';
import { fetchSensors } from '../../api/sensors.api';
import { getLocations } from '../../api/location.api';
import { getData } from '../../api/data.api';

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

export interface ISensor {
	dataFieldId: number;
	dataFieldName: string;
	displayName: string;
}

export interface ISensors {
	deviceTypeId: number;
	sensors: ISensor[];
}

export interface ITransmission {
	time: Date;
	value: number;
}

export interface IDeviceData {
	deviceId: number;
	deviceName: string;
	transmissions: ITransmission[];
}

export interface ISensorData {
	sensorName: string;
	deviceDataSets: IDeviceData[];
}

interface IOrganization {
	orgId: number;
	organizationName: string;
}

export interface ILocation {
	device: IDevice;
	latitude: number;
	longitude: number;
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
	selectedSensors?: ISensor[];
	setSelectedSensors?: React.Dispatch<React.SetStateAction<ISensor[]>>;
	sensorDataSets?: ISensorData[];
	setSensorDataSets?: React.Dispatch<React.SetStateAction<ISensorData[]>>;
	locations?: ILocation[];
	setLocations?: React.Dispatch<React.SetStateAction<ILocation[]>>;
	showMapModal?: boolean;
	setShowMapModal?: React.Dispatch<React.SetStateAction<boolean>>;
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

	const [sensorSets, setSensorSets] = useState<ISensors[]>([]);

	const [selectedSensors, setSelectedSensors] = useState<ISensor[]>([]);

	const [sensorDataSets, setSensorDataSets] = useState<ISensorData[]>([]);

	const sensorsCacheRef = useRef({});

	const [locations, setLocations] = useState<ILocation[]>([]);

	const [showMapModal, setShowMapModal] = useState<boolean>(false);

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
						const deviceInQuestion = devices.find((device) => {
							return device.deviceTypeId == deviceTypeId;
						});

						if (!!deviceInQuestion && deviceInQuestion.deviceId !== undefined) {
							const deviceId = deviceInQuestion.deviceId;
							const sensors = await fetchSensors({ jwt, deviceId });
							sensorsCacheRef.current[deviceTypeId] = sensors;

							const updatedSensorSets = deviceTypeIds.map((deviceTypeId) => ({
								deviceTypeId,
								sensors: sensorsCacheRef.current[deviceTypeId],
							}));

							setSensorSets(updatedSensorSets);
						}
					})
				);
			}
		};

		updateSensorSets();

		const getLatestLocations = async () => {
			const selectedDeviceObjects = selectedDevices.map((selectedDevice) => {
				return devices.find((device) => device.commId == selectedDevice);
			});

			let deviceIndex = 0;

			for (const device of selectedDeviceObjects) {
				const latestLocation = await getLocations({
					deviceId: device.deviceId,
					timeRange,
					jwt,
				});

				if (
					latestLocation.latitude !== undefined &&
					latestLocation.longitude !== undefined
				) {
					const newLocation = {
						device,
						latitude: latestLocation.latitude,
						longitude: latestLocation.longitude,
					};

					setLocations((prevLocations) =>
						deviceIndex > 0 ? [...prevLocations, newLocation] : [newLocation]
					);

					deviceIndex++;
				}
			}
		};

		getLatestLocations();
	}, [selectedDevices]);

	useEffect(() => {
		const handleGetData = async () => {
			if (selectedSensors.length && selectedDevices.length) {
				const newSensorDataSets: ISensorData[] = [];
				for (const selectedSensor of selectedSensors) {
					const currentDeviceDataSets: IDeviceData[] = [];
					for (const selectedDevice of selectedDevices) {
						const device = devices.find(
							(device) => device.commId === selectedDevice
						);

						if (!device) {
							continue;
						}

						const deviceId = device.deviceId;

						try {
							const { data } = await getData({
								timeRange,
								deviceId,
								sensor: selectedSensor.dataFieldName,
								jwt,
							});

							if (data) {
								currentDeviceDataSets.push({
									deviceId: data.deviceId,
									deviceName: data.deviceName,
									transmissions: data.transmissions.map(
										(transmission: any) => ({
											time: transmission.time,
											value: transmission.value,
										})
									),
								});
							}
						} catch {}
					}

					newSensorDataSets.push({
						sensorName: selectedSensor.displayName,
						deviceDataSets: currentDeviceDataSets,
					});
				}

				setSensorDataSets(newSensorDataSets);
			} else {
				setSensorDataSets([]);
			}
		};

		handleGetData();
	}, [timeRange, selectedDevices, selectedSensors]);

	useEffect(() => {
		const allSensors = sensorSets.flatMap((sensorSet) => sensorSet.sensors);
		setSelectedSensors((prevSelectedSensors) =>
			prevSelectedSensors.filter((sensor) =>
				allSensors
					.map((currentSensor) => currentSensor.dataFieldId)
					.includes(sensor.dataFieldId)
			)
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
				sensorDataSets,
				setSensorDataSets,
				locations,
				setLocations,
				showMapModal,
				setShowMapModal,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export const useDataContext = () => useContext(DataContext);
