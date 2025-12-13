import express from 'express';
import {
  createTaskTemplate,
  getAllTaskTemplates,
  getTaskTemplateById,
  getTaskTemplateByNumber,
  getAllTaskNumbers,
  updateTaskTemplate,
  deleteTaskTemplate
} from '../controllers/taskTemplateController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// Admin Routes
router.post('/create', auth, adminAuth, createTaskTemplate);
router.get('/all', auth, adminAuth, getAllTaskTemplates);
router.get('/numbers', auth, getAllTaskNumbers); // Available for both
router.get('/:id', auth, getTaskTemplateById);
router.get('/number/:taskNumber', auth, getTaskTemplateByNumber);
router.put('/:id', auth, adminAuth, updateTaskTemplate);
router.delete('/:id', auth, adminAuth, deleteTaskTemplate);

export default router;