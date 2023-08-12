const TasksModel = require("../models/TasksModel");
const User = require("../models/UsersModel")


//Create New Task
exports.createTask = async (req, res) => {
    try {

        const { title, description } = req.body;

        const user = await User.findById(req.user);

        const email = user.email;

        const newTask = await TasksModel.create({ title, description, email });

        res.status(201).json({ status: 'Success', massage: 'New Task has been Created!', Data: newTask })

    } catch (error) {
        console.log(error)
    }
};

//Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const deleteTask = await TasksModel.findByIdAndDelete(taskId);

        if (!deleteTask) {
            return res.json({ error: 'Task not found' })
        }

        res.json({ massage: 'Task has been Deleted', deleteTask });
    } catch (error) {
        console.log(error)
    }
};

//Update Task
exports.updateTask = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { taskId } = req.params;


        const updateTask = await TasksModel.findByIdAndUpdate(taskId, {
            email: taskId.email,
            title: title || taskId.title,
            description: description || taskId.description,
            status: 'Updated'
        }, { new: true });

        if (!updateTask) {
            return res.json({ error: 'Task not found' })
        }

        res.json(updateTask);

    } catch (error) {
        console.log(error)
    }
};

//Update Status
exports.updateStatus = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { status } = req.body;

        const updateStatus = await TasksModel.findByIdAndUpdate(taskId, { status });

        if (!updateStatus) {
            return res.json({ error: 'Task not found!' })
        }
        res.json(updateStatus);

    } catch (error) {
        console.log(error)
    }
};

//All Task
exports.tasks = async (req, res) => {
    try {
        const user = await User.findById(req.user);
        const { email } = user.email;
        const tasks = await TasksModel.find(email, 'title description status');

        if (!tasks) {
            return res.json({ error: 'Task is empty' })
        }

        res.json(tasks)
    } catch (error) {
        console.log(error)
    }
};

//List Task By Status
exports.listTaskByStatus = async (req, res) => {
    try {
        const { status } = req.params;
        const user = await User.findById(req.user);
        const email = user.email;
        const tasks = await TasksModel.find({ email, status }, 'title description status');

        if (!tasks) {
            return res.json({ error: 'Task not found' })
        }

        res.json(tasks)
    } catch (error) {
        console.log(error)
    }
};

