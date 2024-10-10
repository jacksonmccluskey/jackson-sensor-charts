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

export interface ILocation {
	latitude: number;
	longitude: number;
}

export interface IGoogleLocation {
	lat: number;
	lng: number;
}

export interface IDevice {
	id: string;
	deviceId: string | number;
	deviceTypeId: number;
	deviceTypeName?: string;
	commId: string;
	deviceName: string;
	lastTransmitDate: string;
	lastTransmitAgo: string;
	status: string;
	deployed: boolean;
	active: boolean;
	batteryVoltage?: number;
	temperature?: number;
	latitude?: number;
	longitude?: number;
	gpsQuality?: number;
	track?: ILocation[];
	iconFileName?: string;
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

export interface IMapModal {
	isShowing: boolean;
	device?: IDevice;
	track?: IGoogleLocation[];
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
	showMapModal?: IMapModal;
	setShowMapModal?: React.Dispatch<React.SetStateAction<IMapModal>>;
	locations?: IDevice[];
	setLocations?: React.Dispatch<React.SetStateAction<IDevice[]>>;
	isDevicesLoading?: boolean;
	setIsDevicesLoading?: React.Dispatch<React.SetStateAction<boolean>>;
	isSensorsLoading?: boolean;
	setIsSensorsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
	isMapLoading?: boolean;
	setIsMapLoading?: React.Dispatch<React.SetStateAction<boolean>>;
	isChartsLoading?: boolean;
	setIsChartsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
	isTrackLoading?: boolean;
	setIsTrackLoading?: React.Dispatch<React.SetStateAction<boolean>>;
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

	const [showMapModal, setShowMapModal] = useState<IMapModal>({
		isShowing: false,
	});

	const [locations, setLocations] = useState<IDevice[]>([]);

	const [isDevicesLoading, setIsDevicesLoading] = useState<boolean>(false);
	const [isSensorsLoading, setIsSensorsLoading] = useState<boolean>(false);
	const [isMapLoading, setIsMapLoading] = useState<boolean>(false);
	const [isChartsLoading, setIsChartsLoading] = useState<boolean>(false);
	const [isTrackLoading, setIsTrackLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchDeviceData = async () => {
			if (jwt && orgId) {
				setIsDevicesLoading(true);
				const fetchedDevices = await fetchDevices({ jwt, orgId });
				setDevices(fetchedDevices);
			}
		};

		fetchDeviceData();
	}, [jwt, orgId]);

	useEffect(() => {
		if (devices.length) {
			setIsDevicesLoading(false);
		}
	}, [devices]);

	const getLatestLocations = async () => {
		if (selectedDevices.length) {
			setIsMapLoading(true);

			const selectedDeviceObjects = selectedDevices.map((selectedDevice) => {
				return devices.find((device) => device.commId == selectedDevice);
			});

			const updatedDevices: IDevice[] = await getLocations({
				deviceIdList: selectedDeviceObjects.map(
					(selectedDeviceObject) => selectedDeviceObject.deviceId + ''
				),
				timeRange,
				jwt,
				devices: selectedDeviceObjects,
			});

			setLocations(updatedDevices);
		} else {
			setLocations([]);
			setShowMapModal({ isShowing: false });
		}
	};

	useEffect(() => {
		const updateSensorSets = async () => {
			if (selectedDevices.length) {
				setIsSensorsLoading(true);

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

							if (
								!!deviceInQuestion &&
								deviceInQuestion.deviceId !== undefined
							) {
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

				const updatedSensorSets = deviceTypeIds.map((deviceTypeId) => ({
					deviceTypeId,
					sensors: sensorsCacheRef.current[deviceTypeId],
				}));

				setSensorSets(updatedSensorSets);
			} else {
				setSensorSets([]);
			}
		};

		updateSensorSets();
	}, [selectedDevices]);

	useEffect(() => {
		getLatestLocations();
	}, [selectedDevices, timeRange]);

	useEffect(() => {
		if (sensorSets.length) {
			setIsSensorsLoading(false);
		}
	}, [sensorSets]);

	useEffect(() => {
		if (locations.length) {
			setIsMapLoading(false);
		}
	}, [locations]);

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

	useEffect(() => {
		const handleGetData = async () => {
			if (selectedSensors.length) {
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
								setIsChartsLoading(true);
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
			}
		};

		handleGetData();
	}, [timeRange, selectedDevices, selectedSensors]);

	useEffect(() => {
		if (sensorDataSets.length >= selectedSensors.length) {
			setIsChartsLoading(false);
		}
	}, [sensorDataSets]);

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
				isDevicesLoading,
				setIsDevicesLoading,
				isSensorsLoading,
				setIsSensorsLoading,
				isMapLoading,
				setIsMapLoading,
				isChartsLoading,
				setIsChartsLoading,
				isTrackLoading,
				setIsTrackLoading,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export const useDataContext = () => useContext(DataContext);
