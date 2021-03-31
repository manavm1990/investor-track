import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Skeleton,
} from '@chakra-ui/react';
import api from 'api';
import { Form, Table } from 'components';
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
      <Heading className="my-4">
        Hello,&nbsp;
        {loggedInUser?.email === process.env.REACT_APP_INVESTMENTS_ADMIN
          ? 'Admin'
          : loggedInUser?.name}
      </Heading>

      <Skeleton
        isLoaded={!isLoading}
        startColor="orange.100"
        endColor="orange.500"
        className="min-w-max my-4"
      >
        <Accordion allowToggle>
          {data?.map(({ _id: id, name, investors }) => (
            <AccordionItem key={id}>
              <AccordionButton className="text-center">
                <h3 className="font-semibold text-xl">
                  {name}&nbsp;
                  <AccordionIcon />
                </h3>
              </AccordionButton>
              <AccordionPanel>
                <Table investors={investors} />
                <h4 className="font-semibold text-lg">
                  Add Investor to {name}
                </h4>
                <Form />
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Skeleton>
    </>
  );
}

export default Dashboard;
