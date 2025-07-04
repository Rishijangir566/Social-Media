import {
  ThumbsUp,
  MessageCircle,
  Heart,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState } from "react";
import instance from "./axiosConfig";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const [currentUserID, setCurrentUserID] = useState(null);

  useEffect(() => {
    fetchAllPosts();
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await instance.get("/api/users/me");
      setCurrentUserID(res.data.uniqueId);
    } catch (err) {
      console.error("Fetch user failed:", err);
    }
  }

  async function fetchAllPosts() {
    try {
      const allProfilesRes = await instance.get("/api/users/allposts");
      setPosts(allProfilesRes.data);
    } catch (err) {
      setError("Failed to fetch posts.");
      console.error(err);
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
    <div className="min-h-screen mt-10 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
      {/* Animated Particles */}

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Social Feed</h1>
          <p className="text-white">
            Stay connected with the latest posts and updates from our community.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {posts.map((item, index) => {
            const isLiked = item.likes?.includes(currentUserID);
            const hasCommented = item.comments?.some(
              (c) => c.userId === currentUserID
            );

            return (
              <div
                key={index}
                className=" backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden border border-white/80 group"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-6 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={item.profilePic || "/default-avatar.png"}
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300"
                      />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white hover:text-blue-600 transition-colors cursor-pointer">
                        {item.userName || "Unknown User"}
                      </h2>
                      <p className="text-sm text-white">
                        {" "}
                        {new Date(item.createdAt).toLocaleDateString("en-US")}
                      </p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <MoreHorizontal size={20} className="text-gray-500" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="px-6 pb-4">
                  <p className="text-white leading-relaxed text-lg">
                    {item.content || "No content provided."}
                  </p>
                </div>

                {/* Post Image */}
                {item.postImage && (
                  <div className="px-6 pb-4">
                    <div className="w-full h-[350px] rounded-xl overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
                      <img
                        src={item.postImage}
                        alt="Post"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}

                {/* Hashtags */}
                <div className="px-6 pb-4">
                  <div className="flex flex-wrap gap-2">
                    {item.hashtags?.map((hashtag, index) => (
                      <span
                        key={index}
                        className="text-white hover:from-blue-200 hover:to-purple-200 px-3 py-1 rounded-full text-blue-700 text-sm font-medium cursor-pointer transition-all duration-200"
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="px-6 py-4  border-gray-100">
                  <div className="flex gap-6">
                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                        isLiked
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => handleLike(item.uniqueId)}
                    >
                      <Heart
                        size={18}
                        fill={isLiked ? "currentColor" : "none"}
                      />
                      <span className="font-medium">
                        {item.likes?.length || 0}{" "}
                        {item.likes?.length === 1 ? "Like" : "Likes"}
                      </span>
                    </button>

                    <button
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                        hasCommented
                          ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => {
                        const text = prompt("Write a comment:");
                        if (text) handleComment(item._id, text);
                      }}
                    >
                      <MessageCircle size={18} />
                      <span className="font-medium">
                        {item.comments?.length || 0}{" "}
                        {item.comments?.length === 1 ? "Comment" : "Comments"}
                      </span>
                    </button>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200">
                      <Share2 size={18} />
                      <span className="font-medium">Share</span>
                    </button>
                  </div>
                </div>

                {/* Comments Preview */}
                {item.comments && item.comments.length > 0 && (
                  <div className="px-6 pb-4">
                    <div className=" rounded-lg p-3">
                      <p className="text-sm text-white mb-2 font-medium">
                        Recent Comments:
                      </p>
                      {item.comments.slice(-2).map((comment, idx) => (
                        <div key={idx} className="text-sm text-white mb-1">
                          <span className="font-medium">User:</span>{" "}
                          {comment.text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Loading State */}
        {posts.length === 0 && !error && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing posts...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayPosts;
