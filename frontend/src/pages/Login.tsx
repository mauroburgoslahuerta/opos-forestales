import React, { useState } from 'react';
// import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { Trees, User, GraduationCap, Lock, ArrowRight, Loader } from 'lucide-react';

export default function Login() {
    const [selectedUser, setSelectedUser] = useState<'mauro' | 'dario' | 'hugo' | null>(null);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;

        setLoading(true);
        setError(null);

        const email = selectedUser === 'mauro'
            ? 'mauro@oposforestales.gal'
            : selectedUser === 'dario'
                ? 'dario@oposforestales.gal'
                : 'hugo@oposforestales.gal';

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            setError('Contrasinal incorrecto. Proba outra vez.');

            setLoading(false);
        } else {
            // AuthContext listener will handle redirection/state update ideally, 
            // but let's force a nav just in case or wait for state change.
            // For now, simple redirect.
            navigate('/dashboard');
        }
    };

    const userConfig = {
        mauro: {
            name: 'Mauro',
            role: 'Admin / Supervisor',
            icon: User,
            color: 'bg-forest-600',
            description: 'Gestión completa e control de estudio.'
        },
        dario: {
            name: 'Dario',
            role: 'Opositor',
            icon: GraduationCap,
            color: 'bg-earth-600',
            description: 'Acceso a tests, temario e simulacros.'
        },
        hugo: {
            name: 'Hugo',
            role: 'Opositor',
            icon: GraduationCap,
            color: 'bg-orange-600',
            description: 'Acceso a tests, temario e simulacros.'
        }
    };

    return (
        <div className="min-h-screen bg-earth-50 flex flex-col justify-center items-center p-4">
            <div className="mb-8 text-center">
                <div className="bg-forest-700 p-4 rounded-full inline-flex mb-4 shadow-lg">
                    <Trees className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-forest-900">Opos Forestais</h1>
                <p className="text-forest-600">Plataforma de Estudo Intelixente</p>
            </div>

            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden p-8">
                {!selectedUser ? (
                    <>
                        <h2 className="text-center text-xl font-semibold text-gray-800 mb-6">Quen es ti?</h2>
                        <div className="grid gap-4">
                            {(['mauro', 'dario', 'hugo'] as const).map((key) => {
                                const u = userConfig[key];
                                return (
                                    <button
                                        key={key}
                                        onClick={() => setSelectedUser(key)}
                                        className="flex items-center p-4 border-2 border-transparent hover:border-forest-200 bg-gray-50 hover:bg-forest-50 rounded-xl transition-all duration-200 group text-left"
                                    >
                                        <div className={`${u.color} p-3 rounded-full mr-4 shadow-sm group-hover:scale-105 transition-transform`}>
                                            <u.icon className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{u.name}</h3>

                                        </div>
                                        <ArrowRight className="ml-auto w-5 h-5 text-gray-300 group-hover:text-forest-500" />
                                    </button>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <form onSubmit={handleLogin} className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <button
                            type="button"
                            onClick={() => { setSelectedUser(null); setPassword(''); setError(null); }}
                            className="text-sm text-forest-600 hover:text-forest-800 mb-6 flex items-center"
                        >
                            ← Volver atrás
                        </button>

                        <div className="text-center mb-6">
                            <div className={`${userConfig[selectedUser].color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md`}>
                                {React.createElement(userConfig[selectedUser].icon, { className: 'w-8 h-8 text-white' })}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">Ola benvido, {userConfig[selectedUser].name}</h2>
                            <p className="text-sm text-gray-500">Introduce o teu contrasinal</p>
                        </div>

                        <div className="space-y-4">
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Contrasinal..."
                                    autoFocus
                                />
                            </div>

                            {error && (
                                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !password}
                                className="w-full py-3 bg-forest-600 text-white rounded-lg font-semibold shadow-md hover:bg-forest-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex justify-center items-center"
                            >
                                {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Entrar'}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="mt-8 text-center text-xs text-earth-400">
                &copy; 2026 Opos Forestais · Versión 3.5
            </div>
        </div>
    );
}
