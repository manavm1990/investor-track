import dotenv from "dotenv";

dotenv.config();

export default {
  port: process.env.PORT,
  mongodbURI: process.env.MONGODB_URI,
  admin: process.env.INVESTMENTS_ADMIN,
};
