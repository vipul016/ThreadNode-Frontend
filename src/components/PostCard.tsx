import { useState } from "react"
interface PostProps{
    title : string;
}
export default function PostCard({title} : PostProps){
    const [upvotes,setUpvotes] = useState(0);
    return (
        <div className = "border-red-300 w-full flex justify-center gap-2">
        <h2>{title}</h2>
        <button onClick = {()=>setUpvotes(upvotes+1)}>Upvote</button>
        <p>{upvotes}</p>
        </div>
    )
}