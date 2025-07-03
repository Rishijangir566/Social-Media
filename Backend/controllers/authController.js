import Register from "../models/register.js";
import Profile from "../models/profile.js";
import userPost from "../models/post.js";
import user from "../models/register.js";
import friendRequest from "../models/connection.js";
import axios from "axios";

import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { sendVerificationEmail } from "../email.js";
// import ConnectionRequest from "../models/user.js";

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
        Address: "",
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
        sameSite: "None",
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

export async function sendRequest(req, res) {
  try {
    const receiverId = req.params.receiverId;
    const senderId = req.user;

    const existingRequest = await friendRequest.findOne({
      sender: senderId,
      receiver: receiverId,
    });

    if (existingRequest) {
      if (existingRequest.status === "pending") {
        return res.status(429).json({
          message:
            "You have already sent a request. Wait for it to be accepted or rejected",
        });
      } else if (existingRequest.status === "accepted") {
        return res.status(400).json({ message: "You are already friends" });
      }
    }

    const newRequest = new friendRequest({
      sender: senderId,
      receiver: receiverId,
      status: "pending",
    });
    await newRequest.save();

    await user.findByIdAndUpdate(senderId, {
      $push: { sendRequest: receiverId },
    });
    await user.findByIdAndUpdate(receiverId, {
      $push: { receivedRequest: newRequest._id },
    });

    res.status(200).json({
      message: "Friend request sent successfully",
      requestId: newRequest._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function acceptRequest(req, res) {
  try {
    const requestId = req.params.requestId;

    const FriendRequest = await friendRequest.findById(requestId);

    if (
      !FriendRequest ||
      FriendRequest.status === "accept" ||
      FriendRequest.status === "reject"
    ) {
      return res
        .status(404)
        .json({ message: "Request not found or already accepted" });
    }

    const senderId = FriendRequest.sender;
    const receiverId = FriendRequest.receiver;

    FriendRequest.status = "accept";
    await FriendRequest.save();

    await user.findByIdAndUpdate(senderId, { $push: { friends: receiverId } });
    await user.findByIdAndUpdate(receiverId, { $push: { friends: senderId } });

    await user.findByIdAndUpdate(senderId, {
      $pull: { sendRequest: receiverId },
    });
    await user.findByIdAndUpdate(receiverId, {
      $pull: { receivedRequest: FriendRequest._id },
    });

    res.status(200).json({ message: "Friend Request Accepted!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function rejectRequest(req, res) {
  try {
    const requestId = req.params.requestId;

    const FriendRequest = await friendRequest.findById(requestId);

    if (
      !FriendRequest ||
      FriendRequest.status === "reject" ||
      FriendRequest.status === "accept"
    ) {
      return res
        .status(404)
        .json({ message: "Request not found or already Rejected" });
    }

    const senderId = FriendRequest.sender;
    const receiverId = FriendRequest.receiver;

    FriendRequest.status = "reject";
    await FriendRequest.save();

    await user.findByIdAndUpdate(senderId, {
      $pull: { sendRequest: receiverId },
    });
    await user.findByIdAndUpdate(receiverId, {
      $pull: { receivedRequest: FriendRequest._id },
    });

    res.status(200).json({ message: "Friend Request Rejected!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function requestIdDetail(req, res) {
  try {
    const request = await friendRequest.findById(req.params.requestId);
    res.json({ senderProfile: request.sender });
  } catch (error) {
    res.status(500).json({ message: "Error fetching request" });
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
  console.log(postId);

  const { userId } = req.body;
  console.log(userId);

  try {
    const post = await userPost.findOne({ uniqueId: postId });
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
  const { userId, text } = req.body;

  try {
    const post = await userPost.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ userId, text, createdAt: new Date() });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
