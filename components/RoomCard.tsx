import React, { useContext } from 'react';
import type { Room } from '../types';
import { AppContext } from '../App';

interface RoomCardProps {
    room: Room & { availableSlots: { startTime: string; endTime: string }[] };
    onBook: (room: Room, slot: { startTime: string; endTime: string }) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
    const { user } = useContext(AppContext);
    const isFullyBooked = room.availableSlots.length === 0;

    const cardClasses = isFullyBooked
        ? 'bg-red-50 border-red-200'
        : 'bg-white border-gray-200 transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl';

    const headerClasses = isFullyBooked ? 'text-red-800' : 'text-saizu-blue';

    return (
        <div className={`border rounded-lg shadow-md flex flex-col ${cardClasses}`}>
            <div className={`p-4 border-b ${isFullyBooked ? 'border-red-200' : 'border-gray-200'}`}>
                <h3 className={`text-xl font-bold ${headerClasses}`}>{room.name}</h3>
                <p className="text-sm text-gray-500">Gedung {room.building}</p>
            </div>
            <div className="p-4 flex-grow flex flex-col gap-2">
                {isFullyBooked ? (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-center font-semibold text-red-600">Terpakai Penuh</p>
                    </div>
                ) : (
                    room.availableSlots.map((slot, index) => (
                        <div key={index} className="bg-green-50 p-3 rounded-md flex flex-col sm:flex-row justify-between items-center gap-2">
                            <div className="text-center sm:text-left">
                                <p className="font-semibold text-green-800">{slot.startTime} - {slot.endTime}</p>
                                <p className="text-xs text-green-600">Tersedia</p>
                            </div>
                            {user && user.role === 'User' && (
                                <button
                                    onClick={() => onBook(room, slot)}
                                    className="w-full sm:w-auto bg-saizu-green text-white py-1 px-3 rounded-md font-semibold text-sm hover:bg-green-600 transition-colors whitespace-nowrap"
                                >
                                    Pinjam
                                </button>
                            )}
                        </div>
                    ))
                )}
                 {!user && !isFullyBooked && (
                    <p className="text-xs text-center text-gray-500 mt-2">Login sebagai user untuk meminjam.</p>
                )}
            </div>
        </div>
    );
};

export default RoomCard;