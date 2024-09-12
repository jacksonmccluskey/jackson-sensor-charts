import React, { createContext, useState, useContext } from 'react';

const DataContext = createContext({});

export const DataProvider = ({ children }) => {
	const [timeRange, setTimeRange] = useState({
		startDate: '2023-01-01T00:00:00',
		endDate: '2023-01-02T00:00:00',
	});

	const [devices, setDevices] = useState([
		{
			deviceId: 1,
			deviceName: 'Device A',
			sensorData: [10, 20, 30, 40, 50],
			timestamps: [
				'2023-01-01T10:00:00',
				'2023-01-01T11:00:00',
				'2023-01-01T12:00:00',
				'2023-01-01T13:00:00',
				'2023-01-01T14:00:00',
			],
			isSelected: true, // Boolean for selection state
		},
		{
			deviceId: 2,
			deviceName: 'Device B',
			sensorData: [15, 25, 35, 45, 55],
			timestamps: [
				'2023-01-01T10:00:00',
				'2023-01-01T11:00:00',
				'2023-01-01T12:00:00',
				'2023-01-01T13:00:00',
				'2023-01-01T14:00:00',
			],
			isSelected: false, // Boolean for selection state
		},
	]);

	// State for storing the sensor sets
	const [sensorSets, setSensorSets] = useState([
		{ sensorId: 1, sensorName: 'Temperature' },
		{ sensorId: 2, sensorName: 'Humidity' },
	]);

	return (
		<DataContext.Provider
			value={{
				timeRange,
				setTimeRange,
				devices,
				setDevices,
				sensorSets,
				setSensorSets,
			}}
		>
			{children}
		</DataContext.Provider>
	);
};

export const useDataContext = () => useContext(DataContext);
