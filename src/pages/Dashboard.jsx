import { useAuth } from "../context/AuthContext";
import DashboardWelcome from "../components/dashboard/DashboardWelcome";
import DashboardLayout from "../components/dashboard/DashboardLayout";

const Dashboard = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <DashboardWelcome />;
  }

  return <DashboardLayout />;
};

export default Dashboard;
