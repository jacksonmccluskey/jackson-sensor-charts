// pages/_document.js
import { ColorModeScript } from '@chakra-ui/react';
import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
	render() {
		return (
			<Html lang='en'>
				<Head />
				<body>
					<ColorModeScript />
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
