"use client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "@/components/Headers";

interface Post {
  id: number;
  title: string;
  body: string;
  status: 'active' | 'inactive';
}

const Dashboard = () => {
  const { user } = useUser();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      const accessTokenResponse = await fetch('/api/access');
      const { accessToken } = await accessTokenResponse.json();

      const response = await fetch('/api/posts', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      setPosts(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const accessTokenResponse = await fetch('/api/access');
    const { accessToken } = await accessTokenResponse.json();

      const response = await fetch(`/api/posts?id=${postId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) throw new Error('Failed to delete post');
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  useEffect(() => {
    if (user) fetchPosts();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <p className="text-red-500 text-center mt-4">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      <main className="container mx-auto p-4 lg:p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Your Projects</h1>
          <button
            onClick={() => router.push('/create-post')}
            className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
          >
            Create New Project
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{post.title}</h3>
              <p className="text-gray-600 mb-4 line-clamp-3">{post.body}</p>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${post.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                  }`}>
                  {post.status}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/edit-post/${post.id}`)}
                    className="text-blue-600 hover:text-blue-700 px-3 py-1 rounded-md transition-colors duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-700 px-3 py-1 rounded-md transition-colors duration-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No projects found. Create your first project!</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;