export type UserRole = 'User' | 'Admin' | null;

export interface User {
  email: string;
  role: UserRole;
  name: string;
  id: string; // NIM / NIP
}

export type Building = 'D' | 'S';

export interface Room {
  id: string;
  name:string;
  building: Building;
  availableStartTime: string; // e.g., '07:00'
  availableEndTime: string;   // e.g., '21:00'
}

export type BookingStatus = 'Pending' | 'Disetujui' | 'Ditolak' | 'Dibatalkan';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  building: Building;
  userId: string;
  userName: string;
  userNIM: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  purpose: string;
  status: BookingStatus;
}