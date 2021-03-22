import config from "config";
import client from "./client";

export default {
  findInvestments(user) {
    return client.connect().then(async () => {
      try {
        const cursor = await client
          .db("investments")
          .collection("data")

          // If it's the admin, 'find all'
          .find(user === config.admin ? null : user);
        const results = await cursor.toArray();
        return results;
      } catch (error) {
        throw new Error(error);
      } finally {
        // Close the connection to the MongoDB cluster
        client.close();
      }
    });
  },
};
