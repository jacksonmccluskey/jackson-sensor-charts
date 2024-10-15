module.exports = {
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{
						key: 'X-Frame-Options',
						value: 'ALLOW-ALL',
					},
				],
			},
		];
	},
};
