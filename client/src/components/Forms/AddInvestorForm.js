import {
  Button,
  FormControl,
  FormLabel,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useToast,
} from '@chakra-ui/react';
import api from 'api';
import { AuthContext } from 'context';
import PropTypes from 'prop-types';
import { useContext, useRef } from 'react';
import { useMutation, useQueryClient } from 'react-query';

function AddInvestorForm({ name }) {
  const { loggedInUser } = useContext(AuthContext);
  const formEl = useRef(null);

  const queryClient = useQueryClient();
  const toast = useToast();

  const addInvestor = useMutation(
    async (newInvestor, investmentName) =>
      api.db.create({
        token: await loggedInUser.getIdToken(),
        newInvestor,
        investmentName: name,
        path: 'investments/investor',
      }),
    {
      onSuccess: ({
        investmentName: updatedInvestmentName,
        scrubbedInvestor: updatedInvestor,
      } = {}) => {
        queryClient.invalidateQueries('investments');
        toast({
          title: `Added ${updatedInvestor.fname} ${updatedInvestor.lname} to ${updatedInvestmentName}`,
          status: 'success',
          duration: 9000,
          isClosable: true,
        });

        // Reset form via ref
        formEl.current.reset();
      },
    }

    // TODO: 🥅 (https://react-query.tanstack.com/guides/mutations#mutation-side-effects)
  );

  const handleSubmit = event => {
    event.preventDefault();

    const newInvestor = Object.fromEntries(new FormData(event.target));
    addInvestor.mutate(newInvestor, name);
  };

  // ⚠️ Be sure that all `name` attributes match 🔑s for MongoDB
  return (
    <form className="mt-4" onSubmit={handleSubmit} ref={formEl}>
      <h4 className="font-semibold text-lg">Add Investor to {name}</h4>
      <FormControl className="my-2" id="email">
        <FormLabel>Email address</FormLabel>
        <Input type="email" name="email" />
      </FormControl>

      <FormControl className="my-2" id="first-name">
        <FormLabel>First name</FormLabel>
        <Input placeholder="First name" name="fname" />
      </FormControl>

      <FormControl className="my-2" id="last-name">
        <FormLabel>First name</FormLabel>
        <Input placeholder="Last name" name="lname" />
      </FormControl>

      <FormControl className="my-2" id="investment-amount">
        <FormLabel>Investment Amount</FormLabel>

        {/* TODO: 🐛 Not resetting! */}
        <NumberInput min={10}>
          <NumberInputField name="investmentAmt" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      {/* ⚠️ MUST have type! */}
      <Button colorScheme="green" className="mt-4" type="submit">
        Add Investor
      </Button>
    </form>
  );
}

AddInvestorForm.propTypes = { name: PropTypes.string.isRequired };

export default AddInvestorForm;
