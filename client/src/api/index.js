import ky from 'ky';
import auth from './auth';

const dbBaseURL = 'http://localhost:8080';
const dbBasePath = 'investments';

const api = {
  auth: {
    async show(email, password) {
      try {
        if (email && password) {
          return auth.signInWithEmailAndPassword(email, password);
        }

        // If no email and password, just check for a current user
        return auth.currentUser;
      } catch (error) {
        throw new Error(error);
      }
    },

    async create(email, password) {
      try {
        const user = await auth.createUserWithEmailAndPassword(email, password);
        return user;
      } catch (error) {
        throw new Error(error);
      }
    },

    update(email) {
      return auth
        .sendPasswordResetEmail(email)
        .then(() => 'Go check your ✉️❗')
        .catch(error => {
          throw new Error(error);
        });
    },

    delete() {
      return auth
        .signOut()
        .then(() => true)
        .catch(error => {
          throw new Error(error);
        });
    },
  },
  photo: {
    async create(imgFile) {
      const fd = new FormData();

      fd.append('file', imgFile);
      fd.append('upload_preset', process.env.REACT_APP_CLOUDINARY_PRESET);

      const resp = await ky
        .post(
          `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,

          // Request body that we want to send to the server
          { body: fd }
        )
        .json();
      return resp;
    },
  },
  db: {
    /**
     * Get all investments for either a user or for everyone if 'admin.'
     * @param {Object} user - the current user
     * @param {string} user.token - JWT
     * @param {string} path - 👆🏾
     * @returns {[Object]}
     */
    async index({ token }, path = dbBasePath) {
      const resp = await ky
        .post(`${dbBaseURL}/${path}`, {
          headers: { Authorization: token },
        })
        .json();

      return resp;
    },

    /**
     * Create a new investment or add an investor
     * @param {Object} args
     * @param {string} args.token - JWT
     * @param {Object} args.newInvestor
     * @param {string} args.investmentName
     * @param {string} path - 👆🏾
     * @returns {Object}
     */
    async create({
      token,
      newInvestor,
      investmentName,
      path = dbBasePath,
    } = {}) {
      const resp = await ky
        .post(`${dbBaseURL}/${path}`, {
          headers: { Authorization: token },
          json: { newInvestor, investmentName },
        })
        .json();

      return resp;
    },
  },
};

export default api;
