
import React, { useState, useContext, useMemo } from 'react';
import type { Building, Room } from '../types';
import { AppContext } from '../App';
import RoomCard from '../components/RoomCard';
import BookingModal from '../components/BookingModal';

// Helper to get local date string YYYY-MM-DD
const getTodayDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

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
      // No overlap logic
      if (bookingEnd <= slot.start || bookingStart >= slot.end) {
        newAvailableSlots.push(slot);
        return;
      }
      
      // If booking overlaps, split the slot
      // Part before the booking
      if (bookingStart > slot.start) {
        newAvailableSlots.push({ start: slot.start, end: bookingStart });
      }
      // Part after the booking
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
    
    // State for applied filters, default to local today
    const [buildingFilter, setBuildingFilter] = useState<Building | 'semua'>('semua');
    const [selectedDate, setSelectedDate] = useState(getTodayDate());
    
    // State for staged filter changes
    const [stagedBuilding, setStagedBuilding] = useState<Building | 'semua'>('semua');
    const [stagedDate, setStagedDate] = useState(getTodayDate());

    const [bookingDetails, setBookingDetails] = useState<{room: Room, slot: {startTime: string, endTime: string}} | null>(null);

    const handleApplyFilter = () => {
        setBuildingFilter(stagedBuilding);
        setSelectedDate(stagedDate);
    };

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
        <div className="space-y-8 animate-fade-in">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Cari Ruangan Tersedia</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Pilih tanggal dan gedung untuk melihat ketersediaan ruangan.</p>
            </div>

            <div className="sticky top-24 z-40 flex flex-col md:flex-row gap-4 p-4 bg-white/70 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg border border-black/5 dark:border-white/10 items-center justify-center">
                 <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-700 dark:text-gray-300">Gedung:</span>
                    <div className="inline-flex rounded-lg shadow-sm" role="group">
                        <button type="button" onClick={() => setStagedBuilding('semua')} className={`py-2 px-4 text-sm font-medium ${stagedBuilding === 'semua' ? 'bg-saizu-blue text-white z-10 ring-2 ring-saizu-blue' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200'} rounded-l-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}>Semua</button>
                        <button type="button" onClick={() => setStagedBuilding('D')} className={`py-2 px-4 text-sm font-medium ${stagedBuilding === 'D' ? 'bg-saizu-blue text-white z-10 ring-2 ring-saizu-blue' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200'} border-t border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}>Gedung D</button>
                        <button type="button" onClick={() => setStagedBuilding('S')} className={`py-2 px-4 text-sm font-medium ${stagedBuilding === 'S' ? 'bg-saizu-blue text-white z-10 ring-2 ring-saizu-blue' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200'} rounded-r-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}>Gedung S</button>
                    </div>
                </div>
                 <div className="flex items-center gap-3">
                    <label htmlFor="date-filter" className="font-semibold text-gray-700 dark:text-gray-300">Tanggal:</label>
                    <input 
                        type="date" 
                        id="date-filter"
                        value={stagedDate}
                        onChange={(e) => setStagedDate(e.target.value)}
                        className="py-2 px-3 text-sm font-medium bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-saizu-blue transition-colors"
                    />
                </div>
                <button 
                    onClick={handleApplyFilter}
                    className="py-2 px-5 bg-saizu-green text-white rounded-lg font-semibold hover:bg-green-600 transition-colors shadow-md"
                >
                    Terapkan Filter
                </button>
            </div>

             <div className="flex justify-center items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-200 dark:bg-green-800 border-2 border-green-400 dark:border-green-500"></span>
                    <span>Tersedia</span>
                </div>
                 <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-red-200 dark:bg-red-800 border-2 border-red-400 dark:border-red-500"></span>
                    <span>Penuh</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {processedRooms.map((room, index) => (
                    <div key={room.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-slide-in-up opacity-0">
                        <RoomCard 
                            room={room}
                            onBook={handleBook}
                        />
                    </div>
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
