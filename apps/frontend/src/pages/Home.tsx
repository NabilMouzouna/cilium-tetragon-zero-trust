import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Newspaper, ShieldCheck } from 'lucide-react';

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
      <div className="text-center py-16 md:py-24">
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold text-on-surface mb-4"
        >
          Insights for the Modern Developer
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-on-surface-variant max-w-3xl mx-auto mb-8"
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
            className="inline-flex items-center px-8 py-3 bg-primary text-on-primary text-lg font-semibold rounded-md shadow-lg hover:bg-primary/90 transition-colors duration-300"
          >
            Explore Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </motion.div>
      </div>

      {/* Featured Posts Section */}
      <div className="py-16 md:py-24 bg-surface-200/50 rounded-lg">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-on-surface text-center mb-12">
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <motion.div
                key={post.slug}
                whileHover={{ y: -5 }}
                className="bg-surface-100 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-xl"
              >
                <Link to={`/news/${post.slug}`} className="block p-6">
                  <div className="flex items-center mb-4">
                    {post.category === 'DevSecOps' ? (
                      <ShieldCheck className="h-6 w-6 text-primary mr-3" />
                    ) : (
                      <Newspaper className="h-6 w-6 text-primary mr-3" />
                    )}
                    <span className="text-sm font-semibold text-primary uppercase">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-on-surface mb-2">
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
