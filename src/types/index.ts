export type UserRole = 'client' | 'barber';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
}

export interface Barber extends User {
  role: 'barber';
  bio: string;
  rating: number;
  specialties: string[];
  availableSlots: AvailableSlot[];
}

export interface AvailableSlot {
  dayOfWeek: number; // 0=Sun, 6=Sat
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
  interval: number;  // minutes
}

export interface Service {
  id: string;
  barberId: string;
  name: string;
  price: number;
  duration: number; // minutes
  description?: string;
}

export type AppointmentStatus = 'pending' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  barberId: string;
  barberName: string;
  serviceId: string;
  serviceName: string;
  servicePrice: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  duration: number;
  status: AppointmentStatus;
  createdAt: string;
}

export interface DashboardStats {
  todayCount: number;
  weekCount: number;
  monthCount: number;
  weekRevenue: number;
  monthRevenue: number;
  busiestDay: string;
  uniqueClients: number;
}
