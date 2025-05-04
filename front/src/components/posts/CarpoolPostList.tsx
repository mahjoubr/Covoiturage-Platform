import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import CarpoolPostItem from './CarpoolPostItem.tsx';
import CreatePostModal from './CreatePostModal.tsx';
import ViewPostModal from './ViewPostModal.tsx';
import { CarpoolPost, CreatePostFormData } from '../../types/posts.ts';
import '../../styles/posts.css';
import { useQuery } from '@apollo/client';
import { GET_POSTS } from '../../graphQl/queries/posts.ts';
import { GET_USER } from '../../graphQl/queries/rides.ts';
import PostFilter from './postFilter.tsx';

const CarpoolPostList: React.FC = () => {
  const { data, loading, error } = useQuery(GET_POSTS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CarpoolPost | null>(null);
  const [filter, setFilter] = useState<'all' | 'my'>('all');
  const [filteredPosts, setFilteredPosts] = useState<CarpoolPost[]>([]);
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
  useEffect(() => {
    if (isCreateModalOpen || isViewModalOpen) {
      // Disable scrolling on the body
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when modals are closed
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to ensure scrolling is re-enabled
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCreateModalOpen, isViewModalOpen]);
  // Get user information safely
  const userInfo = userData?.getAppUserInfo || {};

  // Transform GraphQL data into our CarpoolPost type
  const transformPosts = (): CarpoolPost[] => {
    if (!data?.getPosts) return [];
    
    return data.getPosts.map((post: any) => ({
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
      // Store the post owner ID for filtering
      postOwnerId: post.postOwner?.id,
      status:post.status,
    }));
  };

  console.log("info",userInfo);
  useEffect(() => {
    const allPosts = transformPosts();
    
    if (filter === 'all') {
      setFilteredPosts(allPosts);
    } else if (filter === 'my' && userInfo?.id) {
      // Filter to only show posts where the current user is the owner
      const myPosts = allPosts.filter(post => Number(post.postOwnerId) === Number(userInfo.id));
      setFilteredPosts(myPosts);
    } else {
      // Fallback to showing all posts if we can't determine ownership
      setFilteredPosts(allPosts);
    }
  }, [data, filter, userInfo]);
  
  useEffect(() => {
    setDebugInfo({
      hasData: !!data,
      hasPosts: !!(data && data.getPosts),
      postsCount: data && data.getPosts ? data.getPosts.length : 0,
      rawData: data
    });
  }, [data]);


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
      <PostFilter 
        activeFilter={filter} 
        onFilterChange={setFilter} 
        isLoggedIn={isLoggedIn}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {filteredPosts.length > 0 ? (
          filteredPosts.map(post => (
            <CarpoolPostItem 
              key={post.id} 
              post={post} 
              onClick={handlePostClick}
              userData={userInfo}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            {filter === 'my' ? "You haven't created any carpool posts yet." : "No carpool posts available."}
          </div>
        )}
      </div>
      
      <CreatePostModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        //onSubmit={handleCreatePost}
        userData={userInfo} 
      />
      
      <ViewPostModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        post={selectedPost}
        userData={userInfo}
      />
    </div>
  );
};

export default CarpoolPostList;