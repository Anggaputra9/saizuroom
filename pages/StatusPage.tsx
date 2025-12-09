
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
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wide rounded-full ring-1 ${statusClasses[status]}`}>
            {status}
        </span>
    );
};

const StatusCard: React.FC<{ booking: Booking; onCancel: (id: string) => void }> = ({ booking, onCancel }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 border border-gray-100 dark:border-gray-700 animate-slide-in-up">
        <div className="p-6">
            {/* Header: Room Name and Status */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <div>
                    <h3 className="text-2xl font-bold text-saizu-blue dark:text-blue-300">{booking.roomName}</h3>
                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                         <span className="font-medium">{new Date(booking.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>
                <StatusBadge status={booking.status} />
            </div>

            {/* Detail Grid */}
            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-6 border border-gray-100 dark:border-gray-600/50">
                 {/* Column 1: Time & Purpose */}
                 <div className="space-y-4">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Waktu Peminjaman</p>
                        <p className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-saizu-green" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {booking.startTime} - {booking.endTime} WIB
                        </p>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Keperluan</p>
                        <p className="text-gray-800 dark:text-white font-medium leading-relaxed">"{booking.purpose}"</p>
                    </div>
                </div>

                {/* Column 2: Applicant Data */}
                <div className="space-y-4 md:border-l md:border-gray-200 md:dark:border-gray-600 md:pl-6">
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Nama Peminjam</p>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            <p className="text-gray-800 dark:text-white font-medium">{booking.userName}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">NIM / NIP</p>
                        <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0c0 .884-.896 1.644-2 1.644a1.868 1.868 0 01-1.332-.572L3.655 4.5" /></svg>
                            <p className="text-gray-800 dark:text-white font-mono">{booking.userNIM}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                 {(booking.status === 'Pending' || booking.status === 'Disetujui') && (
                    <button 
                        onClick={() => onCancel(booking.id)}
                        className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 font-semibold text-sm flex items-center gap-2 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        Batalkan Peminjaman
                    </button>
                )}
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
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-12">
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 dark:text-white">Status Peminjaman</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Detail riwayat pengajuan peminjaman ruangan Anda.</p>
            </div>
            
            <div className="space-y-6">
                 {userBookings.length > 0 ? userBookings.map((booking, index) => (
                    <div key={booking.id} style={{ animationDelay: `${index * 100}ms` }} className="opacity-0 animate-slide-in-up">
                        <StatusCard booking={booking} onCancel={handleCancel} />
                    </div>
                )) : (
                    <div className="text-center bg-white dark:bg-gray-800 p-16 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                         <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                         </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Belum ada peminjaman</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Anda belum mengajukan peminjaman ruangan apapun saat ini.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusPage;
