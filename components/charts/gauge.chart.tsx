import React, { useState, useEffect } from 'react';
import { Chart } from 'react-google-charts';

export const options = {
	width: 400,
	height: 120,
	redFrom: 90,
	redTo: 100,
	yellowFrom: 75,
	yellowTo: 90,
	minorTicks: 5,
	redColor: '#AAAAAA',
	yellowColor: '#BBBBBB',
	greenColor: '#CCCCCC',
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
