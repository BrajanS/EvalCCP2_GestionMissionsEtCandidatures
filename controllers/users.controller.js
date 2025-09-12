import getPool from "../databases/pool.js";
import argon2 from "argon2";
import { putStringifier, findUser } from "../functions/routeFunc.js";

const getUsers = async (_, res) => {
  try {
    const pool = await getPool();
    const users = await pool.query(`
        SELECT * FROM \`users\`;`);
    if (users) {
      res.status(200).json({ users: users[0] });
    } else {
      res.status(400).json({ message: "Couldn't find users" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while getting Users" });
  }
};

const getUser = async (req, res) => {
  try {
    const target = Number(req.params.id);
    const pool = await getPool();
    const user = await pool.query(`
        SELECT * FROM users WHERE users.id_user = ${target};`);
    if (user[0].length > 0) {
      res.status(200).json({ user: user[0] });
    } else {
      res.status(404).json({ message: `User user_id=${target} doesn't exist` });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while getting User" });
  }
};

const createUser = async (req, res) => {
  try {
    const { email, password, surname, name, role } = req.body;
    const hashedPswd = await argon2.hash(password, { type: argon2.argon2id });
    const verifData = [email, hashedPswd, surname, name, role];
    const pool = await getPool();

    // prettier-ignore
    if (hashedPswd) {
      // prettier-ignore
      if (verifData.some((data) => data === undefined || data === null || data === "")) {
        res.status(400).json({ message: "Some fields are empty" });
      } else {
        const creatingUser = await pool.query(
          `INSERT INTO \`users\` (email, \`password\`, surname, \`name\`, \`role\`) VALUES (?,?,?,?,?)`,
          [email, hashedPswd, surname, name, role]
        );
        if (creatingUser) {
          res.status(201).json({ message: "User has been created" });
        } else {
          res.status(500).json({ message: "User failed to create" });
        }
      }
    } else {
      res.status(500).json({ message: "Failed to hash password" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while creating User" });
  }
};

const changeUser = async (req, res) => {
  try {
    const pool = await getPool();
    const target = Number(req.params.id);
    const found = await findUser(target);
    if (found) {
      const { email, password, surname, name, role } = req.body;
      const jsonValues = {
        email: email,
        password: password,
        surname: surname,
        name: name,
        role: role,
      };
      const transformedData = putStringifier(jsonValues);
      const command = `UPDATE \`users\` SET ${transformedData[0]} WHERE users.id_user = ${target};`;
      const modifyUser = await pool.query(command, transformedData[1]); // Has columns with "keyX = ?", and secure array of data later
      if (modifyUser) {
        res.status(200).json({
          message: `The User 'users.id_user = ${target}' got modified`,
        });
      } else {
        res.stauts(500).json({ message: "Failed to modify the User" });
      }
    } else {
      res.status(404).json({ message: "User doesn't exist" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while changing User" });
  }
};

const removeUser = async (req, res) => {
  try {
    const target = Number(req.params.id);
    const pool = await getPool();
    const deleteUser = await pool.query(`
      DELETE FROM users WHERE users.id_user = ${target}`);
    if (deleteUser) {
      // prettier-ignore
      res.status(204).json({ message: `Successfully delete user id_user=${target}` });
    } else {
      res.status(500).json({ message: "Failed to delete user" });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while removing User" });
  }
};

export { getUsers, getUser, createUser, changeUser, removeUser };
