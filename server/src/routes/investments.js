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
 * We use user's ✉️ to get all of the relevant records from MongoDB
 * @param {Request} req
 * @param {string} req.body.email - email ID of the user
 * @returns {[Object]} - MongoDB results
 */
router.post("/", async ({ body: { email } }, res) => {
  try {
    // TODO: ⚠️ Verify identity via Firebase auth ID token JWT
    const investments = await db.findInvestments(email);
    return res.json(investments);
  } catch (error) {
    // TODO: Use `switch/case` to send back appropriate codes/messages
    return res.status(401).json({ error: error.message });
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
    },
    res
  ) => {
    try {
      if (!name) {
        throw new Error("Investment name is invalid or undefined.");
      }
      // TODO: Check db results for an `"error"` 🔑 👇🏾
      return res.json(await db.addInvestment(name));
    } catch (error) {
      return res.status(500).json({ error: error.message });
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
  async ({ body: { investmentName, newInvestor } }, res) => {
    try {
      // TODO: Double check for falsy values b4 sending to db service method 👆🏾
      const results = await db.addInvestor(investmentName, newInvestor);

      // If our results includes a 🔑 called "error"
      if (Object.keys(results).includes("error")) {
        throw new Error(results.error);
      }
      return res.json(results);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
);

export default router;
