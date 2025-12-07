import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Post } from '../lib/types';
import { fetchPosts } from '../lib/api';
import { Loader2, AlertTriangle } from 'lucide-react';
import styles from './News.module.css';

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
        <p className={styles.loadingText}>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <AlertTriangle className={styles.errorIcon} />
        <p className={styles.errorText}>{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={styles.newsPageContainer}
    >
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>All Articles</h1>
        <p className={styles.pageSubtitle}>
          Browse our collection of articles and stay informed.
        </p>
      </div>
      <div className={styles.postsGrid}>
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
            className={styles.postCard}
          >
            <div className={styles.postContent}>
              <div className={styles.postMetaTop}>
                  <span
                      className={`${styles.categoryBase} ${getCategoryClassName(post.category)}`}
                  >
                      {post.category}
                  </span>
                  <p className={styles.postDate}>{new Date(post.date).toLocaleDateString()}</p>
              </div>
              <h2 className={styles.postTitle}>
                <Link to={`/news/${post.slug}`} className={styles.postLinkHover}>
                  {post.title}
                </Link>
              </h2>
              <p className={styles.postDescription}>
                {post.content.substring(0, 120)}...
              </p>
              <div className={styles.readMoreContainer}>
                <Link to={`/news/${post.slug}`} className={styles.readMoreLink}>
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
