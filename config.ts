export const config = {
	company: process.env.NEXT_PUBLIC_COMPANY,
	link: process.env.NEXT_PUBLIC_LINK,
	dataPageTitle: process.env.NEXT_PUBLIC_DATA_PAGE_TITLE,
	googleMapsAPIKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
	internalAPIURL: process.env.NEXT_PUBLIC_INTERNAL_API_URL,
	authEndpoint: process.env.NEXT_PUBLIC_AUTH_ENDPOINT,
	orgEndpoint: process.env.NEXT_PUBLIC_ORG_ENDPOINT,
	deviceEndpoint: process.env.NEXT_PUBLIC_DEVICE_ENDPOINT,
	sensorEndpoint: process.env.NEXT_PUBLIC_SENSOR_ENDPOINT,
	customerAPIURL: process.env.NEXT_PUBLIC_CUSTOMER_API_URL,
	dataEndpoint: process.env.NEXT_PUBLIC_DATA_ENDPOINT,
	locationEndpoint: process.env.NEXT_PUBLIC_LOCATION_ENDPOINT,
	trackEndpoint: process.env.NEXT_PUBLIC_TRACK_ENDPOINT,
	jwtTester: process.env.NEXT_PUBLIC_JWT_TESTER ?? null,
	apiKeyTester: process.env.NEXT_PUBLIC_API_KEY_TESTER ?? null,
	ordIdTester: process.env.NEXT_PUBLIC_ORD_ID_TESTER
		? parseInt(process.env.NEXT_PUBLIC_ORD_ID_TESTER)
		: null,
};
