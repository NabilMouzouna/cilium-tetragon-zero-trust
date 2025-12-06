import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Post } from '../lib/types';
import { fetchPosts } from '../lib/api';
import { Loader2, AlertTriangle } from 'lucide-react';

const categoryColors: { [key: string]: string } = {
  DevSecOps: 'bg-blue-100 text-blue-800',
  Cybersecurity: 'bg-green-100 text-green-800',
  DevOps: 'bg-purple-100 text-purple-800',
  'Software Engineering': 'bg-yellow-100 text-yellow-800',
};

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
        setError('Failed to load posts. Is the backend server running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-on-surface-variant">Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-surface-200 rounded-lg">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 text-lg text-red-600 font-semibold">{error}</p>
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
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-on-surface">All Articles</h1>
        <p className="text-lg text-on-surface-variant mt-2">
          Browse our collection of articles and stay informed.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
            className="bg-surface-100 rounded-lg overflow-hidden shadow-md"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase ${
                        categoryColors[post.category] || 'bg-gray-100 text-gray-800'
                        }`}
                    >
                        {post.category}
                    </span>
                    <p className="text-sm text-on-surface-variant">{new Date(post.date).toLocaleDateString()}</p>
                </div>
                <h2 className="text-xl font-semibold text-on-surface mb-3">
                  <Link to={`/news/${post.slug}`} className="hover:text-primary transition-colors duration-200">
                    {post.title}
                  </Link>
                </h2>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {post.content.substring(0, 120)}...
                </p>
              </div>
              <div className="mt-4">
                <Link to={`/news/${post.slug}`} className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200">
                  Read More &rarr;
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NewsPage;
