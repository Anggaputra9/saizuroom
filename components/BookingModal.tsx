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
    const { user, addBooking } = useContext(AppContext);
    const [formData, setFormData] = useState({
        userName: '',
        userNIM: '',
        purpose: '',
    });
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        if (user) {
            setFormData(prev => ({ ...prev, userName: user.name, userNIM: user.id }));
        }
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            setNotification({ type: 'error', message: 'Anda harus login untuk meminjam.' });
            return;
        }
        
        const bookingData = {
            roomId: room.id,
            roomName: room.name,
            building: room.building,
            userId: user.id,
            date,
            startTime: selectedSlot.startTime,
            endTime: selectedSlot.endTime,
            ...formData,
        };

        const result = addBooking(bookingData);
        setNotification({ type: result.success ? 'success' : 'error', message: result.message });

        if (result.success) {
            setTimeout(() => {
                onClose();
            }, 2500);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
                <h2 className="text-2xl font-bold mb-2 text-saizu-blue">Formulir Peminjaman</h2>
                
                <div className="bg-gray-100 p-3 rounded-md mb-6">
                    <p><span className="font-semibold">Ruangan:</span> {room.name}</p>
                    <p><span className="font-semibold">Tanggal:</span> {new Date(date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><span className="font-semibold">Waktu:</span> {selectedSlot.startTime} - {selectedSlot.endTime}</p>
                </div>

                {notification && (
                    <div className={`p-3 rounded-md mb-4 text-center ${notification.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {notification.message}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="userName" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                        <input type="text" id="userName" name="userName" value={formData.userName} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm" />
                    </div>
                    <div>
                        <label htmlFor="userNIM" className="block text-sm font-medium text-gray-700">NIM/NIP</label>
                        <input type="text" id="userNIM" name="userNIM" value={formData.userNIM} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm" />
                    </div>
                     <div>
                        <label htmlFor="purpose" className="block text-sm font-medium text-gray-700">Keperluan</label>
                        <textarea id="purpose" name="purpose" value={formData.purpose} onChange={handleChange} required rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm"></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Batal</button>
                        <button type="submit" className="py-2 px-4 bg-saizu-blue text-white rounded-md hover:bg-blue-800 transition-colors">Submit Peminjaman</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BookingModal;