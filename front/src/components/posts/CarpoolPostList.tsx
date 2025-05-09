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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCreateModalOpen, isViewModalOpen]);
  const userInfo = userData?.getAppUserInfo || {};
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

export default CarpoolPostList;*/

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
import { useLocation } from 'react-router-dom';

const CarpoolPostList: React.FC = () => {
  const location = useLocation(); // Add this to track route changes

  const {
    data,
    loading,
    error,
    refetch: refetchPosts
  } = useQuery(GET_POSTS, {
    fetchPolicy: 'network-only' // Add this to force network request
  });

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

  const {
    data: userData,
    loading: userLoading,
    error: userError,
    refetch: refetchUser
  } = useQuery(GET_USER, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    onCompleted: (data) => console.log('GET_USER completed:', data),
    onError: (error) => console.error('GET_USER error:', error)
  });

  // Add this effect to refetch data on route changes
  useEffect(() => {
    if (isLoggedIn) {
      console.log('Location changed or component mounted, refetching post data...');
      refetchUser().then(() => {
        refetchPosts();
      });
    } else {
      // If not logged in, still refetch posts
      refetchPosts();
    }
  }, [location.pathname, isLoggedIn]);

  // Function to manually trigger a refetch
  const refreshAllData = () => {
    if (isLoggedIn) {
      refetchUser().then(() => {
        refetchPosts();
      });
    } else {
      refetchPosts();
    }
  };

  useEffect(() => {
    if (isCreateModalOpen || isViewModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isCreateModalOpen, isViewModalOpen]);

  const userInfo = userData?.getAppUserInfo || {};

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
      status: post.status,
    }));
  };

  console.log("info", userInfo);

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
  if (error) return (
      <div className="w-full px-4 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900 pt-2 pb-8 mt-2">
        <div className="max-w-7xl mx-auto text-center py-12">
          <p className="text-red-500 dark:text-red-400">Error loading posts: {error.message}</p>
          <button
              onClick={refreshAllData}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
  );

  return (
      <div className="w-full px-4 md:px-8 lg:px-12 bg-gray-50 dark:bg-gray-900 pt-4 pb-8">
        <div className="flex justify-between items-center mb-6" style={{marginTop:"0px",padding:"0rem"}}>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">Available Carpools</h1>
          <div className="flex gap-2">
            <button
                onClick={refreshAllData}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md flex items-center hover:bg-blue-200 transition-colors dark:bg-blue-900 dark:text-blue-100 dark:hover:bg-blue-800"
            >
              Refresh
            </button>
            <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors dark:bg-brand-500/[0.12] dark:text-white/90 dark:hover:bg-white/5"
            >
              <Plus size={18} className="mr-1" />
              Create Post
            </button>
          </div>
        </div>
        <PostFilter
            activeFilter={filter}
            onFilterChange={setFilter}
            isLoggedIn={isLoggedIn}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 justify-start w-full">
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
              <div className="col-span-full text-left py-4 text-gray-500 pl-1">
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