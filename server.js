const express = require('express');
const cors = require('cors');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);

app.get('/', (req, res) => {
    res.send('Task Manager API is running.');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
