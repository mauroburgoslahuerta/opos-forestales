import { useState, useEffect } from 'react';
import { TestRunner } from '../components/test/TestRunner';
import { TOPIC_REGISTRY } from '../constants/topicRegistry';
import { ArrowLeft, BookOpen, Clock, AlertCircle, Play, Loader2, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { supabase } from '../lib/supabase';

type Mode = 'intro' | 'playing';

interface Scenario {
    id: string;
    title: string;
    content: string;
}

export const PracticalCasePage = () => {
    const [mode, setMode] = useState<Mode>('intro');
    const [scenarios, setScenarios] = useState<Scenario[]>([]);
    const [loading, setLoading] = useState(true);

    const [selectedScenarioId, setSelectedScenarioId] = useState<string | undefined>();

    useEffect(() => {
        async function fetchScenarios() {
            try {
                const { data } = await supabase
                    .from('scenarios')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (data) setScenarios(data);
            } catch (err) {
                console.error("Error fetching scenarios:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchScenarios();
    }, []);

    // Filter all specific topics
    const specificTopics = Object.values(TOPIC_REGISTRY).filter(t => t.category === 'specific');

    const handleStart = (scenarioId?: string) => {
        setSelectedScenarioId(scenarioId);
        setMode('playing');
    };

    const handleExit = () => {
        setSelectedScenarioId(undefined);
        setMode('intro');
    };

    if (mode === 'playing') {
        return (
            <div className="space-y-6">
                <header>
                    <button
                        onClick={handleExit}
                        className="self-start flex items-center gap-2 text-forest-600 hover:text-forest-800 dark:text-forest-400 dark:hover:text-forest-200 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Abandonar Simulacro</span>
                    </button>
                </header>

                <TestRunner
                    topics={specificTopics}
                    mode="practical"
                    scenarioId={selectedScenarioId}
                    onExit={handleExit}
                    onReviewTopic={() => { }}
                />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
            <header className="space-y-4">
                <h1 className="text-4xl font-black text-forest-900 dark:text-forest-50 flex items-center gap-3">
                    <BookOpen size={36} className="text-forest-600" />
                    Segundo Exercicio: Caso Práctico
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    Simulacro oficial baseado na convocatoria de Bombeiro Forestal C2.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="pt-8 space-y-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 italic">Instrucións do Exame</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1"><Clock size={18} /></div>
                                        <div>
                                            <p className="font-bold text-sm">Tempo e Estrutura</p>
                                            <p className="text-sm">40 preguntas (30 min aprox) baseadas na parte específica.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-forest-100 rounded-lg text-forest-600 mt-1"><AlertCircle size={18} /></div>
                                        <div>
                                            <p className="font-bold text-sm">Puntuación</p>
                                            <p className="text-sm">Acerto: <span className="text-forest-600 font-bold">+0.5</span>. Erro: <span className="text-red-500 font-bold">-0.125</span>.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
                                    <p className="text-amber-800 dark:text-amber-200 text-sm font-medium">
                                        <span className="font-black">NOTA MINIMA:</span> Para superar este exercicio debes obter polo menos 10 puntos netos de 20 posibles.
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => handleStart()}
                                className="w-full py-4 bg-forest-600 text-white rounded-xl font-black text-xl hover:bg-forest-700 transition shadow-xl shadow-forest-200 dark:shadow-none transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
                            >
                                <Play fill="currentColor" />
                                Iniciar Simulacro Aleatorio
                            </button>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                                <div className="w-8 h-1 bg-forest-500 rounded-full" />
                                Supostos do Banco Oficial
                            </h3>
                            <span className="bg-forest-100 dark:bg-forest-900/30 text-forest-600 dark:text-forest-400 text-xs font-bold px-3 py-1 rounded-full border border-forest-200/50">
                                {scenarios.length} DISPOÑIBLES
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="animate-spin text-forest-500" size={40} />
                            </div>
                        ) : scenarios.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {scenarios.map((s) => (
                                    <button
                                        key={s.id}
                                        className="group relative p-8 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl hover:shadow-forest-500/10 hover:border-forest-500/50 transition-all duration-300 text-left overflow-hidden translate-y-0 hover:-translate-y-1"
                                        onClick={() => handleStart(s.id)}
                                    >
                                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                                            <Play className="text-forest-500" size={48} />
                                        </div>

                                        <div className="relative z-10">
                                            <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-full text-[10px] font-black tracking-widest text-gray-400 group-hover:text-forest-500 transition-colors uppercase">
                                                <Clock size={12} />
                                                30-40 MIN
                                            </div>

                                            <h4 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-forest-600 transition-colors mb-4 leading-tight">
                                                {s.title}
                                            </h4>

                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-6 font-medium leading-relaxed">
                                                {s.content}
                                            </p>

                                            <div className="flex items-center text-forest-600 font-bold text-sm gap-2">
                                                Comezar agora
                                                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-16 text-center bg-gray-50 dark:bg-gray-900/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
                                <div className="max-w-xs mx-auto space-y-4">
                                    <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center mx-auto text-gray-400">
                                        <BookOpen size={32} />
                                    </div>
                                    <p className="text-gray-400 font-bold">Aínda non hai supostos cargados individualmente.</p>
                                    <p className="text-sm text-gray-400/60">Usa o simulacro aleatorio para practicar coas preguntas existentes ata que carguemos novos casos.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="font-bold text-gray-500 uppercase text-[10px] tracking-widest mb-4">Temas da Parte Específica</h3>
                        <div className="space-y-2">
                            {specificTopics.map(t => (
                                <div key={t.id} className="text-xs flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <div className="w-1 h-1 bg-forest-400 rounded-full" />
                                    {t.title}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
