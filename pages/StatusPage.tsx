import React, { useContext, useMemo } from 'react';
import type { Booking, BookingStatus } from '../types';
import { AppContext } from '../App';

const StatusBadge: React.FC<{ status: BookingStatus }> = ({ status }) => {
    const statusClasses: Record<BookingStatus, string> = {
        Pending: 'bg-yellow-100 text-yellow-800 ring-yellow-200 dark:bg-yellow-500/20 dark:text-yellow-200 dark:ring-yellow-500/30',
        Disetujui: 'bg-green-100 text-green-800 ring-green-200 dark:bg-green-500/20 dark:text-green-200 dark:ring-green-500/30',
        Ditolak: 'bg-red-100 text-red-800 ring-red-200 dark:bg-red-500/20 dark:text-red-200 dark:ring-red-500/30',
        Dibatalkan: 'bg-gray-200 text-gray-800 ring-gray-300 dark:bg-gray-600/50 dark:text-gray-300 dark:ring-gray-500/30',
    };
    return (
        <span className={`px-3 py-1 text-sm font-semibold rounded-full ring-1 ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

const StatusCard: React.FC<{ booking: Booking; onCancel: (id: string) => void }> = ({ booking, onCancel }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-slide-in-up border border-transparent dark:border-gray-700">
        <div className="p-5">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-saizu-blue dark:text-blue-300">{booking.roomName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{booking.purpose}</p>
                </div>
                <StatusBadge status={booking.status} />
            </div>
            <div className="border-t my-4 border-gray-200 dark:border-gray-700"></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">Tanggal</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{new Date(booking.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>
                <div>
                    <p className="font-semibold text-gray-500 dark:text-gray-400">Waktu</p>
                    <p className="text-gray-800 dark:text-gray-200 font-medium">{booking.startTime} - {booking.endTime}</p>
                </div>
                <div className="flex items-center sm:justify-end">
                     {(booking.status === 'Pending' || booking.status === 'Disetujui') && (
                        <button 
                            onClick={() => onCancel(booking.id)}
                            className="w-full sm:w-auto text-center bg-red-500 text-white py-2 px-4 rounded-lg font-semibold text-sm hover:bg-red-600 transition-colors"
                        >
                            Batalkan
                        </button>
                    )}
                </div>
            </div>
        </div>
    </div>
);


const StatusPage: React.FC = () => {
    const { user, bookings, updateBookingStatus } = useContext(AppContext);

    const userBookings = useMemo(() => {
        if (!user) return [];
        return bookings.filter(b => b.userId === user.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [user, bookings]);

    const handleCancel = (bookingId: string) => {
        if (window.confirm('Apakah Anda yakin ingin membatalkan peminjaman ini?')) {
            updateBookingStatus(bookingId, 'Dibatalkan');
        }
    };

    if (!user) {
        return <p>Silakan login untuk melihat status peminjaman.</p>;
    }
    
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Status Peminjaman Anda</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Lihat riwayat dan status peminjaman ruangan Anda di sini.</p>
            </div>
            
            <div className="space-y-5">
                 {userBookings.length > 0 ? userBookings.map((booking, index) => (
                    <div key={booking.id} style={{ animationDelay: `${index * 70}ms` }} className="opacity-0">
                        <StatusCard booking={booking} onCancel={handleCancel} />
                    </div>
                )) : (
                    <div className="text-center bg-white dark:bg-gray-800 p-12 rounded-xl shadow-md">
                        <p className="text-gray-500 dark:text-gray-400">Anda belum memiliki riwayat peminjaman.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusPage;