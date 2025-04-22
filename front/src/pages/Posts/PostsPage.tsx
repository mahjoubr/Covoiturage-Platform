import CarpoolPostList from '../../components/posts/CarpoolPostList';

function Posts() {
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 max-w-full px-4 md:px-8 lg:px-12" style={{paddingTop:"0 !important"}}>
      <CarpoolPostList />
    </div>
  );
}


export default Posts;