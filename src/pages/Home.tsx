import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import PostCard from "../components/PostCard";
interface Post {
  _id: string;
  title: string;
  upvotes: number;
}

export default function Home(){
    const [posts, setPosts] = useState<Post[]>([]);
    useEffect(() => {
        async function fetchPosts() {
        try {
            const res = await axios.get("http://localhost:3000/api/post");
            setPosts(res.data.posts);
        } catch (error) {
            console.error("Failed to fetch posts:", error);
        }
        }
    fetchPosts();
  }, []);
    return (
        <div className="min-h-screen bg-gray-100 font-sans text-gray-900">

      {/* Main Feed */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="space-y-4">
            {posts.map((post) => (
        <PostCard
              key={post._id}
              postId={post._id}
              title={post.title}
              initialUpvotes={post.upvotes || 0}
            />
          ))}
          {posts.length === 0 && (
            <p className="text-center text-gray-500 mt-10">No posts found. Start writing!</p>
          )}
        </div>
      </main>
    </div>
        
    )
}