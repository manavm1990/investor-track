import PropTypes from 'prop-types';

const { Box } = require('@chakra-ui/layout');

const Card = ({ children }) => (
  <Box className="bg-black bg-opacity-30 border-black-600 rounded p-4 shadow-sm w-10/12">
    {children}
  </Box>
);

Card.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Card;
