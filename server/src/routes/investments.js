// TODO: Break this route up (maybe `investments`/`investor`)

import config from "config";
import db from "db";
import { Router } from "express";
import * as admin from "firebase-admin";
import path from "path";

const router = new Router();

const authAdmin = admin
  .initializeApp({
    credential: admin.credential.cert(
      path.join(
        __dirname,
        "investtrack-8953c-firebase-adminsdk-wq40m-f82fde5e6e.json"
      )
    ),
  })
  .auth();

router.get("/", (_, res) => {
  res.send("<h1>Hello from Investments GET Router</h1>");
});

router.post(
  "/",

  /**
   * Get all of the records from MongoDB.
   * @param {Request} req
   * @param {string} req.headers.authorization - jwt
   */
  async ({ headers: { authorization } } = {}, res) => {
    try {
      const decodedToken = await authAdmin.verifyIdToken(authorization);

      // With OPTIONAL CHAINING, `email` may be `undefined` but no crash 🚗.
      // (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
      const email = decodedToken?.email;

      if (email !== config.admin) {
        res.status(401).json({ error: "401 - Unauthorized!" });
        return;
      }
      res.json(await db.findInvestments(email));
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// TODO: Consider updating these to use Mongo ids instead of names

// TODO: Double check for duplicate investment names b4 adding!
router.post(
  "/investment",

  /**
   * Add a new investment
   * @param {Request} req
   * @param {string} req.body.investmentName - name of the investment
   * @param {string} req.body.email - ✉️
   * @param {string} req.headers.authorization - jwt
   */
  async (
    {
      headers: { authorization } = {},
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

      // Only 'super admin' can do this one!
      const decodedToken = await authAdmin.verifyIdToken(authorization);

      if (decodedToken?.email !== config.admin) {
        res.status(401).json({ error: "401 - Unauthorized!" });
        return;
      }

      // 201 - Created
      res.status(201).json(await db.addInvestment(name));
    } catch (error) {
      if (error.name === "MongoError") {
        res.status(500).json({ error: error.message });
      }

      // Probably invalid data in the request
      res.status(400).json({ error: error.message });
    }
  }
);

router.patch(
  "/investment",

  /**
   * Update values in an investment
   * @param {Request} req
   * @param {string} req.body.investmentName - name of the investment
   * @param {Object} req.body.payload - Updates for investment
   * @param {string} req.headers.authorization - jwt
   */
  async (
    {
      headers: { authorization } = {},
      body: { investmentName: name, payload },
    } = {},
    res
  ) => {
    try {
      if (!name) {
        // `json` `end`s the response - no need for `res.end()`
        res.status(400).json({ error: "Invalid investment!" });
        return;
      }

      // Only 'super admin' can do this one!
      const decodedToken = await authAdmin.verifyIdToken(authorization);

      if (decodedToken?.email !== config.admin) {
        res.status(401).json({ error: "401 - Unauthorized!" });
        return;
      }

      const results = db.updateInvestmentButNotInvestors(name, payload);
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

router.post(
  "/investor",

  /**
   * Add a new investor to an investment
   * @param {Request} req
   * @param {string} req.body.investmentName - name of the investment
   * @param {string} req.body.newInvestor - name of the investor
   */
  async (
    {
      headers: { authorization } = {},
      body: { investmentName, newInvestor = {} } = {},
    } = {},
    res
  ) => {
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

      // Only the admin can do this!
      const decodedToken = await authAdmin.verifyIdToken(authorization);

      // We can take the ✉️ directly
      if (decodedToken?.email !== config.admin) {
        res.status(401).json({ error: "401 - Unauthorized!" });
        return;
      }

      res.json(await db.addInvestorToInvestment(investmentName, newInvestor));
    } catch (error) {
      if (error.name === "MongoError") {
        res.status(500).json({ error: error.message });
      }

      // Probably invalid data in the request
      res.status(400).json({ error: error.message });
    }
  }
);

router.patch(
  "/investor",

  /**
   * Update investor details
   * @param {Request} req
   * @param {string} req.headers.authorization - JWT
   * @param {string} req.body.investorEmail - ✉️
   * @param {string} req.body.payload - Updated details
   */
  async (
    { headers: { authorization } = {}, body: { investorEmail, payload } } = {},
    res
  ) => {
    try {
      if (!investorEmail) {
        res.status(400).json({ error: "Invalid investor!" });
        return;
      }

      // Only admin or logged in investor can do this one!
      const decodedToken = await authAdmin.verifyIdToken(authorization);
      const loggedInEmail = decodedToken?.email;

      if (loggedInEmail !== config.admin && loggedInEmail !== investorEmail) {
        res.status(401).json({ error: "401 - Unauthorized!" });
        return;
      }

      // Only admin can update `investmentAmt`!
      if (loggedInEmail !== config.admin) {
        res.status(401).json({
          error:
            "401 - You may not change your investment amount. Only admin can do that.",
        });
        return;
      }

      const investmentsWithInvestorEmail = await db.findInvestor(investorEmail);

      // Get the existing document info to merge with our payload
      const currentInvestor = investmentsWithInvestorEmail.investors
        // Array - find (not MongoDb)
        .find(({ email }) => email === investorEmail);

      // Get all of the fields for investor
      const fullPayload = {
        // Our new `payload` info will overwrite any matching existing 🔑s
        ...currentInvestor,
        ...payload,
      };

      res
        .status(201)
        .json(await db.updateInvestorInfo(investorEmail, fullPayload));
    } catch (error) {
      if (error.name === "MongoError") {
        res.status(500).json({ error: error.message });
      }

      // Probably invalid data in the request
      res.status(400).json({ error: error.message });
    }
  }
);

router.delete(
  "/investment",

  /**
   * 🔥 investment
   * @param {Request} req
   * @param {string} req.headers.authorization - JWT
   * @param {string} req.body.investmentName - name of investment
   */
  async (
    { headers: { authorization } = {}, body: { investmentName } } = {},
    res
  ) => {
    try {
      // Only admin can delete an investment
      const decodedToken = await authAdmin.verifyIdToken(authorization);

      // We can take the ✉️ directly
      if (decodedToken?.email !== config.admin) {
        res.status(401).json({ error: "401 - Unauthorized!" });
        return;
      }

      res.status(202).json(await db.deleteInvestment(investmentName));
    } catch (error) {
      if (error.name === "MongoError") {
        res.status(500).json({ error: error.message });
      }

      // Probably invalid data in the request
      res.status(400).json({ error: error.message });
    }
  }
);

// TODO: 🔥 Investor

export default router;
