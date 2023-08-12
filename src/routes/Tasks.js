const { createTask, updateTask, updateStatus, tasks, deleteTask, listTaskByStatus } = require('../controllers/TasksController');
const { isLogin } = require('../middlewares/auth');

const router = require('express').Router();


//Create New Task Route
router.post('/create-task', isLogin, createTask);

//Delete Task Route
router.delete('/task/delete/:taskId', isLogin, deleteTask);

//Update Task Route
router.put('/task/update/:taskId', isLogin, updateTask);

//Update Status Route
router.put('/task/update-status/:taskId', isLogin, updateStatus);

//List Task By Status Route
router.get('/tasks/:status', isLogin, listTaskByStatus);

//All Task Route
router.get('/tasks', isLogin, tasks);




module.exports = router;