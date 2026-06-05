import express from 'express';
import Task from '../models/Task.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get user's tasks
// @route   GET /api/tasks
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { search, status, priority, sortBy, page = 1, limit = 10 } = req.query;
    
    // Construct query object
    const query = { userId: req.user._id };

    // Search query: matching title or description (case-insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Status filter
    if (status && status !== 'all') {
      query.status = status;
    }

    // Priority filter
    if (priority && priority !== 'all') {
      query.priority = priority;
    }

    // Sort definition: e.g. "dueDate:asc", "createdAt:desc"
    let sortOptions = { createdAt: -1 }; // default sorting
    if (sortBy) {
      const [field, order] = sortBy.split(':');
      sortOptions = { [field]: order === 'asc' ? 1 : -1 };
    }

    // Pagination configuration
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Get total tasks count
    const totalTasks = await Task.countDocuments(query);
    
    // Fetch tasks
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNumber);

    const totalCount = await Task.countDocuments({ userId: req.user._id });
    const completedCount = await Task.countDocuments({ userId: req.user._id, status: 'completed' });
    const pendingCount = await Task.countDocuments({ userId: req.user._id, status: 'pending' });

    res.json({
      tasks,
      totalTasks,
      totalPages: Math.ceil(totalTasks / limitNumber),
      currentPage: pageNumber,
      summary: {
        total: totalCount,
        completed: completedCount,
        pending: pendingCount
      }
    });
  } catch (error) {
    console.error('Fetch tasks error:', error);
    res.status(500).json({ message: 'Server error while fetching tasks' });
  }
});

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  try {
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = await Task.create({
      title,
      description,
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate,
      userId: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this task' });
    }

    // Update fields
    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.status = status !== undefined ? status : task.status;
    task.priority = priority !== undefined ? priority : task.priority;
    task.dueDate = dueDate !== undefined ? dueDate : task.dueDate;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Check ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this task' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Server error while deleting task' });
  }
});

export default router;
