import { Flex, Text } from '@chakra-ui/react';
import DeviceTable from '../../components/tables/device.table';
import { useDataContext } from '../../context/data/data.context';
import DashboardMap from './dashboard.map';
import NotificationModal from './notification.modal';

export default function Dashboard() {
	const { devices } = useDataContext();

	return (
		<Flex flexDirection='column' height='100vh'>
			<Flex position='relative' flex={1} width='100%' backgroundColor='#FFF'>
				<DashboardMap />
				<NotificationModal styles={dashboardStyles.notificationModal}>
					{devices.map((device, index) => {
						return device.active && device.batteryVoltage ? (
							<Text key={index}>
								{device.deviceName +
									' is at ' +
									device.batteryVoltage +
									' volts'}
							</Text>
						) : null;
					})}
				</NotificationModal>
			</Flex>
			<Flex flex={1} flexDirection='column' width='100%' overflow='hidden'>
				<DeviceTable isOnlyActive={true} />
			</Flex>
		</Flex>
	);
}

const dashboardStyles = {
	notificationModal: {
		position: 'absolute',
		top: 0,
		right: 0,
		height: '100%',
		width: '256px',
		backgroundColor: 'rgba(255,255,255,0.8)',
		zIndex: 10,
		padding: '16px',
		overflowY: 'auto',
	},
};
