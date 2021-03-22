import api from 'api';
import { AuthContext } from 'context';
import { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

function Dashboard() {
  const { loggedInUser } = useContext(AuthContext);

  // TODO: Replace this with `react-query`
  const [data, setData] = useState([]);

  const history = useHistory();

  useEffect(() => {
    if (!loggedInUser) {
      history.push('/');
    }
  }, [history, loggedInUser]);

  useEffect(() => {
    (async () => {
      const user = loggedInUser;
      const resp = await api.db.index({ email: user?.email });
      setData(() => resp);
    })();
  }, [loggedInUser]);

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
