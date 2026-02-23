import { useState } from 'react';
import { TestRunner } from '../components/test/TestRunner';
import { TOPIC_REGISTRY } from '../constants/topicRegistry';
import { ArrowLeft, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';

type Mode = 'intro' | 'playing';

export const OfficialExamPage = () => {
    const [mode, setMode] = useState<Mode>('intro');

    // Filter all topics for the registry
    const allTopics = Object.values(TOPIC_REGISTRY);

    const handleStart = () => {
        setMode('playing');
    };

    const handleExit = () => {
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
                    topics={allTopics}
                    mode="official"
                    onExit={handleExit}
                    onReviewTopic={() => { }}
                />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header className="space-y-4">
                <h1 className="text-4xl font-black text-forest-900 dark:text-forest-50 flex items-center gap-3">
                    <BookOpen size={36} className="text-forest-600" />
                    Primeiro Exercicio: Teoría
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">
                    Simulacro completo de 80 preguntas (20 Comúns + 60 Específicas).
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-2">
                    <CardContent className="pt-8 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 italic">Instrucións do Exame</h2>

                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1"><Clock size={20} /></div>
                                <div>
                                    <p className="font-bold">Tempo e Estrutura</p>
                                    <p>O cuestionario consta de <strong>80 preguntas</strong> tipo test:</p>
                                    <ul className="list-disc list-inside ml-2 text-sm mt-1">
                                        <li>20 correspondentes á parte xeral.</li>
                                        <li>60 correspondentes á parte específica.</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-forest-100 rounded-lg text-forest-600 mt-1"><AlertCircle size={20} /></div>
                                <div>
                                    <p className="font-bold">Puntuación e Penalización</p>
                                    <p>Cada resposta correcta suma <span className="text-forest-600 font-bold">0.5 puntos</span>. As respostas incorrectas penalizan <span className="text-red-500 font-bold">-0.125 puntos</span> (1/4 de acerto).</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-amber-100 rounded-lg text-amber-600 mt-1"><AlertCircle size={20} /></div>
                                <div>
                                    <p className="font-bold">Criterio de Aprobado</p>
                                    <p>Necesitas obter polo menos <span className="font-bold underline">20 puntos de 40</span> totais para superar o exercicio.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleStart}
                                className="w-full py-4 bg-forest-600 text-white rounded-xl font-black text-xl hover:bg-forest-700 transition shadow-xl shadow-forest-200 dark:shadow-none transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Iniciar Simulacro Teórico
                            </button>
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-6 text-sm">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-500 uppercase text-xs tracking-widest mb-4">Reparto de Preguntas</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-forest-600 font-bold">20 Preguntas</span> Comúns (Parte Xeral)
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="w-[25%] h-full bg-forest-400" />
                            </div>
                            <div>
                                <span className="text-forest-600 font-bold">60 Preguntas</span> Específicas
                            </div>
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="w-[75%] h-full bg-forest-600" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
