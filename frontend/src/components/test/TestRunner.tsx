import React, { useEffect, useState, useRef } from 'react';
import type { TopicDefinition } from '../../constants/topicRegistry';
import { supabase } from '../../lib/supabase';
import { Card, CardContent } from '../ui/Card';
import { Loader2, CheckCircle, XCircle, ArrowRight, Clock, Play, RotateCcw, AlertTriangle, BookOpen } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Scenario {
    id: string;
    title: string;
    content: string;
}

interface Question {
    id: string;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: string; // 'a' | 'b' | 'c' | 'd'
    correct_answer?: string; // Fallback column
    explanation?: string;
    topic_id: string;
    topic_name?: string; // Display name for clinic mode
    scenario_id?: string;
    scenarios?: Scenario;
}

interface TestRunnerProps {
    topic?: TopicDefinition;
    topics?: TopicDefinition[];
    questions?: any[]; // Allow direct questions passing
    mode?: 'standard' | 'practical' | 'official' | 'clinic';
    scenarioId?: string;
    onExit: () => void;
    onReviewTopic?: () => void;
    onComplete?: () => void;
}

type TestState = 'config' | 'loading' | 'playing' | 'finished';

export const TestRunner: React.FC<TestRunnerProps> = ({
    topic,
    topics,
    questions,
    mode = 'standard',
    scenarioId,
    onExit,
    onReviewTopic,
    onComplete
}) => {
    const { user } = useAuth();
    // State
    const [currentState, setCurrentState] = useState<TestState>('config');
    const [allQuestions, setAllQuestions] = useState<Question[]>([]); // Pool of all questions
    const [activeQuestions, setActiveQuestions] = useState<Question[]>([]); // Selected for this test
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({}); // id -> selected option
    const [score, setScore] = useState(0);

    // Timer
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const timerRef = useRef<any>(null);

    // Fetch or Load questions
    useEffect(() => {
        if (questions && questions.length > 0) {
            const normalized = questions.map(q => ({
                ...q,
                correct_option: (q.correct_option || q.correct_answer || '?').toLowerCase().trim(),
                option_a: q.option_a?.trim() || '',
                option_b: q.option_b?.trim() || '',
                option_c: q.option_c?.trim() || '',
                option_d: q.option_d?.trim() || '',
            }));
            setAllQuestions(normalized);

            if (mode === 'clinic') {
                setActiveQuestions(normalized);
                setCurrentState('playing'); // Skip config for clinic
            }
            return;
        }

        const fetchQuestions = async () => {
            let query = supabase.from('questions').select('*, scenarios(*)');

            if (scenarioId) {
                query = query.eq('scenario_id', scenarioId);
            } else if (topics && topics.length > 0) {
                const ids = topics.map(t => t.id);
                query = query.in('topic_id', ids);
            } else if (topic) {
                query = query.eq('topic_id', topic.id);
            } else {
                return; // Nothing to fetch
            }

            const { data, error } = await query;

            if (error) {
                console.error("Error fetching questions:", error);
            } else {
                // Normalize
                const normalized = (data || []).map(q => ({
                    ...q,
                    correct_option: (q.correct_option || q.correct_answer || '?').toLowerCase().trim(),
                    option_a: q.option_a?.trim() || '',
                    option_b: q.option_b?.trim() || '',
                    option_c: q.option_c?.trim() || '',
                    option_d: q.option_d?.trim() || '',
                }));

                setAllQuestions(normalized);

                // AUTO-START if it's a specific scenario
                if (scenarioId && normalized.length > 0) {
                    setActiveQuestions(normalized);
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                    setScore(0);
                    setElapsedSeconds(0);
                    setCurrentState('playing');
                }
            }
        };
        fetchQuestions();
    }, [topic, topics, questions, mode, scenarioId]);

    useEffect(() => {
        if (currentState === 'playing') {
            timerRef.current = setInterval(() => {
                setElapsedSeconds(prev => prev + 1);
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [currentState]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handlers
    const startTest = (count: number | 'all') => {
        setCurrentState('loading');

        let selected: Question[] = [];
        const shuffledPool = [...allQuestions].sort(() => 0.5 - Math.random());

        if (mode === 'official') {
            const commonTopicIds = topics?.filter(t => t.category === 'common').map(t => t.id) || [];
            const specificTopicIds = topics?.filter(t => t.category === 'specific').map(t => t.id) || [];

            const commonPool = allQuestions.filter(q => commonTopicIds.includes(q.topic_id)).sort(() => 0.5 - Math.random());
            const specificPool = allQuestions.filter(q => specificTopicIds.includes(q.topic_id)).sort(() => 0.5 - Math.random());

            selected = [
                ...commonPool.slice(0, 20),
                ...specificPool.slice(0, 60)
            ].sort(() => 0.5 - Math.random());
        } else if (mode === 'practical') {
            const specificTopicIds = topics?.filter(t => t.category === 'specific').map(t => t.id) || [];

            // Prioritize questions with scenarios
            const scenarioQuestions = allQuestions.filter(q => q.scenario_id).sort(() => 0.5 - Math.random());
            const otherQuestions = allQuestions.filter(q => !q.scenario_id && specificTopicIds.includes(q.topic_id)).sort(() => 0.5 - Math.random());

            selected = [...scenarioQuestions, ...otherQuestions].slice(0, 40);
        } else {
            selected = count === 'all' ? shuffledPool : shuffledPool.slice(0, count);
        }

        setActiveQuestions(selected);
        setCurrentQuestionIndex(0);
        setAnswers({});
        setScore(0);
        setElapsedSeconds(0);
        setCurrentState('playing');
    };

    const handleAnswer = (option: string) => {
        const currentQ = activeQuestions[currentQuestionIndex];
        // Prevent changing answer in this mode (Sudden Death / Immediate Feedback)
        if (answers[currentQ.id]) return;

        setAnswers(prev => ({ ...prev, [currentQ.id]: option }));

        if (option === currentQ.correct_option) {
            setScore(prev => prev + 1);
        }

        // Save progress to Supabase
        if (user) {
            supabase.from('user_progress').insert({
                user_id: user.id,
                question_id: currentQ.id,
                is_correct: option === currentQ.correct_option,
                answered_at: new Date().toISOString()
            }).then(({ error }) => {
                if (error) console.error("Error saving progress:", error);
            });
        }
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < activeQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishTest();
        }
    };

    const finishTest = () => {
        if (onComplete) {
            onComplete();
        } else {
            setCurrentState('finished');
        }
    };

    const retryTest = () => {
        setCurrentState('config');
    };

    // --- RENDERERS ---

    // 1. Loading
    if (currentState === 'loading' || (currentState === 'config' && allQuestions.length === 0)) {
        // If config but no questions yet, show loader or empty state
        if (allQuestions.length === 0 && currentState === 'config') {
            // Wait for fetch...
            return (
                <div className="flex h-96 items-center justify-center">
                    <Loader2 className="animate-spin text-forest-600" size={32} />
                </div>
            );
        }
        if (allQuestions.length === 0) { // Still 0 after fetch?
            return (
                <div className="text-center p-8">
                    <p>Non se atoparon preguntas para este tema.</p>
                    <button onClick={onExit} className="mt-4 text-forest-600 underline">Volver</button>
                </div>
            );
        }
    }

    // 2. Configuration
    if (currentState === 'config') {
        return (
            <div className="max-w-xl mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
                <header className="text-center space-y-2">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                        {mode === 'practical' ? 'Simulacro de Caso Práctico' : 'Configuración do Test'}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {mode === 'practical'
                            ? 'O simulacro consta de 40 preguntas dos temas específicos.'
                            : `Elixe o número de preguntas para ${topic?.title}`}
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mode === 'practical' || mode === 'official' ? (
                        <button
                            onClick={() => startTest(mode === 'practical' ? 40 : 80)}
                            className="p-8 rounded-xl border-2 border-forest-500 bg-forest-50 hover:bg-forest-100 text-forest-700 shadow-sm transition-all md:col-span-2 flex flex-col items-center gap-2"
                        >
                            <Play size={32} />
                            <span className="text-2xl font-black">
                                {mode === 'practical' ? 'Comezar Caso Práctico (40 Preguntas)' : 'Comezar Simulacro Oficial (80 Preguntas)'}
                            </span>
                        </button>
                    ) : (
                        [10, 25, 50, 'all'].map((opt) => {
                            const label = opt === 'all' ? `Todas (${allQuestions.length})` : `${opt} Preguntas`;
                            const disabled = typeof opt === 'number' && allQuestions.length < opt;

                            return (
                                <button
                                    key={opt}
                                    onClick={() => startTest(opt as number | 'all')}
                                    disabled={disabled}
                                    className={`
                                    p-6 rounded-xl border-2 text-lg font-bold transition-all
                                    flex flex-col items-center justify-center gap-2
                                    ${disabled
                                            ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                                            : 'border-forest-200 bg-white hover:border-forest-500 hover:bg-forest-50 text-forest-700 shadow-sm hover:shadow-md'
                                        }
                                `}
                                >
                                    {opt === 'all' ? <RotateCcw size={24} /> : <Play size={24} />}
                                    {label}
                                </button>
                            );
                        })
                    )}
                </div>

                <div className="flex justify-center pt-8">
                    <button onClick={onExit} className="text-gray-500 hover:text-gray-700 underline">Cancelar</button>
                </div>
            </div>
        );
    }

    // 3. Score / Results
    if (currentState === 'finished') {
        const percentage = Math.round((score / activeQuestions.length) * 100);
        const incorrectQuestions = activeQuestions.filter(q => answers[q.id] !== q.correct_option);

        return (
            <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
                <header className="text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-2xl font-bold mb-6">Resultados</h2>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                            <div className="text-sm text-gray-500 uppercase font-bold tracking-wider">Puntuación</div>
                            <div className="text-4xl font-black text-forest-600">{score} <span className="text-xl text-gray-400">/ {activeQuestions.length}</span></div>
                        </div>
                        <div className="text-center border-l border-r border-gray-100 dark:border-gray-700">
                            <div className="text-sm text-gray-500 uppercase font-bold tracking-wider">Tempo</div>
                            <div className="text-4xl font-mono font-bold text-gray-700 dark:text-gray-300">{formatTime(elapsedSeconds)}</div>
                        </div>
                        <div className="text-center">
                            <div className="text-sm text-gray-500 uppercase font-bold tracking-wider">Nota</div>
                            <div className={`text-4xl font-black ${percentage >= (mode === 'practical' ? 50 : 50) ? 'text-green-500' : 'text-red-500'}`}>
                                {mode === 'practical' || mode === 'official'
                                    ? ((score * 0.5) - (incorrectQuestions.length * 0.125)).toFixed(2) + (mode === 'practical' ? ' / 20' : ' / 40')
                                    : percentage + '%'
                                }
                            </div>
                        </div>
                    </div>
                </header>

                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300 text-lg">
                        <AlertTriangle size={20} className="text-yellow-500" />
                        Preguntas falladas ({incorrectQuestions.length})
                    </h3>

                    {incorrectQuestions.length === 0 ? (
                        <div className="p-8 bg-green-50 text-green-700 rounded-xl text-center border border-green-100">
                            <CheckCircle size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="text-xl font-bold">¡Perfecto!</p>
                            <p>Non tiveches ningún fallo.</p>
                        </div>
                    ) : (
                        incorrectQuestions.map((q) => (
                            <Card key={q.id} className="border-l-4 border-l-red-500 overflow-hidden">
                                <CardContent className="pt-6">
                                    <p className="font-medium text-lg mb-4 text-gray-800 dark:text-gray-200">{q.question_text}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="p-3 bg-red-50 text-red-700 rounded-lg flex items-start gap-2">
                                            <XCircle size={16} className="mt-0.5 shrink-0" />
                                            <div>
                                                <span className="font-bold block text-xs uppercase mb-1">A túa resposta</span>
                                                {answers[q.id] ? (q as any)[`option_${answers[q.id]}`] : 'Sen responder'}
                                            </div>
                                        </div>
                                        <div className="p-3 bg-green-50 text-green-700 rounded-lg flex items-start gap-2">
                                            <CheckCircle size={16} className="mt-0.5 shrink-0" />
                                            <div>
                                                <span className="font-bold block text-xs uppercase mb-1">Resposta correcta</span>
                                                {(q as any)[`option_${q.correct_option}`] || <span className="text-xs text-red-500 font-mono">Erro: Opción '{q.correct_option}' non atopada</span>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end">
                                        <button
                                            onClick={onReviewTopic}
                                            className="text-sm font-medium text-forest-600 hover:text-forest-800 flex items-center gap-1"
                                        >
                                            Ver no temario <ArrowRight size={14} />
                                        </button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>

                <div className="flex justify-center gap-4 pt-8 pb-12">
                    <button
                        onClick={onExit}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                    >
                        Volver ao menú
                    </button>
                    <button
                        onClick={retryTest}
                        className="px-8 py-3 bg-forest-600 text-white rounded-xl hover:bg-forest-700 transition font-bold shadow-lg shadow-forest-200 dark:shadow-none flex items-center gap-2"
                    >
                        <RotateCcw size={18} />
                        Repetir Test
                    </button>
                </div>
            </div>
        );
    }

    // 4. Playing
    const currentQ = activeQuestions[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / activeQuestions.length) * 100;
    const isAnswered = !!answers[currentQ.id];
    const isLast = currentQuestionIndex === activeQuestions.length - 1;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Scenario Narrative (if exists) */}
            {currentQ.scenarios && (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-forest-100 dark:border-forest-900/30 rounded-3xl p-8 shadow-xl shadow-forest-500/5 animate-in fade-in slide-in-from-top-6 duration-700">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-forest-100 dark:bg-forest-900/50 rounded-xl flex items-center justify-center text-forest-600">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h3 className="text-[10px] font-black text-forest-600 dark:text-forest-400 uppercase tracking-[0.2em]">
                                Escenario de Exame
                            </h3>
                            <h4 className="font-bold text-gray-900 dark:text-white leading-tight">
                                {currentQ.scenarios.title}
                            </h4>
                        </div>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-medium leading-relaxed text-lg border-l-4 border-forest-500 dark:border-forest-600 pl-8 py-2 italic selection:bg-forest-100 dark:selection:bg-forest-900/50">
                        {currentQ.scenarios.content}
                    </div>
                </div>
            )}
            {/* Playing Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">
                        {mode === 'clinic' ? 'Clínica de Erros' : 'Test en curso'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {currentQuestionIndex + 1} / {activeQuestions.length}
                        </div>
                        {currentQ.topic_name && (
                            <span className="text-[10px] bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded font-bold uppercase tracking-tight">
                                {currentQ.topic_name}
                            </span>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2 text-forest-700 bg-forest-50 px-3 py-1.5 rounded-lg border border-forest-100">
                    <Clock size={16} />
                    <span className="font-mono font-bold">{formatTime(elapsedSeconds)}</span>
                </div>
            </div>

            {/* Progress */}
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div
                    className="h-full bg-forest-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Question Card */}
            <Card className="min-h-[400px] flex flex-col shadow-lg border-t-4 border-t-forest-500">
                <CardContent className="pt-8 flex flex-col h-full">
                    <h3 className="text-xl font-medium mb-8 text-gray-900 dark:text-gray-100 leading-relaxed">
                        {currentQ.question_text}
                    </h3>

                    <div className="space-y-3 flex-1">
                        {['a', 'b', 'c', 'd'].map((opt) => {
                            const isSelected = answers[currentQ.id] === opt;
                            const isCorrect = currentQ.correct_option === opt;

                            // Determine style based on state
                            let styleClass = "border-gray-200 hover:border-forest-300 hover:bg-gray-50 text-gray-700";
                            let icon = null;

                            if (isAnswered) {
                                if (isSelected && isCorrect) {
                                    styleClass = "border-green-500 bg-green-50 text-green-900 font-medium ring-1 ring-green-500";
                                    icon = <CheckCircle size={18} className="text-green-600" />;
                                } else if (isSelected && !isCorrect) {
                                    styleClass = "border-red-500 bg-red-50 text-red-900 ring-1 ring-red-500";
                                    icon = <XCircle size={18} className="text-red-600" />;
                                } else if (isCorrect) {
                                    // Show correct answer even if not selected
                                    styleClass = "border-green-500 bg-white text-green-700 border-dashed";
                                    icon = <CheckCircle size={18} className="text-green-600 opacity-50" />;
                                } else {
                                    styleClass = "opacity-50 border-gray-100 bg-gray-50 text-gray-400";
                                }
                            }

                            return (
                                <button
                                    key={opt}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={isAnswered}
                                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-center justify-between gap-4 ${styleClass}`}
                                >
                                    <div className="flex items-start gap-3">
                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold uppercase shrink-0 mt-0.5 ${isAnswered && (isCorrect || isSelected) ? 'bg-white/50' : 'bg-gray-100 text-gray-500'}`}>
                                            {opt}
                                        </span>
                                        <span>{(currentQ as any)[`option_${opt}`]}</span>
                                    </div>
                                    {icon}
                                </button>
                            );
                        })}
                    </div>

                    {/* Footer / Next Button */}
                    <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-800 flex justify-end min-h-[3rem]">
                        {isAnswered && (
                            <button
                                onClick={nextQuestion}
                                className="animate-in fade-in slide-in-from-bottom-2 duration-200 flex items-center gap-2 px-6 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition shadow-lg shadow-forest-200 dark:shadow-none"
                            >
                                <span className="font-bold">{isLast ? 'Ver Resultados' : 'Seguinte'}</span>
                                <ArrowRight size={18} />
                            </button>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
