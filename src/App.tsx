import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ClientHome from "./pages/client/ClientHome";
import BarberDetail from "./pages/client/BarberDetail";
import ClientAppointments from "./pages/client/ClientAppointments";
import ClientProfile from "./pages/client/ClientProfile";
import BarberDashboard from "./pages/barber/BarberDashboard";
import BarberAgenda from "./pages/barber/BarberAgenda";
import BarberServices from "./pages/barber/BarberServices";
import BarberSettings from "./pages/barber/BarberSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'client' | 'barber' }> = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'barber' ? '/barber' : '/client'} replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={user.role === 'barber' ? '/barber' : '/client'} replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to={user.role === 'barber' ? '/barber' : '/client'} replace /> : <Register />} />

      {/* Client routes */}
      <Route path="/client" element={<ProtectedRoute role="client"><ClientHome /></ProtectedRoute>} />
      <Route path="/client/barber/:id" element={<ProtectedRoute role="client"><BarberDetail /></ProtectedRoute>} />
      <Route path="/client/appointments" element={<ProtectedRoute role="client"><ClientAppointments /></ProtectedRoute>} />
      <Route path="/client/profile" element={<ProtectedRoute role="client"><ClientProfile /></ProtectedRoute>} />

      {/* Barber routes */}
      <Route path="/barber" element={<ProtectedRoute role="barber"><BarberDashboard /></ProtectedRoute>} />
      <Route path="/barber/agenda" element={<ProtectedRoute role="barber"><BarberAgenda /></ProtectedRoute>} />
      <Route path="/barber/services" element={<ProtectedRoute role="barber"><BarberServices /></ProtectedRoute>} />
      <Route path="/barber/settings" element={<ProtectedRoute role="barber"><BarberSettings /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <AuthProvider>
        <BrowserRouter>
          <div className="max-w-lg mx-auto min-h-screen bg-background relative">
            <AppRoutes />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
