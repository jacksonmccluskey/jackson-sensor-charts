// pages/index.js
import { Box, Flex } from '@chakra-ui/react';
import Header from '../components/sections/header';
import TimePicker from '../components/pickers/time-picker';
import DeviceTable from '../components/tables/device.table';
import SensorTable from '../components/tables/sensor.table';
import LineChart from '../components/charts/line.chart';

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

export default function Home() {
	const isMobile = false;

	return (
		<Flex
			height={isMobile ? '100%' : '100vh'}
			width='100vw'
			flexDirection='column'
			backgroundColor='brand.2'
		>
			<Box width='100%' height='64px' position='fixed' zIndex='1000'>
				<Header
					dynamicTitle='My Organization'
					userName='Jackson McCluskey'
					isMobile={isMobile}
				/>
			</Box>
			<Flex
				mt='64px'
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
				>
					<Flex flex='1' bg='white' borderRadius='8px' padding='16px'>
						<TimePicker />
					</Flex>
					<Flex flex='1' bg='white' borderRadius='8px' padding='16px'>
						<DeviceTable />
					</Flex>
					<Flex
						flex='1'
						bg='white'
						borderRadius='8px'
						padding='16px'
						flexDirection='column'
						overflow='auto'
					>
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
				>
					<LineChart
						startDate={startDate}
						endDate={endDate}
						devices={devices1}
						chartId={1}
					/>
					<LineChart
						startDate={startDate}
						endDate={endDate}
						devices={devices2}
						chartId={2}
					/>
					<LineChart
						startDate={startDate}
						endDate={endDate}
						devices={devices3}
						chartId={3}
					/>
				</Flex>
			</Flex>
		</Flex>
	);
}
