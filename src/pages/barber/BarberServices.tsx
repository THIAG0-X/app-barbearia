import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BottomNav from '@/components/BottomNav';
import { Plus, Trash2, Edit2, Clock, DollarSign, X, Check } from 'lucide-react';
import { Service } from '@/types';
import { useToast } from '@/hooks/use-toast';

const BarberServices: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', price: '', duration: '', description: '' });

  const load = () => {
    if (user) setServices(api.getServicesByBarber(user.id));
  };
  useEffect(load, [user]);

  const resetForm = () => {
    setForm({ name: '', price: '', duration: '', description: '' });
    setShowForm(false);
    setEditing(null);
  };

  const handleSave = () => {
    if (!user || !form.name || !form.price || !form.duration) return;
    if (editing) {
      api.updateService(editing, { name: form.name, price: Number(form.price), duration: Number(form.duration), description: form.description });
      toast({ title: 'Serviço atualizado' });
    } else {
      api.addService({ barberId: user.id, name: form.name, price: Number(form.price), duration: Number(form.duration), description: form.description });
      toast({ title: 'Serviço adicionado' });
    }
    resetForm();
    load();
  };

  const handleEdit = (s: Service) => {
    setForm({ name: s.name, price: s.price.toString(), duration: s.duration.toString(), description: s.description || '' });
    setEditing(s.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    api.deleteService(id);
    toast({ title: 'Serviço removido' });
    load();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="px-4 pt-12 pb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Serviços</h1>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-1" /> Novo
        </Button>
      </div>

      {showForm && (
        <div className="px-4 mb-4">
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm">{editing ? 'Editar Serviço' : 'Novo Serviço'}</h3>
                <button onClick={resetForm}><X className="w-4 h-4 text-muted-foreground" /></button>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Nome</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Ex: Corte Masculino" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label className="text-xs">Preço (R$)</Label>
                  <Input type="number" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} placeholder="45" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Duração (min)</Label>
                  <Input type="number" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="30" />
                </div>
              </div>
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleSave}>
                <Check className="w-4 h-4 mr-1" /> Salvar
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="px-4 space-y-2">
        {services.map((s) => (
          <Card key={s.id}>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <h3 className="font-medium text-sm">{s.name}</h3>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="flex items-center gap-0.5"><DollarSign className="w-3 h-3" />R$ {s.price}</span>
                  <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{s.duration}min</span>
                </div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(s)}>
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(s.id)}>
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <BottomNav />
    </div>
  );
};

export default BarberServices;
