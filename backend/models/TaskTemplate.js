import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  questionType: { type: String, enum: ['mcq', 'text'], required: true },
  options: [String],
  correctAnswer: String,
  points: { type: Number, default: 1 }
});

const taskTemplateSchema = new mongoose.Schema({
  taskNumber: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  instructions: String,
  questions: [questionSchema],
  totalPoints: { type: Number, default: 0 },
  timeLimit: { type: Number, required: true, default: 60 }, // NEW - Time limit in minutes
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('TaskTemplate', taskTemplateSchema);