import loginValidator from "../validators/login.validator.js";

const loginValidatorMiddleware = async (req, res, next) => {
  try {
    const { value: joiVal, error: joiErr } = loginValidator.validate(req.body);
    if (!joiErr) {
      req.body = joiVal;
      next();
    } else {
      res.status(400).json({ Error: joiErr.message });
    }
  } catch (err) {
    console.error("Something wrong happened while validating login:", err);
    res.status(500).send("Something wrong happened while validating login");
  }
};

export default loginValidatorMiddleware;
