import React, { useState, useContext, useMemo } from 'react';
import type { Building, Room } from '../types';
import { AppContext } from '../App';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';

// Helper to convert HH:mm to minutes from midnight
const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper to convert minutes from midnight to HH:mm
const minutesToTime = (minutes: number): string => {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
};

const getAvailableSlots = (room: Room, bookingsForRoom: any[]) => {
  const roomStart = timeToMinutes(room.availableStartTime);
  const roomEnd = timeToMinutes(room.availableEndTime);
  
  let availableSlots = [{ start: roomStart, end: roomEnd }];
  
  const sortedBookings = bookingsForRoom.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  
  sortedBookings.forEach(booking => {
    const bookingStart = timeToMinutes(booking.startTime);
    const bookingEnd = timeToMinutes(booking.endTime);
    
    const newAvailableSlots: {start: number, end: number}[] = [];
    availableSlots.forEach(slot => {
      if (bookingEnd <= slot.start || bookingStart >= slot.end) {
        newAvailableSlots.push(slot);
        return;
      }
      if (bookingStart > slot.start) {
        newAvailableSlots.push({ start: slot.start, end: bookingStart });
      }
      if (bookingEnd < slot.end) {
        newAvailableSlots.push({ start: bookingEnd, end: slot.end });
      }
    });
    availableSlots = newAvailableSlots;
  });
  
  return availableSlots.map(slot => ({
    startTime: minutesToTime(slot.start),
    endTime: minutesToTime(slot.end)
  }));
};


const HomePage: React.FC = () => {
    const { rooms, bookings } = useContext(AppContext);
    const [buildingFilter, setBuildingFilter] = useState<Building | 'semua'>('semua');
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [bookingDetails, setBookingDetails] = useState<{room: Room, slot: {startTime: string, endTime: string}} | null>(null);

    const processedRooms = useMemo(() => {
        const bookingsForDate = bookings.filter(b => b.date === selectedDate && (b.status === 'Disetujui' || b.status === 'Pending'));

        const roomsWithSlots = rooms
            .filter(room => buildingFilter === 'semua' || room.building === buildingFilter)
            .map(room => {
                const bookingsForRoom = bookingsForDate.filter(b => b.roomId === room.id);
                const availableSlots = getAvailableSlots(room, bookingsForRoom);
                return { ...room, availableSlots };
            });

        const available = roomsWithSlots.filter(room => room.availableSlots.length > 0);
        const booked = roomsWithSlots.filter(room => room.availableSlots.length === 0);

        return [...available, ...booked];
    }, [rooms, bookings, selectedDate, buildingFilter]);
    
    const handleBook = (room: Room, slot: {startTime: string, endTime: string}) => {
        setBookingDetails({ room, slot });
    };
    
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Cari Ruangan Tersedia</h1>
                <p className="text-gray-500">Pilih tanggal untuk melihat ketersediaan ruangan.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-md items-center">
                 <div className="flex items-center gap-2">
                    <span className="font-semibold">Gedung:</span>
                    <div className="inline-flex rounded-md shadow-sm" role="group">
                        <button type="button" onClick={() => setBuildingFilter('semua')} className={`py-2 px-4 text-sm font-medium ${buildingFilter === 'semua' ? 'bg-saizu-blue text-white' : 'bg-white text-gray-900'} rounded-l-lg border border-gray-300 hover:bg-gray-100`}>Semua</button>
                        <button type="button" onClick={() => setBuildingFilter('D')} className={`py-2 px-4 text-sm font-medium ${buildingFilter === 'D' ? 'bg-saizu-blue text-white' : 'bg-white text-gray-900'} border-t border-b border-gray-300 hover:bg-gray-100`}>Gedung D</button>
                        <button type="button" onClick={() => setBuildingFilter('S')} className={`py-2 px-4 text-sm font-medium ${buildingFilter === 'S' ? 'bg-saizu-blue text-white' : 'bg-white text-gray-900'} rounded-r-md border border-gray-300 hover:bg-gray-100`}>Gedung S</button>
                    </div>
                </div>
                 <div className="flex items-center gap-2">
                    <label htmlFor="date-filter" className="font-semibold">Tanggal:</label>
                    <input 
                        type="date" 
                        id="date-filter"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="py-2 px-3 text-sm font-medium bg-white text-gray-900 rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-2 focus:ring-saizu-blue"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {processedRooms.map(room => (
                    <RoomCard 
                        key={room.id}
                        room={room}
                        onBook={handleBook}
                    />
                ))}
            </div>

            {bookingDetails && (
                <BookingModal 
                    room={bookingDetails.room} 
                    selectedSlot={bookingDetails.slot}
                    date={selectedDate}
                    onClose={() => setBookingDetails(null)} 
                />
            )}
        </div>
    );
};

export default HomePage;