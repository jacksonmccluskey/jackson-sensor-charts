import dotenv from 'dotenv';
dotenv.config();

// pages/_app.js
import { APIProvider } from '@vis.gl/react-google-maps';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme';
import { config } from '../config';

function MyApp({ Component, pageProps }) {
	console.log(config.googleMapsAPIKey);

	return (
		<APIProvider apiKey={config.googleMapsAPIKey}>
			<ChakraProvider theme={theme}>
				<Component {...pageProps} />
			</ChakraProvider>
		</APIProvider>
	);
}

export default MyApp;
