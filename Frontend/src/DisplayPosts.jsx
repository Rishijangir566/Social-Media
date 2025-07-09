import {
  ThumbsUp,
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import instance from "./axiosConfig";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [currentUserID, setCurrentUserID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllPosts();
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      setIsLoading(true);
      const res = await instance.get("/api/users/me");
      setCurrentUserID(res.data.uniqueId);
      setIsLoading(false);
    } catch (err) {
      console.error("Fetch user failed:", err);
      setIsLoading(false);
    }
  }

  async function fetchAllPosts() {
    try {
      setIsLoading(true);
      const allProfilesRes = await instance.get("/api/users/allposts");
      setPosts(allProfilesRes.data);
      setIsLoading(false);
    } catch (err) {
      setError("Failed to fetch posts.");
      console.error(err);
      setIsLoading(false);
    }
  }

  const handleLike = async (postId) => {
    console.log("first");
    try {
      const res = await instance.post(`/user/like/${postId}`, {
        userId: currentUserID,
      });
      console.log(res);

      setPosts((prev) =>
        prev.map((p) => (p.uniqueId === res.data.uniqueId ? res.data : p))
      );
    } catch (err) {
      console.error("Like failed", err);
    }
  };
  const handleComment = async (postId, text) => {
    try {
      const res = await instance.post(`/user/comment/${postId}`, {
        userId: currentUserID,
        text,
      });
      console.log(res);
      // Update post with new comment
      setPosts((prev) =>
        prev.map((p) => (p.uniqueId === res.data.uniqueId ? res.data : p))
      );
    } catch (err) {
      console.error("Comment failed", err);
    }
  };

  return (
    <div className="min-h-screen mt-10 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8">
        
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-yellow-400 w-8 h-8" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Social Feed
            </h1>
            <TrendingUp className="text-green-400 w-8 h-8" />
          </div>
          <p className="text-slate-300 text-lg">
            Stay connected with the latest posts and updates from our community.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-400/50 text-red-200 px-6 py-4 rounded-2xl mb-8 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              {error}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-purple-400/20 rounded-full mx-auto mb-6"></div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-transparent border-t-purple-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-300 text-lg">Loading amazing posts...</p>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-8">
          {posts.map((item, index) => {
            const isLiked = item.likes?.includes(currentUserID);
            const hasCommented = item.comments?.some(
              (c) => c.userId === currentUserID
            );

            return (
              <div
                key={index}
                className="backdrop-blur-xl rounded-2xl border border-white/40 hover:border-white/50 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/20 group overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={item.profilePic || "/default-avatar.png"}
                        alt="Profile"
                        className="w-14 h-14 object-cover rounded-full border-3 border-white/20 shadow-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 ring-opacity-50 transition-all duration-500 group-hover:scale-110 group-hover:shadow-purple-500/50"
                      />
                    </div>

                    <div>
                      <h2 className="font-bold text-white text-lg hover:text-purple-300 transition-colors cursor-pointer">
                        {item.userName || "Anonymous User"}
                      </h2>
                      <p className="text-slate-400 text-sm flex items-center gap-1">
                        {new Date(item.createdAt).toLocaleDateString("en-US")}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 group-hover:rotate-90">
                    <MoreHorizontal size={20} className="text-slate-400" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-6 pb-4">
                  <p className="text-slate-100 leading-relaxed text-lg font-medium">
                    {item.content || "No content provided."}
                  </p>
                </div>

                {/* Post Image */}
                {item.postImage && (
                  <div className="px-6 pb-4">
                    <div className="relative rounded-2xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                      <img
                        src={item.postImage}
                        alt="Post"
                        className="w-full h-80 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    </div>
                  </div>
                )}

                {/* Hashtags */}
                {item.hashtags && item.hashtags.length > 0 && (
                  <div className="px-6 pb-4">
                    <div className="flex flex-wrap gap-2">
                      {item.hashtags.map((hashtag, idx) => (
                        <span
                          key={idx}
                          className="text-white hover:from-blue-200 hover:to-purple-200 px-3 py-1 rounded-full text-blue-700 text-sm font-medium cursor-pointer transition-all duration-200"
                        >
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="px-6 py-4 border-t border-white/10">
                  <div className="flex gap-4">
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        isLiked
                          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-400/30"
                          : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
                      }`}
                      onClick={() => handleLike(item.uniqueId)}
                    >
                      <Heart
                        size={18}
                        fill={isLiked ? "currentColor" : "none"}
                        className={isLiked ? "animate-pulse" : ""}
                      />
                      <span className="font-medium">
                        {item.likes?.length || 0}
                      </span>
                    </button>

                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        hasCommented
                          ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-400/30"
                          : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"
                      }`}
                      onClick={() => {
                        const text = prompt("Write a comment:");
                        if (text) handleComment(item._id, text);
                      }}
                    >
                      <MessageCircle size={18} />
                      <span className="font-medium">
                        {item.comments?.length || 0}
                      </span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20 transition-all duration-300">
                      <Share2 size={18} />
                      <span className="font-medium">Share</span>
                    </button>
                  </div>
                </div>

                {/* Comments Preview */}
                {item.comments && item.comments.length > 0 && (
                  <div className="px-6 pb-6">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                      <p className="text-slate-300 text-sm font-medium mb-3 flex items-center gap-2">
                        <MessageCircle size={14} />
                        Recent Comments
                      </p>
                      <div className="space-y-2">
                        {item.comments.slice(-2).map((comment, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <p className="text-slate-200 text-sm">
                              <span className="font-medium text-purple-300">
                                User:
                              </span>{" "}
                              {comment.text}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {posts.length === 0 && !error && !isLoading && (
          <div className="text-center py-20">
            <div className="mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full mx-auto flex items-center justify-center">
                <Sparkles className="text-white w-10 h-10" />
              </div>
            </div>
            <h3 className="text-slate-300 text-xl font-medium mb-2">
              No posts yet
            </h3>
            <p className="text-slate-400">
              Be the first to share something amazing!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayPosts;
