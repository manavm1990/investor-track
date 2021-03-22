import db from "db";
import { Router } from "express";

const router = new Router();

router.get("/", (_, res) => {
  res.send("<h1>Hello from Investments GET Router</h1>");
});

// Get all investments for all investors
router.get("/admin", async (_, res) => {
  // TODO: Wrap this in `try-catch` for error handling.
  // TODO: ⚠️ Verify identity via Firebase auth ID token JWT
  const investments = await db.findInvestments();
  res.json(investments);
});

export default router;
