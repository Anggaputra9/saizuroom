import React, { useContext } from 'react';
import { AppContext, ThemeContext } from '../App';

const NavLink: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({ onClick, children }) => (
    <button onClick={onClick} className="text-gray-300 hover:text-white transition-colors font-medium px-3 py-2 rounded-md text-sm">
        {children}
    </button>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);


const Navbar: React.FC = () => {
    const { user, setPage, logout } = useContext(AppContext);
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <nav className="bg-saizu-blue dark:bg-gray-800 shadow-lg sticky top-0 z-50 border-b border-black/10 dark:border-white/10">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    <div 
                        className="text-white text-3xl font-bold cursor-pointer tracking-wider"
                        onClick={() => setPage(user?.role === 'Admin' ? 'admin' : 'home')}
                    >
                        SAIZU<span className="text-saizu-green font-semibold">ROOM</span>
                    </div>
                    <div className="hidden md:flex items-center space-x-1">
                        <NavLink onClick={() => setPage('home')}>Beranda</NavLink>
                        <NavLink onClick={() => setPage('visi-misi')}>Visi & Misi</NavLink>
                        {user && user.role === 'User' && (
                            <NavLink onClick={() => setPage('status')}>Status Peminjaman</NavLink>
                        )}
                         {user && user.role === 'Admin' && (
                            <NavLink onClick={() => setPage('admin')}>Dashboard</NavLink>
                        )}
                        <div className="pl-4 flex items-center gap-4">
                             <button onClick={toggleTheme} className="text-gray-300 hover:text-white p-2 rounded-full transition-colors">
                                {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                            </button>
                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-white font-medium text-sm">{user.name}</span>
                                <button onClick={logout} className="bg-saizu-green text-white py-2 px-5 rounded-full hover:bg-green-400 transition-colors font-semibold shadow-md text-sm">Logout</button>
                            </div>
                        ) : (
                            <button onClick={() => setPage('login')} className="bg-saizu-green text-white py-2 px-5 rounded-full hover:bg-green-400 transition-colors font-semibold shadow-md text-sm">Login</button>
                        )}
                        </div>
                    </div>
                    {/* A Mobile Menu toggle could be added here */}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;