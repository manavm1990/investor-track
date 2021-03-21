import { Box } from '@chakra-ui/react';
import { Card, LoginRegistration } from 'components';
const Home = () => (
  <Box className="bg-center bg-cover bg-hero-image flex flex-col justify-center items-center py-4 w-screen">
    <Card>
      <LoginRegistration />
    </Card>
  </Box>
);

export default Home;
