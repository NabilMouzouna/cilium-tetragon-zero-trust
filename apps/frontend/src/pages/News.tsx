import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Post } from '../lib/types';
import { fetchPosts } from '../lib/api';
import { Loader2 } from 'lucide-react';

const NewsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPosts = async () => {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-3 text-lg text-gray-700">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-lg mt-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-10"
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Our Latest News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <motion.div
            key={post.slug}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                <Link to={`/news/${post.slug}`} className="hover:text-blue-600 transition-colors duration-200">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 text-sm mb-3">
                By {post.author} on {new Date(post.date).toLocaleDateString()}
              </p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full uppercase font-semibold mb-4">
                {post.category}
              </span>
              <p className="text-gray-700 leading-relaxed">
                {post.content.substring(0, 150)}...
              </p>
              <Link to={`/news/${post.slug}`} className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200">
                Read More &rarr;
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NewsPage;
