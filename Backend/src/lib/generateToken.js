import jwt from "jsonwebtoken";

const generateToken = (userId, res) => {
    let token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
      expiresIn: "2h",
    });
  
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 24 * 60 * 60 * 1000,
    });
};

export default generateToken;