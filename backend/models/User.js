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

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  phone: String,
  location: String,
  bio: String,
  linkedIn: String,
  github: String,
  portfolio: String,
  skills: [String],
  education: [educationSchema],
  experience: [experienceSchema],
  profileCompleted: { type: Boolean, default: false },
  profilePicture: String // URL to profile picture
}, { timestamps: true });

export default mongoose.model('User', userSchema);