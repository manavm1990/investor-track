import firebase from 'firebase';
import 'firebase/auth';
import config from './config';

const auth = firebase.initializeApp(config).auth();

export default auth;
