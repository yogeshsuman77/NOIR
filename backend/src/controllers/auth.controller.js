import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

// SIGNUP
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required",
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    if (!password) {
      return res.status(400).json({
          message: "Name and email are required",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("noir", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })
    
    res.status(201).json({
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({
      message: "Signup failed",
      error: err.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    if (!user.password) {
      return res.status(401).json({
        message: "Please login using Google"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("noir", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    res.status(500).json({
      message: "Login failed",
      error: err.message,
    });
  }
};