import React from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/contexts/AuthContext';

const ClientHome: React.FC = () => {
  const barbers = api.getBarbers();
  const navigate = useNavigate();
  const { user } = useAuth();
  const firstName = user?.name.split(' ')[0] || 'Cliente';

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-primary px-4 pt-12 pb-8 rounded-b-3xl">
        <p className="text-primary-foreground/70 text-sm">Olá,</p>
        <h1 className="text-primary-foreground text-2xl font-bold">{firstName} 👋</h1>
        <p className="text-primary-foreground/70 text-sm mt-1">Encontre o barbeiro ideal para você</p>
      </div>

      <div className="px-4 -mt-4">
        <h2 className="text-lg font-semibold mb-3 mt-6">Barbeiros Disponíveis</h2>
        <div className="space-y-3">
          {barbers.map((barber) => (
            <Card
              key={barber.id}
              className="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98]"
              onClick={() => navigate(`/client/barber/${barber.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl shrink-0">
                    {barber.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground truncate">{barber.name}</h3>
                      <div className="flex items-center gap-1 text-accent">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-medium">{barber.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{barber.bio}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {barber.specialties.slice(0, 3).map((s) => (
                        <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ClientHome;
