import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper, ShieldCheck } from 'lucide-react';
import styles from './Home.module.css';

const HomePage: React.FC = () => {
  const featuredPosts = [
    {
      slug: 'securing-devops-pipelines',
      title: 'Securing DevOps Pipelines',
      category: 'DevSecOps',
    },
    {
      slug: 'kubernetes-security-best-practices',
      title: 'Kubernetes Security Best Practices',
      category: 'Cybersecurity',
    },
    {
      slug: 'modern-software-engineering-principles',
      title: 'Modern Software Engineering Principles',
      category: 'Software Engineering',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={styles.heroTitle}
        >
          Insights for the Modern Developer
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={styles.heroDescription}
        >
          Exploring the frontiers of Cybersecurity, DevOps, and Software Engineering.
          Stay ahead of the curve with expert analysis and practical guides.
        </motion.p>
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link
            to="/news"
            className={styles.exploreButton}
          >
            Explore Articles
            <ArrowRight className={styles.exploreButtonIcon} />
          </Link>
        </motion.div>
      </div>

      {/* Featured Posts Section */}
      <div className={styles.featuredPostsSection}>
        <div className={styles.featuredPostsContainer}>
          <h2 className={styles.featuredPostsTitle}>
            Featured Articles
          </h2>
          <div className={styles.postsGrid}>
            {featuredPosts.map((post) => (
              <motion.div
                key={post.slug}
                whileHover={{ y: -5 }}
                className={styles.postCard}
              >
                <Link to={`/news/${post.slug}`} className={styles.postLink}>
                  <div className={styles.postMeta}>
                    {post.category === 'DevSecOps' ? (
                      <ShieldCheck className={styles.postCategoryIcon} />
                    ) : (
                      <Newspaper className={styles.postCategoryIcon} />
                    )}
                    <span className={styles.postCategory}>
                      {post.category}
                    </span>
                  </div>
                  <h3 className={styles.postTitle}>
                    {post.title}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomePage;
