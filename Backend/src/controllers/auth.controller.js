import User from "../models/user.model.js";
import generateToken from "../lib/generateToken.js";
import bcrypt from "bcryptjs"

export const signup = async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;

    if (!fullName || !email || !password || !confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Please fill all the required details",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exist, Please Login",
      });
    }

    let hashedPassword;

    try {
        hashedPassword = await bcrypt.hash(password, 10);
    } catch (error) {
      console.log(error);
        return res.status(400).json({
            success: false,
            message: "Something went wrong"
        });
    }


    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });
    user.password = null;

    return res.status({
      success: false,
      message: "User created succesfully",
      user,
    });

  } catch (error) {
    console.log("Error in creating user");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user){
        return res.status(400).json({
            success: false,
            message: "User doesn't exist"
        });
    }

    if (!(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({
            success: false,
            message: "Password doesn't match"
        });
    }

    generateToken(user._id, res);

    res.status(200).json({
        success: true,
        message: "User logged in succesfully",
        user
    });

  } catch (error) {
    console.log("Error in signing in");
    console.log(error);
    return res.status(501).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({
      message: "Logged out succesfully",
    });
  } catch (error) {
    console.log("Error in logging out");
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
