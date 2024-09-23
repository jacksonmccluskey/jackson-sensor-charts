import { config } from '../config';

export const callLogin = async ({ jwt }) => {
	if (!jwt || !config.jwtTester) {
		return { apiKey: null, orgId: null };
	}

	const loginResponse = await fetch(
		config.internalAPIURL + config.authEndpoint,
		{
			method: 'GET',
			headers: { Authorization: jwt ?? config.jwtTester },
		}
	);

	const {
		data: { apiKey, orgId },
	} = await loginResponse.json();

	return {
		apiKey,
		orgId,
	};
};
