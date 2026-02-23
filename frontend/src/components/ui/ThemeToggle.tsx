import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg transition-colors text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800 cursor-pointer"
        >
            <div className="relative w-5 h-5 flex items-center justify-center">
                <Sun className={`absolute h-5 w-5 transition-all ${theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
                <Moon className={`absolute h-5 w-5 transition-all ${theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
            </div>
            <span className="font-medium">
                {theme === 'light' ? 'Modo Claro' : 'Modo Oscuro'}
            </span>
        </button>
    );
}
