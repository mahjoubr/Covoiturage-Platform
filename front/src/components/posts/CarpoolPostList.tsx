/*import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import CarpoolPostItem from './CarpoolPostItem.tsx';
import CreatePostModal from './CreatePostModal.tsx';
import ViewPostModal from './ViewPostModal.tsx';
import { CarpoolPost, CreatePostFormData } from '../../types/posts.ts';
import '../../styles/posts.css';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../../graphQl/queries/posts.ts';
import { GET_USER } from '../../graphQl/queries/rides.ts';



const CarpoolPostList: React.FC = () => {
  const { data, loading, error } = useQuery(GET_POSTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CarpoolPost | null>(null);
  const [ setDebugInfo] = useState({
    hasData: false,
    hasPosts: false,
    postsCount: 0,
    rawData: null
  });
  const token = localStorage.getItem('auth_token');
  const isLoggedIn = !!token;
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER, {
  skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    onCompleted: (data) => console.log('GET_USER completed:', data),
    onError: (error) => console.error('GET_USER error:', error)
  });
  console.log(userData.getAppUserInfo.name);



  const posts: CarpoolPost[] = data?.getPosts?.map((post: any) => ({
    id: post.id.toString(),
    destination: post.destination,
    departure: post.departure,
    date: post.date,
    time: post.time,
    seatCount: post.seatCount,
    frequency: post.frequency,
    description: post.description,
    price: post.price,
    contactInfo: post.contactInfo,
    driverName: post.postOwner?.name && post.postOwner?.lastName
    ? `${post.postOwner.name} ${post.postOwner.lastName}`
    : "Unknown"
  ,
    comments: post.comments ?? [],
  })) ?? [];
  useEffect(() => {
    console.log('Data changed:', data);
    setDebugInfo({
      hasData: !!data,
      hasPosts: !!(data && data.posts),
      postsCount: data && data.posts ? data.posts.length : 0,
      rawData: data
    });
  }, [data]);
  const handleCreatePost = (postData: CreatePostFormData) => {
    // Optional: send a mutation to backend instead of local state
    const newPost: CarpoolPost = {
      id: Date.now().toString(),
      ...postData
    };
    // fallback update if not yet using mutation
    alert("Post created locally only. Add mutation to persist it.");
  };

  const handlePostClick = (post: CarpoolPost) => {
    setSelectedPost(post);
    setIsViewModalOpen(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts</p>;
  console.log('Fetched posts:', data);
  return (
    <div className="w-full px-4 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6" style={{marginTop:"0px",padding:"0rem"}}>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Available Carpools</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors dark:bg-brand-500/[0.12] dark:text-white/90 dark:hover:bg-white/5"
        >
          <Plus size={18} className="mr-1" />
          Create Post
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {posts.map(post => (
          <CarpoolPostItem
            key={post.id}
            post={post}
            onClick={handlePostClick}
          />
        ))}
      </div>

      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
      />

      <ViewPostModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        post={selectedPost}
      />
    </div>
  );
};
export default CarpoolPostList;*/


import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import CarpoolPostItem from './CarpoolPostItem.tsx';
import CreatePostModal from './CreatePostModal.tsx';
import ViewPostModal from './ViewPostModal.tsx';
import { CarpoolPost, CreatePostFormData } from '../../types/posts.ts';
import { mockCarpoolPosts } from '../../data/mockData';
import '../../styles/posts.css';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../../graphQl/queries/posts.ts';
import { GET_USER } from '../../graphQl/queries/rides.ts';

const CarpoolPostList: React.FC = () => {
  const { data, loading, error } = useQuery(GET_POSTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CarpoolPost | null>(null);
  const [debugInfo, setDebugInfo] = useState({
    hasData: false,
    hasPosts: false,
    postsCount: 0,
    rawData: null
  });
  
  const token = localStorage.getItem('auth_token');
  const isLoggedIn = !!token;
  
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    onCompleted: (data) => console.log('GET_USER completed:', data),
    onError: (error) => console.error('GET_USER error:', error)
  });
  console.log("hzy",userData);
  // Get user information safely
  const userInfo = userData?.getAppUserInfo || {};

  const posts: CarpoolPost[] = data?.getPosts?.map((post: any) => ({
    id: post.id.toString(),
    destination: post.destination,
    departure: post.departure,
    date: post.date,
    time: post.time,
    seatCount: post.seatCount,
    frequency: post.frequency,
    description: post.description,
    price: post.price,
    contactInfo: post.contactInfo,
    driverName: post.postOwner?.name && post.postOwner?.lastName
      ? `${post.postOwner.name} ${post.postOwner.lastName}`
      : "Unknown",
    comments: post.comments ?? [],
  })) ?? [];
  
  useEffect(() => {
    console.log('Data changed:', data);
    setDebugInfo({
      hasData: !!data,
      hasPosts: !!(data && data.posts),
      postsCount: data && data.posts ? data.posts.length : 0,
      rawData: data
    });
  }, [data]);
  
  const handleCreatePost = (postData: CreatePostFormData) => {
    // Optional: send a mutation to backend instead of local state
    const newPost: CarpoolPost = {
      id: Date.now().toString(),
      ...postData
    };
    // fallback update if not yet using mutation
    alert("Post created locally only. Add mutation to persist it.");
  };

  const handlePostClick = (post: CarpoolPost) => {
    setSelectedPost(post);
    setIsViewModalOpen(true);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts</p>;
  
  return (
    <div className="w-full px-4 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900">
      <div className="flex justify-between items-center mb-6" style={{marginTop:"0px",padding:"0rem"}}>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Available Carpools</h1>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors dark:bg-brand-500/[0.12] dark:text-white/90 dark:hover:bg-white/5"
        >
          <Plus size={18} className="mr-1" />
          Create Post
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {posts.map(post => (
          <CarpoolPostItem 
            key={post.id} 
            post={post} 
            onClick={handlePostClick}
            userData={userInfo}
          />
        ))}
      </div>
      
      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePost}
        userData={userInfo} // Pass the user data to the modal
      />
      
      <ViewPostModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        post={selectedPost}
      />
    </div>
  );
};

export default CarpoolPostList;
