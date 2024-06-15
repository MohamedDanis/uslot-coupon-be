import asyncHandler from "express-async-handler";
import db from "../index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // bcrypt.hash(password,10,(err,hash)=>{
  //     if(err){
  //         return res.status(500).json({ message: 'Error hashing password', error: err });
  //     }
  //     const q = "INSERT INTO admin (`email`,`password`) VALUES(?)";
  //     const value=[
  //         email,
  //         hash
  //     ]
  //     db.query(q,[value],(err,data)=>{
  //         if(err) return res.json(err)
  //         return res.json(data)
  //     })
  // })

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const q1 = "SELECT * FROM admin WHERE email = ?";
  db.query(q1, [email], (err, data) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }
    if (data.length === 0) {
      return res.status(400).json({ msg: "No admin found" });
    }
    const admin = data[0];

    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Error comparing passwords", error: err });
      }
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      return res.status(200).json({ msg: "Login Successfull", token: token });
    });
  });
});

export { adminLogin };
