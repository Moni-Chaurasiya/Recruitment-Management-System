import mongoose from 'mongoose';

const taskAssignmentSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskNumber: { type: String, required: true },
  taskTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskTemplate', required: true },
  deadline: { type: Number, required: true }, 
  status: { type: String, enum: ['Pending', 'In Progress', 'Submitted', 'Reviewed'], default: 'Pending' },
  assignedAt: { type: Date, default: Date.now },
  startedAt: Date,
  submittedAt: Date
}, { timestamps: true });

export default mongoose.model('TaskAssignment', taskAssignmentSchema);