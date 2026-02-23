import { useState } from "react";
import axios from "axios";

interface PostProps {
  title: string;
  postId: string;
  initialUpvotes: number;
}

export default function PostCard({ title, postId, initialUpvotes }: PostProps) {
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [isVoting,setIsVoting] = useState(false);
  const handleVote = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to vote!");
      return;
    }
    setIsVoting(true);
    try {
      const response = await axios.post(
        "http://localhost:3000/api/votes",
        { itemId: postId, itemType: "Post", value: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.message === 'vote casted successfully') {
        setUpvotes(upvotes + 1);
      } else if (response.data.message === 'Vote removed') {
        setUpvotes(upvotes - 1);
      }
      setIsVoting(false);
    } catch (error) {
      console.error("Vote failed:", error);
      alert("Failed to register vote. Check the backend console.");
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex gap-4 items-start">
      
      <div className="flex flex-col items-center gap-1 bg-gray-50 p-2 rounded-lg border border-gray-100">
        <button
          onClick={handleVote}
          className="text-gray-400 hover:text-orange-500 hover:bg-orange-50 p-1 rounded transition-colors"
          aria-label="Upvote" disabled = {isVoting}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
          </svg>
        </button>
        <span className="font-bold text-gray-700 text-sm">{upvotes}</span>
      </div>

      {/* Content Column */}
      <div className="flex-1 pt-1">
        <h2 className="text-lg font-semibold text-gray-900 leading-tight mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-500 font-medium">Posted in ThreadNode</p>
      </div>
    </div>
  );
}