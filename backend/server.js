import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Import Routes
import authRoutes from './routes/authRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js'; // NEW
import taskTemplateRoutes from './routes/taskTemplateRoutes.js';
import taskAssignmentRoutes from './routes/taskAssignmentRoutes.js';
import taskSubmissionRoutes from './routes/taskSubmissionRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();


app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes); // NEW
app.use('/api/task-templates', taskTemplateRoutes);
app.use('/api/task-assignments', taskAssignmentRoutes);
app.use('/api/task-submissions', taskSubmissionRoutes);


app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});


app.get('/', (req, res) => {
  res.json({ 
    message: 'Recruitment Management System API',
    version: '3.0.0',
    endpoints: {
      auth: '/api/auth',
      jobs: '/api/jobs',
      applications: '/api/applications',
      users: '/api/users',
      taskTemplates: '/api/task-templates',
      taskAssignments: '/api/task-assignments',
      taskSubmissions: '/api/task-submissions'
    }
  });
});


app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});

export default app;