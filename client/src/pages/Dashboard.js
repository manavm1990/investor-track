import { Box, Skeleton } from '@chakra-ui/react';
import api from 'api';
import { Form, Investment } from 'components';
import { AuthContext } from 'context';
import { useContext } from 'react';
import { useQuery } from 'react-query';

function Dashboard() {
  const { loggedInUser } = useContext(AuthContext);

  const fetchInvestments = async () => {
    const results = await api.db.index({
      // Token will be checked on server to cross-reference admin ✉️
      token: await loggedInUser.getIdToken(),
    });
    return results;
  };

  const { isLoading, isError, data, error } = useQuery(
    'investments',
    fetchInvestments,

    /**
     * Developer's Note 🎵: ⚠️ It IS possible to have a `loggedInUser` and
     * no ✉️ b/c of timing of Auth process
     */
    { enabled: Boolean(loggedInUser?.email) }
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
        {data?.map(({ _id: id, name, investors }) => (
          <Investment key={id} caption={name} investors={investors} />
        ))}

        <Form />
      </Skeleton>
    </>
  );
}

export default Dashboard;
