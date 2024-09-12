import { useState } from 'react';
import {
	Box,
	Radio,
	RadioGroup,
	Stack,
	Input,
	Select,
	Flex,
	Text,
} from '@chakra-ui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const TimePicker = () => {
	type TimeSelectionMode = 'time-span' | 'date-range';
	type TimeUnit = 'Hours' | 'Days' | 'Months' | 'Years';
	type CoordinateFormat = 'D' | 'DM' | 'DMS';

	const [timeSelectionMode, setTimeSelectionMode] =
		useState<TimeSelectionMode>('time-span');
	const [mostRecentValue, setMostRecentValue] = useState(24);
	const [timeUnit, setTimeUnit] = useState<TimeUnit>('Days');
	const [fromDate, setFromDate] = useState(new Date());
	const [toDate, setToDate] = useState(new Date());
	const [coordinateFormat, setCoordinateFormat] =
		useState<CoordinateFormat>('D');

	const handleMostRecentChange = (e: any) =>
		setMostRecentValue(
			Number.isNaN(parseInt(e.target.value))
				? undefined
				: parseInt(e.target.value)
		);

	return (
		<Box borderRadius='md' w='100%'>
			<Flex>
				<Flex flexDirection='column'>
					<Text fontSize='lg' color='brand.black' minWidth='200px'>
						Step 1: Enter Time Range
					</Text>
					<RadioGroup
						onChange={(value: TimeSelectionMode) => setTimeSelectionMode(value)}
						value={timeSelectionMode}
						flexDirection='row'
						minWidth='100%'
						marginTop='16px'
					>
						<Radio
							value='time-span'
							borderWidth='2px'
							borderColor='brand.black'
						>
							<Text fontSize='md' color='brand.black'>
								Time Span
							</Text>
						</Radio>
						<Radio
							value='date-range'
							borderWidth='2px'
							borderColor='brand.black'
							marginLeft='16px'
						>
							<Text fontSize='md' color='brand.black'>
								Date Range
							</Text>
						</Radio>
					</RadioGroup>
				</Flex>
			</Flex>

			{timeSelectionMode === 'time-span' ? (
				<Flex
					alignItems='justify-content'
					justifyContent='center'
					flexDirection='column'
					marginTop='16px'
				>
					<Text color='brand.black' minWidth='fit-content'>
						Most Recent
					</Text>
					<Flex flexDirection='row' justifyContent='flex-start' marginTop='8px'>
						<Input
							value={mostRecentValue}
							onChange={handleMostRecentChange}
							width='64px'
							color='brand.black'
							borderWidth='1px'
							borderColor='brand.black'
							backgroundColor='brand.white'
						/>
						<Select
							value={timeUnit}
							onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
								setTimeUnit(e.target.value as TimeUnit)
							}
							color='brand.black'
							borderWidth='1px'
							borderColor='brand.black'
							width='fit-content'
							marginLeft='8px'
							backgroundColor='brand.white'
						>
							<option color='brand.black' value='Hours'>
								Hours
							</option>
							<option color='brand.black' value='Days'>
								Days
							</option>
							<option color='brand.black' value='Months'>
								Months
							</option>
							<option color='brand.black' value='Years'>
								Years
							</option>
						</Select>
					</Flex>
				</Flex>
			) : (
				<Flex justifyContent='flex-start' alignItems='center' marginTop='16px'>
					<Box>
						<Text color='brand.black' marginBottom='8px'>
							From
						</Text>
						<DatePicker
							selected={fromDate}
							onChange={(fromDate: Date) => {
								setFromDate(fromDate);
							}}
							dateFormat='yyyy/MM/dd HH:mm'
							customInput={
								<Input
									placeholder='From Date'
									bg='brand.white'
									color='brand.black'
									borderColor='brand.black'
									_hover={{ borderColor: 'brand.medium' }}
								/>
							}
							showTimeSelect
							timeFormat='HH:mm'
							timeIntervals={60}
							timeCaption='Time'
							popperPlacement='bottom-start'
						/>
					</Box>
					<Box marginLeft='16px'>
						<Text color='brand.black' marginBottom='8px'>
							To
						</Text>
						<DatePicker
							selected={toDate}
							onChange={(toDate: Date) => {
								setToDate(toDate);
							}}
							dateFormat='yyyy/MM/dd HH:mm'
							customInput={
								<Input
									placeholder='From Date'
									bg='brand.white'
									color='brand.black'
									borderColor='brand.black'
									_hover={{ borderColor: 'brand.medium' }}
								/>
							}
							showTimeSelect
							timeFormat='HH:mm'
							timeIntervals={60}
							timeCaption='Time'
							popperPlacement='bottom-start'
						/>
					</Box>
				</Flex>
			)}
			<Box marginTop='16px'>
				<Text color='brand.black'>Coordinate Format</Text>
				<RadioGroup
					onChange={(value: CoordinateFormat) => setCoordinateFormat(value)}
					value={coordinateFormat}
					marginTop='8px'
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
			</Box>
		</Box>
	);
};

export default TimePicker;
