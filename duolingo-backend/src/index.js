// index.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // Middleware to parse JSON

// Auth routes
app.use('/api', authRoutes);

// Get all quizzes with options
app.get('/api/quizzes', async (req, res) => {
  try {
    const quizzesResult = await pool.query('SELECT * FROM quizzes ORDER BY id');
    const quizzes = quizzesResult.rows;

    const quizzesWithOptions = await Promise.all(
      quizzes.map(async (quiz) => {
        const optionsRes = await pool.query(
          'SELECT image_url, option_text FROM quiz_options WHERE quiz_id = $1',
          [quiz.id]
        );

        return {
          ...quiz,
          options: optionsRes.rows.map(opt => ({
            image_url: opt.image_url,
            option_text: opt.option_text
          }))
        };
      })
    );

    res.json(quizzesWithOptions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get single quiz by slug
app.get('/api/quizzes/:slug', async (req, res) => {
  const { slug } = req.params;
  try {
    const quizRes = await pool.query('SELECT * FROM quizzes WHERE slug = $1', [slug]);

    if (quizRes.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const quiz = quizRes.rows[0];
    const optionsRes = await pool.query(
      'SELECT image_url, option_text FROM quiz_options WHERE quiz_id = $1',
      [quiz.id]
    );

    res.json({
      ...quiz,
      options: optionsRes.rows.map(opt => ({
        image_url: opt.image_url,
        option_text: opt.option_text
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
