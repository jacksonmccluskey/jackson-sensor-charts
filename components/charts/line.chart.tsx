import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { formatDistanceStrict } from 'date-fns';

const LineChartComponent = ({ startDate, endDate, devices, chartId }) => {
	const [chartInstance, setChartInstance] = useState(null);
	const colorScheme = [
		'rgba(137, 207, 240, ',
		'rgba(0, 0, 255, ',
		'rgba(115, 147, 179, ',
		'rgba(8, 143, 143, ',
		'rgba(0, 150, 255, ',
		'rgba(95, 158, 160, ',
		'rgba(0, 71, 171, ',
		'rgba(100, 149, 237, ',
		'rgba(0, 255, 255, ',
		'rgba(0, 0, 139, ',
	];

	const generateMockData = () => {
		const datasets = devices.map((device, index) => {
			const data = device.sensorData.map((value, i) => ({
				x: new Date(device.timestamps[i]),
				y: value,
			}));

			return {
				label: device.deviceName,
				data,
				backgroundColor: colorScheme[index % colorScheme.length] + '0.33)',
				borderColor: colorScheme[index % colorScheme.length] + '1)',
				fill: false,
				pointRadius: 4,
				tension: 0.1,
			};
		});

		return datasets;
	};

	const getTimeUnit = () => {
		const diff = formatDistanceStrict(new Date(startDate), new Date(endDate), {
			unit: 'day',
		});

		const days = parseFloat(diff.split(' ')[0]);

		if (days < 1) return 'hour';
		if (days <= 7) return 'day';
		if (days <= 365) return 'month';
		return 'year';
	};

	const initChart = () => {
		const canvas = document.getElementById(
			`lineChart-${chartId}`
		) as HTMLCanvasElement;
		const ctx = canvas.getContext('2d');

		if (!ctx) return;

		const chart = new Chart(ctx, {
			type: 'line',
			data: {
				datasets: generateMockData(),
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: true,
						position: 'top',
						onClick: (_e, legendItem) => {
							const index = legendItem.datasetIndex;
							const ci = chart;
							const meta = ci.getDatasetMeta(index);
							meta.hidden =
								meta.hidden === null ? !ci.data.datasets[index].hidden : null;
							ci.update();
						},
					},
					title: {
						display: true,
						text: `Sensor Data from ${new Date(
							startDate
						).toDateString()} to ${new Date(endDate).toDateString()}`,
					},
					tooltip: {
						mode: 'index',
						intersect: false,
					},
				},
				scales: {
					x: {
						type: 'time',
						time: {
							unit: getTimeUnit(),
							tooltipFormat: 'PP',
						},
						title: {
							display: true,
							text: 'Date',
						},
					},
					y: {
						beginAtZero: true,
						title: {
							display: true,
							text: 'Sensor Values',
						},
					},
				},
				interaction: {
					mode: 'nearest',
					axis: 'x',
					intersect: false,
				},
			},
		});

		setChartInstance(chart);
	};

	useEffect(() => {
		if (chartInstance) {
			chartInstance.destroy();
		}

		initChart();

		return () => {
			if (chartInstance) {
				chartInstance.destroy();
			}
		};
	}, [startDate, endDate, devices]);

	return (
		<canvas
			id={`lineChart-${chartId}`}
			style={{ maxWidth: '100%', marginBottom: '32px' }}
		/>
	);
};

export default LineChartComponent;
