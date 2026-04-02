import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, User, BarChart3, Settings, Scissors } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const BottomNav: React.FC = () => {
  const { isBarber } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const clientTabs = [
    { path: '/client', icon: Home, label: 'Início' },
    { path: '/client/appointments', icon: Calendar, label: 'Agendamentos' },
    { path: '/client/profile', icon: User, label: 'Perfil' },
  ];

  const barberTabs = [
    { path: '/barber', icon: BarChart3, label: 'Dashboard' },
    { path: '/barber/agenda', icon: Calendar, label: 'Agenda' },
    { path: '/barber/services', icon: Scissors, label: 'Serviços' },
    { path: '/barber/settings', icon: Settings, label: 'Config' },
  ];

  const tabs = isBarber ? barberTabs : clientTabs;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border safe-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-lg transition-colors min-w-[60px]',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <tab.icon className={cn('w-5 h-5', isActive && 'stroke-[2.5]')} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
