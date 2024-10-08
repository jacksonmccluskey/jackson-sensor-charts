import { Flex, Text, Image, RadioGroup, Stack, Radio } from '@chakra-ui/react';
import buoyBase64 from '../../components/base64/buoy';
import { useState } from 'react';
import BatteryGauge from 'react-battery-gauge';
import Gauge from '../../components/charts/gauge.chart';

export const MapModal = () => {
	const deviceType = 'My Kind Of Device';
	const deviceName = 'MY-DEVICE-2024';
	const commId = '123456789012345';
	const dateTimeUTC = new Date().toUTCString();
	const latitude = "0°46'38.1324'' S";
	const longitude = "1°8'33.2808'' W";
	const gpsQuality = 3;
	const sst = 0.05;

	type CoordinateFormat = 'D' | 'DM' | 'DMS';
	const [coordinateFormat, setCoordinateFormat] =
		useState<CoordinateFormat>('D');

	return (
		<Flex
			flexDirection='row'
			justifyContent='flex-start'
			alignItems='flex-start'
			width='100%'
			padding='32px'
		>
			<Flex
				flexDirection='column'
				justifyContent='flex-start'
				alignItems='flex-start'
				flex={3}
			>
				<Flex
					flexDirection='row'
					justifyContent='space-between'
					alignItems='center'
				>
					<Image src={buoyBase64} width='32px' height='32px' />
					<Flex
						flexDirection='column'
						justifyContent='center'
						alignItems='flex-start'
						marginLeft='32px'
					>
						<Text minWidth='fit-content' fontWeight='bold' flex={1}>
							{deviceName}
						</Text>
						<Text minWidth='fit-content' fontStyle='italic'>
							{`Type: ${deviceType}`}
						</Text>
						<Text minWidth='fit-content' fontStyle='italic' flex={1}>
							{`ID: ${commId}`}
						</Text>
					</Flex>
				</Flex>
				<Text maxWidth='fit-content' fontWeight='bold' marginTop='16px'>
					{dateTimeUTC}
				</Text>
				<Flex
					flexDirection='row'
					justifyContent='space-between'
					alignItems='center'
					marginTop='16px'
					fontWeight='bold'
					flexWrap='wrap'
					width='100%'
					maxWidth='296px'
				>
					<Text minWidth='fit-content' flex={1}>
						{latitude}
					</Text>
					<Text minWidth='fit-content' flex={1}>
						{longitude}
					</Text>
				</Flex>
				<Flex
					flexDirection='row'
					justifyContent='space-between'
					alignItems='center'
					marginTop='16px'
					fontStyle='italic'
				>
					<Text minWidth='fit-content' flex={1}>
						GPS Quality (3D):
					</Text>
					<Text marginLeft='16px' minWidth='fit-content' flex={1}>
						{gpsQuality}
					</Text>
				</Flex>
				<RadioGroup
					onChange={(value: CoordinateFormat) => setCoordinateFormat(value)}
					value={coordinateFormat}
					marginTop='16px'
				>
					<Stack direction='row' spacing='16px'>
						<Radio borderColor='brand.black' value='D'>
							<Text color='brand.black'>D</Text>
						</Radio>
						<Radio borderColor='brand.black' value='DM'>
							<Text color='brand.black'>DM</Text>
						</Radio>
						<Radio borderColor='brand.black' value='DMS'>
							<Text color='brand.black'>DMS</Text>
						</Radio>
					</Stack>
				</RadioGroup>
			</Flex>
			<Flex
				flex={2}
				flexDirection='column'
				justifyContent='space-between'
				alignItems='center'
			>
				<BatteryGauge
					value={99}
					style={{ maxHeight: '128px', maxWidth: '128px' }}
				/>
				<Gauge
					min={-50}
					max={50}
					value={0.05}
					style={{ height: '128px', width: '128px' }}
				/>
			</Flex>
		</Flex>
	);
};

export default MapModal;
