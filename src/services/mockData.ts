import { Barber, Service, Appointment, User } from '@/types';

export const mockBarbers: Barber[] = [
  {
    id: 'b1',
    name: 'Carlos Silva',
    email: 'carlos@barber.com',
    phone: '(11) 99999-0001',
    role: 'barber',
    bio: 'Especialista em cortes modernos e degradê. 8 anos de experiência.',
    rating: 4.8,
    specialties: ['Degradê', 'Corte Social', 'Barba'],
    avatar: '',
    availableSlots: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '18:00', interval: 30 },
      { dayOfWeek: 2, startTime: '09:00', endTime: '18:00', interval: 30 },
      { dayOfWeek: 3, startTime: '09:00', endTime: '18:00', interval: 30 },
      { dayOfWeek: 4, startTime: '09:00', endTime: '18:00', interval: 30 },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', interval: 30 },
      { dayOfWeek: 6, startTime: '09:00', endTime: '14:00', interval: 30 },
    ],
  },
  {
    id: 'b2',
    name: 'Rafael Costa',
    email: 'rafael@barber.com',
    phone: '(11) 99999-0002',
    role: 'barber',
    bio: 'Barbeiro criativo, apaixonado por estilos clássicos e vintage.',
    rating: 4.6,
    specialties: ['Corte Clássico', 'Barba Modelada', 'Pigmentação'],
    avatar: '',
    availableSlots: [
      { dayOfWeek: 1, startTime: '10:00', endTime: '19:00', interval: 30 },
      { dayOfWeek: 2, startTime: '10:00', endTime: '19:00', interval: 30 },
      { dayOfWeek: 3, startTime: '10:00', endTime: '19:00', interval: 30 },
      { dayOfWeek: 4, startTime: '10:00', endTime: '19:00', interval: 30 },
      { dayOfWeek: 5, startTime: '10:00', endTime: '18:00', interval: 30 },
    ],
  },
  {
    id: 'b3',
    name: 'Lucas Mendes',
    email: 'lucas@barber.com',
    phone: '(11) 99999-0003',
    role: 'barber',
    bio: 'Especialista em barba e tratamentos capilares.',
    rating: 4.9,
    specialties: ['Barba', 'Hidratação', 'Corte Infantil'],
    avatar: '',
    availableSlots: [
      { dayOfWeek: 2, startTime: '08:00', endTime: '17:00', interval: 30 },
      { dayOfWeek: 3, startTime: '08:00', endTime: '17:00', interval: 30 },
      { dayOfWeek: 4, startTime: '08:00', endTime: '17:00', interval: 30 },
      { dayOfWeek: 5, startTime: '08:00', endTime: '17:00', interval: 30 },
      { dayOfWeek: 6, startTime: '08:00', endTime: '13:00', interval: 30 },
    ],
  },
];

export const mockServices: Service[] = [
  { id: 's1', barberId: 'b1', name: 'Corte Masculino', price: 45, duration: 30, description: 'Corte moderno com acabamento' },
  { id: 's2', barberId: 'b1', name: 'Barba', price: 30, duration: 20, description: 'Barba com toalha quente' },
  { id: 's3', barberId: 'b1', name: 'Combo (Corte + Barba)', price: 65, duration: 50, description: 'Corte e barba completos' },
  { id: 's4', barberId: 'b1', name: 'Degradê', price: 55, duration: 40, description: 'Degradê com navalha' },
  { id: 's5', barberId: 'b2', name: 'Corte Clássico', price: 40, duration: 30 },
  { id: 's6', barberId: 'b2', name: 'Barba Modelada', price: 35, duration: 25 },
  { id: 's7', barberId: 'b2', name: 'Combo Clássico', price: 60, duration: 50 },
  { id: 's8', barberId: 'b2', name: 'Pigmentação', price: 80, duration: 60 },
  { id: 's9', barberId: 'b3', name: 'Corte + Hidratação', price: 70, duration: 45 },
  { id: 's10', barberId: 'b3', name: 'Barba Completa', price: 35, duration: 25 },
  { id: 's11', barberId: 'b3', name: 'Corte Infantil', price: 30, duration: 20 },
  { id: 's12', barberId: 'b3', name: 'Combo Premium', price: 90, duration: 60 },
];

const today = new Date();
const formatDate = (d: Date) => d.toISOString().split('T')[0];
const daysAgo = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return formatDate(d); };
const daysFromNow = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return formatDate(d); };

export const mockAppointments: Appointment[] = [
  { id: 'a1', clientId: 'c1', clientName: 'João Pedro', barberId: 'b1', barberName: 'Carlos Silva', serviceId: 's1', serviceName: 'Corte Masculino', servicePrice: 45, date: daysAgo(5), time: '10:00', duration: 30, status: 'completed', createdAt: daysAgo(7) },
  { id: 'a2', clientId: 'c1', clientName: 'João Pedro', barberId: 'b1', barberName: 'Carlos Silva', serviceId: 's3', serviceName: 'Combo (Corte + Barba)', servicePrice: 65, date: daysAgo(12), time: '14:00', duration: 50, status: 'completed', createdAt: daysAgo(14) },
  { id: 'a3', clientId: 'c2', clientName: 'Marcos Lima', barberId: 'b1', barberName: 'Carlos Silva', serviceId: 's2', serviceName: 'Barba', servicePrice: 30, date: daysAgo(3), time: '11:00', duration: 20, status: 'completed', createdAt: daysAgo(5) },
  { id: 'a4', clientId: 'c3', clientName: 'Felipe Santos', barberId: 'b1', barberName: 'Carlos Silva', serviceId: 's4', serviceName: 'Degradê', servicePrice: 55, date: daysAgo(1), time: '09:30', duration: 40, status: 'completed', createdAt: daysAgo(3) },
  { id: 'a5', clientId: 'c1', clientName: 'João Pedro', barberId: 'b1', barberName: 'Carlos Silva', serviceId: 's1', serviceName: 'Corte Masculino', servicePrice: 45, date: daysFromNow(1), time: '10:00', duration: 30, status: 'pending', createdAt: formatDate(today) },
  { id: 'a6', clientId: 'c2', clientName: 'Marcos Lima', barberId: 'b1', barberName: 'Carlos Silva', serviceId: 's3', serviceName: 'Combo (Corte + Barba)', servicePrice: 65, date: daysFromNow(2), time: '15:00', duration: 50, status: 'pending', createdAt: formatDate(today) },
  { id: 'a7', clientId: 'c4', clientName: 'André Oliveira', barberId: 'b2', barberName: 'Rafael Costa', serviceId: 's5', serviceName: 'Corte Clássico', servicePrice: 40, date: daysAgo(2), time: '10:30', duration: 30, status: 'completed', createdAt: daysAgo(4) },
  { id: 'a8', clientId: 'c5', clientName: 'Bruno Almeida', barberId: 'b2', barberName: 'Rafael Costa', serviceId: 's8', serviceName: 'Pigmentação', servicePrice: 80, date: daysFromNow(1), time: '11:00', duration: 60, status: 'pending', createdAt: formatDate(today) },
  { id: 'a9', clientId: 'c1', clientName: 'João Pedro', barberId: 'b3', barberName: 'Lucas Mendes', serviceId: 's9', serviceName: 'Corte + Hidratação', servicePrice: 70, date: daysAgo(8), time: '09:00', duration: 45, status: 'completed', createdAt: daysAgo(10) },
  { id: 'a10', clientId: 'c3', clientName: 'Felipe Santos', barberId: 'b1', barberName: 'Carlos Silva', serviceId: 's1', serviceName: 'Corte Masculino', servicePrice: 45, date: daysAgo(15), time: '16:00', duration: 30, status: 'cancelled', createdAt: daysAgo(17) },
  { id: 'a11', clientId: 'c2', clientName: 'Marcos Lima', barberId: 'b3', barberName: 'Lucas Mendes', serviceId: 's12', serviceName: 'Combo Premium', servicePrice: 90, date: daysAgo(6), time: '14:00', duration: 60, status: 'completed', createdAt: daysAgo(8) },
  { id: 'a12', clientId: 'c4', clientName: 'André Oliveira', barberId: 'b1', barberName: 'Carlos Silva', serviceId: 's2', serviceName: 'Barba', servicePrice: 30, date: formatDate(today), time: '10:00', duration: 20, status: 'pending', createdAt: daysAgo(1) },
];

export const mockClients: User[] = [
  { id: 'c1', name: 'João Pedro', email: 'joao@email.com', phone: '(11) 98888-0001', role: 'client' },
  { id: 'c2', name: 'Marcos Lima', email: 'marcos@email.com', phone: '(11) 98888-0002', role: 'client' },
  { id: 'c3', name: 'Felipe Santos', email: 'felipe@email.com', phone: '(11) 98888-0003', role: 'client' },
  { id: 'c4', name: 'André Oliveira', email: 'andre@email.com', phone: '(11) 98888-0004', role: 'client' },
  { id: 'c5', name: 'Bruno Almeida', email: 'bruno@email.com', phone: '(11) 98888-0005', role: 'client' },
];
