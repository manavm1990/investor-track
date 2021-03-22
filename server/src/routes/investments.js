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
 * @param{Object}
 * @returns {[Object]}
 */
router.post("/", async ({ body: { email } }, res) => {
  try {
    // TODO: ⚠️ Verify identity via Firebase auth ID token JWT
    const investments = await db.findInvestments(email);
    return res.json(investments);
  } catch (error) {
    // TODO: Use `switch/case` to send back appropriate codes/messages
    return res.status(401).json({ error: error.toString() });
  }
});

export default router;
