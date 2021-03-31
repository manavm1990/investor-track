import { Table, Tbody, Td, Tr } from '@chakra-ui/react';
import PropTypes from 'prop-types';

function InvestmentTable({ investors }) {
  return (
    <Table variant="simple">
      <Tbody>
        {investors.map(({ email, fname, lname, investmentAmt }) => (
          <Tr key={email}>
            <Td>{fname}</Td>
            <Td>{lname}</Td>
            <Td isNumeric>{investmentAmt}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
}

InvestmentTable.propTypes = {
  investors: PropTypes.arrayOf(
    PropTypes.shape({
      email: PropTypes.string.isRequired,
      fname: PropTypes.string.isRequired,
      lname: PropTypes.string.isRequired,
      investmentAmt: PropTypes.number.isRequired,
      phone: PropTypes.string,
    })
  ),
};

export default InvestmentTable;
