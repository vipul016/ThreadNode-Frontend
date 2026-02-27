import { useEffect, useContext, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface Community {
    _id: string;
    name: string;
}

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [communities, setCommunities] = useState<Community[]>([]);
    
    // Autocomplete states
    const [query, setQuery] = useState('');
    const [communityId, setCommunityId] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    const [error, setError] = useState('');
    
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCommunities() {
            try {
                const res = await axios.get('http://localhost:3000/api/communities/');
                setCommunities(res.data.communities);
                if (res.data.communities.length > 0) {
                    setCommunityId(res.data.communities[0]._id);
                    setQuery(res.data.communities[0].name); // Set visual input text
                }
            } catch (error) {
                console.error("Failed to fetch communities", error);
            }
        }
        fetchCommunities();
    }, []);

    // Filter communities based on what the user types
    const filtered = communities.filter((community) => 
        community.name.toLowerCase().includes(query.toLowerCase())
    );

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!auth?.token) {
            setError("You must be logged in to create a post");
            return;
        }

        try {
            const res = await axios.post("http://localhost:3000/api/post/", {
                title,
                content, 
                communityId
            }, { 
                headers: { Authorization: `Bearer ${auth.token}` } 
            });

            if (res.data) {
                navigate('/');
            } else {
                setError("Something went wrong while creating the post.");
            }
        } catch (e: any) {
            console.error(e);
            setError(e.response?.data?.message || "Server error.");
        }
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Create a Post</h1>

                {error && (
                    <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleCreate} className="space-y-6">
                    
                    {/* The Autocomplete Community Selector */}
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Select a Community</label>
                        <input 
                            type="text" 
                            value={query} 
                            onChange={(e) => {
                                setQuery(e.target.value);
                                setIsDropdownOpen(true); // Open dropdown when typing
                            }}
                            onFocus={() => setIsDropdownOpen(true)}
                            placeholder="Search communities..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500"
                        />
                        
                        {/* Dropdown Menu */}
                        {isDropdownOpen && query && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {filtered.length > 0 ? (
                                    filtered.map((community) => (
                                        <div
                                            key={community._id}
                                            onClick={() => {
                                                setQuery(community.name); // Show name in input
                                                setCommunityId(community._id); // Save actual ID for DB
                                                setIsDropdownOpen(false); // Close dropdown
                                            }}
                                            className="px-4 py-2 hover:bg-orange-50 cursor-pointer text-gray-700"
                                        >
                                            {community.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500 text-sm">No communities found.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                        <input 
                            type="text" 
                            required
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="An interesting title"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 font-semibold"
                        />
                    </div>

                    {/* Content Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Body (Optional)</label>
                        <textarea 
                            value={content} 
                            onChange={(e) => setContent(e.target.value)}
                            rows={5}
                            placeholder="What are your thoughts?"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-orange-500 focus:border-orange-500 resize-y"
                        ></textarea>
                    </div>

                    <div className="pt-2">
                        <button 
                            type="submit"
                            className="w-full sm:w-auto px-6 py-2.5 bg-orange-600 text-white font-medium rounded-md hover:bg-orange-700 transition-colors"
                        >
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}