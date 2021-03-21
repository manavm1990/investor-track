import config from "config";
import { MongoClient } from "mongodb";

const client = new MongoClient(config.mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default client;
