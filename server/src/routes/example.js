import { Router } from "express";

const router = new Router();

// '/example/'
router.get("/", (_, res) => {
  res.send("<h1>Hello Example GET Route!</h1>");
});

export default router;
