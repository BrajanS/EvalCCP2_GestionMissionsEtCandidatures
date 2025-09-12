import express from "express";
import {
  getUsers,
  getUser,
  createUser,
  changeUser,
  removeUser,
} from "../controllers/users.controller.js";

const route = express.Router();

route.get("/", async (_, res) => {
  res.send("<h1 style='font-family:Calibri,sans-serif;'>Root page</h1>");
});

// #region USER
route.get("/users", getUsers);
route.get("/user/:id", getUser);
route.post("/createUser", createUser);
route.put("/user/:id", changeUser);
route.delete("/deleteUser/:id", removeUser);
// #endregion USER

export default route;
