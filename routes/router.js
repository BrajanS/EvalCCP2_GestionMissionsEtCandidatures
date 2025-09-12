// #region IMPORTS ----------
import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  getUsers,
  getUser,
  createUser,
  changeUser,
  removeUser,
} from "../controllers/users.controller.js";
import {
  getMissions,
  createMission,
  changeMission,
  deleteMission,
} from "../controllers/mission.controller.js";
import {
  candidateStatus,
  deleteCandidate,
  getAllCandidates,
  getMissionCandidate,
  getUserCandidate,
  postCandidate,
} from "../controllers/candidate.controller.js";
// #endregion IMPORTS -------

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
// #region MISSION
route.get("/missions", getMissions);
route.post("/postMission", createMission);
route.put("/changeMission/:id", changeMission);
route.delete("/deleteMission/:id", deleteMission);
// #endregion MISSION
// #region CANDIDATE
route.get("/candidates", getAllCandidates);
route.get("/candidates/user/:id", getUserCandidate);
route.get("/candidates/mission/:id", getMissionCandidate);

route.post("/postCandidate", postCandidate);
route.put("/candidate/:id", candidateStatus);
route.delete("/deleteCandidate/:id", deleteCandidate);
// #endregion CANDIDATE

export default route;
