import Register from "../models/register.js";
import Profile from "../models/profile.js";
import userPost from "../models/post.js";
import friendRequest from "../models/connection.js";
import mongoose from "mongoose";
import axios from "axios";
import nodemailer from "nodemailer";

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
  const { email, name, password } = req.body;

  const userExists = await Register.findOne({ email });

  if (userExists && userExists.oauthProvider === "local") {
    return res.status(409).json({ message: "Email already in use" });
  }
  const Registration_Token = jwt.sign(
    { email, name, password },
    process.env.JWT_SECRET,
    { expiresIn: "10m" }
  );

  try {
    await sendVerificationEmail(email, Registration_Token);
    return res
      .status(200)
      .json({ message: `Verification email sent to ${email}` });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(400).send("Token has expired");
    }
  }
}

export async function verifyEmail(req, res) {
  console.log("first");

  const { token } = req.params;
  console.log(token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);

    const { name, email, password } = decoded;
    const Semail = email.toLowerCase();

    const userExists = await Register.findOne({
      email: Semail,
      oauthProvider: "local",
    });

    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newData = new Register({
      email: Semail,
      name,
      password,
      oauthProvider: "local",
    });

    console.log("Creating new user:", newData);
    await newData.save();
    console.log("New user saved:", newData);

    return res.send("Email verified. User registered successfully!");
  } catch (err) {
    console.error("Error during verification:", err);
    res
      .status(400)
      .json({ error: "Invalid or expired link", details: err.message });
  }
}

export async function handleLogin(req, res) {
  console.log("first");
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await Register.findOne({ email, oauthProvider: "local" });

    if (!user || user.password !== String(password)) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    let userDetail = await Profile.findOne({ uniqueId: user._id });

    if (!userDetail) {
      userDetail = new Profile({
        uniqueId: user._id,
        userName: "",
        email: user.email,
        name: user.name,
        phone: "",
        gender: "",
        dob: "",
        address: "",
        state: "",
        city: "",
        bio: "",
        profilePic: "",
        oauthProvider: "local",
        firstTimeSignIn: false,
      });
      await userDetail.save();
    }
    console.log(userDetail);
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
        user: userDetail,
      });
  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(400).json({ message: "Login error" }, err);
  }
}

export const getUserById = async (req, res) => {
  try {
    const user = await Profile.findOne({ uniqueId: req.params.userId }).select(
      "-password"
    );
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

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
    const { profilePic, firstTimeSignIn, ...profileFields } = req.body;
    console.log(firstTimeSignIn);

    if (req.file) {
      const uploaded = await uploadToCloudinary(
        req.file.buffer,
        "profile_pics"
      );
      console.log(uploaded);
      profileFields.profilePic = uploaded.secure_url;
    }

    const updatedProfile = await Profile.findOneAndUpdate(
      { uniqueId: userId },
      {
        ...profileFields,
        firstTimeSignIn: firstTimeSignIn,
      },
      { new: true }
    );
    console.log(updatedProfile);

    res.status(200).json({ message: "Profile updated", user: updatedProfile });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

export async function handleShareData(req, res) {
  try {
    // console.log(req.body);
    const userId = req.user._id;

    const MAX_SIZE = 2 * 1024 * 1024;

    if (req.file && req.file.size > MAX_SIZE) {
      return res
        .status(400)
        .json({ message: "Profile picture must be under 2MB" });
    }
    const { content, hashtags, userName, profilepic } = req.body;

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
      userName: userName,
      profilePic: profilepic,
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

export async function getMe(req, res) {
  try {
    const id = req.user._id;

    const user = await Profile.findOne({ uniqueId: id }).select("-__v");
    // console.log(user);
    if (!user) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("getMe Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

export async function githubAuthorization(req, res) {
  console.log("first");
  try {
    const { code, redirectUri } = req.body;

    const tokenResponse = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: redirectUri,
        }),
      }
    );

    const tokenData = await tokenResponse.json();
    const access_token = tokenData.access_token;

    if (!access_token) {
      return res.status(400).json({
        success: false,
        message: "Failed to get access token from GitHub",
      });
    }

    // Fetch GitHub user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `token ${access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!userResponse.ok) {
      return res.status(400).json({
        success: false,
        message: "Failed to fetch GitHub user details",
      });
    }

    const githubUser = await userResponse.json();

    // Optional: fetch emails
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const emails = await emailsResponse.json();

    // Optional: fetch events
    const eventsResponse = await fetch(
      `https://api.github.com/users/${githubUser.login}/events`,
      {
        headers: {
          Authorization: `token ${access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    const events = await eventsResponse.json();

    const primaryEmailObj = emails.find(
      (emailObj) => emailObj.primary && emailObj.verified
    );
    const email =
      primaryEmailObj?.email ||
      githubUser.email ||
      `${login}@users.noreply.github.com`;

    const { name, id, html_url } = githubUser;

    // Step 1: Check if user exists

    const userExists = await Register.findOne({
      oauthId: id,
    });
    // console.log(userExists);

    if (!userExists) {
      const newData = new Register({
        email,
        name,
        oauthProvider: "github",
        oauthId: id,
        url: html_url,
      });
      await newData.save();
    }

    const userDetail = await Register.findOne({ oauthId: id });
    console.log(userDetail);

    const token = generateToken(userDetail._id);

    let user = await Profile.findOne({ uniqueId: userDetail._id });

    if (!user) {
      user = new Profile({
        uniqueId: userDetail._id,
        userName: userDetail.userName || "",
        email: userDetail.email,
        name: userDetail.name || "",
        phone: "",
        gender: "",
        dob: "",
        Address: "",
        state: "",
        city: "",
        bio: "",
        profilePic: "",
        url: userDetail.url,
        oauthProvider: "github",
        firstTimeSignIn: false,
      });
      await user.save();
    }
    console.log(user);

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "GitHub Authentication Completed",
        user: user,
      });
  } catch (err) {
    console.error("GitHub OAuth Error:", err.message);
    res.status(500).json({ error: "OAuth failed", details: err.message });
  }
}

export async function googleAuthorization(req, res) {
  try {
    const { code, redirectUri } = req.body;

    // Step 1: Exchange code for access_token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    const access_token = tokenData?.access_token;

    if (!access_token) {
      return res
        .status(400)
        .json({ message: "Failed to get access token from Google" });
    }

    // Step 2: Use token to fetch user info
    const userRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userInfo = await userRes.json();

    // console.log(userInfo);
    const { email, id, given_name } = userInfo;
    console.log(userInfo);

    // Step 1: Check if user exists
    let userExists = await Register.findOne({ oauthId: id });

    if (!userExists) {
      const Registeruser = new Register({
        email,
        oauthProvider: "google",
        oauthId: id,
        name: given_name,
      });
      await Registeruser.save();
    }

    const userDetail = await Register.findOne({ oauthId: id });

    const token = generateToken(userDetail._id);

    // Optionally, check if profile already exists
    let user = await Profile.findOne({ uniqueId: userDetail._id });

    if (!user) {
      user = new Profile({
        uniqueId: userDetail._id,
        userName: userDetail.userName,
        email: userDetail.email,
        name: userDetail.name || "",
        phone: "",
        gender: "",
        dob: "",
        Address: "",
        state: "",
        city: "",
        bio: "",
        profilePic: userDetail.profileUrl || "",
        oauthProvider: "google",
        firstTimeSignIn: false,
      });
      await user.save();
    }

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "Google Authentication Successful",
        user: user,
      });
  } catch (err) {
    console.error("Google OAuth Error:", err.message);
    res.status(500).json({ error: "OAuth failed", details: err.message });
  }
}

export async function linkedinAuthorization(req, res) {
  try {
    const { code, redirectUri } = req.body;

    const tokenParams = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
    });
    // console.log(tokenParams);

    const tokenResponse = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      tokenParams,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    // console.log(accessToken);

    const userInfoResponse = await axios.get(
      "https://api.linkedin.com/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const userInfo = userInfoResponse.data;
    const { email, sub, name } = userInfo;
    console.log(userInfo);

    let userExists = await Register.findOne({ oauthId: sub });
    if (!userExists) {
      const Registeruser = new Register({
        email,
        oauthProvider: "linkedin",
        oauthId: sub,
        name,
      });
      await Registeruser.save();
    }
    const userDetail = await Register.findOne({ oauthId: sub });
    const token = generateToken(userDetail._id);
    let user = await Profile.findOne({ uniqueId: userDetail._id });

    if (!user) {
      user = new Profile({
        uniqueId: userDetail._id,
        userName: userDetail.userName,
        email: userDetail.email,
        name: userDetail.name || "",
        phone: "",
        gender: "",
        dob: "",
        Address: "",
        state: "",
        city: "",
        bio: "",
        profilePic: userDetail.profileUrl || "",
        oauthProvider: "linkedin",
        firstTimeSignIn: false,
      });
      await user.save();
    }

    return res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
        maxAge: 2 * 60 * 60 * 1000,
      })
      .status(201)
      .json({
        message: "Linkedin Authentication Successful",
        user: user,
      });
  } catch (err) {
    console.error("LinkedIn Auth Error:", err.message);
    res
      .status(500)
      .json({ error: "LinkedIn OAuth failed", details: err.message });
  }
}

export async function findAllProfiles(req, res) {
  try {
    const users = await Profile.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
}
export async function findAllPosts(req, res) {
  try {
    const users = await userPost.find().select("-password");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
}

export async function findUserName(req, res) {
  const { username } = req.query;

  if (!username || username.trim() === "") {
    return res
      .status(400)
      .json({ available: false, message: "Username is required" });
  }

  const user = await Profile.findOne({ userName: username.trim() });

  if (user) {
    return res.json({ available: false, message: "Username is already taken" });
  }

  res.json({ available: true });
}

export function handleLogout(req, res) {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out successfully" });
}

export const likePost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;
  console.log(postId);

  console.log(userId);

  try {
    const post = await userPost.findById(postId);
    console.log(post);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.likes.includes(userId)) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// COMMENT on a post
export const commentOnPost = async (req, res) => {
  const { postId } = req.params;
  console.log(postId);
  const { userId, text, userName } = req.body;

  try {
    const post = await userPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId, text, userName, createdAt: new Date() });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  console.log("first");
  try {
    const senderId = req.user._id; // ✅ Profile ID from auth middleware
    const receiverIdParam = req.params.receiverId;

    console.log(senderId, receiverIdParam);

    if (!receiverIdParam) {
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    const receiverId = new mongoose.Types.ObjectId(receiverIdParam);
    console.log(receiverId);
    if (senderId.equals(receiverId)) {
      return res
        .status(400)
        .json({ message: "You cannot send a request to yourself" });
    }

    // ✅ Check both Profile documents exist
    const [senderProfile, receiverProfile] = await Promise.all([
      Profile.findOne({ uniqueId: senderId }),
      Profile.findOne({ uniqueId: receiverId }),
    ]);

    // console.log('email',senderProfile)
    // console.log(receiverProfile.email);

    if (!senderProfile || !receiverProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // ✅ Find or create friendRequest docs
    const [senderDoc, receiverDoc] = await Promise.all([
      friendRequest.findOneAndUpdate(
        { uniqueId: senderId },
        { $setOnInsert: { uniqueId: senderId } },
        { upsert: true, new: true }
      ),
      friendRequest.findOneAndUpdate(
        { uniqueId: receiverId },
        { $setOnInsert: { uniqueId: receiverId } },
        { upsert: true, new: true }
      ),
    ]);

    // send email

    const transporter = nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: 587,
      secure: false,
      auth: {
        user: "apikey", // this is always "apikey"
        pass: process.env.SENDGRID_API_KEY, // store your key in .env
      },
    });

    const mailOptions = {
      from: process.env.FROM_EMAIL, // ✅ must be verified with SendGrid
      to: receiverProfile.email, // ✅ 
      subject: "You've received a friend request!",
      text: `Hello ${receiverProfile.name}, ${senderProfile.name} sent you a friend request.`,
      html: `<p><strong>${senderProfile.name}</strong> has sent you a friend request.</p> <br>  
      <a 
      href="https://social-media-1-mfvc.onrender.com/app/notification"
      style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #007BFF;
        color: #ffffff;
        text-decoration: none;
        border-radius: 5px;
        font-weight: bold;
      ">
      Accept
    </a> `,
    };

    await transporter.sendMail(mailOptions);

    // ✅ Prevent duplicate requests
    const alreadySent = senderDoc.sentRequests.some(
      (id) => id.toString() === receiverId.toString()
    );

    if (alreadySent) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // ✅ Add to sent and received
    senderDoc.sentRequests.push(receiverId);
    receiverDoc.receivedRequests.push(senderId);

    await Promise.all([senderDoc.save(), receiverDoc.save()]);

    return res.status(200).json({ message: "Friend request sent!" });
  } catch (error) {
    console.error("Send Friend Request Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// export const getFriendRequestData = async (req, res) => {
//   try {
//     const userId = req.params.userId;

//     const userFriendData = await friendRequest
//       .findOne({ uniqueId: userId })
//       .populate("sentRequests", "userName email profilePic")
//       .populate("receivedRequests", "userName email profilePic")
//       .populate("connections", "userName email profilePic");

//     if (!userFriendData) {
//       return res.status(404).json({ message: "No friend data found" });
//     }

//     res.status(200).json(userFriendData);
//   } catch (error) {
//     console.error("Get Friend Data Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getFriendRequestData = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);
    // ✅ cast to ObjectId

    const userFriendData = await friendRequest.findOne({ uniqueId: userId });

    res.status(200).json(userFriendData);
  } catch (error) {
    console.error("Get Friend Data Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const fetchProfileData = async (req, res) => {
  // console.log("first");
  const ID = req.params.userId;
  // console.log(ID);
  try {
    const updatedProfile = await Profile.findOne({ uniqueId: ID });
    const { email, name, userName, profilePic, uniqueId } = updatedProfile;
    // console.log(updatedProfile);

    res.status(200).json({
      email,
      name,
      userName,
      profilePic,
      uniqueId,
    });
  } catch (error) {}
};

export const acceptRequest = async (req, res) => {
  const requestId = req.params.requestId; // Receiver's ID
  const { senderID } = req.body; // Sender's ID
  console.log(requestId);
  console.log(senderID);
  try {
    const senderObjectId = new mongoose.Types.ObjectId(senderID);
    const receiverObjectId = new mongoose.Types.ObjectId(requestId);

    const senderUserDetail = await friendRequest.findOne({
      uniqueId: senderObjectId,
    });

    const receiverUserDetail = await friendRequest.findOne({
      uniqueId: receiverObjectId,
    });

    if (!receiverUserDetail) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    if (!senderUserDetail) {
      return res.status(404).json({ message: "Sender user not found" });
    }

    // ✅ Remove receiver from sender's sentRequests and receivedRequests
    senderUserDetail.sentRequests = senderUserDetail.sentRequests.filter(
      (id) => !id.equals(receiverObjectId)
    );
    senderUserDetail.receivedRequests =
      senderUserDetail.receivedRequests.filter(
        (id) => !id.equals(receiverObjectId)
      );

    // ✅ Remove sender from receiver's receivedRequests
    receiverUserDetail.sentRequests = receiverUserDetail.sentRequests.filter(
      (id) => !id.equals(senderObjectId)
    );
    receiverUserDetail.receivedRequests =
      receiverUserDetail.receivedRequests.filter(
        (id) => !id.equals(senderObjectId)
      );

    // ✅ Add each other to connections if not already there
    if (
      !senderUserDetail.connections.some((id) => id.equals(receiverObjectId))
    ) {
      senderUserDetail.connections.push(receiverObjectId);
    }

    if (
      !receiverUserDetail.connections.some((id) => id.equals(senderObjectId))
    ) {
      receiverUserDetail.connections.push(senderObjectId);
    }

    // ✅ Save updates
    await senderUserDetail.save();
    await receiverUserDetail.save();

    res
      .status(200)
      .json({ message: "Connection request accepted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const rejectRequest = async (req, res) => {
  const requestId = req.params.requestId; // Receiver's ID
  const { senderID } = req.body; // Sender's ID
  console.log(requestId);
  console.log(senderID);

  try {
    const senderObjectId = new mongoose.Types.ObjectId(senderID);
    const receiverObjectId = new mongoose.Types.ObjectId(requestId);

    const senderUserDetail = await friendRequest.findOne({
      uniqueId: senderObjectId,
    });

    const receiverUserDetail = await friendRequest.findOne({
      uniqueId: receiverObjectId,
    });

    if (!receiverUserDetail) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    if (!senderUserDetail) {
      return res.status(404).json({ message: "Sender user not found" });
    }
    senderUserDetail.sentRequests = senderUserDetail.sentRequests.filter(
      (id) => !id.equals(receiverObjectId)
    );
    senderUserDetail.receivedRequests =
      senderUserDetail.receivedRequests.filter(
        (id) => !id.equals(receiverObjectId)
      );

    // ✅ Remove sender from receiver's receivedRequests
    receiverUserDetail.sentRequests = receiverUserDetail.sentRequests.filter(
      (id) => !id.equals(senderObjectId)
    );
    receiverUserDetail.receivedRequests =
      receiverUserDetail.receivedRequests.filter(
        (id) => !id.equals(senderObjectId)
      );
    await senderUserDetail.save();
    await receiverUserDetail.save();

    res
      .status(200)
      .json({ message: "Connection request accepted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const removeConnection = async (req, res) => {
  console.log("first");
  const requestId = req.params.requestId; // Receiver's ID
  const { senderID } = req.body; // Sender's ID
  console.log(requestId);
  console.log(senderID);
  try {
    const senderObjectId = new mongoose.Types.ObjectId(senderID);
    const receiverObjectId = new mongoose.Types.ObjectId(requestId);

    const senderUserDetail = await friendRequest.findOne({
      uniqueId: senderObjectId,
    });

    const receiverUserDetail = await friendRequest.findOne({
      uniqueId: receiverObjectId,
    });

    if (!receiverUserDetail) {
      return res.status(404).json({ message: "Receiver user not found" });
    }

    if (!senderUserDetail) {
      return res.status(404).json({ message: "Sender user not found" });
    }
    senderUserDetail.sentRequests = senderUserDetail.sentRequests.filter(
      (id) => !id.equals(receiverObjectId)
    );
    if (
      senderUserDetail.connections.some((id) => id.equals(receiverObjectId))
    ) {
      senderUserDetail.connections.pull(receiverObjectId);
    }
    if (
      receiverUserDetail.connections.some((id) => id.equals(senderObjectId))
    ) {
      receiverUserDetail.connections.pull(senderObjectId);
    }
    await senderUserDetail.save();
    await receiverUserDetail.save();

    res
      .status(200)
      .json({ message: "Connection request accepted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const displayMyPosts = async (req, res) => {
  const userID = req.params.requestId;
  console.log(userID);

  try {
    const users = await userPost.find({ uniqueId: userID }).select("-password");
    console.log(users);

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postID = req.params.postId;

    // Check if post exists
    const post = await userPost.findById(postID);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await userPost.findByIdAndDelete(postID);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Server error while deleting post" });
  }
};
