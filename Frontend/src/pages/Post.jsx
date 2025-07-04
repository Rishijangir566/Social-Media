import { useState, useEffect } from "react";
import instance from "../axiosConfig.js";
import { Camera, Hash, Send, User, Sparkles, Heart, Star } from "lucide-react";

const Post = () => {
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [userDetail, setUserDetail] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [profilepic, setProfilePic] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock user data for demo

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
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 py-8 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      {/* <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div> */}

      {/* Floating Stars */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <Star className="absolute top-20 left-20 w-4 h-4 text-yellow-400/30 animate-pulse" />
        <Star className="absolute top-40 right-32 w-3 h-3 text-pink-400/30 animate-pulse delay-300" />
        <Star className="absolute bottom-40 left-1/3 w-5 h-5 text-blue-400/30 animate-pulse delay-700" />
        <Sparkles className="absolute top-32 right-1/4 w-6 h-6 text-purple-400/30 animate-pulse delay-1000" />
      </div> */}

      <div className="max-w-2xl mx-auto relative z-10 mt-15">
        {/* User Profile Section */}
        <div className="text-center mb-8 relative flex items-center justify-center gap-6">
          <div className="relative inline-block group ">
            {userDetail?.profilePic ? (
              <div className="relative">
                <img
                  src={userDetail.profilePic}
                  alt="User Profile"
                  className="w-24 h-24 object-cover rounded-full border-4 border-white/20 shadow-2xl ring-4 ring-gradient-to-r from-blue-500 to-purple-500 ring-opacity-50 transition-all duration-500 group-hover:scale-110 group-hover:shadow-purple-500/50"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all duration-500"></div>
              </div>
            ) : (
              <div className="w-32 h-32 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full border-4 border-white/20 shadow-2xl flex items-center justify-center">
                <User className="w-16 h-16 text-white/60" />
              </div>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              {userDetail?.userName || "Loading..."}
            </span>
            <p className="text-slate-400 mt-2 text-sm">
            Share your thoughts with Your friends
          </p>
          </h1>
          
        </div>

        {/* Post Form Container */}
        <div className="bg-white/5 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/10 p-8 space-y-6 relative overflow-hidden">
          {/* Glassmorphism overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-3xl"></div>

          <div className="relative z-10 space-y-6">
            {/* Content Input */}
            <div className="relative group">
              <textarea
                className="w-full p-6 min-h-[130px] bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl resize-none text-white placeholder-white/50 shadow-lg hover:shadow-xl hover:bg-white/15 focus:border-blue-400/50 focus:ring-4 focus:ring-blue-400/20 transition-all duration-300 group-focus-within:scale-[1.02]"
                placeholder="What's on your mind? Share something amazing..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
              <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                <span className="text-xs text-white/60 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  {content.length} characters
                </span>
                <Heart className="w-4 h-4 text-pink-400/60" />
              </div>
            </div>

            {/* Image Preview */}
            {previewImage && (
              <div className="relative group">
                <div className="relative overflow-hidden rounded-2xl border-2 border-white/20 shadow-2xl">
                  <img
                    src={previewImage}
                    alt="Post Preview"
                    className="w-full max-h-80 object-contain bg-black/20 transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setPostImage(null);
                    setPreviewImage(null);
                  }}
                  className="absolute top-4 right-4 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                >
                  ×
                </button>
              </div>
            )}

            {/* Image Upload */}
            <div className="relative group">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-6 bg-white/5 border-2 border-dashed border-white/30 rounded-2xl cursor-pointer file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-purple-500 file:text-white hover:file:from-blue-600 hover:file:to-purple-600 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300 text-white/70"
              />
              <div className="absolute top-4 right-4 flex items-center space-x-2">
                <Camera className="w-5 h-5 text-blue-400/60" />
                <span className="text-xs text-white/60 bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
                  Images only
                </span>
              </div>
            </div>

            {/* Hashtag Input */}
            <div className="relative group">
              <input
                type="text"
                placeholder="#trending #awesome #socialmedia"
                className="w-full p-6 bg-white/10 backdrop-blur-xl border-2 border-white/20 rounded-2xl text-white placeholder-white/50 shadow-lg hover:shadow-xl hover:bg-white/15 focus:border-purple-400/50 focus:ring-4 focus:ring-purple-400/20 transition-all duration-300 pl-14"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
              />
              <Hash className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-purple-400/60" />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white text-lg font-bold py-6 rounded-2xl shadow-2xl hover:shadow-purple-500/50 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:ring-4 focus:ring-purple-400/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 group-hover:animate-pulse"></div>
              <div className="relative flex items-center justify-center space-x-3">
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    <span>Share Your Post</span>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white/40 text-sm">
            Express yourself • Connect with others • Make an impact
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
