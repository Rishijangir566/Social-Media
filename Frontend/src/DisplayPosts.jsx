import { ThumbsUp, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import instance from "./axiosConfig";

const DisplayPosts = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAllPosts();
  }, []);

  async function fetchAllPosts() {
    try {
      const userRes = await instance.get("/api/users/me");
      const allProfilesRes = await instance.get("/api/users/allposts");
      console.log(allProfilesRes);
      setPosts(allProfilesRes.data);
    } catch (err) {
      setError("Failed to fetch profiles or requests.");
      console.error(err);
    }
  }

  return (
    <div className="max-w-6xl mt-25 w-[100%] mx-auto px-4 py-6">
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Grid layout: 1 column on mobile, 2 on medium+ screens */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((item, index) => (
          <div key={index} className="bg-white shadow-md rounded-2xl p-5">
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
              {item.hashtags.map((hashtag, index) => (
                <span
                  key={index}
                  className="bg-gray-100 px-2 py-1 rounded text-blue-700 text-xs"
                >
                  {hashtag}
                </span>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-6 mt-4 text-gray-600 text-sm">
              <button className="flex items-center gap-1 hover:text-blue-600">
                <ThumbsUp size={18} /> Like
              </button>
              <button className="flex items-center gap-1 hover:text-blue-600">
                <MessageCircle size={18} /> Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayPosts;
