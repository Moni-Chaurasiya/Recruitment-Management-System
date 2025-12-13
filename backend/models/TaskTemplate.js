import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: { type: String, enum: ['mcq', 'text'], required: true },
  options: [String], // Only for MCQ type
  correctAnswer: String, // Only for MCQ type (for admin reference)
  points: { type: Number, default: 1 }
});

const taskTemplateSchema = new mongoose.Schema({
  taskNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  instructions: String,
  questions: [questionSchema],
  totalPoints: { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('TaskTemplate', taskTemplateSchema);