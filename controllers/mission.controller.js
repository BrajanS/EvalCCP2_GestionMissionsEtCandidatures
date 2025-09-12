import getPool from "../databases/pool.js";
import { putStringifier } from "../functions/routeFunc.js";

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

const changeMission = async (req, res) => {
  try {
    const pool = await getPool();
    const target = Number(req.params.id);
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
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while changing mission" });
  }
};

const deleteMission = async (req, res) => {
  try {
    const pool = await getPool();
    const target = Number(req.params.id);
    const deleteMission = await pool.query(`
      DELETE FROM mission WHERE mission.id_mission = ${target}`);
    if (deleteMission) {
      res
        .status(204)
        .json({ message: `Successfully delete mission id_mission=${target}` });
    } else {
      res.status(500).json({ message: "Failed to delete mission" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while deleting mission" });
  }
};

export { getMissions, createMission, changeMission, deleteMission };
