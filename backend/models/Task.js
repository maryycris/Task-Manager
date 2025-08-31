const mongoose = require('mongoose');

const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: VALID_STATUSES, default: 'pending', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);