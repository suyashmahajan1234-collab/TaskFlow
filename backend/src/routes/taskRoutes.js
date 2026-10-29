const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addSubtask,
  toggleSubtask,
  reorderTasks,
  getStats,
} = require('../controllers/taskController');

// Stats route should come before /:id
router.get('/stats', getStats);
router.post('/reorder', reorderTasks);

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .get(getTaskById)
  .patch(updateTask)
  .put(updateTask)
  .delete(deleteTask);

router.post('/:id/subtasks', addSubtask);
router.patch('/:id/subtasks/:subtaskId', toggleSubtask);

module.exports = router;

