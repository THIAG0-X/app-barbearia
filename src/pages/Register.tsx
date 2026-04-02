import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scissors, ArrowLeft } from 'lucide-react';
import { UserRole } from '@/types';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('client');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const user = api.register({ name, email, phone, role });
    login(user);
    navigate(role === 'barber' ? '/barber' : '/client');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-primary/5 to-background">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
            <Scissors className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Criar Conta</h1>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Seu perfil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button
                type="button"
                variant={role === 'client' ? 'default' : 'outline'}
                onClick={() => setRole('client')}
                className="w-full"
              >
                Cliente
              </Button>
              <Button
                type="button"
                variant={role === 'barber' ? 'default' : 'outline'}
                onClick={() => setRole('barber')}
                className="w-full"
              >
                Barbeiro
              </Button>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label>Nome completo</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" required />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-0000" required />
              </div>
              <div className="space-y-2">
                <Label>Senha</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Criar Conta
              </Button>
            </form>
          </CardContent>
        </Card>

        <button onClick={() => navigate('/login')} className="flex items-center gap-1 text-sm text-muted-foreground mx-auto hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Voltar para login
        </button>
      </div>
    </div>
  );
};

export default Register;
