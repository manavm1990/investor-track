import PropTypes from 'prop-types';

const Main = ({ children }) => (
  <main className="flex flex-col items-center">{children}</main>
);

Main.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Main;
