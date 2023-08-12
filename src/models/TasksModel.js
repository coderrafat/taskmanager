const { Schema, model } = require('mongoose');


const TasksSchema = new Schema({
    email: { type: String },
    title: { type: String, required: true, trim: true },
    description: { type: String },
    status: { type: String, default: 'New' }
}, { timestamps: true, versionKey: false })


const TasksModel = model('tasks', TasksSchema);


module.exports = TasksModel;