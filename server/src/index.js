import config from "config";
import cors from "cors";
import express from "express";
import { investments } from "./routes";

const app = express();

app.get("/", (_, res) => {
  res.send("<h1>Hello Express!</h1>");
});

app.use(
  // Cross origin resource sharing
  cors(
    // TODO: Update this for production
    // Only allow access from 'localhost'
    { origin: "http://localhost:3000" }
  )
);

// Expect request bodies to be as JSON
app.use(express.json());

// localhost:8080/investments - investments route will handle this one!
app.use("/investments", investments);

app.listen(process.env.PORT, () => {
  console.info(`Express server 🏃🏾‍♂️ http://localhost:${config.port}`);
});
