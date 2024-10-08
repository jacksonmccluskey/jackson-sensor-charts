import React from 'react';
import { Chart } from 'react-google-charts';

export const options = {
	width: 400,
	height: 120,
	redFrom: 90,
	redTo: 99,
	yellowFrom: 56,
	yellowTo: 90,
	greenFrom: -99,
	greenTo: 0,
	minorTicks: 5,
	redColor: '#C70039',
	yellowColor: 'rgb(255,255,255,0.8)',
	greenColor: '#87CEEB',
};

export const Gauge = ({ min, max, value, style }) => {
	return (
		<Chart
			chartType='Gauge'
			data={[
				['Label', 'Value'],
				['TEMP (C)', value],
			]}
			options={{ ...options, min, max }}
			style={{ padding: 0, ...style }}
		/>
	);
};

export default Gauge;
