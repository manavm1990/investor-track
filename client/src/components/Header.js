import { Button, Heading } from '@chakra-ui/react';
import api from 'api';
import { ColorModeSwitcher } from 'ColorModeSwitcher';
import { AuthContext } from 'context';
import { useContext } from 'react';

const Header = () => {
  const { loggedInUser, toggleUser } = useContext(AuthContext);

  function handleClick() {
    api.auth
      .delete()
      .catch(error => {
        console.error(error.msg);
      })

      // Fail or not - reset the user
      .finally(() => {
        toggleUser(null);
      });
  }

  return (
    <header className="flex items-center">
      <Heading fontSize="2xl" className="mr-auto pl-2 text-green-500">
        InvestTrack
      </Heading>
      {loggedInUser ? (
        <Button colorScheme="orange" size="sm" onClick={handleClick}>
          Logout
        </Button>
      ) : null}
      <ColorModeSwitcher />
    </header>
  );
};

export default Header;
