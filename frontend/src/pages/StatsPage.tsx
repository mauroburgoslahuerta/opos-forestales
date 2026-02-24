import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BarChart3, Target, CheckCircle2, AlertCircle, Search, ArrowUpDown } from 'lucide-react';
import { getAllTopics } from '../constants/topicRegistry';

interface TopicStats {
    topicId: string;
    title: string;
    total: number;
    correct: number;
    accuracy: number;
    group: string;
}

export const StatsPage = () => {
    const { user, role, profile } = useAuth();
    const [profiles, setProfiles] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [topicStats, setTopicStats] = useState<TopicStats[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof TopicStats; direction: 'asc' | 'desc' } | null>(null);
    const [timeRange, setTimeRange] = useState<'total' | 'last7'>('total');

    // Initial setup
    useEffect(() => {
        if (user && profile) {
            setSelectedUserId(user.id);
        }
    }, [user, profile]);

    // Admin: fetch profiles
    useEffect(() => {
        async function fetchProfiles() {
            if (role === 'admin') {
                const { data } = await supabase.from('profiles').select('id, full_name');
                if (data) setProfiles(data);
            }
        }
        fetchProfiles();
    }, [role]);

    // Fetch stats for selected user
    useEffect(() => {
        async function fetchDetailedStats() {
            if (!selectedUserId) return;
            setLoading(true);

            try {
                const topics = getAllTopics();

                // Fetch progress
                let query = supabase
                    .from('user_progress')
                    .select('question_id, is_correct, answered_at')
                    .eq('user_id', selectedUserId);

                if (timeRange === 'last7') {
                    const sevenDaysAgo = new Date();
                    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                    query = query.gte('answered_at', sevenDaysAgo.toISOString());
                }

                const { data: progress } = await query;

                if (progress) {
                    // Fetch topic associations for these questions
                    const questionIds = Array.from(new Set(progress.map(p => p.question_id)));

                    // Supabase 'in' filter limit is usually around 1000, but let's be safe
                    // Instead of fetching associations for all, let's map existing questions.
                    // To be really accurate, we need the topic_id of every answered question.
                    const { data: qTopics } = await supabase
                        .from('questions')
                        .select('id, topic_id')
                        .in('id', questionIds);

                    const qToTopic = new Map(qTopics?.map(q => [q.id, q.topic_id]) || []);

                    const statsMap: Record<string, { total: number; correct: number }> = {};
                    progress.forEach(p => {
                        const topicId = qToTopic.get(p.question_id);
                        if (topicId) {
                            if (!statsMap[topicId]) statsMap[topicId] = { total: 0, correct: 0 };
                            statsMap[topicId].total++;
                            if (p.is_correct) statsMap[topicId].correct++;
                        }
                    });

                    const calculated: TopicStats[] = topics.map(t => {
                        const s = statsMap[t.id] || { total: 0, correct: 0 };
                        return {
                            topicId: t.id,
                            title: t.title,
                            total: s.total,
                            correct: s.correct,
                            accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
                            group: t.category === 'common' ? 'Parte Común' : 'Parte Específica'
                        };
                    });

                    setTopicStats(calculated);
                } else {
                    // No progress yet
                    setTopicStats(topics.map(t => ({
                        topicId: t.id,
                        title: t.title,
                        total: 0,
                        correct: 0,
                        accuracy: 0,
                        group: t.category === 'common' ? 'Parte Común' : 'Parte Específica'
                    })));
                }
            } catch (err) {
                console.error("Error fetching detailed stats:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchDetailedStats();
    }, [selectedUserId, timeRange]);

    const handleSort = (key: keyof TopicStats) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedStats = React.useMemo(() => {
        let items = [...topicStats];

        // Filter
        if (searchTerm) {
            items = items.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        // Sort
        if (sortConfig !== null) {
            items.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return items;
    }, [topicStats, searchTerm, sortConfig]);

    const globalStats = React.useMemo(() => {
        const total = topicStats.reduce((acc, curr) => acc + curr.total, 0);
        const correct = topicStats.reduce((acc, curr) => acc + curr.correct, 0);
        return {
            total,
            correct,
            accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
        };
    }, [topicStats]);

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-forest-900 dark:text-forest-100 flex items-center gap-3">
                        <BarChart3 className="text-forest-600" size={32} />
                        Estatísticas Detalladas
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Analiza o teu rendemento por tema e identifica áreas de mellora.
                    </p>
                </div>

                {role === 'admin' && (
                    <div className="flex flex-wrap items-center gap-3">
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setTimeRange('total')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === 'total'
                                    ? 'bg-white dark:bg-gray-700 text-forest-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                Total
                            </button>
                            <button
                                onClick={() => setTimeRange('last7')}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === 'last7'
                                    ? 'bg-white dark:bg-gray-700 text-forest-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                            >
                                Última Semana
                            </button>
                        </div>

                        <div className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ver de:</span>
                            <select
                                className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer min-w-[150px]"
                                value={selectedUserId || ''}
                                onChange={(e) => {
                                    setSelectedUserId(e.target.value);
                                }}
                            >
                                {profiles.map(p => (
                                    <option key={p.id} value={p.id}>{p.full_name === 'Mauro' ? 'Mauro (Admin)' : p.full_name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {role !== 'admin' && (
                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
                        <button
                            onClick={() => setTimeRange('total')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === 'total'
                                ? 'bg-white dark:bg-gray-700 text-forest-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Total
                        </button>
                        <button
                            onClick={() => setTimeRange('last7')}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${timeRange === 'last7'
                                ? 'bg-white dark:bg-gray-700 text-forest-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Última Semana
                        </button>
                    </div>
                )}
            </div>

            {/* Global Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                <Target size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">Precisión Global</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-white">{globalStats.accuracy}%</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                                <CheckCircle2 size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">Acertos Totais</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-white">{globalStats.correct}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-gray-800">
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                                <AlertCircle size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400 font-medium">Total Respondidas</p>
                                <p className="text-3xl font-black text-gray-900 dark:text-white">{globalStats.total}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Topics Table */}
            <Card className="bg-white dark:bg-gray-800 overflow-hidden">
                <CardHeader className="border-b border-gray-100 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-xl">Desglose por Tema</CardTitle>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Buscar tema..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:ring-2 focus:ring-forest-500 transition-all w-full md:w-64"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-gray-900 text-gray-400 text-[10px] uppercase tracking-wider font-bold">
                                    <th className="px-6 py-4 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => handleSort('title')}>
                                        <div className="flex items-center gap-2">
                                            Tema <ArrowUpDown size={12} />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 cursor-pointer hover:text-gray-600 transition-colors" onClick={() => handleSort('group')}>
                                        <div className="flex items-center gap-2">
                                            Bloque <ArrowUpDown size={12} />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center cursor-pointer hover:text-gray-600 transition-colors" onClick={() => handleSort('total')}>
                                        <div className="flex items-center justify-center gap-2">
                                            Respondidas <ArrowUpDown size={12} />
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center cursor-pointer hover:text-gray-600 transition-colors" onClick={() => handleSort('accuracy')}>
                                        <div className="flex items-center justify-center gap-2">
                                            Precisión <ArrowUpDown size={12} />
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                            Cargando datos...
                                        </td>
                                    </tr>
                                ) : sortedStats.length > 0 ? (
                                    sortedStats.map((topic) => (
                                        <tr key={topic.topicId} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">{topic.title}</p>
                                                <p className="text-[10px] text-gray-400">ID: {topic.topicId}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${topic.group === 'Parte Común'
                                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20'
                                                    : 'bg-forest-50 text-forest-600 dark:bg-forest-900/20'
                                                    }`}>
                                                    {topic.group}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <p className="text-sm font-medium">{topic.total}</p>
                                                <p className="text-[10px] text-gray-400">{topic.correct} acertos</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden min-w-[60px]">
                                                        <div
                                                            className={`h-full transition-all duration-500 ${topic.accuracy > 70 ? 'bg-green-500' : topic.accuracy > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${topic.accuracy}%` }}
                                                        />
                                                    </div>
                                                    <span className={`text-sm font-black w-10 text-right ${topic.accuracy > 70 ? 'text-green-600' : topic.accuracy > 40 ? 'text-yellow-600' : 'text-red-600'
                                                        }`}>
                                                        {topic.accuracy}%
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                                            Non se atoparon datos co filtro actual.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
