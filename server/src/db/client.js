import config from "config";
import { MongoClient } from "mongodb";

const client = new MongoClient(config.mongodbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect();

process.on("SIGINT", () => {
  client.close().then(() => {
    console.info("Closing Mongo client");
  });

  process.exit(0);
});

export default client;
