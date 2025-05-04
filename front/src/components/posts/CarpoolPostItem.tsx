/*import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Users, RotateCcw } from 'lucide-react';
import { CarpoolPost } from '../../types/posts.ts';
import { formatDate, formatTime } from '../../utils/dateTime';
import '../../styles/posts.css';
import { useMutation } from '@apollo/client';
import { CREATE_JOIN_REQUEST, DELETE_JOIN_REQUEST } from '../../graphQl/queries/rides.ts';

interface CarpoolPostItemProps {
  post: CarpoolPost;
  onClick: (post: CarpoolPost) => void;
  userData: {
    id?: string;
    name?: string;
    lastName?: string;
  };
}

const CarpoolPostItem: React.FC<CarpoolPostItemProps> = ({ post, onClick ,userData}) => {
  const [requestPending, setRequestPending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  //these
  const [createJoinRequest] = useMutation(CREATE_JOIN_REQUEST);
const [deleteJoinRequest] = useMutation(DELETE_JOIN_REQUEST);
//these

const handleJoinRide = async (e: React.MouseEvent) => {

    e.stopPropagation(); 
    
    if (requestPending) {
      setRequestPending(false);
      setShowAlert(true);
      await deleteJoinRequest({ variables: { postId: Number(post.id) } });
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else {
      setRequestPending(true);
      await createJoinRequest({ variables: { postId: Number(post.id) } });
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-white/5 hover:shadow-lg dark:shadow-theme-xl transition-all duration-300 cursor-pointer relative flex flex-col h-full"
      onClick={() => onClick(post)}
    >
      <div className="flex flex-col space-y-3 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-brand-400">
            {post.departure} → {post.destination}
          </h3>
          <span className="bg-blue-100 dark:bg-brand-500/20 text-blue-800 dark:text-brand-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
            ${post.price}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>From: {post.departure}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>{formatDate(post.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>To: {post.destination}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>{formatTime(post.time)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-white/[0.03]">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-brand-500/15 rounded-full flex items-center justify-center text-blue-700 dark:text-brand-400 font-medium">
              {post.driverName.charAt(0)}
            </div>
            <span className="ml-2 text-sm font-medium dark:text-gray-300">{post.driverName}</span>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <Users size={16} className="mr-1 text-gray-500 dark:text-gray-500" />
              <span>{post.seatCount} seats</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <RotateCcw size={16} className="mr-1 text-gray-500 dark:text-gray-500" />
              <span>{post.frequency}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <button
          onClick={handleJoinRide}
          className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all duration-300 ${
            requestPending
              ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30'
              : 'bg-blue-100 dark:bg-brand-500/20 text-blue-700 dark:text-brand-400 border border-blue-200 dark:border-brand-500/20 hover:bg-blue-200 dark:hover:bg-brand-500/30'
          }`}
        >
          {requestPending ? 'Request Pending' : 'Join Ride'}
        </button>
      </div>
      
      {showAlert && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/50 dark:bg-gray-900/60 text-white text-sm px-6 py-3 rounded-md shadow-lg">
            Request cancelled
          </div>
        </div>
      )}
    </div>
  );
};

export default CarpoolPostItem;*/
/*
import React, { useState } from 'react';
import { MapPin, Calendar, Clock, Users, RotateCcw } from 'lucide-react';
import { CarpoolPost } from '../../types/posts.ts';
import { formatDate, formatTime } from '../../utils/dateTime';
import '../../styles/posts.css';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_JOIN_REQUEST, DELETE_JOIN_REQUEST } from '../../graphQl/queries/rides.ts';
import { GET_JOIN_REQUESTS, GET_RIDE } from '../../graphQl/queries/posts.ts';

interface CarpoolPostItemProps {
  post: CarpoolPost;
  onClick: (post: CarpoolPost) => void;
  userData: {
    id?: string;
    name?: string;
    lastName?: string;
  };
}

const CarpoolPostItem: React.FC<CarpoolPostItemProps> = ({ post, onClick ,userData}) => {
  const [requestPending, setRequestPending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  //these
  const [createJoinRequest] = useMutation(CREATE_JOIN_REQUEST);
const [deleteJoinRequest] = useMutation(DELETE_JOIN_REQUEST);
//these


const token = localStorage.getItem('auth_token');
  const isLoggedIn = !!token;
  
  const { data: rideData, loading: userLoading, error: userError } = useQuery(GET_RIDE, {
    variables:{postId:Number(post.id)},
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    onCompleted: (data) => console.log('GET_ride completed:', data),
    onError: (error) => console.error('GET_ride error:', error)
  });

  const { data: joinRequest } = useQuery(GET_JOIN_REQUESTS, {
    variables:{rideId:Number(rideData?.matchingRide?.id),userId:Number(userData.id)},
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    onCompleted: (data) => console.log('GET_ride completed:', data),
    onError: (error) => console.error('GET_ride error:', error)
  });
  console.log(joinRequest);

const handleJoinRide = async (e: React.MouseEvent) => {

    e.stopPropagation(); 
    
    if (requestPending) {
      setRequestPending(false);
      setShowAlert(true);
      await deleteJoinRequest({ variables: { postId: Number(post.id) } });
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else {
      setRequestPending(true);
      await createJoinRequest({ variables: { postId: Number(post.id) } });
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-white/5 hover:shadow-lg dark:shadow-theme-xl transition-all duration-300 cursor-pointer relative flex flex-col h-full"
      onClick={() => onClick(post)}
    >
      <div className="flex flex-col space-y-3 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-brand-400">
            {post.departure} → {post.destination}
          </h3>
          <span className="bg-blue-100 dark:bg-brand-500/20 text-blue-800 dark:text-brand-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
            ${post.price}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>From: {post.departure}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>{formatDate(post.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>To: {post.destination}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>{formatTime(post.time)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-white/[0.03]">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-brand-500/15 rounded-full flex items-center justify-center text-blue-700 dark:text-brand-400 font-medium">
              {post.driverName.charAt(0)}
            </div>
            <span className="ml-2 text-sm font-medium dark:text-gray-300">{post.driverName}</span>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <Users size={16} className="mr-1 text-gray-500 dark:text-gray-500" />
              <span>{post.seatCount} seats</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <RotateCcw size={16} className="mr-1 text-gray-500 dark:text-gray-500" />
              <span>{post.frequency}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <button
          onClick={handleJoinRide}
          className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all duration-300 ${
            requestPending
              ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30'
              : 'bg-blue-100 dark:bg-brand-500/20 text-blue-700 dark:text-brand-400 border border-blue-200 dark:border-brand-500/20 hover:bg-blue-200 dark:hover:bg-brand-500/30'
          }`}
        >
          {requestPending ? 'Request Pending' : 'Join Ride'}
        </button>
      </div>
      
      {showAlert && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/50 dark:bg-gray-900/60 text-white text-sm px-6 py-3 rounded-md shadow-lg">
            Request cancelled
          </div>
        </div>
      )}
    </div>
  );
};

export default CarpoolPostItem;

*/


import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Clock, Users, RotateCcw } from 'lucide-react';
import { CarpoolPost } from '../../types/posts.ts';
import { formatDate, formatTime } from '../../utils/dateTime';
import '../../styles/posts.css';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_JOIN_REQUEST, DELETE_JOIN_REQUEST } from '../../graphQl/queries/rides.ts';
import { GET_JOIN_REQUESTS, GET_RIDE } from '../../graphQl/queries/posts.ts';

interface CarpoolPostItemProps {
  post: CarpoolPost;
  onClick: (post: CarpoolPost) => void;
  userData: {
    id?: string;
    name?: string;
    lastName?: string;
  };
}

const CarpoolPostItem: React.FC<CarpoolPostItemProps> = ({ post, onClick ,userData}) => {
  const [requestPending, setRequestPending] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  //these
  const [createJoinRequest] = useMutation(CREATE_JOIN_REQUEST);
const [deleteJoinRequest] = useMutation(DELETE_JOIN_REQUEST);
//these


const token = localStorage.getItem('auth_token');
  const isLoggedIn = !!token;
  
  const { data: rideData, loading: userLoading, error: userError } = useQuery(GET_RIDE, {
    variables:{postId:Number(post.id)},
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    onCompleted: (data) => console.log('GET_ride completed:', data),
    onError: (error) => console.error('GET_ride error:', error)
  });

  const { data: joinRequest } = useQuery(GET_JOIN_REQUESTS, {
    variables:{rideId:Number(rideData?.matchingRide?.id),userId:Number(userData.id)},
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
    onCompleted: (data) => console.log('GET_ride completed:', data),
    onError: (error) => console.error('GET_ride error:', error)
  });
useEffect(() => {
  if (joinRequest?.getJoinRequestsByRideUser) {
    const hasRequests = Array.isArray(joinRequest.getJoinRequestsByRideUser) 
      ? joinRequest.getJoinRequestsByRideUser.length > 0 
      : !!joinRequest.getJoinRequestsByRideUser;
    
    setRequestPending(hasRequests);
  } else {
    setRequestPending(false);
  }
}, [joinRequest]);
const handleJoinRide = async (e: React.MouseEvent) => {

    e.stopPropagation(); 
    
    if (requestPending) {
      setRequestPending(false);
      setShowAlert(true);
      await deleteJoinRequest({ variables: { postId: Number(post.id) } });
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    } else {
      setRequestPending(true);
      await createJoinRequest({ variables: { postId: Number(post.id) } });
    }
  };

  const handleDeletePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement delete post functionality here
    console.log("Delete post clicked for post ID:", post.id);
  };

  const handleClosePost = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Implement close post functionality here
    console.log("Close post clicked for post ID:", post.id);
  };

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-100 dark:border-white/5 hover:shadow-lg dark:shadow-theme-xl transition-all duration-300 cursor-pointer relative flex flex-col h-full"
      onClick={() => onClick(post)}
    >
      <div className="flex flex-col space-y-3 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-blue-700 dark:text-brand-400">
            {post.departure} → {post.destination}
          </h3>
          <span className="bg-blue-100 dark:bg-brand-500/20 text-blue-800 dark:text-brand-400 text-xs font-medium px-2.5 py-0.5 rounded-full">
            ${post.price}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>From: {post.departure}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Calendar size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>{formatDate(post.date)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>To: {post.destination}</span>
          </div>
          
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Clock size={16} className="mr-2 text-gray-500 dark:text-gray-500" />
            <span>{formatTime(post.time)}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-white/[0.03]">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-100 dark:bg-brand-500/15 rounded-full flex items-center justify-center text-blue-700 dark:text-brand-400 font-medium">
              {post.driverName.charAt(0)}
            </div>
            <span className="ml-2 text-sm font-medium dark:text-gray-300">{post.driverName}</span>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <Users size={16} className="mr-1 text-gray-500 dark:text-gray-500" />
              <span>{post.seatCount} seats</span>
            </div>
            
            <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
              <RotateCcw size={16} className="mr-1 text-gray-500 dark:text-gray-500" />
              <span>{post.frequency}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-4 space-y-2">
        <button
          onClick={handleJoinRide}
          className={`w-full py-2 px-4 rounded-md font-medium text-sm transition-all duration-300 ${
            requestPending
              ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30'
              : 'bg-blue-100 dark:bg-brand-500/20 text-blue-700 dark:text-brand-400 border border-blue-200 dark:border-brand-500/20 hover:bg-blue-200 dark:hover:bg-brand-500/30'
          }`}
        >
          {requestPending ? 'Request Pending' : 'Join Ride'}
        </button>
        
        <div className="flex space-x-2">
          <button
            onClick={handleDeletePost}
            className="w-1/2 py-2 px-4 rounded-md font-medium text-sm transition-all duration-300 bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30 hover:bg-red-200 dark:hover:bg-red-500/30"
          >
            Delete Post
          </button>
          
          <button
            onClick={handleClosePost}
            className="w-1/2 py-2 px-4 rounded-md font-medium text-sm transition-all duration-300 bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-200 dark:border-gray-500/30 hover:bg-gray-200 dark:hover:bg-gray-500/30"
          >
            Close Post
          </button>
        </div>
      </div>
      
      {showAlert && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-black/50 dark:bg-gray-900/60 text-white text-sm px-6 py-3 rounded-md shadow-lg">
            Request cancelled
          </div>
        </div>
      )}
    </div>
  );
};

export default CarpoolPostItem;