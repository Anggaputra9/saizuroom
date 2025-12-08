import React, { useContext } from 'react';
import type { Room } from '../types';
import { AppContext } from '../App';

interface RoomCardProps {
    room: Room & { availableSlots: { startTime: string; endTime: string }[] };
    onBook: (room: Room, slot: { startTime: string; endTime: string }) => void;
}

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m-1 4h1m-1 4h1m4-12h1m-1 4h1m-1 4h1m-1 4h1" />
    </svg>
);


const RoomCard: React.FC<RoomCardProps> = ({ room, onBook }) => {
    const { user } = useContext(AppContext);
    const isFullyBooked = room.availableSlots.length === 0;

    const cardClasses = isFullyBooked
        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-500/30'
        : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 dark:hover:shadow-saizu-green/20';

    const headerClasses = isFullyBooked 
        ? 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30' 
        : 'text-saizu-blue dark:text-blue-300 bg-blue-50 dark:bg-gray-700';

    return (
        <div className={`border rounded-xl shadow-lg flex flex-col h-full ${cardClasses}`}>
            <div className={`p-4 border-b rounded-t-xl flex items-center gap-4 ${headerClasses} ${isFullyBooked ? 'border-red-200 dark:border-red-500/30' : 'border-blue-100 dark:border-gray-600'}`}>
                <div className="flex-shrink-0"><BuildingIcon/></div>
                <div>
                    <h3 className="text-xl font-bold">{room.name}</h3>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gedung {room.building}</p>
                </div>
            </div>
            <div className="p-4 flex-grow flex flex-col gap-3">
                {isFullyBooked ? (
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-center font-semibold text-red-600 dark:text-red-400">Terpakai Penuh Hari Ini</p>
                    </div>
                ) : (
                    room.availableSlots.map((slot, index) => (
                        <div key={index} className="bg-green-100 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-3 rounded-lg flex flex-col sm:flex-row justify-between items-center gap-2">
                            <div className="text-center sm:text-left">
                                <p className="font-semibold text-green-800 dark:text-green-200">{slot.startTime} - {slot.endTime}</p>
                                <p className="text-xs text-green-600 dark:text-green-400 font-medium">TERSEDIA</p>
                            </div>
                            {user && user.role === 'User' && (
                                <button
                                    onClick={() => onBook(room, slot)}
                                    className="w-full sm:w-auto bg-saizu-green text-white py-2 px-4 rounded-lg font-semibold text-sm hover:bg-green-600 transition-colors whitespace-nowrap shadow-md hover:shadow-lg"
                                >
                                    Pinjam
                                </button>
                            )}
                        </div>
                    ))
                )}
                 {!user && !isFullyBooked && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-md">Login sebagai user untuk meminjam ruangan.</p>
                )}
            </div>
        </div>
    );
};

export default RoomCard;