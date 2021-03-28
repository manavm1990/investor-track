import { AuthContext } from 'context';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';

function PrivateRoute({ children }) {
  const { loggedInUser } = useContext(AuthContext);

  return (
    <Route
      /**
       * ...render allows us to re-check
       *  if the user is authenticated every time the Route matches.
       * https://reactrouter.com/web/api/Route/route-render-methods
       * https://ui.dev/react-router-v5-protected-routes-authentication/
       *
       * Render children (e.g. `Dashboard`) or `Redirect...`
       */
      render={() => (loggedInUser ? children : <Redirect to="/" />)}
    />
  );
}

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PrivateRoute;
