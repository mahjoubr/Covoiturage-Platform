import { useQuery } from "@apollo/client";
import { useState } from "react";
import { GET_USERS } from "../../graphQl/queries/users";
import { Flag, Search, Sparkles, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, loading, error } = useQuery(GET_USERS, {
    variables: { searchTerm: searchTerm || "", page, limit },
  });

  const navigate = useNavigate();
  
  const handleReportUser = (userId:number) => {
    navigate('/report', { state: { reportedUserId: userId } });
  };

  // Gradient card backgrounds
  const cardGradients = [
    "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
    "from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20",
    "from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20",
    "from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20",
    "from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20",
  ];

  // Button accent colors
  const buttonAccents = [
    "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500",
    "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500",
    "bg-teal-600 hover:bg-teal-700 focus:ring-teal-500",
    "bg-cyan-600 hover:bg-cyan-700 focus:ring-cyan-500",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900">
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-full mb-6 shadow-lg">
            <Sparkles size={28} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <h1 className="text-5xl font-extrabold mb-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              Users Directory
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto text-lg">
            Connect with talented professionals in our community
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 relative max-w-xl mx-auto transform transition-all duration-500 scale-100">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl overflow-hidden pr-4 pl-3 py-1">
              <div className="bg-indigo-100 dark:bg-indigo-800/30 rounded-full p-2 mr-3">
                <Search className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <input
                type="text"
                placeholder="Search users by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 dark:text-gray-200 placeholder-gray-400 text-lg"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 dark:border-indigo-900 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 dark:border-indigo-400 rounded-full border-l-transparent animate-spin"></div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-6">
            <div className="flex">
              <svg className="h-6 w-6 text-red-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Error</h3>
                <div className="mt-1 text-red-700 dark:text-red-300">{error.message}</div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Users Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {data?.getUsers?.data.map((user:any, index:number) => {
                const gradientClass = cardGradients[index % cardGradients.length];
                const buttonAccent = buttonAccents[index % buttonAccents.length];
                
                return (
                  <div 
                    key={user.id} 
                    className={`bg-gradient-to-br ${gradientClass} rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                  >
                    <div className="p-6">
                      {/* User info with circular image on the left */}
                      <div className="flex items-center mb-4">
                        {user.imageUrl ? (
                          <img 
                            src={user.imageUrl} 
                            alt={`${user.name} ${user.lastName}`} 
                            className="h-20 w-20 rounded-full object-cover shadow-md border-2 border-white dark:border-gray-800"
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xl font-bold shadow-md border-2 border-white dark:border-gray-800">
                            {user.name.charAt(0)}{user.lastName.charAt(0)}
                          </div>
                        )}
                        
                        <div className="ml-4">
                          <h3 className="text-xl font-bold text-gray-800 dark:text-white">{user.name} {user.lastName}</h3>
                          
                          {/* Star Rating */}
                          <div className="flex items-center mt-2">
                            {[...Array(5)].map((_, i) => (
                              <svg 
                                key={i} 
                                className={`w-5 h-5 ${i < Math.round(user.rating) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                                fill="currentColor" 
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                              </svg>
                            ))}
                            <span className="ml-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                              {user.rating}/5
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Buttons */}
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        <button className={`${buttonAccent} text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2`}>
                          View Profile
                        </button>
                        <button 
                          onClick={() => handleReportUser(user.id)}
                          className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-red-500 border border-gray-200 dark:border-gray-700 py-3 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          <Flag size={16} className="mr-2" />
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {data?.getUsers?.data.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center justify-center p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                  <Users size={28} className="text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">No users found</h3>
                <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  Try adjusting your search to find what you're looking for.
                </p>
              </div>
            )}

            {/* Pagination */}
            {data?.getUsers?.data.length > 0 && (
              <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-8">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button 
                    disabled={data?.getUsers?.currentPage === 1} 
                    onClick={() => setPage(page - 1)}
                    className={`relative inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${
                      data?.getUsers?.currentPage === 1 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-700' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Previous
                  </button>
                  <button 
                    onClick={() => setPage(page + 1)}
                    disabled={page * limit >= data?.getUsers?.totalItems}
                    className={`ml-3 relative inline-flex items-center px-5 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors ${
                      page * limit >= data?.getUsers?.totalItems 
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border border-gray-300 dark:border-gray-700' 
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Showing <span className="font-medium">{((page - 1) * limit) + 1}</span> to{' '}
                      <span className="font-medium">
                        {Math.min(page * limit, data?.getUsers?.totalItems)}
                      </span>{' '}
                      of <span className="font-medium">{data?.getUsers?.totalItems}</span> results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-lg shadow-md overflow-hidden" aria-label="Pagination">
                      <button
                        disabled={data?.getUsers?.currentPage === 1}
                        onClick={() => setPage(page - 1)}
                        className={`relative inline-flex items-center px-3 py-2 border-r ${
                          data?.getUsers?.currentPage === 1 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-700' 
                            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="sr-only">Previous</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Current page indicator */}
                      <span className="relative inline-flex items-center px-4 py-2 border-r border-indigo-600 bg-indigo-600 text-sm font-medium text-white">
                        {data?.getUsers?.currentPage}
                      </span>
                      
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page * limit >= data?.getUsers?.totalItems}
                        className={`relative inline-flex items-center px-3 py-2 ${
                          page * limit >= data?.getUsers?.totalItems 
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-300 dark:border-gray-700' 
                            : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-300 border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                      >
                        <span className="sr-only">Next</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UsersPage;