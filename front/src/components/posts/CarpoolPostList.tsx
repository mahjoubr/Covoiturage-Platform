import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import CarpoolPostItem from './CarpoolPostItem.tsx';
import CreatePostModal from './CreatePostModal.tsx';
import ViewPostModal from './ViewPostModal.tsx';
import { CarpoolPost, CreatePostFormData } from '../../types/posts.ts';
import { mockCarpoolPosts } from '../../data/mockData';
import '../../styles/posts.css';

const CarpoolPostList: React.FC = () => {
  const [posts, setPosts] = useState<CarpoolPost[]>(mockCarpoolPosts);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<CarpoolPost | null>(null);

  const handleCreatePost = (postData: CreatePostFormData) => {
    const newPost: CarpoolPost = {
      id: Date.now().toString(),
      ...postData
    };
    
    setPosts(prev => [newPost, ...prev]);
  };

  const handlePostClick = (post: CarpoolPost) => {
    setSelectedPost(post);
    setIsViewModalOpen(true);
  };

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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 custom-scrollbar overflow-auto max-h-[calc(100vh-140px)]">
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

export default CarpoolPostList;