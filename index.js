import "dotenv/config";
import express from "express";
import getPool from "./databases/pool.js";
import cookieParser from "cookie-parser";
import router from "./routes/router.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser());

app.use("", router);

app.listen(port, async () => {
  try {
    console.info(`Server started at: http://localhost:${port}`);
  } catch (err) {
    console.error("Couldn't start the server... :\n", err);
  }
});
