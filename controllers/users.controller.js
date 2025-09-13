import getPool from "../databases/pool.js";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { putStringifier, findXTarget } from "../functions/routeFunc.js";

const getUsers = async (_, res) => {
  try {
    const pool = await getPool();
    const users = await pool.query(`
        SELECT \`users\`.id_user, \`users\`.email, \`users\`.surname, \`users\`.name, \`users\`.role FROM \`users\`;`);
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
        SELECT \`users\`.id_user, \`users\`.email, \`users\`.surname, \`users\`.name, \`users\`.role FROM users WHERE users.id_user = ${target};`);
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

const registerUser = async (req, res) => {
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
          [email.toLowerCase(), hashedPswd, surname, name, role]
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

const loginUser = async (req, res) => {
  try {
    const pool = await getPool();
    const { email, password } = req.body;
    const verifData = [email, password];
    // prettier-ignore
    if (verifData.some((data) => data === undefined || data === null || data === "")) {
      res.status(400).json({ message: "Some fields are empty" });
    } else {
      const [exists] = await pool.query(
        `SELECT \`users\`.id_user, \`users\`.email, \`users\`.password, \`users\`.role FROM \`users\` WHERE \`users\`.email = ?;`,
        email.trim().toLowerCase()
      );
      if (exists.length > 0) {
        // prettier-ignore
        const argonVerif = await argon2.verify(exists[0].password, password);
        console.info("ArgonVerif:", argonVerif);
        if (argonVerif) {
          // prettier-ignore
          // Token
          const token = jwt.sign({ id: exists[0].id_user, role: exists[0].role }, process.env.JWT_SECRET, { expiresIn: `1h` });
          // Cookie
          res.cookie("jwt", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 1 * 60 * 60 * 1000, // 1h
          });
          // prettier-ignore
          res.status(200).send(`Logged successfully into ${JSON.stringify(exists[0].email)}`);
        } else {
          res
            .status(401)
            .send("Error 401: Unauthorized access ! Verification failed");
        }
      } else {
        res.status(404).json({message: "This user doesn't exist ! Please login into a existing User or register first."});
      }
    }
  } catch (err) {
    console.error(err);
    res.status(500).json("Something went wrong when logging-In");
  }
};

const changeUser = async (req, res) => {
  try {
    const pool = await getPool();
    const target = Number(req.params.id);
    const found = await findXTarget(target);
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

const logoutUser = async (_, res) => {
  try {
    res.clearCookie("jwt", {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).send("Logged out");
  } catch (error) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Something went wrong while logging-Out..." });
  }
};

export {
  getUsers,
  getUser,
  registerUser,
  changeUser,
  removeUser,
  loginUser,
  logoutUser,
};
