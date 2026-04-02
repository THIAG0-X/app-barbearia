import React, { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Star, Check, Clock, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Service } from '@/types';
import { useToast } from '@/hooks/use-toast';

const BarberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const barber = api.getBarber(id!);
  const services = api.getServicesByBarber(id!);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const dates = useMemo(() => {
    const result: { date: string; label: string; dayLabel: string }[] = [];
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      result.push({
        date: d.toISOString().split('T')[0],
        label: d.getDate().toString(),
        dayLabel: i === 0 ? 'Hoje' : i === 1 ? 'Amanhã' : days[d.getDay()],
      });
    }
    return result;
  }, []);

  const availableSlots = useMemo(() => {
    if (!selectedDate || !id) return [];
    return api.getAvailableSlots(id, selectedDate);
  }, [id, selectedDate]);

  const handleBook = () => {
    if (!selectedService || !selectedDate || !selectedTime || !user || !barber) return;
    try {
      api.createAppointment({
        clientId: user.id,
        clientName: user.name,
        barberId: barber.id,
        barberName: barber.name,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        servicePrice: selectedService.price,
        date: selectedDate,
        time: selectedTime,
        duration: selectedService.duration,
      });
      toast({
        title: '✅ Agendamento confirmado!',
        description: `${selectedService.name} com ${barber.name} em ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('pt-BR')} às ${selectedTime}`,
      });
      navigate('/client/appointments');
    } catch {
      toast({ title: 'Erro', description: 'Horário não disponível', variant: 'destructive' });
    }
  };

  if (!barber) return <p className="p-4">Barbeiro não encontrado</p>;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-primary px-4 pt-10 pb-6 rounded-b-3xl">
        <button onClick={() => navigate(-1)} className="text-primary-foreground mb-3 flex items-center gap-1">
          <ArrowLeft className="w-5 h-5" /> Voltar
        </button>
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-primary-foreground/20 flex items-center justify-center text-primary-foreground text-2xl font-bold">
            {barber.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-primary-foreground">{barber.name}</h1>
            <div className="flex items-center gap-1 text-accent mt-0.5">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-medium">{barber.rating}</span>
            </div>
          </div>
        </div>
        <p className="text-primary-foreground/70 text-sm mt-2">{barber.bio}</p>
      </div>

      <div className="px-4 space-y-6 mt-6">
        {/* Services */}
        <section>
          <h2 className="font-semibold text-foreground mb-3">Escolha o serviço</h2>
          <div className="space-y-2">
            {services.map((s) => (
              <Card
                key={s.id}
                className={cn(
                  'cursor-pointer transition-all active:scale-[0.98]',
                  selectedService?.id === s.id && 'ring-2 ring-primary border-primary'
                )}
                onClick={() => { setSelectedService(s); setSelectedTime(''); }}
              >
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{s.name}</h3>
                      {selectedService?.id === s.id && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-muted-foreground text-xs">
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{s.duration}min</span>
                      <span className="flex items-center gap-0.5"><DollarSign className="w-3 h-3" />R$ {s.price}</span>
                    </div>
                  </div>
                  <span className="text-primary font-bold text-sm">R$ {s.price}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Date */}
        {selectedService && (
          <section>
            <h2 className="font-semibold text-foreground mb-3">Escolha a data</h2>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
              {dates.map((d) => (
                <button
                  key={d.date}
                  onClick={() => { setSelectedDate(d.date); setSelectedTime(''); }}
                  className={cn(
                    'flex flex-col items-center min-w-[52px] py-2 px-2 rounded-xl border transition-colors shrink-0',
                    selectedDate === d.date
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card border-border text-foreground hover:border-primary/50'
                  )}
                >
                  <span className="text-[10px] font-medium opacity-70">{d.dayLabel}</span>
                  <span className="text-lg font-bold">{d.label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Time */}
        {selectedDate && (
          <section>
            <h2 className="font-semibold text-foreground mb-3">Horários disponíveis</h2>
            {availableSlots.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum horário disponível nesta data.</p>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {availableSlots.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={cn(
                      'py-2 rounded-lg border text-sm font-medium transition-colors',
                      selectedTime === t
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-card border-border text-foreground hover:border-primary/50'
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* Confirm */}
        {selectedTime && (
          <Button
            onClick={handleBook}
            className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 font-bold"
          >
            Confirmar Agendamento — R$ {selectedService?.price}
          </Button>
        )}
      </div>
    </div>
  );
};

export default BarberDetail;
