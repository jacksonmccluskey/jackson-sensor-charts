export const formatDate = (date: Date | null) => {
	if (!date) {
		return 'No Date Selected';
	}

	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
	const day = String(date.getDate()).padStart(2, '0');
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');

	return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const constructTime = (
	startDate: Date,
	endDate: Date,
	hasTime: boolean = false
) => {
	return `startDate${hasTime ? 'Time' : ''}=${formatDate(startDate)}&endDate${
		hasTime ? 'Time' : ''
	}=${formatDate(endDate)}`;
};
