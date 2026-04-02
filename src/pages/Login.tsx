import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Scissors } from 'lucide-react';
import { UserRole } from '@/types';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = api.login(email, password);
    if (user) {
      login(user);
      navigate(user.role === 'barber' ? '/barber' : '/client');
    } else {
      setError('Email ou senha inválidos');
    }
  };

  const quickLogin = (role: UserRole) => {
    const email = role === 'barber' ? 'carlos@barber.com' : 'joao@email.com';
    const user = api.login(email, '');
    if (user) {
      login(user);
      navigate(role === 'barber' ? '/barber' : '/client');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Scissors className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">BarberApp</h1>
          <p className="text-muted-foreground text-sm">Sua barbearia na palma da mão</p>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Entrar</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full">Entrar</Button>
            </form>

            <div className="mt-6 space-y-3">
              <p className="text-xs text-center text-muted-foreground">Acesso rápido (demo)</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" onClick={() => quickLogin('client')}>
                  Entrar como Cliente
                </Button>
                <Button variant="outline" size="sm" onClick={() => quickLogin('barber')}>
                  Entrar como Barbeiro
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{' '}
          <button onClick={() => navigate('/register')} className="text-primary font-medium hover:underline">
            Cadastre-se
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
