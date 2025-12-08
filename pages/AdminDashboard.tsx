
import React, { useContext, useMemo, useState } from 'react';
import type { Booking, BookingStatus, Room } from '../types';
import { AppContext } from '../App';
import RoomModal from '../components/RoomModal';

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
    const statusClasses: Record<BookingStatus, string> = {
        Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200',
        Disetujui: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200',
        Ditolak: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200',
        Dibatalkan: 'bg-gray-100 text-gray-800 dark:bg-gray-600/50 dark:text-gray-300',
    };
    return (
        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; colorClass: string }> = ({ title, value, icon, colorClass }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 transition-transform hover:scale-105">
        <div className={`p-4 rounded-full text-white ${colorClass}`}>
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">{value}</p>
        </div>
    </div>
);

type Tab = 'overview' | 'bookings' | 'rooms';

const AdminDashboard: React.FC = () => {
    const { bookings, rooms, updateBookingStatus, deleteBooking, deleteRoom } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [editingRoom, setEditingRoom] = useState<Room | null>(null);

    const sortedBookings = useMemo(() => {
        return [...bookings].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [bookings]);

    const stats = useMemo(() => ({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'Pending').length,
        approvedBookings: bookings.filter(b => b.status === 'Disetujui').length,
        totalRooms: rooms.length
    }), [bookings, rooms]);

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

    const MenuButton: React.FC<{ id: Tab; label: string; icon: React.ReactNode }> = ({ id, label, icon }) => (
        <button 
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === id 
                ? 'bg-saizu-blue text-white shadow-md' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
        >
            {icon}
            {label}
        </button>
    );

    return (
        <div className="flex flex-col md:flex-row gap-6 animate-fade-in min-h-[80vh]">
            {/* Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24 border border-gray-100 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6 px-2">Menu Admin</h2>
                    <nav className="space-y-2">
                        <MenuButton 
                            id="overview" 
                            label="Overview" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                        />
                        <MenuButton 
                            id="bookings" 
                            label="Kelola Peminjaman" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>}
                        />
                        <MenuButton 
                            id="rooms" 
                            label="Kelola Ruangan" 
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m-1 4h1m4-12h1m-1 4h1m-1 4h1m-1 4h1" /></svg>}
                        />
                    </nav>
                     <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                         <button onClick={handlePrint} className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg text-sm font-semibold transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                            Cetak Laporan
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                        {activeTab === 'overview' && 'Dashboard Overview'}
                        {activeTab === 'bookings' && 'Daftar Peminjaman'}
                        {activeTab === 'rooms' && 'Daftar Ruangan'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Selamat datang di panel admin SAIZU Room.</p>
                </header>

                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-in-up">
                        <StatCard 
                            title="Total Peminjaman" 
                            value={stats.totalBookings} 
                            colorClass="bg-blue-500"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} 
                        />
                        <StatCard 
                            title="Menunggu" 
                            value={stats.pendingBookings} 
                            colorClass="bg-yellow-500"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                        />
                         <StatCard 
                            title="Disetujui" 
                            value={stats.approvedBookings} 
                            colorClass="bg-green-500"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} 
                        />
                        <StatCard 
                            title="Total Ruangan" 
                            value={stats.totalRooms} 
                            colorClass="bg-purple-500"
                            icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m-1 4h1m4-12h1m-1 4h1m-1 4h1m-1 4h1" /></svg>} 
                        />
                    </div>
                )}

                {activeTab === 'bookings' && (
                    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden animate-slide-in-up border border-gray-100 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Peminjam</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ruangan & Waktu</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {sortedBookings.map(booking => (
                                        <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900 dark:text-white">{booking.userName}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-0.5">{booking.userNIM}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900 dark:text-white">{booking.roomName}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                    {new Date(booking.date).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})} • <span className="font-mono">{booking.startTime}-{booking.endTime}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={booking.status} /></td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                {booking.status === 'Pending' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => { if(window.confirm('Anda yakin ingin MENYETUJUI peminjaman ini?')) updateBookingStatus(booking.id, 'Disetujui')}} className="p-1.5 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors" title="Setujui">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                        </button>
                                                        <button onClick={() => { if(window.confirm('Anda yakin ingin MENOLAK peminjaman ini?')) updateBookingStatus(booking.id, 'Ditolak')}} className="p-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors" title="Tolak">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                                        </button>
                                                    </div>
                                                )}
                                                {booking.status !== 'Pending' && (
                                                     <button onClick={() => { if(window.confirm('Anda yakin ingin MENGHAPUS peminjaman ini secara permanen?')) deleteBooking(booking.id)}} className="text-gray-400 hover:text-red-500 transition-colors" title="Hapus Permanen">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 000-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {activeTab === 'rooms' && (
                     <div className="space-y-4 animate-slide-in-up">
                         <div className="flex justify-end">
                            <button 
                                onClick={handleAddRoom}
                                className="bg-saizu-green text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors font-semibold shadow-md text-sm flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                Tambah Ruangan
                            </button>
                         </div>
                        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nama Ruangan</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Gedung</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jam Operasional</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                        {rooms.map(room => (
                                            <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">{room.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">Gedung {room.building}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 font-mono">{room.availableStartTime} - {room.availableEndTime}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                                    <button onClick={() => handleEditRoom(room)} className="text-saizu-blue hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors">Edit</button>
                                                    <button onClick={() => handleDeleteRoom(room.id)} className="text-red-600 hover:text-red-800 dark:text-red-500 dark:hover:text-red-400 font-semibold transition-colors">Hapus</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {isRoomModalOpen && (
                <RoomModal 
                    room={editingRoom}
                    onClose={() => setIsRoomModalOpen(false)}
                />
            )}
        </div>
    );
};

export default AdminDashboard;
