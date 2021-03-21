import {
  Button,
  ButtonGroup,
  Collapse,
  Fade,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import api from 'api';
import { useReducer } from 'react';
import { useHistory } from 'react-router-dom';

// state, action (it's from the dispatcher)
function reducer(state, { type, payload }) {
  switch (type) {
    case 'activate-login-mode':
      return { ...state, ...{ mode: 'login', info: '' } };
    case 'activate-registration-mode':
      return { ...state, ...{ mode: 'registration', info: '' } };
    case 'activate-forgotten-mode':
      return { ...state, ...{ mode: 'forgotten', info: '' } };
    case 'update-info':
      return { ...state, ...{ info: payload } };
    default:
      throw new Error('Illegal 🙅🏾‍♂️ action! 💣');
  }
}

function LoginRegistrationForm() {
  const [formState, dispatch] = useReducer(reducer, { mode: 'login' });

  const history = useHistory();

  const finishRegistration = async (fname, photo) => {
    try {
      const photoURL = photo
        ? await getPhotoURL(photo)
        : 'https://i.stack.imgur.com/34AD2.jpg';

      const currentUser = await api.auth.show();

      currentUser
        .updateProfile({ displayName: fname, photoURL })
        .then(() => {
          history.push('/dashboard');
        })
        .catch(error => {
          throw new Error(error.message);
        });
    } catch (error) {
      dispatch({ type: 'update-info', payload: error.message });
    }
  };

  async function getPhotoURL(img) {
    if (img) {
      // `secure_url` comes back in the JSON that Cloudinary sends back
      // We are destructuring and renaming to `url`
      const { secure_url: url } = await api.photo.create(img);
      return url;
    }
  }

  const handleClick = ({ target: { innerText } }) => {
    if (
      innerText === 'Already Have an Account?' ||
      innerText === 'Login/Register'
    ) {
      dispatch({ type: 'activate-login-mode' });
    } else {
      switch (innerText) {
        case 'No Account Yet?':
          dispatch({ type: 'activate-registration-mode' });

          break;

        case 'Forgot Password?':
          dispatch({ type: 'activate-forgotten-mode' });
          break;
        default:
          throw new Error('Illegal 🙅🏾‍♂️ action!');
      }
    }
  };

  const handleSubmit = async function (event) {
    event.preventDefault();

    const submission = Object.fromEntries(new FormData(event.target));

    switch (formState.mode) {
      case 'login':
        api.auth
          .show(submission.email, submission.password)
          .then(() => {
            history.push('/dashboard');
          })
          .catch(error => {
            dispatch({ type: 'update-info', payload: error.message });
          });
        break;
      case 'registration':
        api.auth
          .create(submission.email, submission.password)
          .then(() => {
            finishRegistration(submission.fullName, submission.profile);
          })
          .catch(error => {
            dispatch({ type: 'update-info', payload: error.message });
          });
        break;
      case 'forgotten':
        try {
          const msg = await api.auth.update(submission.email);
          dispatch({ type: 'update-info', payload: msg });
        } catch (error) {
          dispatch({ type: 'update-info', payload: error.message });
        }
        break;
      default:
        throw new Error('Illegal 🙅🏾‍♂️ action!');
    }
  };

  function renderSubmitTxt(mode) {
    switch (formState.mode) {
      case 'login':
        return 'Login';
      case 'registration':
        return 'Register';
      case 'forgotten':
        return 'Reset Password';
      default:
        throw new Error('Illegal form mode');
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <FormControl id="email" isRequired>
        <FormLabel>Email address</FormLabel>
        <Input type="email" name="email" />
      </FormControl>

      <Collapse in={!(formState.mode === 'forgotten')} animateOpacity>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" name="password" />
        </FormControl>
      </Collapse>

      <Collapse
        in={formState.mode === 'registration'}
        animateOpacity
        unmountOnExit
      >
        <FormControl id="name" isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input type="text" name="fullName" />
        </FormControl>

        <FormControl id="profile" className="mt-4">
          <FormLabel>Upload a Profile Pic?</FormLabel>
          <Input
            type="file"
            accept="image/*"
            className="no-border no-left-padding"
            name="profile"
          />
        </FormControl>
      </Collapse>

      <ButtonGroup
        variant="outline"
        className="flex flex-col md:flex-row gap-4 items-center"
      >
        <Button type="submit" colorScheme="green">
          {renderSubmitTxt(formState.mode)}
        </Button>

        <Fade in={!(formState.mode === 'forgotten')}>
          <Button type="button" colorScheme="blue" onClick={handleClick}>
            {formState.mode === 'login'
              ? 'No Account Yet?'
              : 'Already Have an Account?'}
          </Button>
        </Fade>

        <Button type="button" colorScheme="orange" onClick={handleClick}>
          {formState.mode === 'forgotten'
            ? 'Login/Register'
            : 'Forgot Password?'}
        </Button>
      </ButtonGroup>

      {formState.info ? <p className="text-red-300">{formState.info}</p> : null}
    </form>
  );
}

export default LoginRegistrationForm;
