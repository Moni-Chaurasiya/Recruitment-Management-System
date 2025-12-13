import express from 'express';
import {
  assignTask,
  getMyAssignedTasks,
  getAllAssignments,
  startTask
} from '../controllers/taskAssignmentController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Student Routes
router.get('/my-assignments', auth, getMyAssignedTasks);
router.put('/:id/start', auth, startTask);

// Admin Routes
router.post('/assign', auth, adminAuth, assignTask);
router.get('/all', auth, adminAuth, getAllAssignments);

export default router;