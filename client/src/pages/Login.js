import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from '@chakra-ui/react';

const Login = () => (
  <FormControl id="email">
    <FormLabel>Email address</FormLabel>
    <Input type="email" />
    <FormHelperText>We&apos;ll never share your email.</FormHelperText>
  </FormControl>
);

export default Login;
