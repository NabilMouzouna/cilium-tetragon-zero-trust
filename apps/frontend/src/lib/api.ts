import type { Post } from './types';
import { API_BASE_URL } from '../../constants';

export const fetchPosts = async (): Promise<Post[]> => {
  const response = await fetch(`${API_BASE_URL}/posts`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts');
  }
  return response.json();
};

export const fetchPostBySlug = async (slug: string): Promise<Post> => {
  const response = await fetch(`${API_BASE_URL}/posts/${slug}`);
  if (!response.ok) {
    throw new Error('Failed to fetch post');
  }
  return response.json();
};
