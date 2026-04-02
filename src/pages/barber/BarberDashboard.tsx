import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Card, CardContent } from '@/components/ui/card';
import BottomNav from '@/components/BottomNav';
import { BarChart3, Users, Calendar, DollarSign, TrendingUp, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BarberDashboard: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  const stats = api.getBarberStats(user.id);

  const chartData = [
    { name: 'Seg', atendimentos: 4, receita: 180 },
    { name: 'Ter', atendimentos: 6, receita: 270 },
    { name: 'Qua', atendimentos: 5, receita: 225 },
    { name: 'Qui', atendimentos: 7, receita: 315 },
    { name: 'Sex', atendimentos: 8, receita: 360 },
    { name: 'Sáb', atendimentos: 3, receita: 135 },
  ];

  const statCards = [
    { label: 'Hoje', value: stats.todayCount, icon: Calendar, color: 'text-primary' },
    { label: 'Semana', value: stats.weekCount, icon: TrendingUp, color: 'text-primary' },
    { label: 'Mês', value: stats.monthCount, icon: BarChart3, color: 'text-primary' },
    { label: 'Clientes', value: stats.uniqueClients, icon: Users, color: 'text-primary' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-primary px-4 pt-12 pb-8 rounded-b-3xl">
        <p className="text-primary-foreground/70 text-sm">Bem-vindo,</p>
        <h1 className="text-2xl font-bold text-primary-foreground">{user.name} 💈</h1>
      </div>

      <div className="px-4 space-y-5 -mt-4">
        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{s.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue */}
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">Receita Semana</span>
              </div>
              <p className="text-xl font-bold text-foreground">R$ {stats.weekRevenue}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">Receita Mês</span>
              </div>
              <p className="text-xl font-bold text-foreground">R$ {stats.monthRevenue}</p>
            </CardContent>
          </Card>
        </div>

        {/* Busiest day */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Star className="w-5 h-5 text-accent" />
            <div>
              <p className="text-xs text-muted-foreground">Dia mais movimentado</p>
              <p className="font-semibold text-foreground capitalize">{stats.busiestDay}</p>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-sm mb-4">Desempenho Semanal</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(220 13% 91%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="atendimentos" fill="hsl(217 91% 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default BarberDashboard;
