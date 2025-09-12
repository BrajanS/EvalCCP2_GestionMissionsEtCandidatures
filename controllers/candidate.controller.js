import getPool from "../databases/pool.js";
import { putStringifier } from "../functions/routeFunc.js";

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong while " });
  }
};

const getMissionCandidate = async (req, res) => {
  try {
    const pool = await getPool();
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
    const deleteCandidate = await pool.query(`
      DELETE FROM candidate WHERE candidate.id_candidate = ${target}`);
    if (deleteCandidate) {
      res.status(204).json({
        message: `Successfully delete candidate id_candidate=${target}`,
      });
    } else {
      res.status(500).json({ message: "Failed to delete candidate" });
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
