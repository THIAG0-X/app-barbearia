import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import StatusBadge from '@/components/StatusBadge';
import { Calendar, Clock, Scissors, X } from 'lucide-react';
import { Appointment } from '@/types';
import { useToast } from '@/hooks/use-toast';

const ClientAppointments: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const load = () => {
    if (user) setAppointments(api.getClientAppointments(user.id));
  };

  useEffect(load, [user]);

  const upcoming = appointments.filter(a => a.status === 'pending');
  const past = appointments.filter(a => a.status !== 'pending');

  const handleCancel = (id: string) => {
    api.cancelAppointment(id);
    toast({ title: 'Agendamento cancelado' });
    load();
  };

  const formatDate = (d: string) => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-2xl font-bold text-foreground">Meus Agendamentos</h1>
      </div>

      <div className="px-4 space-y-6">
        {/* Upcoming */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Próximos</h2>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum agendamento futuro.</p>
          ) : (
            <div className="space-y-3">
              {upcoming.map((a) => (
                <Card key={a.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-foreground">{a.serviceName}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{a.barberName}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(a.date)}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.time}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-primary font-bold">R$ {a.servicePrice}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive h-7 px-2"
                          onClick={() => handleCancel(a.id)}
                        >
                          <X className="w-3 h-3 mr-1" /> Cancelar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        <section>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Histórico</h2>
          {past.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhum histórico ainda.</p>
          ) : (
            <div className="space-y-2">
              {past.map((a) => (
                <Card key={a.id} className="opacity-80">
                  <CardContent className="p-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{a.serviceName}</h3>
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{a.barberName} • {formatDate(a.date)} {a.time}</p>
                    </div>
                    <span className="text-sm font-semibold text-muted-foreground">R$ {a.servicePrice}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>

      <BottomNav />
    </div>
  );
};

export default ClientAppointments;
