import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';
import { useDataContext } from '../../context/data/data.context';
import LoadingSkeleton from '../modals/loading-skeleton.modal';

const LineChartComponent = ({
	startDate,
	endDate,
	chartId,
	dataSets,
	sensorName,
}) => {
	const { isChartsLoading } = useDataContext();

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

	const mapDataForSensorToLine = () => {
		if (Array.isArray(dataSets)) {
			const datasets = dataSets.map((dataSet: any, index: number) => {
				return {
					label: dataSet.deviceName,
					data: dataSet.transmissions.map((transmission) => {
						return {
							x: new Date(transmission.time),
							y: transmission.value,
						};
					}),
					backgroundColor: colorScheme[index % colorScheme.length] + '0.33)',
					borderColor: colorScheme[index % colorScheme.length] + '1)',
					fill: false,
					pointRadius: 0,
					tension: 0.1,
				};
			});
			return datasets;
		}
		return [];
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
				datasets: mapDataForSensorToLine(),
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
						text: `${sensorName} Data from ${new Date(
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
							displayFormats: {
								hour: 'HH:mm',
								day: 'MMM d',
								month: 'MMM yyyy',
								year: 'yyyy',
							},
							tooltipFormat: 'PPpp',
						},
						title: {
							display: true,
							text: 'Date',
						},
					},
					y: {
						title: {
							display: true,
							text: sensorName + '',
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
	}, [startDate, endDate, dataSets, sensorName]);

	return (
		<LoadingSkeleton isLoading={isChartsLoading}>
			<canvas
				id={`lineChart-${chartId}`}
				style={{ maxWidth: '100%', marginBottom: '32px' }}
			/>
		</LoadingSkeleton>
	);
};

export default LineChartComponent;
