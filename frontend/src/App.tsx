import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import NurseDashboard from "./pages/NurseDashboard";
import DoctorDashboard from "./pages/DoctorDashboard";
import LabTechDashboard from "./pages/LabTechDashboard";
import PharmacistDashboard from "./pages/PharmacistDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const DashboardRouter = () => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated || !user) return <Login />;

  const dashboards = {
    admin: <AdminDashboard />,
    doctor: <DoctorDashboard />,
    nurse: <NurseDashboard />,
    lab_tech: <LabTechDashboard />,
    pharmacist: <PharmacistDashboard />,
  };

  return dashboards[user.role] || <Navigate to="/" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<DashboardRouter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
