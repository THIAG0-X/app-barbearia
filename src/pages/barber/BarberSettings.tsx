import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import { LogOut, Mail, Phone, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Barber } from '@/types';

const BarberSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;
  const barber = user as Barber;

  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

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
            <p className="text-primary-foreground/70 text-sm">Barbeiro</p>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-4 mt-6">
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Dados pessoais</h3>
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

        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">Horários de atendimento</h3>
            <div className="space-y-2">
              {barber.availableSlots?.map((slot) => (
                <div key={slot.dayOfWeek} className="flex items-center justify-between text-sm">
                  <span className="font-medium w-12">{dayNames[slot.dayOfWeek]}</span>
                  <span className="text-muted-foreground">{slot.startTime} - {slot.endTime}</span>
                  <span className="text-xs text-muted-foreground">a cada {slot.interval}min</span>
                </div>
              ))}
              {(!barber.availableSlots || barber.availableSlots.length === 0) && (
                <p className="text-sm text-muted-foreground">Nenhum horário configurado.</p>
              )}
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

export default BarberSettings;
