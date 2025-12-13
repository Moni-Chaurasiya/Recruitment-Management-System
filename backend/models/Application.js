import mongoose from 'mongoose';

const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  college: { type: String, required: true },
  yearOfPassing: { type: Number, required: true },
  percentage: { type: Number, required: true }
});

const experienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  position: { type: String, required: true },
  duration: { type: String, required: true },
  description: String
});

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  position: { type: String, required: true },
  status: { type: String, enum: ['In Progress', 'Under Review', 'Completed', 'Rejected'], default: 'In Progress' },
  skills: [String],
  education: [educationSchema],
  experience: [experienceSchema],
  coverMessage: String,
  appliedAt: { type: Date, default: Date.now },
  hasSubmittedTask: { type: Boolean, default: false }, 
  submittedTaskCount: { type: Number, default: 0 } 
}, { timestamps: true });

export default mongoose.model('Application', applicationSchema);