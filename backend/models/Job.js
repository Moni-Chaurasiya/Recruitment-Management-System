import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, default: 'Our Company' },
  location: { type: String, required: true },
  locationType: { type: String, enum: ['Remote', 'On-site', 'Hybrid'], default: 'On-site' },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true },
  experience: { type: String, required: true }, // e.g., "2-5 years"
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' }
  },
  description: { type: String, required: true },
  responsibilities: [String],
  requirements: [String],
  skills: [String],
  benefits: [String],
  deadline: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicantsCount: { type: Number, default: 0 },
  viewsCount: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);