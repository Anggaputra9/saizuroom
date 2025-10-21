
import React, { useContext, useMemo } from 'react';
import type { BookingStatus } from '../types';
import { AppContext } from '../App';

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
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Status Peminjaman Anda</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruangan</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keperluan</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {userBookings.length > 0 ? userBookings.map(booking => (
                                <tr key={booking.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.roomName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(booking.date).toLocaleDateString('id-ID')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.startTime} - {booking.endTime}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{booking.purpose}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><StatusBadge status={booking.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {(booking.status === 'Pending' || booking.status === 'Disetujui') && (
                                            <button 
                                                onClick={() => handleCancel(booking.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Batalkan
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">Anda belum memiliki riwayat peminjaman.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StatusPage;
