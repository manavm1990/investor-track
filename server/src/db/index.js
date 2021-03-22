import config from "config";
import client from "./client";

export default {
  /**
   * Use the ✉️ to find the relevent investment data.
   * Note 🎵: If this matches the 'env admin,' we get all investments
   * @param {string} user - ✉️
   * @returns {[Object]}
   */
  findInvestments(user) {
    // TODO: 🐛 Fix this code to avoid constant opening and closing of the connection
    return client.connect().then(async () => {
      try {
        const cursor = await client
          .db("investments")
          .collection("data")

          /**
           * If the user is the 'admin,'
           * we pass `null` into the `find`
           * thereby retrieving all of the data.
           *
           * Otherwise, we are 'finding in array'
           * only where the investor ✉️ matches our current user.
           * (https://docs.mongodb.com/manual/tutorial/query-arrays/#query-an-array-for-an-element)
           */
          .find(user === config.admin ? null : { "investors.email": user });
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
