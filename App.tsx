
import React, { useState, useCallback, useEffect, createContext } from 'react';
import type { User, UserRole, Booking, Room } from './types';
import { MOCK_ROOMS, MOCK_BOOKINGS } from './constants';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import StatusPage from './pages/StatusPage';
import AdminDashboard from './pages/AdminDashboard';
import VisiMisiPage from './pages/VisiMisiPage';

export type Page = 'login' | 'home' | 'status' | 'admin' | 'visi-misi';
export type Theme = 'light' | 'dark';

export const AppContext = createContext<{
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

export const ThemeContext = createContext<{
    theme: Theme;
    toggleTheme: () => void;
}>({
    theme: 'light',
    toggleTheme: () => {},
});

const App: React.FC = () => {
    const [page, setPage] = useState<Page>('home');
    
    // Initialize state from localStorage if available, else use defaults
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem('saizu_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [rooms, setRooms] = useState<Room[]>(() => {
        const saved = localStorage.getItem('saizu_rooms');
        return saved ? JSON.parse(saved) : MOCK_ROOMS;
    });

    const [bookings, setBookings] = useState<Booking[]>(() => {
        const saved = localStorage.getItem('saizu_bookings');
        return saved ? JSON.parse(saved) : MOCK_BOOKINGS;
    });

    const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

    // Persistence Effects
    useEffect(() => {
        localStorage.setItem('saizu_user', JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        localStorage.setItem('saizu_rooms', JSON.stringify(rooms));
    }, [rooms]);

    useEffect(() => {
        localStorage.setItem('saizu_bookings', JSON.stringify(bookings));
    }, [bookings]);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'light' ? 'dark' : 'light');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

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
        // Clear local storage for user but keep data
        localStorage.removeItem('saizu_user');
    }, []);

    const addBooking = useCallback((bookingData: Omit<Booking, 'id' | 'status'>) => {
        // Validation: Check for overlapping bookings
        const hasConflict = bookings.some(b => 
            b.roomId === bookingData.roomId && 
            b.date === bookingData.date &&
            (b.status === 'Disetujui' || b.status === 'Pending') &&
            // Check if time ranges overlap: (StartA < EndB) and (EndA > StartB)
            (bookingData.startTime < b.endTime && bookingData.endTime > b.startTime)
        );

        if (hasConflict) {
            return { success: false, message: 'Maaf, waktu yang dipilih bertabrakan dengan peminjaman lain.' };
        }

        const newBooking: Booking = {
            ...bookingData,
            id: `book${Date.now()}`,
            status: 'Pending',
        };
        setBookings(prev => [...prev, newBooking]);
        return { success: true, message: 'Peminjaman berhasil diajukan dan sedang menunggu persetujuan admin.' };
    }, [bookings]);

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
            <ThemeContext.Provider value={{ theme, toggleTheme }}>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                        {renderPage()}
                    </main>
                </div>
            </ThemeContext.Provider>
        </AppContext.Provider>
    );
};

export default App;
