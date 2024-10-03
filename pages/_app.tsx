import dotenv from 'dotenv';
dotenv.config();

// pages/_app.js
import { APIProvider } from '@vis.gl/react-google-maps';
import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '../theme';
import { config } from '../config';
import { DataProvider } from '../context/data/data.context';
import { AuthProvider } from '../context/auth/auth.context';

function MyApp({ Component, pageProps }) {
	return (
		<APIProvider apiKey={config.googleMapsAPIKey}>
			<AuthProvider>
				<DataProvider>
					<ChakraProvider theme={theme}>
						<Component {...pageProps} />
					</ChakraProvider>
				</DataProvider>
			</AuthProvider>
		</APIProvider>
	);
}

export default MyApp;
