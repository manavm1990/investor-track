import { AuthContext } from 'context';
import { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

function Dashboard() {
  const { loggedInUser } = useContext(AuthContext);

  const history = useHistory();

  useEffect(() => {
    if (!loggedInUser) {
      history.push('/');
    }
  });

  return (
    <p>
      Hello,&nbsp;
      {loggedInUser?.email === process.env.REACT_APP_INVESTMENTS_ADMIN
        ? 'Admin'
        : loggedInUser?.name}
    </p>
  );
}

export default Dashboard;
