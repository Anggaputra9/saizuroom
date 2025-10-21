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
    if (isEditing) {
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
    if (isEditing) {
      // FIX: Cast `formData.building` to the `Building` type. The value from the
      // form is a generic string, but the `editRoom` function expects 'D' | 'S'.
      editRoom({ ...room, ...formData, building: formData.building as Building });
    } else {
      // FIX: Cast `formData.building` to the `Building` type and remove the incorrect
      // `as Omit<Room, 'id'>` assertion, which was hiding a type error.
      addRoom({ ...formData, building: formData.building as Building });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold mb-6 text-saizu-blue">{isEditing ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Ruangan</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm" placeholder="e.g., Ruang D.101" />
          </div>
          <div>
            <label htmlFor="building" className="block text-sm font-medium text-gray-700">Gedung</label>
            <select id="building" name="building" value={formData.building} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm">
                <option value="D">Gedung D</option>
                <option value="S">Gedung S</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="availableStartTime" className="block text-sm font-medium text-gray-700">Jam Buka</label>
              <input type="time" id="availableStartTime" name="availableStartTime" value={formData.availableStartTime} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm" />
            </div>
            <div>
              <label htmlFor="availableEndTime" className="block text-sm font-medium text-gray-700">Jam Tutup</label>
              <input type="time" id="availableEndTime" name="availableEndTime" value={formData.availableEndTime} onChange={handleChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm" />
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <button type="button" onClick={onClose} className="py-2 px-4 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors">Batal</button>
            <button type="submit" className="py-2 px-4 bg-saizu-blue text-white rounded-md hover:bg-blue-800 transition-colors">
              {isEditing ? 'Simpan Perubahan' : 'Tambah Ruangan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;
