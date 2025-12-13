import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  questionText: String,
  questionType: String,
  answer: String, // For text type or selected option for MCQ
  isCorrect: Boolean, // Only for MCQ
  pointsEarned: { type: Number, default: 0 }
});

const taskSubmissionSchema = new mongoose.Schema({
  taskAssignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'TaskAssignment', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  taskNumber: { type: String, required: true },
  answers: [answerSchema],
  totalPoints: { type: Number, default: 0 },
  maxPoints: { type: Number, default: 0 },
  submittedAt: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: Date,
  feedback: String
}, { timestamps: true });

export default mongoose.model('TaskSubmission', taskSubmissionSchema);