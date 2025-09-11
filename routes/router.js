import express from "express";

const route = express.Router();

route.get("/", async (_, res) => {
  res.send("<h1 style='font-family:Calibri,sans-serif;'>Root page</h1>");
});

export default route;
