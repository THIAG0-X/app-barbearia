import { Appointment, Barber, DashboardStats, Service, User } from '@/types';
import { mockAppointments, mockBarbers, mockClients, mockServices } from './mockData';

// In-memory state (simulating a backend)
let appointments = [...mockAppointments];
let services = [...mockServices];
let barbers = [...mockBarbers];
let nextAppointmentId = 100;

export const api = {
  // Auth
  login(email: string, _password: string): User | Barber | null {
    const barber = barbers.find(b => b.email === email);
    if (barber) return barber;
    const client = mockClients.find(c => c.email === email);
    return client || null;
  },

  register(user: Omit<User, 'id'>): User {
    const newUser: User = { ...user, id: `c${Date.now()}` };
    mockClients.push(newUser);
    return newUser;
  },

  // Barbers
  getBarbers(): Barber[] {
    return barbers;
  },

  getBarber(id: string): Barber | undefined {
    return barbers.find(b => b.id === id);
  },

  // Services
  getServicesByBarber(barberId: string): Service[] {
    return services.filter(s => s.barberId === barberId);
  },

  addService(service: Omit<Service, 'id'>): Service {
    const newService: Service = { ...service, id: `s${Date.now()}` };
    services.push(newService);
    return newService;
  },

  updateService(id: string, updates: Partial<Service>): Service | null {
    const idx = services.findIndex(s => s.id === id);
    if (idx === -1) return null;
    services[idx] = { ...services[idx], ...updates };
    return services[idx];
  },

  deleteService(id: string): boolean {
    const len = services.length;
    services = services.filter(s => s.id !== id);
    return services.length < len;
  },

  // Appointments
  getAvailableSlots(barberId: string, date: string): string[] {
    const barber = barbers.find(b => b.id === barberId);
    if (!barber) return [];

    const d = new Date(date + 'T12:00:00');
    const dayOfWeek = d.getDay();
    const slot = barber.availableSlots.find(s => s.dayOfWeek === dayOfWeek);
    if (!slot) return [];

    const booked = appointments
      .filter(a => a.barberId === barberId && a.date === date && a.status !== 'cancelled')
      .map(a => a.time);

    const times: string[] = [];
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const [endH, endM] = slot.endTime.split(':').map(Number);
    let current = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (current < end) {
      const h = Math.floor(current / 60).toString().padStart(2, '0');
      const m = (current % 60).toString().padStart(2, '0');
      const timeStr = `${h}:${m}`;
      if (!booked.includes(timeStr)) {
        times.push(timeStr);
      }
      current += slot.interval;
    }

    return times;
  },

  createAppointment(data: {
    clientId: string;
    clientName: string;
    barberId: string;
    barberName: string;
    serviceId: string;
    serviceName: string;
    servicePrice: number;
    date: string;
    time: string;
    duration: number;
  }): Appointment {
    const conflict = appointments.find(
      a => a.barberId === data.barberId && a.date === data.date && a.time === data.time && a.status !== 'cancelled'
    );
    if (conflict) throw new Error('Horário não disponível');

    const appointment: Appointment = {
      ...data,
      id: `a${nextAppointmentId++}`,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    appointments.push(appointment);
    return appointment;
  },

  getClientAppointments(clientId: string): Appointment[] {
    return appointments
      .filter(a => a.clientId === clientId)
      .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
  },

  getBarberAppointments(barberId: string): Appointment[] {
    return appointments
      .filter(a => a.barberId === barberId)
      .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  },

  cancelAppointment(id: string): boolean {
    const apt = appointments.find(a => a.id === id);
    if (!apt || apt.status !== 'pending') return false;
    apt.status = 'cancelled';
    return true;
  },

  completeAppointment(id: string): boolean {
    const apt = appointments.find(a => a.id === id);
    if (!apt || apt.status !== 'pending') return false;
    apt.status = 'completed';
    return true;
  },

  // Dashboard
  getBarberStats(barberId: string): DashboardStats {
    const barberApts = appointments.filter(a => a.barberId === barberId);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const weekStr = startOfWeek.toISOString().split('T')[0];

    const monthStr = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`;

    const completed = barberApts.filter(a => a.status === 'completed');
    const todayCount = completed.filter(a => a.date === todayStr).length;
    const weekCompleted = completed.filter(a => a.date >= weekStr);
    const monthCompleted = completed.filter(a => a.date.startsWith(monthStr));

    const dayCounts: Record<string, number> = {};
    completed.forEach(a => {
      const day = new Date(a.date + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'long' });
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });
    const busiestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    const uniqueClients = new Set(completed.map(a => a.clientId)).size;

    return {
      todayCount,
      weekCount: weekCompleted.length,
      monthCount: monthCompleted.length,
      weekRevenue: weekCompleted.reduce((sum, a) => sum + a.servicePrice, 0),
      monthRevenue: monthCompleted.reduce((sum, a) => sum + a.servicePrice, 0),
      busiestDay,
      uniqueClients,
    };
  },

  updateBarberSlots(barberId: string, slots: Barber['availableSlots']): void {
    const barber = barbers.find(b => b.id === barberId);
    if (barber) barber.availableSlots = slots;
  },
};
