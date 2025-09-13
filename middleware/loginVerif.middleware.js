import loginValidator from "../validators/login.validator.js";

/**
 * -> Request from Express
 * @typedef {Object} Req
 * -> Request from Express
 * @typedef {Object} Res
 * -> Promise without Returns to Caller
 * @param {Object} next - Next middleware callback
 * -> Returns nothing
 * @typedef {Promise<void>} Pvoid
 */

/**
 * Uses the Joi schema to verify syntax in API REST tools
 * @param {Req}- Request
 * @param {Res} - Response of middleware function that verifies roles
 * @returns {Pvoid} - Returns Nothing
 */

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
