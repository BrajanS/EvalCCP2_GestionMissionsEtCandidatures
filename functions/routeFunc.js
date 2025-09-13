import getPool from "../databases/pool.js";

function putStringifier(jsonValues) {
  const filterValues = Object.fromEntries(
    Object.entries(jsonValues).filter(([_, value]) => {
      return value !== undefined && value !== "";
    })
  );
  // prettier-ignore
  const stringifyingValues = `${Object.keys(filterValues).map((key) => {
    return `\`${key}\` = ?`;
  }).join(", ")}`;

  const valuesArray = Object.values(filterValues);
  return [stringifyingValues, valuesArray];
}

async function findXTarget(target, tableName) {
  const pool = await getPool();
  // prettier-ignore
  const searchX = tableName === "candidate"
    ? await pool.query(`SELECT * FROM \`candidate\` WHERE candidate.id_candidate = ?`, [target])
    : tableName === "mission"
    ? await pool.query(`SELECT * FROM \`mission\` WHERE mission.id_mission = ?`, [target])
    : await pool.query(`SELECT \`users\`.email FROM \`users\` WHERE \`users\`.id_user = ?`, [target]);
  const boolConverter = searchX[0].length === 0 ? false : true;
  return boolConverter;
}

export { putStringifier, findXTarget };
