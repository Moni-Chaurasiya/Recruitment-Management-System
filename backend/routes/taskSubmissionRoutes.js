import express from 'express';
import {
  submitTask,
  getMySubmissions,
  getSubmissionByAssignment,
  getSubmissionsByUserId,
  getAllSubmissions,
  reviewSubmission
} from '../controllers/taskSubmissionController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Student Routes
router.post('/submit', auth, submitTask);
router.get('/my-submissions', auth, getMySubmissions);
router.get('/assignment/:assignmentId', auth, getSubmissionByAssignment);

// Admin Routes
router.get('/all', auth, adminAuth, getAllSubmissions);
router.get('/user/:userId', auth, adminAuth, getSubmissionsByUserId);
router.put('/:id/review', auth, adminAuth, reviewSubmission);

export default router;