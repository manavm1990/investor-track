import config from "config";
import db from "db";
import { Router } from "express";

const router = new Router();

/**
 * Handles any GET requests to "/investments/"
 */
router.get("/", (_, res) => {
  res.send("<h1>Hello from Investments GET Router</h1>");
});

/**
 * We use user's ✉️ to get all of the records from MongoDB
 * @param {Request} req
 * @param {string} req.body.email - email ID of the user
 * @returns {[Object]} - MongoDB results
 */
router.post("/", async ({ body: { email } } = {}, res) => {
  try {
    // TODO: ⚠️ Verify identity via Firebase auth ID token JWT
    if (email !== config.admin) {
      throw new Error("401 - Unauthorized!");
    }
    return res.json(await db.findInvestments(email));
  } catch ({ message }) {
    // Pull the code from the message - if there is one, or assume `500`
    return res.status(400).json({ error: message });
  }
});

/**
 * Add a new investment
 * @param {Request} req
 * @param {string} req.body.investmentName - name of the investment
 * @returns {Object} - MongoDB results
 */
router.post(
  "/investment",
  async (
    {
      body: {
        investmentName:
          // Passed in as `investmentName`, but needs to be `name` for db service method.
          name,
      },
    } = {},
    res
  ) => {
    try {
      if (!name) {
        // `json` `end`s the response - no need for `res.end()`
        res.status(400).json({ error: "Invalid investment name!" });
      }

      const results = await db.addInvestment(name);

      // 201 - Created
      return res.status(201).json(results);
    } catch (error) {
      if (error.name === "MongoError") {
        return res.status(500).json({ error: error.message });
      }

      // Probably invalid data in the request
      return res.status(400).json({ error: error.message });
    }
  }
);

/**
 * Add a new investor
 * @param {Request} req
 * @param {string} req.body.investor - name of the investment
 * @returns {Object} - MongoDB results
 */
router.post(
  "/investor",

  // Use default parameter empty objects to avoid `cannot...of 'undefined'` 💩
  async ({ body: { investmentName, newInvestor = {} } = {} } = {}, res) => {
    try {
      if (!investmentName || !Object.entries(newInvestor).length) {
        res
          .status(400)
          .json({ error: "Invalid investment name or new investor!" });
      }
      return res.json(await db.addInvestor(investmentName, newInvestor));
    } catch (error) {
      if (error.name === "MongoError") {
        return res.status(500).json({ error: error.message });
      }

      // Probably invalid data in the request
      return res.status(400).json({ error: error.message });
    }
  }
);

export default router;
