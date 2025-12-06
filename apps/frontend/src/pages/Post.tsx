import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { Post as BlogPostType } from '../lib/types';
import { fetchPostBySlug } from '../lib/api';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';

const categoryColors: { [key: string]: string } = {
    DevSecOps: 'bg-blue-100 text-blue-800',
    Cybersecurity: 'bg-green-100 text-green-800',
    DevOps: 'bg-purple-100 text-purple-800',
    'Software Engineering': 'bg-yellow-100 text-yellow-800',
};

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
          setError('Failed to load the post. It might not exist.');
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
        <div className="flex flex-col justify-center items-center h-96">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-lg text-on-surface-variant">Loading post...</p>
        </div>
    );
  }

  if (error || !post) {
    return (
        <div className="flex flex-col items-center justify-center h-96 bg-surface-200 rounded-lg">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <p className="mt-4 text-lg text-red-600 font-semibold">{error || 'Post not found.'}</p>
            <Link to="/news" className="mt-6 inline-flex items-center px-4 py-2 bg-primary text-on-primary rounded-md hover:bg-primary/90">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to News
            </Link>
        </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto py-10"
    >
        <div className="mb-8">
            <Link to="/news" className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-200">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to News
            </Link>
        </div>
      <div className="bg-surface-100 p-8 md:p-12 rounded-lg shadow-lg">
        <header className="mb-8">
            <span
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full uppercase mb-4 ${
                categoryColors[post.category] || 'bg-gray-100 text-gray-800'
                }`}
            >
                {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-3">{post.title}</h1>
            <p className="text-on-surface-variant">
              By {post.author} on {new Date(post.date).toLocaleDateString()}
            </p>
        </header>

        <article 
          className="prose prose-lg max-w-none text-on-surface prose-headings:text-on-surface prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-on-surface" 
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\\n/g, '<br />') }} 
        />
      </div>
    </motion.div>
  );
};

export default PostPage;
