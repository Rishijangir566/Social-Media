import Register from "../models/register.js";
import Profile from "../models/profile.js";
import userPost from "../models/post.js";

import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { sendVerificationEmail } from "../email.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

function generateToken(dataId) {
  return jwt.sign({ id: dataId }, process.env.JWT_SECRET);
}

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (result) resolve(result);
        else reject(err);
      }
    );
    stream.end(buffer);
  });
}
export async function handleRegister(req, res) {
  const { email, userName, password } = req.body;
  const userExists = await Register.findOne({ email });
  if (userExists) {
    return res.status(409).json({ message: "Email already in use" });
  }
  const token = jwt.sign(
    { email, userName, password },
    process.env.JWT_SECRET,
    {
      expiresIn: "10m",
    }
  );


  try {
    await sendVerificationEmail(email, token);
    res.status(200).json({ message: "Verification email sent!" });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).send("Token has expired");
    } else {
      return res.status(400).send("Invalid token");
    }
  }
}
export async function verifyEmail(req, res) {
  console.log("first");
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { userName, email, password } = decoded;
    const Semail = email.toLowerCase();
    const newData = new Register({ email: Semail, userName, password });

    await newData.save();
    console.log("Email verified. User registered successfully!");

    res
      .status(201)
      .json({ message: "Email verified. User registered successfully!" });
  } catch (err) {
    res.status(400).send("Invalid or expired link");
  }
}

export async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    const user = await Register.findOne({ email });
    console.log("user:", user);

    if (!user || user.password !== String(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    const profileData = {
      uniqueId: user._id,
      userName: user.userName,
      email: user.email,
      name: "",
      phone: "",
      gender: "",
      dob: "",
      Address: "",
      state: "",
      city: "",
      bio: "",
      profilePic: "",
    };

    console.log(profileData);
    const newProfile = new Profile(profileData);
    const savedProfile = await newProfile.save();

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "Login successfull,Profile created",
        user: savedProfile,
      });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(400).json({ message: "Login error" }, err);
  }
}

export async function updateProfile(req, res) {
  const userId = req.user._id;
  console.log("Updating profile for user:", userId);

  const MAX_SIZE = 2 * 1024 * 1024;

  if (req.file && req.file.size > MAX_SIZE) {
    return res
      .status(400)
      .json({ message: "Profile picture must be under 2MB" });
  }

  try {
    const { profilePic, ...profileFields } = req.body;

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "profile_pics"
      );
      profileFields.profilePic = uploaded.secure_url;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { uniqueId: userId },
      profileFields
    );

    res.status(200).json({ message: "Profile updated", user: updatedProfile });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function handleShareData(req, res) {
  try {
    const userId = req.user._id;
    // console.log(userId);
    // console.log(req.body);

    const MAX_SIZE = 2 * 1024 * 1024;

    if (req.file && req.file.size > MAX_SIZE) {
      return res
        .status(400)
        .json({ message: "Profile picture must be under 2MB" });
    }
    const { content, hashtags } = req.body;

    let postPicUrl = null;
    if (req.file) {
      const uploaded = await uploadToCloudinary(req.file.buffer, "post_pics");
      postPicUrl = uploaded.secure_url;
    }

    const postData = {
      uniqueId: userId,
      content,
      hashtags,
      postImage: postPicUrl,
    };
    console.log(postData);
    const newPost = new userPost(postData);
    const savedPost = await newPost.save();

    res
      .status(201)
      .json({ message: " New Post created", postDetails: savedPost });
  } catch (error) {
    console.error("Post uploaded error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
