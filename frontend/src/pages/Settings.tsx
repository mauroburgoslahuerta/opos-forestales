import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Lock, Check, Loader, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Settings() {
    const { user, role } = useAuth();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Os contrasinais non coinciden' });
            return;
        }
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'O contrasinal debe ter polo menos 6 caracteres' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setMessage({ type: 'success', text: 'Contrasinal actualizado correctamente! 🌲' });
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Erro ao actualizar contrasinal' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-forest-800">Recuncho Persoal</h1>

            {/* Profile Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-earth-100 flex items-center space-x-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white ${role === 'admin' ? 'bg-forest-600' : 'bg-earth-600'}`}>
                    {user?.user_metadata?.full_name?.[0] || 'U'}
                </div>
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">{user?.user_metadata?.full_name}</h2>
                    <p className="text-gray-500 capitalize">{role === 'admin' ? 'Supervisor' : 'Opositor'}</p>
                    <p className="text-xs text-earth-400 mt-1">{user?.email}</p>
                </div>
            </div>

            {/* Password Change Form */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-earth-100">
                <h3 className="text-lg font-semibold text-forest-700 mb-4 flex items-center">
                    <Lock className="w-5 h-5 mr-2" />
                    Cambiar Contrasinal
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                    Escribe o novo contrasinal para a túa conta. Non a esquezas!
                </p>

                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Novo Contrasinal</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contrasinal</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-forest-500 outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded-lg text-sm flex items-center ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message.type === 'success' ? <Check className="w-4 h-4 mr-2" /> : <AlertCircle className="w-4 h-4 mr-2" />}
                            {message.text}
                        </div>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading || !newPassword}
                            className="px-6 py-2 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 disabled:opacity-50 transition-colors flex items-center"
                        >
                            {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : 'Gardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
