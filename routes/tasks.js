const express = require('express');
const router = express.Router();

// In-memory tasks array
let tasks = [];
let lastId = 0;

const STATUS = ['pending', 'in-progress', 'completed'];

// Create Task
router.post('/', (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !description || !STATUS.includes(status)) {
        return res.status(400).json({ message: 'Invalid input.' });
    }
    const newTask = { id: ++lastId, title, description, status };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// Get All Tasks (+ search, + filter)
router.get('/', (req, res) => {
    let { search, status } = req.query;
    let filtered = [...tasks];
    if (search) {
        filtered = filtered.filter(t => 
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.description.toLowerCase().includes(search.toLowerCase())
        );
    }
    if (status && STATUS.includes(status)) {
        filtered = filtered.filter(t => t.status === status);
    }
    res.json(filtered);
});

// Get Single Task
router.get('/:id', (req, res) => {
    const task = tasks.find(t => t.id == req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
});

// Update Task
router.put('/:id', (req, res) => {
    const { title, description, status } = req.body;
    const task = tasks.find(t => t.id == req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined && STATUS.includes(status)) task.status = status;
    res.json(task);
});

// Delete Task
router.delete('/:id', (req, res) => {
    const idx = tasks.findIndex(t => t.id == req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Task not found' });
    const deleted = tasks.splice(idx, 1);
    res.json(deleted[0]);
});

module.exports = router;
