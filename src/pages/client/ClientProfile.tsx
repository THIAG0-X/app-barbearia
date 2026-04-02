import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import { User, Mail, Phone, LogOut, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ClientProfile: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const appointments = api.getClientAppointments(user.id);
  const completed = appointments.filter(a => a.status === 'completed');
  const totalSpent = completed.reduce((s, a) => s + a.servicePrice, 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">{user.name}</h1>
            <p className="text-primary-foreground/70 text-sm">Cliente</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4 mt-6">
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary">{completed.length}</p>
              <p className="text-xs text-muted-foreground">Cortes realizados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-accent-foreground">R$ {totalSpent}</p>
              <p className="text-xs text-muted-foreground">Total gasto</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{user.phone}</span>
            </div>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" /> Sair da conta
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default ClientProfile;
