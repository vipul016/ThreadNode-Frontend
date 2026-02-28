import { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface PostProps {
  postId: string;
  title: string;
  content?: string;
  authorName?: string;
  communityName?: string;
  initialUpvotes?: number;
  initialDownvotes?: number;
  commentCount?: number;
  initialUserVote?: number; // 1 (upvoted), -1 (downvoted), or 0 (neutral)
}

export default function PostCard({
  postId,
  title,
  content,
  authorName = "Unknown",
  communityName = "General",
  initialUpvotes = 0,
  initialDownvotes = 0,
  commentCount = 0,
  initialUserVote = 0,
}: PostProps) {
  // 1. Separate State for exact database mirroring
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  
  // 2. Track what the user has clicked so we can color the buttons
  const [userVote, setUserVote] = useState(initialUserVote);
  const [isVoting, setIsVoting] = useState(false);
  
  const auth = useContext(AuthContext);

  const handleVote = async (voteValue: number) => {
    if (!auth?.token) {
      alert("You must be logged in to vote!");
      return;
    }
    if (isVoting) return;

    // Toggle off if they click the same button again
    const targetVote = userVote === voteValue ? 0 : voteValue;
    
    setIsVoting(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/votes",
        { itemId: postId, itemType: "Post", value: targetVote },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      // THE SINGLE SOURCE OF TRUTH:
      // We do no math on the frontend. We just blindly trust what the database tells us.
      if (response.data) {
        setUpvotes(response.data.upvotes);
        setDownvotes(response.data.downvotes);
        setUserVote(targetVote); // Update the button color
      }
    } catch (error) {
      console.error("Vote failed:", error);
      alert("Failed to register vote. Check the backend console.");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors duration-200 flex flex-col cursor-pointer overflow-hidden">
      
      {/* 1. Header */}
      <div className="px-4 pt-3 pb-1 flex items-center text-xs text-gray-500 gap-1.5">
        <div className="w-5 h-5 bg-orange-500 rounded-full flex-shrink-0"></div>
        <Link to={`/community/${communityName}`} className="font-bold text-gray-900 hover:underline">
          c/{communityName}
        </Link>
        <span className="text-gray-400">•</span>
        <span>Posted by {authorName}</span>
      </div>

      {/* 2. Content */}
      <div className="px-4 py-1">
        <Link to={`/post/${postId}`}>
          <h2 className="text-lg font-bold text-gray-900 leading-tight mb-1 hover:underline">
            {title}
          </h2>
        </Link>
        {content && (
          <p className="text-sm text-gray-700 line-clamp-3 mt-1">
            {content}
          </p>
        )}
      </div>

      {/* 3. Action Bar */}
      <div className="px-4 py-2 flex items-center gap-2">
        
        {/* Vote Pill */}
        <div className="flex bg-gray-100 hover:bg-gray-200 rounded-full items-center transition-colors px-1">
          
          {/* Upvote Section */}
          <button
            onClick={() => handleVote(1)}
            disabled={isVoting}
            className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${
              userVote === 1 ? "text-orange-600 bg-orange-100" : "text-gray-500 hover:text-orange-500 hover:bg-gray-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7"></path>
            </svg>
          </button>
          <span className={`text-sm font-bold pr-2 pl-1 ${userVote === 1 ? "text-orange-600" : "text-gray-900"}`}>
            {upvotes}
          </span>

          <div className="w-px h-4 bg-gray-300 mx-1"></div> {/* Vertical Divider */}
          
          {/* Downvote Section */}
          <span className={`text-sm font-bold pl-2 pr-1 ${userVote === -1 ? "text-blue-600" : "text-gray-900"}`}>
            {downvotes}
          </span>
          <button
            onClick={() => handleVote(-1)}
            disabled={isVoting}
            className={`p-1.5 rounded-full flex items-center justify-center transition-colors ${
              userVote === -1 ? "text-blue-600 bg-blue-100" : "text-gray-500 hover:text-blue-500 hover:bg-gray-300"
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        {/* Comment Pill */}
        <Link 
          to={`/post/${postId}`}
          className="flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 rounded-full px-3 py-1.5 transition-colors text-sm font-semibold text-gray-700"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          {commentCount}
        </Link>

      </div>
    </div>
  );
}