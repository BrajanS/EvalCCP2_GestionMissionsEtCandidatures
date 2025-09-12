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

async function findUser(target) {
  const pool = await getPool();
  const searchUser = await pool.query(
    `SELECT \`users\`.email FROM \`users\` WHERE \`users\`.id_user = ${target}`
  );
  const boolConverter = searchUser[0].length === 0 ? false : true;
  return boolConverter;
}

export { putStringifier, findUser };
