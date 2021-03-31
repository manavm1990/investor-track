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
} from '@chakra-ui/react';
import { useQueryClient } from 'react-query';

function AddInvestorForm() {
  const queryClient = useQueryClient();

  const handleSubmit = event => {
    event.preventDefault();

    const newInvestor = Object.fromEntries(new FormData(event.target));
  };

  // ⚠️ Be sure that all `name` attributes match 🔑s for MongoDB
  return (
    <form className="mt-4" onSubmit={handleSubmit}>
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

export default AddInvestorForm;
