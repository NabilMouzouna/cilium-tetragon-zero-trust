import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import HomePage from '../pages/Home';
import NewsPage from '../pages/News';
import PostPage from '../pages/Post';

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="news/:slug" element={<PostPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
