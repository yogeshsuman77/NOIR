import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

const authMiddleware = async (req, res, next) => {
  try {

    const token = req.cookies.noir

    if (!token) {
      return res.status(401).json({
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }

    req.user = user;
    
    next();

  } catch (err) {
    res.status(401).json({
      message: "Unauthorized",
    });
  }
};

export default authMiddleware;