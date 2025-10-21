import React, { useContext, useMemo, useState } from 'react';
import type { Booking, BookingStatus, Room } from '../types';
import { AppContext } from '../App';
import RoomModal from '../components/RoomModal';

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
    const statusClasses: Record<BookingStatus, string> = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Disetujui: 'bg-green-100 text-green-800',
        Ditolak: 'bg-red-100 text-red-800',
        Dibatalkan: 'bg-gray-100 text-gray-800',
    };
    return (
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

const AdminDashboard: React.FC = () => {
    const { bookings, rooms, updateBookingStatus, deleteBooking, deleteRoom } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState<'bookings' | 'rooms'>('bookings');
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    const sortedBookings = useMemo(() => {
        return [...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [bookings]);

    const handlePrint = () => {
        window.print();
    };

    const handleAddRoom = () => {
        setEditingRoom(null);
        setIsRoomModalOpen(true);
    };
    
    const handleEditRoom = (room: Room) => {
        setEditingRoom(room);
        setIsRoomModalOpen(true);
    };
    
    const handleDeleteRoom = (roomId: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus ruangan ini? Aksi ini tidak dapat dibatalkan.')) {
            deleteRoom(roomId);
        }
    };


    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                 <button onClick={handlePrint} className="bg-saizu-blue text-white py-2 px-4 rounded-md hover:bg-blue-800 transition-colors self-start">
                    Cetak Laporan
                </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('bookings')} className={`${activeTab === 'bookings' ? 'border-saizu-blue text-saizu-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        Kelola Peminjaman
                    </button>
                    <button onClick={() => setActiveTab('rooms')} className={`${activeTab === 'rooms' ? 'border-saizu-blue text-saizu-blue' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>
                        Kelola Ruangan
                    </button>
                </nav>
            </div>

            {activeTab === 'bookings' && (
                <div className="bg-white shadow-md rounded-lg overflow-hidden animate-fade-in">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Peminjam</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruangan & Waktu</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sortedBookings.map(booking => (
                                    <tr key={booking.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                                            <div className="text-sm text-gray-500">{booking.userNIM}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{booking.roomName}</div>
                                            <div className="text-sm text-gray-500">{new Date(booking.date).toLocaleDateString('id-ID')} ({booking.startTime}-{booking.endTime})</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={booking.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                            {booking.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => updateBookingStatus(booking.id, 'Disetujui')} className="text-saizu-green hover:text-green-700">Setujui</button>
                                                    <button onClick={() => updateBookingStatus(booking.id, 'Ditolak')} className="text-red-600 hover:text-red-800">Tolak</button>
                                                </>
                                            )}
                                            <button onClick={() => deleteBooking(booking.id)} className="text-gray-500 hover:text-gray-700">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {activeTab === 'rooms' && (
                 <div className="space-y-4 animate-fade-in">
                     <div className="text-right">
                         <button onClick={handleAddRoom} className="bg-saizu-green text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
                             + Tambah Ruangan
                         </button>
                     </div>
                     <div className="bg-white shadow-md rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama Ruangan</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gedung</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Jam Tersedia</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {rooms.map(room => (
                                        <tr key={room.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.building}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.availableStartTime} - {room.availableEndTime}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-4">
                                                <button onClick={() => handleEditRoom(room)} className="text-blue-600 hover:text-blue-800">Edit</button>
                                                <button onClick={() => handleDeleteRoom(room.id)} className="text-red-600 hover:text-red-800">Hapus</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                 </div>
            )}
            {isRoomModalOpen && (
                <RoomModal room={editingRoom} onClose={() => setIsRoomModalOpen(false)} />
            )}
        </div>
    );
};

export default AdminDashboard;