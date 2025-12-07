import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import type { Post as BlogPostType } from '../lib/types';
import { fetchPostBySlug } from '../lib/api';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import styles from './Post.module.css';

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

  const getCategoryClassName = (category: string) => {
    switch (category) {
      case 'DevSecOps':
        return styles.categoryDevSecOps;
      case 'Cybersecurity':
        return styles.categoryCybersecurity;
      case 'DevOps':
        return styles.categoryDevOps;
      case 'Software Engineering':
        return styles.categorySoftwareEngineering;
      default:
        return styles.categoryDefault;
    }
  };

  if (loading) {
    return (
        <div className={styles.loadingContainer}>
            <Loader2 className={styles.loaderIcon} />
            <p className={styles.loadingText}>Loading post...</p>
        </div>
    );
  }

  if (error || !post) {
    return (
        <div className={styles.errorContainer}>
            <AlertTriangle className={styles.errorIcon} />
            <p className={styles.errorText}>{error || 'Post not found.'}</p>
            <Link to="/news" className={styles.backToNewsButton}>
                <ArrowLeft className={styles.backToNewsButtonIcon} />
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
      className={styles.postPageContainer}
    >
        <div className={styles.topBackToNews}>
            <Link to="/news" className={styles.topBackToNews}>
                <ArrowLeft className={styles.topBackToNewsIcon} />
                Back to News
            </Link>
        </div>
      <div className={styles.postContentCard}>
        <header className={styles.postHeader}>
            <span
                className={`${styles.categoryBase} ${getCategoryClassName(post.category)}`}
            >
                {post.category}
            </span>
            <h1 className={styles.postTitle}>{post.title}</h1>
            <p className={styles.postMeta}>
              By {post.author} on {new Date(post.date).toLocaleDateString()}
            </p>
        </header>

        <article
          className={styles.articleContent}
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\\n/g, '<br />') }}
        />
      </div>
    </motion.div>
  );
};

export default PostPage;

