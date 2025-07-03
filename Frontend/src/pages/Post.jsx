import React, { useState, useEffect } from "react";
import instance from "../axiosConfig.js";

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

      await instance.post("/user/shareData", formData);
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
    <div className="min-h-screen mt-15 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 py-10 px-4">
      <div className="max-w-2xl mx-auto">

        {/* User Profile Section */}
        <div className="text-center mb-6">
          {userDetail?.profilePic && (
            <div className="relative inline-block">
              <img
                src={userDetail.profilePic}
                alt="User Profile"
                className="w-24 h-24 object-cover rounded-full border-4 border-white shadow-md ring-4 ring-blue-100 transition-transform duration-300 hover:scale-105"
              />
           
            </div>
          )}
          <h1 className=" text-2xl font-bold text-gray-800">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {userDetail?.userName}
            </span>
          </h1>
        </div>

        {/* Post Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-lg border border-white/30 p-8 space-y-6"
        >

          {/* Content Input */}
          <div className="relative">
            <textarea
              className="w-full p-4 min-h-[120px] border-2 border-gray-200 rounded-2xl resize-none text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition"
              placeholder="What do you want to talk about?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <span className="absolute bottom-3 right-3 text-sm text-gray-400 bg-white/80 px-2 py-1 rounded-md">
              {content.length} chars
            </span>
          </div>

          {/* Image Preview */}
          {previewImage && (
            <div className="relative group">
              <img
                src={previewImage}
                alt="Post Preview"
                className="w-full max-h-60 object-contain rounded-2xl border-2 border-gray-100 shadow-lg group-hover:shadow-xl transition"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition" />
            </div>
          )}

          {/* Image Upload */}
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 hover:border-blue-400 hover:bg-blue-50/50 transition"
            />
            <span className="absolute top-2 right-4 text-sm text-gray-400 bg-white px-2 py-1 rounded-md">
              Images only
            </span>
          </div>

          {/* Hashtag Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="#hashtags (comma separated)"
              className="w-full p-4 border-2 border-gray-200 rounded-2xl text-gray-700 placeholder-gray-400 shadow-sm hover:shadow-md focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 pointer-events-none">
              
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg font-semibold py-4 rounded-2xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:ring-4 focus:ring-blue-200"
          >
             Share Your Post
          </button>
        </form>

        {/* Footer */}
      
      </div>
    </div>
  );
};

export default Post;
