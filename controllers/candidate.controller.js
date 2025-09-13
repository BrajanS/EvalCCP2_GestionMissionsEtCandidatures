import getPool from "../databases/pool.js";
import { findXTarget, putStringifier } from "../functions/routeFunc.js";

const getAllCandidates = async (_, res) => {
  try {
    const pool = await getPool();
    const candidates = await pool.query(`
        SELECT * FROM \`candidate\`;`);
    if (candidates) {
      res.status(200).json({ candidates: candidates[0] });
    } else {
      res.status(400).json({ message: "Couldn't find candidates" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while " });
  }
};

const getUserCandidate = async (req, res) => {
  try {
    const pool = await getPool();
    const target = Number(req.params.id);
    const found = await findXTarget(target);
    if (found) {
      const userListOfMissions = await pool.query(
        `
        SELECT c.id_candidate, c.status, m.id_mission, m.title, m.description, m.date
        FROM candidate c
        JOIN mission m ON c.fk_mission = m.id_mission
        WHERE c.fk_user = ?;`,
        target
      );
      if (userListOfMissions) {
        res.status(200).json({
          message: "All missions this user Candidated to:",
          missions: userListOfMissions[0],
        });
      } else {
        res.status(500).json({ message: "Failed to show all . . ." });
      }
    } else {
      res.status(404).json({ message: "User doesn't exist" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while " });
  }
};

const getMissionCandidate = async (req, res) => {
  try {
    const pool = await getPool();
    const target = Number(req.params.id);
    const found = await findXTarget(target, "mission");
    if (found) {
      const candidatesForThisMission = await pool.query(
        `
        SELECT c.id_candidate, c.status, m.title, u.id_user, u.name, u.email
        FROM candidate c
        JOIN users u ON c.fk_user = u.id_user
        JOIN mission m ON c.fk_mission = m.id_mission
        WHERE c.fk_mission = ?;`,
        target
      );
      if (candidatesForThisMission) {
        res.status(200).json({
          message: `List of all candidates of mission.id_mission=${target}`,
          candidates: candidatesForThisMission[0],
        });
      } else {
        res.status(500).json({ message: "Failed to show all . . ." });
      }
    } else {
      res.status(404).json({ message: "Mission doesn't exist" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while " });
  }
};

const postCandidate = async (req, res) => {
  try {
    const pool = await getPool();
    const { fk_user, fk_mission } = req.body;
    const verifData = [fk_user, fk_mission];
    // prettier-ignore
    if (verifData.some((data) => data === undefined || data === null || data === "")) {
      res.status(400).json({ message: "Some fields are empty" });
    } else {
      const postingCandidate = await pool.query(
        `INSERT INTO \`candidate\` (fk_user, fk_mission) VALUES (?,?)`,
        [fk_user, fk_mission]
      );
      if (postingCandidate) {
        res.status(201).json({ message: "Candidate was successfully posted !" });
      } else {
        res.status(500).json({ message: "Candidate failed to be posted" });
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while " });
  }
};

const candidateStatus = async (req, res) => {
  try {
    const pool = await getPool();
    const target = Number(req.params.id);
    const found = await findXTarget(target, "candidate");
    if (found) {
      const { status } = req.body;
      const jsonValues = {
        status: status,
      };
      const transformedData = putStringifier(jsonValues);
      const command = `UPDATE \`candidate\` SET ${transformedData[0]} WHERE candidate.id_candidate = ${target};`;
      const modifyCandidate = await pool.query(command, transformedData[1]);
      if (modifyCandidate) {
        // prettier-ignore
        res.status(200).json({ message: "Modified candidate's status successfully" });
      } else {
        res
          .status(400)
          .json({ message: "Modifying candidate's status failed" });
      }
    } else {
      res.status(404).json({ message: "Candidate doesn't exist" });
    }
  } catch (err) {
    console.error(err);
    // prettier-ignore
    res.status(500).json({ message: "Something went wrong while changing candidate status" });
  }
};

const deleteCandidate = async (req, res) => {
  try {
    const pool = await getPool();
    const target = Number(req.params.id);
    const found = await findXTarget(target, "candidate");
    if (found) {
      const deleteCandidate = await pool.query(`
      DELETE FROM candidate WHERE candidate.id_candidate = ${target}`);
      if (deleteCandidate) {
        res.status(204).json({
          message: `Successfully delete candidate id_candidate=${target}`,
        });
      } else {
        res.status(500).json({ message: "Failed to delete candidate" });
      }
    } else {
      res.status(404).json({ message: "Candidate doesn't exist" });
    }
  } catch (err) {
    console.error(err);
    // prettier-ignore
    res.status(500).json({ message: "Something went wrong while deleting candidate" });
  }
};

export {
  getAllCandidates,
  getUserCandidate,
  getMissionCandidate,
  postCandidate,
  candidateStatus,
  deleteCandidate,
};
