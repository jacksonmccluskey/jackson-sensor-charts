import { extendTheme } from '@chakra-ui/react';

const colors = {
	brand: {
		dark: '#176B87',
		medium: '#86B6F6',
		light: '#B4D4FF',
		base: '#EEF5FF',
		white: '#FFF',
		black: '#000',
		1: '#f8f9fa',
		2: '#e9ecef',
		3: '#dee2e6',
		4: '#ced4da',
		5: '#adb5bd',
	},
};

export const theme = extendTheme({
	colors,
	styles: {
		global: () => ({
			body: {
				bg: '',
			},
		}),
	},
});
