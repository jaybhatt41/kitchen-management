const nodemailer = require("nodemailer");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
    });
    await user.save();

     transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification OTP",
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    });

    res.status(201).json({ message: "Registration initiated. Check your email for OTP." });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.status(200).json({ message: "Email verified successfully. Registration completed." });
  } catch (error) {
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

const loginUser=async(req,res)=>{
  try {
    const {email,password}=req.body
    if(!email || !password)
    {
      return res.status(400).json({msg:"Email and Password are required"})
    }
    const user=await User.findOne({email})
    if(!user)
    {
      return res.status(404).json({msg:"User not found"})
    }
    if(!user.isVerified)
    {
      return res.status(403).json({msg:"please verify your email first"})
    }
    const isPasswordValid=await bcrypt.compare(password,user.password)
    if(!isPasswordValid)
    {
      return res.status(401).json({msg:"Invalid credentials"})
    }
    const token=jwt.sign(
      {id:user._id,email:user.email},
      process.env.JWT_SECRET_KEY,
      {expiresIn:"1h"}
    )
    res.status(200).json({msg:"login successfully",token})
  } catch (error) {
    res.status(500).json({msg:"Server Error pls try again later"})
  }
}



module.exports = { registerUser, verifyOtp,loginUser};
