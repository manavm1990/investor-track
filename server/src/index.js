import config from "config";
import cors from "cors";
import express from "express";
import { investments } from "./routes";

const app = express();

app.get("/", (_, res) => {
  res.send("<h1>Hello Express!</h1>");
});

app.use(
  cors(
    // TODO: Update this for production
    // Only allow access from 'localhost'
    { origin: "http://localhost" }
  )
);

app.use(express.json());

app.use("/investments", investments);

app.listen(process.env.PORT, () => {
  console.info(`Express server 🏃🏾‍♂️ http://localhost:${config.port}`);
});
