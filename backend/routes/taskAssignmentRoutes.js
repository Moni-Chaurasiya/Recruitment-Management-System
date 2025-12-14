import express from 'express';
import {
  assignTask,
  getMyAssignedTasks,
  getAllAssignments,
  startTask,
  checkTaskExpiry
} from '../controllers/taskAssignmentController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Student Routes
router.get('/my-assignments', auth, getMyAssignedTasks);
router.put('/:id/start', auth, startTask);
router.get('/:id/check-expiry', auth, checkTaskExpiry); // NEW

// Admin Routes
router.post('/assign', auth, adminAuth, assignTask);
router.get('/all', auth, adminAuth, getAllAssignments);

export default router;
