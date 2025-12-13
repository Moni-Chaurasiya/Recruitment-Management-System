// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import StudentLogin from './components/Student/StudentLogin';
// import StudentSignup from './components/Student/StudentSignup';
// import JobApplication from './components/Student/JobApplication';
// import StudentDashboard from './components/Student/StudentDashboard';
// import MyAssessments from './components/Student/MyAssessments';
// import Profile from './components/Student/Profile';
// import Status from './components/Student/Status';
// import AdminLogin from './components/Admin/AdminLogin';
// import AdminSignup from './components/Admin/AdminSignup';
// import AdminDashboard from './components/Admin/AdminDashboard';
// import CreateTask from './components/Admin/CreateTask';

// function App() {
//   const isAuthenticated = () => localStorage.getItem('token');
//   const getUserRole = () => localStorage.getItem('role');
  
//   const ProtectedRoute = ({ children, allowedRole }) => {
//     if (!isAuthenticated()) {
//       return <Navigate to="/student/login" />;
//     }
//     if (allowedRole && getUserRole() !== allowedRole) {
//       return <Navigate to="/" />;
//     }
//     return children;
//   };

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Navigate to="/student/login" />} />
        
//         {/* Student Routes */}
//         <Route path="/student/login" element={<StudentLogin />} />
//         <Route path="/student/signup" element={<StudentSignup />} />
//         <Route 
//           path="/student/apply" 
//           element={
//             <ProtectedRoute allowedRole="student">
//               <JobApplication />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/student/dashboard" 
//           element={
//             <ProtectedRoute allowedRole="student">
//               <StudentDashboard />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/student/assessments" 
//           element={
//             <ProtectedRoute allowedRole="student">
//               <MyAssessments />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/student/profile" 
//           element={
//             <ProtectedRoute allowedRole="student">
//               <Profile />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/student/status" 
//           element={
//             <ProtectedRoute allowedRole="student">
//               <Status />
//             </ProtectedRoute>
//           } 
//         />

//         {/* Admin Routes */}
//         <Route path="/admin/login" element={<AdminLogin />} />
//         <Route path="/admin/signup" element={<AdminSignup />} />
//         <Route 
//           path="/admin/dashboard" 
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <AdminDashboard />
//             </ProtectedRoute>
//           } 
//         />
//         <Route 
//           path="/admin/tasks/create" 
//           element={
//             <ProtectedRoute allowedRole="admin">
//               <CreateTask />
//             </ProtectedRoute>
//           } 
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Student Components
import StudentLogin from './components/Student/StudentLogin';
import StudentSignup from './components/Student/StudentSignup';
import JobApplication from './components/Student/JobApplication';
import StudentDashboard from './components/Student/StudentDashboard';
import MyAssessments from './components/Student/MyAssessments';
import TaskAssessment from './components/Student/TaskAssessment';
import Profile from './components/Student/Profile';
import Status from './components/Student/Status';

// Admin Components
import AdminLogin from './components/Admin/AdminLogin';
import AdminSignup from './components/Admin/AdminSignup';
import AdminDashboard from './components/Admin/AdminDashboard';
import CreateTaskTemplate from './components/Admin/CreateTaskTemplate';
import AssignTask from './components/Admin/AssignTask';
import ViewSubmissions from './components/Admin/ViewSubmissions';

function App() {
  const isAuthenticated = () => localStorage.getItem('token');
  const getUserRole = () => localStorage.getItem('role');

  const ProtectedRoute = ({ children, allowedRole }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/student/login" />;
    }
    if (allowedRole && getUserRole() !== allowedRole) {
      return <Navigate to="/" />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/student/login" />} />
        
        {/* Student Routes */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/signup" element={<StudentSignup />} />
        <Route 
          path="/student/apply" 
          element={
            <ProtectedRoute allowedRole="student">
              <JobApplication />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/assessments" 
          element={
            <ProtectedRoute allowedRole="student">
              <MyAssessments />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/assessment/:assignmentId" 
          element={
            <ProtectedRoute allowedRole="student">
              <TaskAssessment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/profile" 
          element={
            <ProtectedRoute allowedRole="student">
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/student/status" 
          element={
            <ProtectedRoute allowedRole="student">
              <Status />
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/tasks/create-template" 
          element={
            <ProtectedRoute allowedRole="admin">
              <CreateTaskTemplate />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/tasks/assign" 
          element={
            <ProtectedRoute allowedRole="admin">
              <AssignTask />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/submissions/user/:userId" 
          element={
            <ProtectedRoute allowedRole="admin">
              <ViewSubmissions />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;