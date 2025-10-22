import React, { useState, useCallback } from 'react';
import type { User, UserRole, Booking, Room } from './types';
import { MOCK_ROOMS, MOCK_BOOKINGS } from './constans';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';
import AdminDashboard from './pages/AdminDashboard';
import VisiMisiPage from './pages/VisiMisiPage';

export type Page = 'login' | 'home' | 'status' | 'admin' | 'visi-misi';

export const AppContext = React.createContext<{
    user: User | null;
    rooms: Room[];
    bookings: Booking[];
    login: (email: string) => void;
    logout: () => void;
    addBooking: (booking: Omit<Booking, 'id' | 'status'>) => { success: boolean; message: string };
    updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
    deleteBooking: (bookingId: string) => void;
    addRoom: (room: Omit<Room, 'id'>) => void;
    editRoom: (room: Room) => void;
    deleteRoom: (roomId: string) => void;
    setPage: (page: Page) => void;
}>({
    user: null,
    rooms: [],
    bookings: [],
    login: () => {},
    logout: () => {},
    addBooking: () => ({ success: false, message: '' }),
    updateBookingStatus: () => {},
    deleteBooking: () => {},
    addRoom: () => {},
    editRoom: () => {},
    deleteRoom: () => {},
    setPage: () => {},
});

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('home');
    const [user, setUser] = useState<User | null>(null);
    const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS);
    const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

    const login = useCallback((email: string) => {
        if (email.toLowerCase() === 'admin@uinsaizu.ac.id') {
            setUser({ email, role: 'Admin', name: 'Admin SAIZU', id: '000000000' });
            setPage('admin');
        } else {
            // Simple mock user login
            setUser({ email, role: 'User', name: 'Mahasiswa UIN SAIZU', id: '123456789' });
            setPage('home');
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setPage('login');
    }, []);

    const addBooking = useCallback((bookingData: Omit<Booking, 'id' | 'status'>) => {
        const newBookingId = `book${Date.now()}`;
        const autoStatus = Math.random() > 0.3 ? 'Disetujui' : 'Ditolak';
        const newBooking: Booking = {
            ...bookingData,
            id: newBookingId,
            status: 'Pending',
        };
        setBookings(prev => [...prev, newBooking]);
        
        setTimeout(() => {
            setBookings(prev => prev.map(b => b.id === newBookingId ? { ...b, status: autoStatus } : b));
        }, 1000);
        return { success: true, message: `Booking Anda berhasil dikirim dan akan segera diproses. Status awal: ${autoStatus}` };
    }, []);

    const updateBookingStatus = useCallback((bookingId: string, status: Booking['status']) => {
        setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
    }, []);
    
    const deleteBooking = useCallback((bookingId: string) => {
        setBookings(prev => prev.filter(b => b.id !== bookingId));
    }, []);

    const addRoom = useCallback((roomData: Omit<Room, 'id'>) => {
        const newRoom: Room = {
            ...roomData,
            id: `${roomData.building}${Math.floor(Math.random() * 900) + 100}`
        };
        setRooms(prev => [...prev, newRoom]);
    }, []);

    const editRoom = useCallback((updatedRoom: Room) => {
        setRooms(prev => prev.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    }, []);
    
    const deleteRoom = useCallback((roomId: string) => {
        setRooms(prev => prev.filter(r => r.id !== roomId));
    }, []);

    const renderPage = () => {
        if (!user && !['login', 'home', 'visi-misi'].includes(page)) {
             setPage('login');
             return <LoginPage />;
        }
        switch (page) {
            case 'login': return <LoginPage />;
            case 'home': return <HomePage />;
            case 'status': return user?.role === 'User' ? <StatusPage /> : <LoginPage />;
            case 'admin': return user?.role === 'Admin' ? <AdminDashboard /> : <HomePage />;
            case 'visi-misi': return <VisiMisiPage />;
            default: return <HomePage />;
        }
    };
    
    return (
        <AppContext.Provider value={{ user, rooms, bookings, login, logout, addBooking, updateBookingStatus, deleteBooking, addRoom, editRoom, deleteRoom, setPage }}>
            <div className="min-h-screen flex flex-col font-sans">
                <Navbar />
                <main className="flex-grow container mx-auto p-4 md:p-8">
                    {renderPage()}
                </main>
            </div>
        </AppContext.Provider>
    );
};

export default App;