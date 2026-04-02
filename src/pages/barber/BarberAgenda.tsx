import React, { useState, useEffect, useMemo } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import StatusBadge from '@/components/StatusBadge';
import { Calendar, Clock, User, CheckCircle } from 'lucide-react';
import { Appointment } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const BarberAgenda: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

  const load = () => {
    if (user) setAppointments(api.getBarberAppointments(user.id));
  };
  useEffect(load, [user]);

  const weekDates = useMemo(() => {
    const d = new Date(selectedDate + 'T12:00:00');
    const start = new Date(d);
    start.setDate(d.getDate() - d.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day.toISOString().split('T')[0];
    });
  }, [selectedDate]);

  const filtered = view === 'day'
    ? appointments.filter(a => a.date === selectedDate)
    : appointments.filter(a => weekDates.includes(a.date));

  const handleComplete = (id: string) => {
    api.completeAppointment(id);
    toast({ title: 'Atendimento concluído ✅' });
    load();
  };

  const handleCancel = (id: string) => {
    api.cancelAppointment(id);
    toast({ title: 'Atendimento cancelado' });
    load();
  };

  const formatDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', weekday: 'short' });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Agenda</h1>
        <div className="flex gap-2 mt-4">
          <Button size="sm" variant={view === 'day' ? 'default' : 'outline'} onClick={() => setView('day')}>Dia</Button>
          <Button size="sm" variant={view === 'week' ? 'default' : 'outline'} onClick={() => setView('week')}>Semana</Button>
        </div>
      </div>

      {view === 'day' && (
        <div className="px-4 mb-4">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="w-full border border-border rounded-lg px-3 py-2 text-sm bg-card"
          />
        </div>
      )}

      <div className="px-4 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-8">Nenhum agendamento para este período.</p>
        ) : (
          filtered.map((a) => (
            <Card key={a.id} className={cn(
              'border-l-4',
              a.status === 'pending' && 'border-l-accent',
              a.status === 'completed' && 'border-l-green-500',
              a.status === 'cancelled' && 'border-l-destructive',
            )}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{a.serviceName}</h3>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <User className="w-3 h-3" /> {a.clientName}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(a.date)}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.time}</span>
                    </div>
                  </div>
                  <span className="text-primary font-bold text-sm">R$ {a.servicePrice}</span>
                </div>
                {a.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 h-8 text-xs" onClick={() => handleComplete(a.id)}>
                      <CheckCircle className="w-3 h-3 mr-1" /> Concluir
                    </Button>
                    <Button size="sm" variant="outline" className="h-8 text-xs text-destructive" onClick={() => handleCancel(a.id)}>
                      Cancelar
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default BarberAgenda;
