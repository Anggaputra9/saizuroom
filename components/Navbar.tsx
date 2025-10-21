import React, { useContext } from 'react';
import { AppContext } from '../App';

const Navbar: React.FC = () => {
    const { user, setPage, logout } = useContext(AppContext);

    return (
        <nav className="bg-saizu-blue shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div 
                        className="text-white text-2xl font-bold cursor-pointer"
                        onClick={() => setPage(user?.role === 'Admin' ? 'admin' : 'home')}
                    >
                        SAIZU <span className="text-saizu-green">ROOM</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-6">
                        <button onClick={() => setPage('home')} className="text-white hover:text-saizu-green transition-colors font-medium">Beranda</button>
                        <button onClick={() => setPage('visi-misi')} className="text-white hover:text-saizu-green transition-colors font-medium">Visi & Misi</button>
                        {user && user.role === 'User' && (
                            <button onClick={() => setPage('status')} className="text-white hover:text-saizu-green transition-colors font-medium">Status Peminjaman</button>
                        )}
                         {user && user.role === 'Admin' && (
                            <button onClick={() => setPage('admin')} className="text-white hover:text-saizu-green transition-colors font-medium">Dashboard</button>
                        )}
                        {user ? (
                            <button onClick={logout} className="bg-saizu-green text-white py-2 px-4 rounded-md hover:bg-green-400 transition-colors font-semibold">Logout</button>
                        ) : (
                            <button onClick={() => setPage('login')} className="bg-saizu-green text-white py-2 px-4 rounded-md hover:bg-green-400 transition-colors font-semibold">Login</button>
                        )}
                    </div>
                    {/* A Mobile Menu toggle could be added here */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;