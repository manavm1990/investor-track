import { Router } from "express";

const router = new Router();

router.get("/", (_, res) => {
  res.send("<h1>Hello Investments GET Route!</h1>");
});

export default router;
