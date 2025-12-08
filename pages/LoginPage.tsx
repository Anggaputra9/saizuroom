import React, { useState, useContext } from 'react';
import { AppContext } from '../App';

const MailIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12V8m0 4a4 4 0 100-8 4 4 0 000 8zm0 0l-4 4m4-4l4 4m-1-4a1 1 0 10-2 0 1 1 0 002 0z" />
    </svg>
);

const LockIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
);


const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AppContext);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setError('Email dan Password harus diisi.');
            return;
        }
        if (email.toLowerCase() !== 'admin@uinsaizu.ac.id' && !email.toLowerCase().endsWith('@uinsaizu.ac.id')) {
            setError('Gunakan email UIN SAIZU yang valid.');
            return;
        }
        setError('');
        login(email);
    };

    return (
        <div className="flex items-center justify-center min-h-[75vh]">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-2xl shadow-2xl flex overflow-hidden">
                <div className="w-full md:w-1/2 p-8 sm:p-12 animate-fade-in">
                     <div className="text-left mb-8">
                        <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Selamat Datang!
                        </h2>
                        <p className="mt-2 text-md text-gray-600 dark:text-gray-300">
                            Login untuk memulai peminjaman ruangan.
                        </p>
                    </div>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <MailIcon />
                                </div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm"
                                    placeholder="Email UIN SAIZU"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <LockIcon />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-saizu-blue focus:border-saizu-blue sm:text-sm"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-saizu-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saizu-blue transition-all duration-300 ease-in-out"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
                 <div className="hidden md:flex w-1/2 bg-saizu-blue items-center justify-center p-12 relative overflow-hidden">
                     <div className="absolute inset-0 bg-black/10" style={{backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2375CD90' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}}></div>
                     <div className="text-center z-10">
                        <h1 className="text-white text-5xl font-bold tracking-wider">
                           SAIZU<span className="text-saizu-green font-semibold">ROOM</span>
                        </h1>
                        <p className="text-blue-200 mt-4">Sistem Peminjaman Ruang Kelas Terintegrasi</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;