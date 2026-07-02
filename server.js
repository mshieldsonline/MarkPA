require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Routes (to be built out)
// app.use('/api/tasks', require('./routes/tasks'));
// app.use('/api/projects', require('./routes/projects'));
// app.use('/api/goals', require('./routes/goals'));
// app.use('/api/notes', require('./routes/notes'));
// app.use('/api/captures', require('./routes/captures'));
// app.use('/api/tags', require('./routes/tags'));
// app.use('/api/summary', require('./routes/summary'));
// app.use('/api/chat', require('./routes/chat'));
// app.use('/telegram', require('./routes/telegram'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`MarkPA server running on port ${PORT}`));
