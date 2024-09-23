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
import Earth from './earth';
import Map from './map';
import { getCustomerAPIURL } from '../api/customer.api';
import DataTable from '../components/tables/raw-data.table';
import { useDataContext } from '../context/data.context';
import { useAuthContext } from '../context/auth.context';

const devices1 = [
	{
		deviceName: 'Device A',
		sensorData: [5, 10, 20, 40, 80],
		timestamps: [
			'2024-02-01T10:00:00',
			'2024-02-02T11:00:00',
			'2024-02-03T12:00:00',
			'2024-02-04T13:00:00',
			'2024-02-05T14:00:00',
		],
	},
	{
		deviceName: 'Device B',
		sensorData: [10, 20, 40, 80, 160],
		timestamps: [
			'2024-02-01T10:00:00',
			'2024-02-02T11:00:00',
			'2024-02-03T12:00:00',
			'2024-02-04T13:00:00',
			'2024-02-05T14:00:00',
		],
	},
];

const devices2 = [
	{
		deviceName: 'Device A',
		sensorData: [100, 99, 97, 94, 90],
		timestamps: [
			'2024-02-01T10:00:00',
			'2024-02-01T11:00:00',
			'2024-02-01T12:00:00',
			'2024-02-01T13:00:00',
			'2024-02-01T14:00:00',
		],
	},
	{
		deviceName: 'Device B',
		sensorData: [100, 98, 92, 84, 58],
		timestamps: [
			'2024-02-01T10:00:00',
			'2024-02-01T11:00:00',
			'2024-02-01T12:00:00',
			'2024-02-01T13:00:00',
			'2024-02-01T14:00:00',
		],
	},
];

const devices3 = [
	{
		deviceName: 'Device A',
		sensorData: [100, 99, 97, 94, 90],
		timestamps: [
			'2024-02-01T10:00:00',
			'2024-02-01T11:00:00',
			'2024-02-01T12:00:00',
			'2024-02-01T13:00:00',
			'2024-02-01T14:00:00',
		],
	},
	{
		deviceName: 'Device B',
		sensorData: [100, 98, 92, 84, 58],
		timestamps: [
			'2024-02-01T10:00:00',
			'2024-02-01T11:00:00',
			'2024-02-01T12:00:00',
			'2024-02-01T13:00:00',
			'2024-02-01T14:00:00',
		],
	},
];

const startDate = '2024-02-01T10:00:00';
const endDate = '2024-02-05T15:00:00';

type Tab = 'CHART' | 'GLOBE' | 'MAP' | 'API';
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

	const { apiKey, orgId } = useAuthContext();
	const { timeRange, selectedDevices, sensorSets, selectedSensors } =
		useDataContext();

	const [currentTab, setCurrentTab] = useState<Tab | null>(null);
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
		backgroundColor: 'brand.white',
		_hover: { backgroundColor: 'brand.base' },
		borderRadius: 0,
		marginRight: '8px',
	};

	const unselectedButtonStyles = {
		backgroundColor: 'brand.5',
		borderWidth: '1px',
		borderColor: 'brand.black',
		borderRadius: 0,
		_hover: { backgroundColor: 'brand.3' },
		marginRight: '8px',
	};

	const visualizationParentRef = useRef(null);

	return (
		<Flex
			height={isMobile ? '100%' : '100vh'}
			width='100vw'
			flexDirection='column'
			backgroundColor='brand.2'
		>
			<Flex
				flex='1'
				flexDirection={isMobile ? 'column' : 'row'}
				height='calc(100vh - 64px)'
			>
				<Flex
					flex='1'
					flexDirection='column'
					height='100%'
					padding='16px'
					gap='16px'
					maxWidth='50%'
				>
					<Flex
						flex='1'
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
						flex='1'
						bg='white'
						borderRadius='8px'
						padding='16px'
						flexDirection='column'
						height='100%'
						overflow='auto'
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
						flex='1'
						bg='white'
						borderRadius='8px'
						padding='16px'
						flexDirection='column'
						height='100%'
						overflow='auto'
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
								{...(currentTab == 'GLOBE'
									? selectedButtonStyles
									: unselectedButtonStyles)}
								onClick={() => {
									setCurrentTab('GLOBE');
								}}
								key='globe'
							>
								<Text
									color={currentTab == 'GLOBE' ? 'brand.medium' : 'brand.white'}
								>
									Global Map
								</Text>
							</Button>
							<Button
								{...(currentTab == 'MAP'
									? selectedButtonStyles
									: unselectedButtonStyles)}
								onClick={() => {
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
						{/* <Box height='1px' width='100%' backgroundColor='brand.black' /> */}
					</Flex>
					{currentTab == 'CHART' && [
						<LineChart
							startDate={startDate}
							endDate={endDate}
							devices={devices1}
							chartId={1}
							key={1}
						/>,
						<LineChart
							startDate={startDate}
							endDate={endDate}
							devices={devices2}
							chartId={2}
							key={2}
						/>,
						<LineChart
							startDate={startDate}
							endDate={endDate}
							devices={devices3}
							chartId={3}
							key={3}
						/>,
					]}
					{currentTab == 'GLOBE' && (
						<Earth parentRef={visualizationParentRef} />
					)}
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
						<Button
							marginTop='32px'
							paddingTop='16px'
							paddingBottom='16px'
							borderRadius='0px'
							borderWidth='1px'
							borderColor='brand.black'
							backgroundColor='brand.5'
							_hover={{ backgroundColor: 'brand.3' }}
						>
							<Text
								fontSize='lg'
								color='brand.white'
								fontWeight='bold'
								key='data-preview-header'
							>
								Preview Data
							</Text>
						</Button>,
						<DataTable key='data-table' styles={{ marginTop: '32px' }} />,
					]}
				</Flex>
			</Flex>
		</Flex>
	);
}
