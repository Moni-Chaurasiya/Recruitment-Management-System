import TaskSubmission from '../models/TaskSubmission.js';
import TaskAssignment from '../models/TaskAssignment.js';
import TaskTemplate from '../models/TaskTemplate.js';
import Application from '../models/Application.js';

// Submit Task (Student)
export const submitTask = async (req, res) => {
  try {
    const { taskAssignmentId, answers } = req.body;

    // Get assignment and template
    const assignment = await TaskAssignment.findById(taskAssignmentId)
      .populate('taskTemplateId');
    
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const template = assignment.taskTemplateId;

    // Calculate points for MCQ questions
    let totalPoints = 0;
    const processedAnswers = answers.map((ans, index) => {
      const question = template.questions.id(ans.questionId);
      let isCorrect = false;
      let pointsEarned = 0;

      if (question.questionType === 'mcq') {
        isCorrect = ans.answer === question.correctAnswer;
        pointsEarned = isCorrect ? question.points : 0;
        totalPoints += pointsEarned;
      }

      return {
        ...ans,
        questionText: question.questionText,
        questionType: question.questionType,
        isCorrect: question.questionType === 'mcq' ? isCorrect : undefined,
        pointsEarned
      };
    });

    const submission = new TaskSubmission({
      taskAssignmentId,
      userId: req.userId,
      taskNumber: assignment.taskNumber,
      answers: processedAnswers,
      totalPoints,
      maxPoints: template.totalPoints
    });

    await submission.save();

    // Update assignment status
    assignment.status = 'Submitted';
    assignment.submittedAt = new Date();
    await assignment.save();

    // Update application
    await Application.findByIdAndUpdate(assignment.applicationId, {
      hasSubmittedTask: true,
      $inc: { submittedTaskCount: 1 }
    });

    res.status(201).json({ 
      message: 'Task submitted successfully', 
      submission 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get User's Submissions
export const getMySubmissions = async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({ userId: req.userId })
      .populate('taskAssignmentId')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Submission by Assignment ID
export const getSubmissionByAssignment = async (req, res) => {
  try {
    const submission = await TaskSubmission.findOne({ 
      taskAssignmentId: req.params.assignmentId 
    }).populate('userId', 'fullName email');
    
    if (!submission) {
      return res.status(404).json({ message: 'No submission found' });
    }

    res.json(submission);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Submissions by User ID (Admin - for viewing student's all submissions)
export const getSubmissionsByUserId = async (req, res) => {
  try {
    const submissions = await TaskSubmission.find({ userId: req.params.userId })
      .populate('taskAssignmentId')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get All Submissions (Admin)
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await TaskSubmission.find()
      .populate('userId', 'fullName email')
      .populate('taskAssignmentId')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Review Submission (Admin)
export const reviewSubmission = async (req, res) => {
  try {
    const { feedback, manualPoints } = req.body;

    const submission = await TaskSubmission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }

    // Update text question points if provided
    if (manualPoints) {
      submission.answers = submission.answers.map((ans, index) => {
        if (ans.questionType === 'text' && manualPoints[index] !== undefined) {
          ans.pointsEarned = manualPoints[index];
        }
        return ans;
      });

      // Recalculate total points
      submission.totalPoints = submission.answers.reduce(
        (sum, ans) => sum + ans.pointsEarned, 
        0
      );
    }

    submission.feedback = feedback;
    submission.reviewedBy = req.userId;
    submission.reviewedAt = new Date();
    await submission.save();

    // Update assignment status
    await TaskAssignment.findByIdAndUpdate(submission.taskAssignmentId, {
      status: 'Reviewed'
    });

    res.json({ message: 'Submission reviewed successfully', submission });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};