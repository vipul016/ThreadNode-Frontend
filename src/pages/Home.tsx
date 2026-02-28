import { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "../components/PostCard"; // Make sure this path matches your folder structure

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPosts() {
      try {
        // Fetch all posts from your Express backend
        const res = await axios.get("http://localhost:3000/api/post");
        
        // Depending on your backend response structure, it might be res.data or res.data.posts
        const fetchedPosts = res.data.posts || res.data;
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load the feed. Is your backend running?");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPosts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-gray-500 font-medium">Loading feed...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-red-500 bg-red-50 p-4 rounded-md border border-red-200">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 flex flex-col gap-4">
        
        {/* Feed Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Home Feed</h1>
          <p className="text-sm text-gray-500">Top posts from your communities</p>
        </div>

        {/* The Posts Map */}
        {posts.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-gray-200">
            No posts yet. Be the first to create one!
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post._id}
              postId={post._id}
              title={post.title}
              content={post.content}
              
              // DEFENSIVE PROGRAMMING: 
              // If post.author exists, grab the username. Otherwise, default to "Unknown".
              authorName={post.author?.username || post.authorName || "Unknown"}
              
              // Same for community. 
              communityName={post.community?.name || post.communityName || "General"}
              
              // Fallbacks to prevent NaN math errors in the PostCard component
              initialUpvotes={post.upvotes || 0}
              initialDownvotes={post.downvotes || 0}
              
              // If comments is an array, get the length. Otherwise, 0.
              commentCount={post.comments?.length || 0} 
            />
          ))
        )}
      </div>
    </div>
  );
}