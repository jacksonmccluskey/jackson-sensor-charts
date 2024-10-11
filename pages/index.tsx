// pages/index.js
import { useState, useRef, useEffect } from 'react';
import {
	Flex,
	Button,
	Text,
	Select,
	RadioGroup,
	Radio,
	Link,
	IconButton,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import TimePicker from '../components/pickers/time-picker';
import DeviceTable from '../components/tables/device.table';
import SensorTable from '../components/tables/sensor.table';
import LineChart from '../components/charts/line.chart';
import Map from './map';
import { getCustomerAPIURL } from '../api/customer.api';
import {
	IDeviceData,
	ISensorData,
	useDataContext,
} from '../context/data/data.context';
import { useAuthContext } from '../context/auth/auth.context';
import { getData } from '../api/data.api';

type Tab = 'CHART' | 'MAP' | 'API';
type FileFormatKey =
	| 'html'
	| 'csv'
	| 'excel'
	| 'xml'
	| 'json'
	| 'earth'
	| 'text';

type FileFormatValue =
	| 'HTML (.html)'
	| 'Comma Separated Values (.csv)'
	| 'Excel (.xlsx)'
	| 'XML (.xml)'
	| 'JSON (.json)'
	| 'Google Earth (.kml)'
	| 'Fixed Width (.txt)';

export const fileFormatKey: { [key in FileFormatValue]: FileFormatKey } = {
	'HTML (.html)': 'html',
	'Comma Separated Values (.csv)': 'csv',
	'Excel (.xlsx)': 'excel',
	'XML (.xml)': 'xml',
	'JSON (.json)': 'json',
	'Google Earth (.kml)': 'earth',
	'Fixed Width (.txt)': 'text',
};

export const fileFormatValue: { [key in FileFormatKey]: FileFormatValue } =
	Object.fromEntries(
		Object.entries(fileFormatKey).map(([value, key]) => [key, value])
	) as { [key in FileFormatKey]: FileFormatValue };

type APIResponseFormat = 'SCREEN' | 'DOWNLOAD';

const apiResponseFormatValues: { [key in APIResponseFormat]: string } = {
	SCREEN: 'View On Screen',
	DOWNLOAD: 'Download',
};

type CompressionValue = 'NONE' | 'ZIP';

const compressionValues: { [keys in CompressionValue]: string } = {
	NONE: 'None',
	ZIP: 'zip (.zip)',
};

export default function Home() {
	const isMobile = false;

	const { apiKey, orgId, jwt } = useAuthContext();
	const {
		timeRange,
		selectedDevices,
		sensorSets,
		selectedSensors,
		sensorDataSets,
		setSensorDataSets,
		devices,
	} = useDataContext();

	const [currentTab, setCurrentTab] = useState<Tab | null>('CHART');
	const [fileFormat, setFileFormat] = useState<FileFormatKey>('html');
	const [apiResponseFormat, setAPIResponseFormat] =
		useState<APIResponseFormat>('SCREEN');
	const [compressionValue, setCompressionValue] =
		useState<CompressionValue>('NONE');
	const [customerAPIURL, setCustomerAPIURL] = useState<string>(
		getCustomerAPIURL({
			fileFormat,
			timeRange,
			apiKey,
			selectedDevices,
			orgId,
			selectedSensors,
		})
	);

	useEffect(() => {
		setCustomerAPIURL(
			getCustomerAPIURL({
				fileFormat,
				timeRange,
				apiKey,
				selectedDevices,
				orgId,
				selectedSensors,
			})
		);
	}, [
		fileFormat,
		timeRange,
		apiKey,
		selectedDevices,
		orgId,
		sensorSets,
		selectedSensors,
	]);

	const selectedButtonStyles = {
		flex: 1,
		backgroundColor: 'brand.white',
		_hover: { backgroundColor: 'brand.base' },
		borderRadius: 0,
		borderTopLeftRadius: '8px',
		borderTopRightRadius: '8px',
		borderBottomWidth: '2px',
		borderColor: 'brand.black',
		minWidth: '128px',
	};

	const unselectedButtonStyles = {
		flex: 1,
		backgroundColor: 'brand.5',
		borderWidth: '1px',
		borderColor: 'brand.black',
		borderRadius: 0,
		_hover: { backgroundColor: 'brand.3' },
		borderTopLeftRadius: '8px',
		borderTopRightRadius: '8px',
		borderBottomWidth: '2px',
		minWidth: '128px',
	};

	const visualizationParentRef = useRef(null);

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
								transmissions: data.transmissions.map((transmission: any) => ({
									time: transmission.time,
									value: transmission.value,
								})),
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
		}
	};

	return (
		<Flex
			height={isMobile ? '100%' : '100vh'}
			width='100vw'
			flexDirection='column'
			backgroundColor='brand.2'
		>
			<Flex
				flex={1}
				flexDirection={isMobile ? 'column' : 'row'}
				height='calc(100vh - 64px)'
			>
				<Flex
					flex={1}
					flexDirection='column'
					height='100%'
					padding='16px'
					gap='16px'
					maxWidth='50%'
				>
					<Flex
						flex={1}
						bg='white'
						borderRadius='8px'
						padding='16px'
						flexDirection='column'
					>
						<Text
							fontSize='lg'
							fontWeight='bold'
							color='brand.black'
							minWidth='200px'
						>
							Step 1: Enter Time Range
						</Text>
						<TimePicker />
					</Flex>
					<Flex
						flex={1}
						bg='white'
						borderRadius='8px'
						padding='16px'
						flexDirection='column'
						overflow='hidden'
					>
						<Text
							fontSize='lg'
							fontWeight='bold'
							color='brand.black'
							minWidth='200px'
							marginBottom='16px'
						>
							Step 2: Select Devices
						</Text>
						<DeviceTable />
					</Flex>
					<Flex
						flex={1}
						bg='white'
						borderRadius='8px'
						padding='16px'
						flexDirection='column'
						overflow='hidden'
					>
						<Text
							fontSize='lg'
							fontWeight='bold'
							color='brand.black'
							minWidth='200px'
							marginBottom='16px'
						>
							Step 3: Select Sensors
						</Text>
						{!selectedDevices.length ? (
							<Text color='brand.black' fontStyle='italic'>
								No devices selected
							</Text>
						) : null}
						<SensorTable />
					</Flex>
				</Flex>
				<Flex
					flexDirection='column'
					flex='2'
					bg='white'
					borderRadius='8px'
					padding='16px'
					margin='16px'
					marginLeft={isMobile ? undefined : '0px'}
					overflowY='auto'
					ref={visualizationParentRef}
				>
					<Flex flexDirection='column' marginBottom='32px'>
						<Flex flexDirection='row' flexWrap='wrap'>
							<Button
								{...(currentTab == 'CHART'
									? selectedButtonStyles
									: unselectedButtonStyles)}
								onClick={() => {
									setCurrentTab('CHART');
									handleGetData();
								}}
								key='chart'
							>
								<Text
									color={currentTab == 'CHART' ? 'brand.medium' : 'brand.white'}
								>
									Plot Chart
								</Text>
							</Button>
							<Button
								{...(currentTab == 'MAP'
									? selectedButtonStyles
									: unselectedButtonStyles)}
								onClick={async () => {
									setCurrentTab('MAP');
								}}
								key='map'
							>
								<Text
									color={currentTab == 'MAP' ? 'brand.medium' : 'brand.white'}
								>
									Mercator Map
								</Text>
							</Button>
							<Button
								{...(currentTab == 'API'
									? selectedButtonStyles
									: unselectedButtonStyles)}
								onClick={() => {
									setCurrentTab('API');
								}}
								key='api'
							>
								<Text
									color={currentTab == 'API' ? 'brand.medium' : 'brand.white'}
								>
									Data Download
								</Text>
							</Button>
						</Flex>
					</Flex>
					{currentTab == 'CHART' &&
						selectedSensors.map((selectedSensor, index) => {
							return (
								<LineChart
									startDate={timeRange.startDate}
									endDate={timeRange.endDate}
									dataSets={
										sensorDataSets.length
											? sensorDataSets.find(
													(sensorDataSet) =>
														sensorDataSet.sensorName ==
														selectedSensor.displayName
											  )?.deviceDataSets
											: []
									}
									sensorName={selectedSensor.displayName}
									chartId={index}
									key={index}
								/>
							);
						})}
					{currentTab == 'MAP' && <Map />}
					{currentTab == 'API' && [
						<Select
							value={fileFormat}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
								setFileFormat(e.target.value as FileFormatKey)
							}
							color='brand.black'
							borderWidth='1px'
							borderColor='brand.black'
							width='fit-content'
							backgroundColor='brand.white'
							key='file-format'
						>
							{Object.keys(fileFormatValue).map((key) => (
								<option key={key} value={key} color='brand.black'>
									{fileFormatValue[key as FileFormatKey]}
								</option>
							))}
						</Select>,
						<RadioGroup
							onChange={(value: APIResponseFormat) =>
								setAPIResponseFormat(value)
							}
							value={apiResponseFormat}
							flexDirection='row'
							minWidth='100%'
							marginTop='16px'
							key='api-response-format'
						>
							{Object.keys(apiResponseFormatValues).map((key) => (
								<Radio
									value={key}
									borderWidth='2px'
									borderColor='brand.black'
									marginRight='16px'
									marginTop='16px'
									key={key}
								>
									<Text fontSize='md' color='brand.black'>
										{apiResponseFormatValues[key]}
									</Text>
								</Radio>
							))}
						</RadioGroup>,
						apiResponseFormat == 'DOWNLOAD' && (
							<Select
								value={compressionValue}
								onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
									setCompressionValue(e.target.value as CompressionValue)
								}
								color='brand.black'
								borderWidth='1px'
								borderColor='brand.black'
								width='fit-content'
								backgroundColor='brand.white'
								marginTop='32px'
								key='compression-value'
							>
								{Object.keys(compressionValues).map((key) => (
									<option key={key} value={key} color='brand.black'>
										{compressionValues[key as CompressionValue]}
									</option>
								))}
							</Select>
						),
						<Flex
							flexDirection='row'
							justifyContent='flex-start'
							alignItems='center'
							marginTop='32px'
							maxWidth='100%'
							key='api-url'
						>
							<IconButton
								backgroundColor='brand.black'
								_hover={{ backgroundColor: 'brand.5' }}
								icon={<CopyIcon color='brand.white' />}
								aria-label='Copy API URL'
								onClick={() => navigator.clipboard.writeText(customerAPIURL)}
								size='sm'
								borderRadius={2}
							/>
							<Link
								href={customerAPIURL}
								justifyContent='center'
								alignItems='center'
								marginLeft='16px'
							>
								<Text wordBreak='break-all' color='brand.black'>
									{customerAPIURL}
								</Text>
							</Link>
						</Flex>,
						<Text color='brand.black' marginTop='32px' key='instructions-text'>
							This URL can be used to pull data into MatLab or other software or
							to easily view your data online.
						</Text>,
					]}
				</Flex>
			</Flex>
		</Flex>
	);
}
