import { Flex, Text, Image, RadioGroup, Stack, Radio } from '@chakra-ui/react';
import buoyBase64 from '../../components/base64/buoy';
import { useEffect, useState } from 'react';
import BatteryGauge from 'react-battery-gauge';
import Gauge from '../../components/charts/gauge.chart';
import { ILocation } from '../../context/data/data.context';
import { getFormattedLocation } from '../../helpers/get-formatted-location';

export interface IMapModal {
	deviceTypeName: string;
	deviceName: string;
	commId: string | number;
	dateTimeUTC: string;
	latitude: number;
	longitude: number;
	gpsQuality: number;
	temperature: number;
	batteryVoltage: number;
}

export const MapModal = ({
	deviceTypeName,
	deviceName,
	commId,
	dateTimeUTC,
	latitude,
	longitude,
	gpsQuality,
	temperature,
	batteryVoltage,
}: IMapModal) => {
	type CoordinateFormat = 'D' | 'DM' | 'DMS';
	const [coordinateFormat, setCoordinateFormat] =
		useState<CoordinateFormat>('D');

	const [formattedLocation, setFormattedLocation] = useState<{
		formattedLatitude: number | string;
		formattedLongitude: number | string;
	}>({
		formattedLatitude: latitude,
		formattedLongitude: longitude,
	});

	useEffect(() => {
		const newFormattedLocation = getFormattedLocation({
			coordinateFormat,
			latitude,
			longitude,
		});

		setFormattedLocation(newFormattedLocation);
	}, [coordinateFormat]);

	const batteryPercentage: number =
		batteryVoltage && batteryVoltage > 0
			? Math.floor((batteryVoltage / 12.5) * 100)
			: 0;

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
							{`TYPE: ${deviceTypeName}`}
						</Text>
						<Text minWidth='fit-content' fontStyle='italic' flex={1}>
							{`COMM ID: ${commId}`}
						</Text>
					</Flex>
				</Flex>
				<Text maxWidth='fit-content' fontWeight='bold' marginTop='16px'>
					{`${dateTimeUTC}`}
				</Text>
				<Flex
					flexDirection='row'
					justifyContent='flex-start'
					alignItems='center'
					marginTop='16px'
					fontWeight='bold'
					flexWrap='wrap'
					width='100%'
				>
					<Text minWidth='fit-content'>
						{formattedLocation.formattedLatitude}
					</Text>
					<Text minWidth='fit-content' marginLeft='16px'>
						{formattedLocation.formattedLongitude}
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
					value={batteryPercentage}
					style={{ maxHeight: '128px', maxWidth: '128px' }}
				/>
				<Gauge
					min={-99}
					max={99}
					value={temperature}
					style={{ height: '128px', width: '128px' }}
				/>
			</Flex>
		</Flex>
	);
};

export default MapModal;
