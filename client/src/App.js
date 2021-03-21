import { Box, ChakraProvider, extendTheme, Grid } from '@chakra-ui/react';
import Layout from 'layout';
import { AboutPage, HomePage, LoginPage } from 'pages';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Fonts } from 'theme';
import './index.css';

const theme = extendTheme({
  fonts: {
    heading: 'Lato',
    body: 'Lato',
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <Layout>
            <Fonts />
            <Router>
              <Switch>
                <Route exact path="/">
                  <HomePage />
                </Route>
                <Route exact path="/about">
                  <AboutPage />
                </Route>
                <Route exact path="/login">
                  <LoginPage />
                </Route>
              </Switch>
            </Router>
          </Layout>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
