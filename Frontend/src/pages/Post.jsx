import React, { useState } from "react";
import instance from "../axiosConfig.js";
import { useEffect } from "react";

const Post = () => {
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [profilepic, setProfilePic] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await instance.get("/api/users/me");
        console.log(res);
        setUserDetail(res.data);
        setUserId(res.data.uniqueId);
        setUserName(res.data.userName);
        setProfilePic(res.data.profilePic);
      } catch (err) {
        console.error("Fetch user failed:", err);
      }
    }
    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPostImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("uniqueId", userId);
      formData.append("profilepic", profilepic);
      formData.append("userName", userName);
      formData.append("content", content);
      formData.append("hashtags", hashtags);
      
      if (postImage) formData.append("postImage", postImage);

      const res = await instance.post("/user/shareData", formData);
      console.log(res);
      alert("Post created successfully!");
      setContent("");
      setHashtags("");
      setPostImage(null);
      setPreviewImage(null);
    } catch (error) {
      console.error("Post creation failed", error);
      alert("Failed to create post.");
    }
  };

  return (
    <>
      <div className="w-[100%]">
        {userDetail?.profilePic && (
        <img
          src={userDetail.profilePic}
          alt="Preview"
          className="w-32 h-32 object-cover rounded-full mx-auto mb-4  mt-30"
        />
      )}
      <h1 className="text-center">User-Name: {userDetail?.userName}</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow rounded p-4 w-full max-w-xl mx-auto"
      >
        <textarea
          className="w-full border rounded p-2 mb-3"
          placeholder="What do you want to talk about?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="mb-3 max-h-60 object-contain rounded"
          />
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-3"
        />

        <input
          type="text"
          placeholder="#hashtags (comma separated)"
          className="w-full border rounded p-2 mb-3"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Post
        </button>
      </form>
      </div>
    </>
  );
};

export default Post;
