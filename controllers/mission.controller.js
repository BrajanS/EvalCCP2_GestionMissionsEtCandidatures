import getPool from "../databases/pool.js";
import { findXTarget, putStringifier } from "../functions/routeFunc.js";

/**
 * @module missionController
 * : All controller functions for Mission's routes
 */

/**
 * -> Request from Express
 * @typedef {Object} Req
 * -> Request from Express
 * @typedef {Object} Res
 * -> Promise without Returns to Caller
 * @typedef {Promise<void>} Pvoid
 * -> Ignored ("_" -> Not used) Request from Express
 * @typedef {Object} ignoredReq
 */

/**
 * Get all missions
 * @param {ignoredReq} - Request
 * @param {Res} - Response of All users
 * @returns {Pvoid} - Returns Nothing
 */
const getMissions = async (_, res) => {
  try {
    const pool = await getPool();
    const missions = await pool.query(`
        SELECT * FROM \`mission\`;`);
    if (missions) {
      res.status(200).json({ missions: missions[0] });
    } else {
      res.status(400).json({ message: "Couldn't find missions" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while searching missions" });
  }
};

/**
 * Create a mission
 * @param {Req}- Request
 * @param {Res} - Response managing to create a mission
 * @returns {Pvoid} - Returns Nothing
 */
const createMission = async (req, res) => {
  try {
    const pool = await getPool();
    const { title, description, date, fk_association } = req.body;
    const verifData = [title, description, date, fk_association];
    // prettier-ignore
    if (verifData.some((data) => data === undefined || data === null || data === "")) {
      res.status(400).json({ message: "Some fields are empty" });
    } else {
      const creatingMission = await pool.query(
        `INSERT INTO \`mission\` (title, \`description\`, date, \`fk_association\`) VALUES (?,?,?,?)`,
        [title, description, date, fk_association]
      );
      if (creatingMission) {
        res.status(201).json({ message: "Mission was successfully created !" });
      } else {
        res.status(500).json({ message: "Mission failed to be created" });
      }
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while creating mission" });
  }
};

/**
 * Change a mission
 * @param {Req}- Request
 * @param {Res} - Response changed mission
 * @returns {Pvoid} - Returns Nothing
 */
const changeMission = async (req, res) => {
  try {
    const pool = await getPool();
    const target = Number(req.params.id);
    const found = await findXTarget(target, "mission");
    if (found) {
      const { title, description, date, fk_association } = req.body;
      const jsonValues = {
        title: title,
        description: description,
        date: date,
        fk_association: fk_association,
      };
      const transformedData = putStringifier(jsonValues);
      const command = `UPDATE \`mission\` SET ${transformedData[0]} WHERE mission.id_mission = ${target};`;
      const modifyMission = await pool.query(command, transformedData[1]);
      if (modifyMission) {
        res.status(200).json({ message: "Modified mission successfully" });
      } else {
        res.status(400).json({ message: "Modifying mission failed" });
      }
    } else {
      res.status(404).json({ message: "User doesn't exist" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while changing mission" });
  }
};

/**
 * Create a mission
 * @param {Req}- Request
 * @param {Res} - Response of deleting a mission
 * @returns {Pvoid} - Returns Nothing
 */

const deleteMission = async (req, res) => {
  try {
    const pool = await getPool();
    const target = Number(req.params.id);
    const found = await findXTarget(target, "mission");
    if (found) {
      const deleteMission = await pool.query(`
      DELETE FROM mission WHERE mission.id_mission = ${target}`);
      if (deleteMission) {
        res.status(204).json({
          message: `Successfully delete mission id_mission=${target}`,
        });
      } else {
        res.status(500).json({ message: "Failed to delete mission" });
      }
    } else {
      res.status(404).json({ message: "User doesn't exist" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while deleting mission" });
  }
};

export { getMissions, createMission, changeMission, deleteMission };
