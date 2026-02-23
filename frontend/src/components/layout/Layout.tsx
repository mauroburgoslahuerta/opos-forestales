import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, BookOpen, PenTool, BarChart3, Settings, Menu, X, Briefcase, FileText } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../ui/ThemeToggle';

const SidebarItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink
        to={to}
        className={({ isActive }) =>
            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                ? 'bg-forest-100 text-forest-700 dark:bg-forest-900 dark:text-forest-100'
                : 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800'
            }`
        }
    >
        <Icon size={20} />
        <span className="font-medium">{label}</span>
    </NavLink>
);

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex text-gray-900 dark:text-gray-100 font-sans">
            {/* Sidebar - Desktop */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } lg:translate-x-0 lg:static lg:inset-0`}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-800">
                    <h1 className="text-xl font-bold text-forest-600 flex items-center space-x-2">
                        <span>🌲 Opos Forestais</span>
                    </h1>
                </div>

                <nav className="p-4 space-y-2">
                    <SidebarItem to="/" icon={LayoutDashboard} label="Inicio" />
                    <SidebarItem to="/study" icon={BookOpen} label="Modo Estudo" />
                    <SidebarItem to="/test" icon={PenTool} label="Modo Test" />
                    <SidebarItem to="/exame-oficial" icon={FileText} label="Exame Oficial" />
                    <SidebarItem to="/caso-practico" icon={Briefcase} label="Caso Práctico" />
                    <SidebarItem to="/stats" icon={BarChart3} label="Estatísticas" />
                    <div className="pt-8 border-t border-gray-100 dark:border-gray-800 space-y-2">
                        <ThemeToggle />
                        <SidebarItem to="/settings" icon={Settings} label="Configuración" />
                    </div>
                </nav>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center px-4 justify-between">
                    <span className="font-bold text-forest-600">Opos Forestais</span>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
