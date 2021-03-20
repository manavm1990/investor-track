import { Heading } from '@chakra-ui/react';
import { ColorModeSwitcher } from 'ColorModeSwitcher';

const Header = () => (
  <header className="flex justify-between">
    <Heading fontSize="xl">My Capstone!</Heading>
    <ColorModeSwitcher />
  </header>
);

export default Header;
