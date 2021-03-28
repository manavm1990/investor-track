import config from "config";
import db from "db";
import { Router } from "express";
import * as admin from "firebase-admin";
import path from "path";

const router = new Router();

const app = admin
  .initializeApp({
    credential: admin.credential.cert(
      path.join(
        __dirname,
        "investtrack-8953c-firebase-adminsdk-wq40m-f82fde5e6e.json"
      )
    ),
  })
  .auth();

/**
 * Handles any GET requests to "/investments/"
 */
router.get("/", (_, res) => {
  res.send("<h1>Hello from Investments GET Router</h1>");
});

/**
 * Get all of the records from MongoDB.
 * @param {Request} req
 * @param {string} req.body.email - email ID of the user
 * @param {string} req.headers.authorization - jwt
 * @returns {[Object]} - MongoDB results
 */
router.post(
  "/",
  async ({ headers: { authorization } = {}, body: { email } } = {}, res) => {
    try {
      const decodedToken = await app.verifyIdToken(authorization);

      if (!decodedToken?.uid || email !== config.admin) {
        res.status(401).json({ error: "401 - Unauthorized!" });
        return;
      }
      res.json(await db.findInvestments(email));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

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
        return;
      }

      const results = await db.addInvestment(name);

      // 201 - Created
      res.status(201).json(results);
    } catch (error) {
      if (error.name === "MongoError") {
        res.status(500).json({ error: error.message });
      }

      // Probably invalid data in the request
      res.status(400).json({ error: error.message });
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
      if (
        !investmentName ||
        // Check for an empty object
        !Object.entries(newInvestor).length
      ) {
        res
          .status(400)
          .json({ error: "Invalid investment name or new investor!" });

        /**
         * Even though `json` closes out response,
         * JS will keep going unless we use `return`
         */
        return;
      }
      res.json(await db.addInvestor(investmentName, newInvestor));
    } catch (error) {
      if (error.name === "MongoError") {
        res.status(500).json({ error: error.message });
      }

      // Probably invalid data in the request
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;
