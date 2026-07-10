import { useAuth } from "../context/AuthContext";
import DashboardWelcome from "../components/dashboard/DashboardWelcome";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import AdminDashboardLayout from "../components/admin/AdminDashboardLayout";

const Dashboard = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <DashboardWelcome />;
  }

  // Route to Admin Dashboard for admin users
  if (user?.role === "admin") {
    return <AdminDashboardLayout />;
  }

  return <DashboardLayout />;
};

export default Dashboard;
