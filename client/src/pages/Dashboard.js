import { Box, Skeleton } from '@chakra-ui/react';
import api from 'api';
import { Form, Investment } from 'components';
import { AuthContext } from 'context';
import { useContext, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useHistory } from 'react-router-dom';

function Dashboard() {
  const { loggedInUser } = useContext(AuthContext);

  const history = useHistory();

  const fetchInvestments = async () => {
    const results = await api.db.index({ email: loggedInUser?.email });
    return results;
  };

  useEffect(() => {
    if (!loggedInUser) {
      history.push('/');
    }
  }, [history, loggedInUser]);

  const { isLoading, isError, data, error } = useQuery(
    'investments',
    fetchInvestments
  );

  if (isError) {
    return <Box className="text-red-500">{error.message}</Box>;
  }

  return (
    <>
      <p>
        Hello,&nbsp;
        {loggedInUser?.email === process.env.REACT_APP_INVESTMENTS_ADMIN
          ? 'Admin'
          : loggedInUser?.name}
      </p>

      <Skeleton
        isLoaded={!isLoading}
        startColor="orange.100"
        endColor="orange.500"
        className="my-4 w-4/5"
      >
        {/* TODO: Resolve Y `name` is undefined... */}
        {data?.map(({ _id: id, name, investors }) => (
          <Investment key={id} caption={name} investors={investors} />
        ))}

        <Form />
      </Skeleton>
    </>
  );
}

export default Dashboard;
