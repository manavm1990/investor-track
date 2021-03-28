import config from "config";
import client from "./client";

const db = "investments";
const collection = "data";

export default {
  /**
   * Use the ✉️ to find the relevant investment data.
   * Note 🎵: If this matches the 'env admin,' we get all investments
   * @param {string} user - ✉️
   * @returns {[Object]}
   */
  async findInvestments(user) {
    try {
      const cursor = await client
        .db(db)
        .collection(collection)

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

      // `await` is on receiver - no need here
      return cursor.toArray();
    } catch (error) {
      throw new Error(error);
    }
  },

  // TODO: Consider updating these to use Mongo ids instead of names

  /**
   * Add a new investment
   * @param {string} investment
   * @returns {Object}
   */
  addInvestment(investment) {
    try {
      return client
        .db(db)
        .collection(collection)
        .insertOne({ name: investment });
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Update an investment
   * @param {investment} investment name
   * @param {Object} payload
   * @returns {Object}
   */
  updateInvestmentButNotInvestors(investment, payload) {
    try {
      return client
        .db(db)
        .collection(collection)
        .updateOne({ name: investment }, { $set: payload });
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Add an investor to an investment
   * @param {string} investment - `name`
   * @param {Object} investor
   * @returns {Object}
   */
  addInvestor(investment, investor) {
    try {
      return (
        client
          .db(db)
          .collection(collection)

          // Update an investment that has a `name` of `investment` by pushing `investor`
          .updateOne({ name: investment }, { $push: { investors: investor } })
      );
    } catch (error) {
      throw new Error(error);
    }
  },

  /**
   * Add an investor to an investment
   * @param {string} investor - ✉️
   * @param {Object} payload
   * @returns {Object}
   */
  updateInvestor(investor, payload) {
    try {
      return (
        client
          .db(db)
          .collection(collection)

          // Update an investment that has a `name` of `investment` by pushing `investor`
          .updateOne({ name: investment }, { $push: { investors: investor } })
      );
    } catch (error) {
      throw new Error(error);
    }
  },
};
