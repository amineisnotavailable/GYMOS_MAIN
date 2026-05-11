const express = require('express');
const cors = require('cors');
const path = require('path');
const { port } = require('./config/env');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const coachRoutes = require('./routes/coach');
const athleteRoutes = require('./routes/athlete');
const sportRoutes = require('./routes/sports');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/coach', coachRoutes);
app.use('/api/athlete', athleteRoutes);
app.use('/api/sports', sportRoutes);
app.use('/api/public', require('./routes/public'));
app.use('/api/employee', require('./routes/employee'));
app.use('/api/wallet', require('./routes/wallet'));
app.use('/api/employer', require('./routes/employer'));
app.use('/api/owner', require('./routes/owner'));
app.use('/api/shop', require('./routes/shop'));

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../client/build', 'index.html')));
}

app.listen(port, () => console.log(`Server running on port ${port}`));