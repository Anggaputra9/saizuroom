import type { Room, Booking } from './types';

export const MOCK_ROOMS: Room[] = [
  { id: 'D101', name: 'Ruang D.101', building: 'D', availableStartTime: '07:00', availableEndTime: '21:00' },
  { id: 'D102', name: 'Ruang D.102', building: 'D', availableStartTime: '07:00', availableEndTime: '21:00' },
  { id: 'D201', name: 'Ruang D.201', building: 'D', availableStartTime: '08:00', availableEndTime: '17:00' },
  { id: 'D202', name: 'Ruang D.202', building: 'D', availableStartTime: '08:00', availableEndTime: '19:00' },
  { id: 'S301', name: 'Ruang S.301', building: 'S', availableStartTime: '07:30', availableEndTime: '20:00' },
  { id: 'S302', name: 'Ruang S.302', building: 'S', availableStartTime: '09:00', availableEndTime: '18:00' },
  { id: 'S401', name: 'Ruang S.401', building: 'S', availableStartTime: '07:00', availableEndTime: '22:00' },
  { id: 'S402', name: 'Ruang S.402', building: 'S', availableStartTime: '07:00', availableEndTime: '22:00' },
];

const today = new Date().toISOString().split('T')[0];

export const MOCK_BOOKINGS: Booking[] = [
    { 
        id: 'book1', 
        roomId: 'D102', 
        roomName: 'Ruang D.102',
        building: 'D',
        userId: 'user1', 
        userName: 'Ahmad Subarjo',
        userNIM: '123456789',
        date: today, 
        startTime: '09:00', 
        endTime: '11:00', 
        purpose: 'Kelas Tambahan', 
        status: 'Disetujui' 
    },
    { 
        id: 'book2', 
        roomId: 'S401', 
        roomName: 'Ruang S.401',
        building: 'S',
        userId: 'user2', 
        userName: 'Siti Aminah',
        userNIM: '987654321',
        date: today, 
        startTime: '13:00', 
        endTime: '15:00', 
        purpose: 'Seminar Himpunan', 
        status: 'Disetujui' 
    },
     { 
        id: 'book3', 
        roomId: 'S401', 
        roomName: 'Ruang S.401',
        building: 'S',
        userId: 'user3', 
        userName: 'Budi Santoso',
        userNIM: '112233445',
        date: today, 
        startTime: '16:00', 
        endTime: '17:00', 
        purpose: 'Rapat BEM', 
        status: 'Pending' 
    }
];