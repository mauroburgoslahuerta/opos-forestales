import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { TestRunner } from '../components/test/TestRunner';
import { Button } from '../components/ui/Button';
import { ArrowLeft, Stethoscope, Loader2 } from 'lucide-react';

export default function ClinicPage() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchFailedQuestions() {
            if (!user) return;

            try {
                // 1. Get all user progress
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

                    // 2. Get IDs of failed questions
                    const failedIds = Object.entries(latestByQuestion)
                        .filter(([_, isCorrect]) => !isCorrect)
                        .map(([id, _]) => id);

                    if (failedIds.length > 0) {
                        // 3. Fetch full question data including topic name
                        const { data: questionData } = await supabase
                            .from('questions')
                            .select('*, topics(name)')
                            .in('id', failedIds);

                        if (questionData) {
                            // Map topic name to question object for TestRunner
                            const mappedQuestions = questionData.map(q => ({
                                ...q,
                                topic_name: q.topics?.name || 'Tema descoñecido'
                            }));
                            setQuestions(mappedQuestions);
                        }
                    }
                }
            } catch (err) {
                console.error('Error fetching clinic questions:', err);
            } finally {
                setLoading(false);
            }
        }

        fetchFailedQuestions();
    }, [user]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="h-8 w-8 text-forest-500 animate-spin" />
                <p className="text-gray-500 animate-pulse">Cargando a túa clínica de erros...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-12 text-center">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Stethoscope size={40} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">¡Estás de alta!</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                        Non tes ningunha pregunta pendente de cura. Segue así para manter o teu banco de erros limpo.
                    </p>
                    <Button onClick={() => navigate('/dashboard')} variant="primary" size="lg">
                        Volver ao Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-12">
            <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 py-4 px-6 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Sair
                        </Button>
                        <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2" />
                        <div className="flex items-center gap-2">
                            <Stethoscope className="h-6 w-6 text-orange-500" />
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Clínica de Erros</h1>
                        </div>
                    </div>
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {questions.length} Pendentes
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 mt-8">
                <TestRunner
                    questions={questions}
                    mode="clinic"
                    onExit={() => navigate('/dashboard')}
                    onComplete={() => navigate('/dashboard')}
                />
            </main>
        </div>
    );
}
