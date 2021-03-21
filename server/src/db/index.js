import client from "./client";

export default {
  // TODO: `findInvestmentsAsAdmin`
  findInvestments() {
    return client.connect().then(async () => {
      try {
        const cursor = await client.db("investments").collection("data").find();
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
