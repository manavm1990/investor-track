import { Footer, Header, Main } from 'components';
import PropTypes from 'prop-types';

const Layout = ({ children }) => (
  <div className="container mx-auto">
    <Header />
    <Main>{children}</Main>
    <Footer />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
