import { Box, ChakraProvider, extendTheme, Grid } from '@chakra-ui/react';
import api from 'api';
import { AuthContext } from 'context';
import Layout from 'layout';
import { DashboardPage, HomePage } from 'pages';
import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Fonts } from 'theme';
import './index.css';

const queryClient = new QueryClient();

const theme = extendTheme({
  fonts: {
    heading: 'Lato',
    body: 'Lato',
  },
});

function App() {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    (async () => {
      const user = await api.auth.show();
      setLoggedInUser(() => user);
    })();
  });

  function toggleUser(user) {
    setLoggedInUser(() => user || null);
  }

  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Grid minH="100vh" p={3}>
          <AuthContext.Provider value={{ loggedInUser, toggleUser }}>
            {/* Place the following code as high in your React app as you can. The closer it is to the root of the page, the better it will work! (https://react-query.tanstack.com/devtools) */}
            <QueryClientProvider client={queryClient}>
              <Layout>
                <Fonts />
                <Router>
                  <Switch>
                    <Route exact path="/">
                      <HomePage />
                    </Route>
                    <Route path="/dashboard">
                      <DashboardPage />
                    </Route>
                  </Switch>
                </Router>
              </Layout>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </AuthContext.Provider>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
