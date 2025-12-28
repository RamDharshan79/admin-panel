const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 🔍 Health check
app.get('/', (req, res) => {
  res.send('Music App Backend Running');
});

// 🎵 Get songs
app.get('/api/songs', (req, res) => {
  res.json([]); // empty for now
});

// ➕ Add song
app.post('/api/songs', (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: 'Song added' });
});

// 📜 Play history
app.get('/api/history', (req, res) => {
  res.json([]);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});