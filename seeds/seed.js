import "dotenv/config";
import argon2 from "argon2";
import getPool from "../databases/pool.js";

async function seed() {
  const passwordsArray = ["amigo123", "tacos0ss99"];
  try {
    const pool = await getPool();
    const hashedPswd = await Promise.all(
      passwordsArray.map((pswd) => argon2.hash(pswd, { type: argon2.argon2id }))
    );
    await pool.query(`USE ${process.env.POOL_DB_NAME};`);
    // #region CLEANING DATA ---------------------------
    // Truncate --> Deletes data from Table AND Resets Auto_increment's
    await pool.query("SET FOREIGN_KEY_CHECKS = 0;"); // Truncate won't work because of strict FK, so disabling Temporarily FK fixes it
    await pool.query(`TRUNCATE TABLE candidate;`);
    await pool.query(`TRUNCATE TABLE mission;`);
    await pool.query(`TRUNCATE TABLE association;`);
    await pool.query(`TRUNCATE TABLE \`users\`;`);
    await pool.query("SET FOREIGN_KEY_CHECKS = 1;"); // Enabling FK checks
    // #endregion CLEANING DATA ------------------------
    // #region INSERTS ------------------
    await pool.query(`
        INSERT INTO \`users\` (email, \`password\`, surname, \`name\`, \`role\`) VALUES
        ('pepito@gmail.com', '${hashedPswd[0]}', 'amigo', 'pepito', 'benevole'),
        ('burito@outlook.com', '${hashedPswd[1]}', 'tartino', 'burito', 'association');`);
    await pool.query(`
        INSERT INTO \`association\` (\`name\`) VALUES
        ('France travail'),
        ('MAC Donald');`);
    await pool.query(`
        INSERT INTO mission (fk_association, title, \`description\`, \`date\`) VALUES 
        (2,'Making hamburgers', 'Bread, salad, steak, tomato, cheese, onions... mMMmm', '2025-09-15'),
        (1,'Constructeur', 'Architecturage et Construction de maisons,', '2025-11-11');`);
    await pool.query(`
        INSERT INTO candidate (fk_user, fk_mission) VALUES
        (1,1),
        (2,2);`);
    // #endregion INSERTS ---------------
    // #region SELECTS --------------
    const users = await pool.query(`SELECT * FROM users;`);
    const associations = await pool.query(`SELECT * FROM association;`);
    const missions = await pool.query(`SELECT * FROM mission;`);
    const candidates = await pool.query(`SELECT * FROM candidate;`);
    console.info("___________________________SEED__________________________");
    console.info("Users:\n", users[0]);
    console.info("Associations:\n", associations[0]);
    console.info("Missions:\n", missions[0]);
    console.info("Candidates:\n", candidates[0]);
    // #endregion SELECTS -----------
    process.exit(0);
  } catch (err) {
    console.error("Something failed while trying to Seed:\n", err);
    process.exit(1);
  }
}

seed();
