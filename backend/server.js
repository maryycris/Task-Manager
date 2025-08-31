require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Task-Manager_db';

app.use(cors());
app.use(express.json());
app.use('/api/tasks', tasksRouter);

app.get('/', (req, res) => {
    res.send('Task Manager API with MongoDB is running.');
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
            console.log('Connected to MongoDB');
        });
    })
    .catch((err) => {
        console.error('MongoDB connection failed:', err.message);
    });
