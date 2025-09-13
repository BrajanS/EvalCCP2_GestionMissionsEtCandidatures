import "dotenv/config";
import jwt from "jsonwebtoken";

/**
 * Authentication middleware.
 * Verifies JWT token, if authorized saves it in: `req.user`.
 *
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Object} next - Next middleware callback
 * @returns {void}
 */

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).send("Not Authorized acces: No Token received");
    } else {
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
      if (verifyToken) {
        req.user = verifyToken;
        next();
      } else {
        res.status(400).send("Token verification failed");
      }
    }
  } catch (err) {
    console.error({
      Authentification_failed: err.message,
      name: err.name,
      errorSource: err.stack.split("\n")[1],
    });
    res.status(500).send("Authentification Failed !");
  }
};

export default authMiddleware;
