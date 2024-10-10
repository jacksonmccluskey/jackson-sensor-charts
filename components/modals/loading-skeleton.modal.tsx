import React from 'react';
import { Box, keyframes } from '@chakra-ui/react';

const gradientFlowAnimation = keyframes`
  0% { transform: translateX(-100%) skewX(10deg); }
  50% { transform: translateX(0) skewX(-10deg); }
  100% { transform: translateX(100%) skewX(10deg); }
`;

const shimmerAnimation = keyframes`
  0% { transform: translateX(-150%); opacity: 0.3; }
  50% { transform: translateX(0); opacity: 0.8; }
  100% { transform: translateX(150%); opacity: 0.3; }
`;

const WaveLoadingSkeleton = ({ children, isLoading, style = {} }) => {
	return (
		<Box
			position='relative'
			width='100%'
			height='100%'
			bg={isLoading ? 'gray.100' : 'transparent'}
			style={style}
		>
			{children}
			{isLoading && (
				<Box
					position='absolute'
					top={0}
					left={0}
					width='100%'
					height='100%'
					pointerEvents='none'
					animation={`${gradientFlowAnimation} 5s ease-in-out infinite`}
					background='linear-gradient(135deg, rgba(50, 50, 100, 0.4), rgba(0, 119, 182, 0.5), rgba(153, 223, 255, 0.6), rgba(50, 50, 100, 0.4))'
					backgroundSize='200% 200%'
					filter='blur(40px)'
					borderRadius='25%'
					opacity={0.7}
					zIndex={2}
				>
					<Box
						position='absolute'
						top={0}
						left={0}
						width='150%'
						height='100%'
						pointerEvents='none'
						animation={`${shimmerAnimation} 2s linear infinite`}
						background='linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.9), transparent)'
						filter='blur(30px)'
						opacity={0.6}
						zIndex={3}
					/>
				</Box>
			)}
		</Box>
	);
};

export default WaveLoadingSkeleton;
