import { useState } from 'react';
import {
	Flex,
	IconButton,
	Text,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	Button,
} from '@chakra-ui/react';
import {
	HamburgerIcon,
	ChevronDownIcon,
	ChevronUpIcon,
} from '@chakra-ui/icons';

const Header = ({ dynamicTitle, userName, isMobile = false }) => {
	const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

	const toggleUserMenu = () => {
		setIsUserMenuOpen(!isUserMenuOpen);
	};

	return (
		<Flex
			as='header'
			bg='brand.4'
			w='100%'
			h='64px'
			align='center'
			justify='space-between'
			px={4}
			boxShadow='md'
		>
			<Flex justifyContent='flex-start' alignItems='center' flex={1}>
				<IconButton
					icon={<HamburgerIcon />}
					aria-label='Open Menu'
					size='lg'
					color='brand.black'
				/>
				<Text fontSize='lg' marginLeft='16px' color='brand.black'>
					Data
				</Text>
			</Flex>
			{isMobile ? null : (
				<Flex justifyContent='center' alignItems='center' flex={1}>
					<Text fontSize='lg' color='brand.black'>
						{dynamicTitle}
					</Text>
				</Flex>
			)}
			{isMobile ? null : (
				<Flex justifyContent='flex-end' alignItems='center' flex={1}>
					<Menu>
						<MenuButton
							as={Button}
							variant='ghost'
							size='lg'
							rightIcon={
								isUserMenuOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
							}
							onClick={toggleUserMenu}
							color='brand.black'
							fontWeight='regular'
						>
							{userName}
						</MenuButton>
						<MenuList backgroundColor='brand.400'>
							<MenuItem color='brand.base'>Charts</MenuItem>
							<MenuItem color='brand.base'>API</MenuItem>
							<MenuItem color='brand.base'>Map</MenuItem>
						</MenuList>
					</Menu>
				</Flex>
			)}
		</Flex>
	);
};

export default Header;
