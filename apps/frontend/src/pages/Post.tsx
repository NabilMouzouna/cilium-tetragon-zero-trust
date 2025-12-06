import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';
import { Post as BlogPostType } from '../lib/types';
import { fetchPostBySlug } from '../lib/api';
import { Loader2 } from 'lucide-react';

const PostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const getPost = async () => {
        try {
          const data = await fetchPostBySlug(slug);
          setPost(data);
        } catch (err) {
          setError('Failed to load post.');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      getPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="ml-3 text-lg text-gray-700">Loading post...</p>
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

  if (!post) {
    return (
      <div className="text-center text-gray-700 text-lg mt-8">
        <p>Post not found.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg"
    >
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <p className="text-gray-600 text-sm mb-2">
        By {post.author} on {new Date(post.date).toLocaleDateString()}
      </p>
      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full uppercase font-semibold mb-6">
        {post.category}
      </span>
      <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content.replace(/\\n/g, '<br />') }} />
    </motion.div>
  );
};

export default PostPage;
