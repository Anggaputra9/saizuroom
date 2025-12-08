
import React, { useState, useContext, useEffect } from 'react';
import type { Room } from '../types';
import { AppContext } from '../App';

interface BookingModalProps {
    room: Room;
    selectedSlot: { startTime: string; endTime: string };
    date: string;
    onClose: () => void;
}

const BookingModal: React.FC<BookingModalProps> = ({ room, selectedSlot, date, onClose }) => {
    const { user, addBooking, setPage } = useContext(AppContext);
    const [formData, setFormData] = useState({
        purpose: '',
    });
    
    // State for flexible time selection
    const [selectedTime, setSelectedTime] = useState({
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
    });

    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedTime({ ...selectedTime, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setNotification({ type: 'error', message: 'Anda harus login untuk meminjam.' });
            return;
        }

        // Validate Time
        if (selectedTime.startTime < selectedSlot.startTime || selectedTime.endTime > selectedSlot.endTime) {
            setNotification({ type: 'error', message: `Waktu harus berada dalam rentang ${selectedSlot.startTime} - ${selectedSlot.endTime}` });
            return;
        }

        if (selectedTime.startTime >= selectedTime.endTime) {
            setNotification({ type: 'error', message: 'Jam selesai harus lebih akhir dari jam mulai.' });
            return;
        }
        
        if (!window.confirm('Apakah Anda yakin dengan data yang diisi dan ingin melanjutkan peminjaman?')) {
            return;
        }

        const bookingData = {
            roomId: room.id,
            roomName: room.name,
            building: room.building,
            userId: user.id,
            userName: user.name, // Use data directly from user object
            userNIM: user.id,    // Use data directly from user object
            date,
            startTime: selectedTime.startTime,
            endTime: selectedTime.endTime,
            ...formData,
        };

        const result = addBooking(bookingData);
        
        if (result.success) {
            onClose();
            setPage('status');
        } else {
            setNotification({ type: 'error', message: result.message });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[100] p-4 animate-fade-in backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg relative transform transition-all animate-slide-in-up flex flex-col max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-white text-3xl font-light leading-none">&times;</button>
                <h2 className="text-3xl font-bold mb-4 text-saizu-blue dark:text-blue-300">Formulir Peminjaman</h2>
                
                <div className="bg-slate-100 dark:bg-gray-700/50 p-4 rounded-lg mb-6 border border-slate-200 dark:border-gray-700">
                    <p className="text-sm"><span className="font-semibold text-gray-700 dark:text-gray-300">Ruangan:</span> <span className="font-bold text-gray-900 dark:text-white">{room.name}</span></p>
                    <p className="text-sm"><span className="font-semibold text-gray-700 dark:text-gray-300">Tanggal:</span> <span className="dark:text-gray-100">{new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                    <p className="text-sm"><span className="font-semibold text-gray-700 dark:text-gray-300">Slot Tersedia:</span> <span className="text-green-600 dark:text-green-400 font-medium">{selectedSlot.startTime} - {selectedSlot.endTime}</span></p>
                </div>

                {notification && (
                    <div className={`p-3 rounded-lg mb-4 text-center font-medium ${notification.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200'}`}>
                        {notification.message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jam Mulai</label>
                            <input 
                                type="time" 
                                id="startTime" 
                                name="startTime" 
                                value={selectedTime.startTime} 
                                onChange={handleTimeChange} 
                                min={selectedSlot.startTime}
                                max={selectedSlot.endTime}
                                required 
                                className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm" 
                            />
                        </div>
                        <div>
                            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jam Selesai</label>
                            <input 
                                type="time" 
                                id="endTime" 
                                name="endTime" 
                                value={selectedTime.endTime} 
                                onChange={handleTimeChange}
                                min={selectedSlot.startTime}
                                max={selectedSlot.endTime}
                                required 
                                className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm" 
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Lengkap</label>
                        <input 
                            type="text" 
                            value={user?.name || ''} 
                            readOnly
                            className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm text-gray-500 dark:text-gray-400 cursor-not-allowed sm:text-sm" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NIM/NIP</label>
                        <input 
                            type="text" 
                            value={user?.id || ''} 
                            readOnly
                            className="mt-1 block w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm text-gray-500 dark:text-gray-400 cursor-not-allowed sm:text-sm" 
                        />
                    </div>
                     <div>
                        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keperluan</label>
                        <textarea 
                            id="purpose" 
                            name="purpose" 
                            value={formData.purpose} 
                            onChange={handleChange} 
                            required 
                            rows={3} 
                            placeholder="Contoh: Rapat Himpunan, Kelas Tambahan"
                            className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm"
                        ></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
                        <button type="button" onClick={onClose} className="py-2 px-5 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors cursor-pointer">Batal</button>
                        <button type="submit" className="py-2 px-6 bg-saizu-blue text-white rounded-full font-semibold hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg cursor-pointer">Submit Peminjaman</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;
