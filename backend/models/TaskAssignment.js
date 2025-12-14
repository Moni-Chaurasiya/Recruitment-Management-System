import mongoose from 'mongoose';

const taskAssignmentSchema = new mongoose.Schema({
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskNumber: { type: String, required: true },
  taskTemplateId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskTemplate', required: true },
  deadline: { type: Number, required: true }, // Hours to start the test
  timeLimit: { type: Number, required: true }, // NEW - Minutes to complete once started
  status: { type: String, enum: ['Pending', 'In Progress', 'Submitted', 'Reviewed', 'Expired'], default: 'Pending' },
  assignedAt: { type: Date, default: Date.now },
  startedAt: Date,
  expiresAt: Date, // NEW - When test must be completed (startedAt + timeLimit)
  submittedAt: Date,
  round: { type: Number, default: 1 } // NEW - Which round this assessment is for
}, { timestamps: true });

export default mongoose.model('TaskAssignment', taskAssignmentSchema);