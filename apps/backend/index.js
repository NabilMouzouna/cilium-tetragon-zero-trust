const express = require('express');
const cors = require('cors');
const posts = require('./data').posts;

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/posts', (req, res) => {
  res.json(posts);
});

app.get('/api/posts/:slug', (req, res) => {
  const post = posts.find((p) => p.slug === req.params.slug);
  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

app.listen(port, () => {
  console.log(`Backend server listening on port ${port}`);
});
