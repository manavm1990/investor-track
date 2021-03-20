import express from "express";
import config from "./config";
import { example } from "./routes";

const app = express();

app.get("/", (_, res) => {
  res.send("<h1>Hello Express!</h1>");
});

// All routes will be receiving JSON in `req.body`
app.use(express.json());

// Route any requests made with path '/example'...
app.use("/example", example);

app.listen(process.env.PORT, () => {
  console.info(`Express server 🏃🏾‍♂️ on port: ${config.port}`);
});
