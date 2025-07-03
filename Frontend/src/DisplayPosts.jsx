import { ThumbsUp, MessageCircle } from "lucide-react";
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

  async function fetchAllPosts() {
    try {
      const allProfilesRes = await instance.get("/api/users/allposts");
      setPosts(allProfilesRes.data);
    } catch (err) {
      setError("Failed to fetch posts.");
      console.error(err);
    }
  }

  async function fetchUser() {
    try {
      const res = await instance.get("/api/users/me");
      setCurrentUserID(res.data.uniqueId);
    } catch (err) {
      console.error("Fetch user failed:", err);
    }
  }

  const handleLike = async (postId) => {
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
    <div className="max-w-6xl mt-12 mx-auto px-4 py-6">
      {error && <p className="text-red-500 text-center">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((item, index) => {
          const isLiked = item.likes?.includes(currentUserID);
          const hasCommented = item.comments?.some(
            (c) => c.userId === currentUserID
          );

          return (
            <div
              key={index}
              className={`bg-white shadow-md rounded-2xl p-5 ${
                !item.postImage ? "min-h-[300px]" : ""
              }`}
            >
              {/* Header */}
              <div className="flex items-start gap-3">
                <img
                  src={item.profilePic || "/default-avatar.png"}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-gray-800">
                    {item.userName || "Unknown User"}
                  </h2>
                </div>
              </div>

              {/* Post Content */}
              <div className="mt-3 text-gray-800">
                <p>{item.content || "No content provided."}</p>
              </div>

              {/* Post Image */}
              {item.postImage && (
                <div className="mt-3 w-full h-[250px] rounded-lg overflow-hidden">
                  <img
                    src={item.postImage}
                    alt="Post"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Hashtags */}
              <div className="mt-3 text-gray-700 text-sm flex flex-wrap gap-2">
                {item.hashtags?.map((hashtag, index) => (
                  <span
                    key={index}
                    className="bg-gray-100 px-2 py-1 rounded text-blue-700 text-xs"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-6 mt-4 text-sm">
                <button
                  className={`flex items-center gap-1 cursor-pointer ${
                    isLiked ? "text-blue-600" : "text-gray-600"
                  }`}
                  onClick={() => handleLike(item.uniqueId)}
                >
                  <ThumbsUp size={18} />
                  Like ({item.likes?.length || 0})
                </button>

                <button
                  className={`flex items-center gap-1 cursor-pointer ${
                    hasCommented ? "text-red-600" : "text-gray-600"
                  }`}
                  onClick={() => {
                    const text = prompt("Write a comment:");
                    if (text) handleComment(item._id, text);
                  }}
                >
                  <MessageCircle size={18} />
                  Comment ({item.comments?.length || 0})
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DisplayPosts;
