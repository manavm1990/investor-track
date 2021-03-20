import { HStack, Icon, IconButton, Link, Text } from '@chakra-ui/react';
import { FaCopyright, FaLinkedinIn } from 'react-icons/fa';
import { GoMarkGithub } from 'react-icons/go';

const Footer = () => (
  <footer className="flex ">
    <HStack>
      <Text fontSize="sm">
        <Icon as={FaCopyright} />
        {new Date().getFullYear()}
      </Text>

      {/* TODO: Replace links! */}
      <Link href="https://www.github.com/manavm1990/" isExternal>
        <IconButton aria-label="GitHub" icon={<GoMarkGithub />} size="sm" />

        {/* TODO: Resolve this component - might be a Chakra UI issue. */}
        {/* <ExternalLinkIcon mx="2px" /> */}
      </Link>

      <Link href="https://www.linkedin.com/in/manavm1990/" isExternal>
        <IconButton aria-label="LinkedIn" icon={<FaLinkedinIn />} size="sm" />
        {/* <ExternalLinkIcon mx="2px" /> */}
      </Link>
    </HStack>
  </footer>
);

export default Footer;
