import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Pages/Login";
import { AuthProvider } from "./AuthContext";
import LandingPage from "./Pages/LandingPage";
import AboutPage from "./Pages/About";
import ContactUs from "./Pages/ContactUs";
import FeaturesPage from "./Pages/Features";
import AdminDashboard from "./Pages/AdminDashboard";
import HolidayList from "./Pages/HolidayList";
import ManagersPage from "./Pages/ManagerPage";
import LeaveManagementDashboard from './Pages/Dashboard';
import { PrivateRoute, AdminRoute, ManagerRoute } from "./PrivateRoute";
import LeaveHistory from "./Pages/History";
import ManagerProfile from "./Pages/ProfileOthers";
import Profile from "./Pages/Profile";
import NotFound from "./Pages/NotFound";
import Statistics from "./Pages/Statistics";
import EditProfile from "./Pages/Edit_Profile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/features" element={<FeaturesPage />} />

          {/* Routes requiring authentication */}
          <Route element={<PrivateRoute />}>
            <Route path="/holidays" element={<HolidayList />} />
            <Route path="/profile/:id" element={<ManagerProfile />} />
            <Route path="/user-profile" element={<Profile />} />
            <Route path="/history" element={<LeaveHistory />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/dashboard" element={<LeaveManagementDashboard />} />
            <Route path="/edit-profile" element={<EditProfile/>}/>

            {/* Admin-only routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/managers" element={<ManagersPage />} />
            </Route>

            {/* Manager-only routes */}
            <Route element={<ManagerRoute />}>
              <Route path="/employees" element={<ManagersPage />} />
              <Route path="/manager/dashboard" element={<AdminDashboard />} />

            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
