import { Heading } from '@chakra-ui/react';
import { ColorModeSwitcher } from 'ColorModeSwitcher';

const Header = () => (
  <header className="flex justify-between">
    <Heading fontSize="2xl" className="text-green-500">
      InvestTrack
    </Heading>
    <ColorModeSwitcher />
  </header>
);

export default Header;
