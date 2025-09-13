import getPool from "../databases/pool.js";

const associationVerif = async (req, res, next) => {
  try {
    const role = req.user.role;
    if (role) {
      const permission = role === "association" ? true : false;
      if (permission) {
        next();
      } else {
        // prettier-ignore
        res.status(403).send("You are forbidden from entering ! It's for Association users only");
      }
    } else {
      res
        .status(500)
        .send("You need to Authentificate yourself to proceed further");
    }
  } catch (err) {
    console.error({
      Role_check_failed: err.message,
      name: err.name,
      errorSource: err.stack.split("\n")[1],
    });
    res.status(500).send("Role verification Failed !");
  }
};

export default associationVerif;
