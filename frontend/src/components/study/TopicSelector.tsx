import React, { useEffect, useState } from 'react';
import { getAllTopics, type TopicDefinition } from '../../constants/topicRegistry';
import { TopicCard } from './TopicCard';
import { supabase } from '../../lib/supabase';
import { AlertCircle, Loader2 } from 'lucide-react';

interface TopicSelectorProps {
    onStudy: (topic: TopicDefinition) => void;
    onTest: (topic: TopicDefinition) => void;
    onClinic: (topic: TopicDefinition) => void;
    onSummary: (topic: TopicDefinition) => void;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onStudy, onTest, onClinic, onSummary }) => {
    const topics = getAllTopics();
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [failedCounts, setFailedCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAllCounts = async () => {
            try {
                // 1. Fetch total question counts per topic
                const newCounts: Record<string, number> = {};
                const qPromises = topics.map(async (topic) => {
                    const { count, error } = await supabase
                        .from('questions')
                        .select('*', { count: 'exact', head: true })
                        .eq('topic_id', topic.id);

                    if (!error && count !== null) {
                        newCounts[topic.id] = count;
                    }
                });

                // 2. Fetch failed counts for current user
                const { data: { user } } = await supabase.auth.getUser();
                const newFailedCounts: Record<string, number> = {};

                if (user) {
                    const { data: allProgress } = await supabase
                        .from('user_progress')
                        .select('question_id, is_correct, answered_at')
                        .eq('user_id', user.id)
                        .order('answered_at', { ascending: false });

                    if (allProgress) {
                        const latestByQuestion: Record<string, boolean> = {};
                        allProgress.forEach(p => {
                            if (latestByQuestion[p.question_id] === undefined) {
                                latestByQuestion[p.question_id] = p.is_correct;
                            }
                        });

                        const failedQuestionIds = Object.entries(latestByQuestion)
                            .filter(([_, isCorrect]) => !isCorrect)
                            .map(([id, _]) => id);

                        if (failedQuestionIds.length > 0) {
                            const { data: qTopics } = await supabase
                                .from('questions')
                                .select('id, topic_id')
                                .in('id', failedQuestionIds);

                            if (qTopics) {
                                qTopics.forEach(qt => {
                                    newFailedCounts[qt.topic_id] = (newFailedCounts[qt.topic_id] || 0) + 1;
                                });
                            }
                        }
                    }
                }

                await Promise.all(qPromises);
                setCounts(newCounts);
                setFailedCounts(newFailedCounts);
            } catch (err) {
                console.error("Error fetching topic counts:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllCounts();
    }, []);

    const filteredTopics = topics.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const commonTopics = filteredTopics.filter(t => t.category === 'common');
    const specificTopics = filteredTopics.filter(t => t.category === 'specific');

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="animate-spin text-forest-600" size={32} />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Search Bar */}
            <div className="relative group max-w-md mx-auto mb-8">
                <input
                    type="text"
                    placeholder="Buscar tema (ex: Lume, Constitución, Motor...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 rounded-xl border-2 border-forest-100 dark:border-forest-900/30 focus:border-forest-500 bg-white dark:bg-gray-800 focus:ring-4 focus:ring-forest-500/10 transition-all outline-none"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-forest-500 transition-colors">
                    <Loader2 size={20} className={searchTerm ? 'hidden' : 'block'} />
                </div>
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                        <AlertCircle size={20} className="rotate-45" />
                    </button>
                )}
            </div>

            {filteredTopics.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-3xl">
                    <AlertCircle size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-400">Non hai resultados</h3>
                    <p className="text-gray-400">Proba con outra palabra ou borra a busca.</p>
                </div>
            ) : (
                <>
                    {/* Common Topics */}
                    {commonTopics.length > 0 && (
                        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-2 mb-4">
                                <h2 className="text-xl font-bold text-forest-800 dark:text-forest-100">
                                    Parte Común
                                </h2>
                                <span className="bg-forest-100 text-forest-800 text-xs px-2 py-0.5 rounded-full font-mono">
                                    {commonTopics.length} Temas
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {commonTopics.map(topic => (
                                    <TopicCard
                                        key={topic.slug}
                                        topic={topic}
                                        questionCount={counts[topic.id] || 0}
                                        failedCount={failedCounts[topic.id] || 0}
                                        onStudy={onStudy}
                                        onTest={onTest}
                                        onClinic={onClinic}
                                        onSummary={onSummary}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Specific Topics */}
                    {specificTopics.length > 0 && (
                        <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex items-center gap-2 mb-4">
                                <h2 className="text-xl font-bold text-forest-800 dark:text-forest-100">
                                    Parte Específica
                                </h2>
                                <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full font-mono">
                                    {specificTopics.length} Temas
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {specificTopics.map(topic => (
                                    <TopicCard
                                        key={topic.slug}
                                        topic={topic}
                                        questionCount={counts[topic.id] || 0}
                                        failedCount={failedCounts[topic.id] || 0}
                                        onStudy={onStudy}
                                        onTest={onTest}
                                        onClinic={onClinic}
                                        onSummary={onSummary}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </div>
    );
};
