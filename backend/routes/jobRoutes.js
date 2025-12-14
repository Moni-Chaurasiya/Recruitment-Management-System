import express from 'express';
import {
  createJob,
  getAllJobs,
  getJobById,
  getMyPostedJobs,
  updateJob,
  deleteJob,
  toggleJobStatus,
  getJobApplicants,
  getJobStats
} from '../controllers/jobController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Public Routes
router.get('/all', getAllJobs);
router.get('/:id', getJobById);

// Admin Routes
router.post('/create', auth, adminAuth, createJob);
router.get('/admin/my-jobs', auth, adminAuth, getMyPostedJobs);
router.get('/admin/stats', auth, adminAuth, getJobStats);
router.get('/admin/:jobId/applicants', auth, adminAuth, getJobApplicants);
router.put('/:id', auth, adminAuth, updateJob);
router.delete('/:id', auth, adminAuth, deleteJob);
router.patch('/:id/toggle-status', auth, adminAuth, toggleJobStatus);

export default router;
