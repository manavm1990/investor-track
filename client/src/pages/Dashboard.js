import api from 'api';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);

  const history = useHistory();

  useEffect(() => {
    (async () => {
      const user = await api.auth.show();

      if (user) {
        setCurrentUser({
          email: user.email,
          name: user.displayName,
          pic: user.photoUrl,
        });
      } else {
        history.push('/');
      }
    })();
  }, [history]);

  return currentUser ? (
    <p>
      Hello,&nbsp;
      {currentUser.email === process.env.REACT_APP_INVESTMENTS_ADMIN
        ? 'Admin'
        : currentUser.name}
    </p>
  ) : (
    <></>
  );
}

export default Dashboard;
