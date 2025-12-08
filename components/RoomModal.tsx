
import React, { useState, useContext, useEffect } from 'react';
import type { Room, Building } from '../types';
import { AppContext } from '../App';

interface RoomModalProps {
  room?: Room | null;
  onClose: () => void;
}

const RoomModal: React.FC<RoomModalProps> = ({ room, onClose }) => {
  const { addRoom, editRoom } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    building: 'D',
    availableStartTime: '07:00',
    availableEndTime: '21:00',
  });
  
  const isEditing = !!room;

  useEffect(() => {
    if (isEditing && room) {
      setFormData({
        name: room.name,
        building: room.building,
        availableStartTime: room.availableStartTime,
        availableEndTime: room.availableEndTime,
      });
    }
  }, [room, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const confirmationMessage = isEditing
        ? 'Apakah Anda yakin ingin menyimpan perubahan pada ruangan ini?'
        : 'Apakah Anda yakin ingin menambahkan ruangan baru ini?';

    if (!window.confirm(confirmationMessage)) {
        return;
    }

    if (isEditing && room) {
      editRoom({ ...room, ...formData, building: formData.building as Building });
    } else {
      addRoom({ ...formData, building: formData.building as Building });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[100] p-4 animate-fade-in backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-lg relative transform transition-all animate-slide-in-up border border-gray-100 dark:border-gray-700">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 dark:hover:text-white text-3xl font-light leading-none">&times;</button>
        <h2 className="text-3xl font-bold mb-6 text-saizu-blue dark:text-blue-300">{isEditing ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Ruangan</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm" placeholder="e.g., Ruang D.101" />
          </div>
          <div>
            <label htmlFor="building" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Gedung</label>
            <select id="building" name="building" value={formData.building} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm">
                <option value="D">Gedung D</option>
                <option value="S">Gedung S</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="availableStartTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jam Buka</label>
              <input type="time" id="availableStartTime" name="availableStartTime" value={formData.availableStartTime} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm" />
            </div>
            <div>
              <label htmlFor="availableEndTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jam Tutup</label>
              <input type="time" id="availableEndTime" name="availableEndTime" value={formData.availableEndTime} onChange={handleChange} required className="mt-1 block w-full px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-700 mt-6">
            <button type="button" onClick={onClose} className="py-2 px-5 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-100 rounded-full font-semibold hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors cursor-pointer">Batal</button>
            <button type="submit" className="py-2 px-6 bg-saizu-blue text-white rounded-full font-semibold hover:bg-blue-800 transition-colors shadow-md hover:shadow-lg cursor-pointer">
              {isEditing ? 'Simpan Perubahan' : 'Tambah Ruangan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
