const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // res.status(201).json({
    //   message: "User created successfully",
    //   success: true,
    //   data: user,
    // });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Registered successful",
        success: true,
        token,
        user: userData,
      });
  } catch (err) {
    res.status(401).json({ message: "Error creating user" });
  }
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
    };
    return res
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        success: true,
        token,
        user: userData,
      });
  } catch (err) {
    res.status(400).json({ message: "Error logging in" });
  }
};

module.exports.logout = async (req, res) => {
  try {
    return res
      .cookie("token", "", { maxAge: 0 })
      .status(201)
      .json({ message: "Loggedout successful", success: true });
  } catch (error) {
    console.log(error);
  }
};
