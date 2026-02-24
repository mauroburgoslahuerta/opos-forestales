import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { TopicSelector } from '../components/study/TopicSelector';
import { SlideViewer } from '../components/study/SlideViewer';
import { SummaryViewer } from '../components/study/SummaryViewer';
import { TestRunner } from '../components/test/TestRunner';
import type { TopicDefinition } from '../constants/topicRegistry';
import { ArrowLeft, X, FileText, Loader2 } from 'lucide-react';

type StudyMode = 'list' | 'study' | 'test' | 'clinic' | 'summary';

export const StudyPage = () => {
    const [mode, setMode] = useState<StudyMode>('list');
    const [selectedTopic, setSelectedTopic] = useState<TopicDefinition | null>(null);
    const [clinicQuestions, setClinicQuestions] = useState<any[]>([]);
    const [loadingClinic, setLoadingClinic] = useState(false);
    const [selectedDocIndex, setSelectedDocIndex] = useState<number>(0);
    const [showDocSelector, setShowDocSelector] = useState(false);
    const [topicToSelectDoc, setTopicToSelectDoc] = useState<TopicDefinition | null>(null);

    const handleStudy = (topic: TopicDefinition) => {
        if (topic.documents && topic.documents.length > 1) {
            setTopicToSelectDoc(topic);
            setShowDocSelector(true);
        } else {
            handleStartStudy(topic, 0);
        }
    };

    const handleStartStudy = (topic: TopicDefinition, docIndex: number) => {
        setSelectedDocIndex(docIndex);
        setSelectedTopic(topic);
        setMode('study');
        setShowDocSelector(false);
        setTopicToSelectDoc(null);
    };

    const handleTest = (topic: TopicDefinition) => {
        setSelectedTopic(topic);
        setMode('test');
    };

    const handleSummary = (topic: TopicDefinition) => {
        setSelectedTopic(topic);
        setMode('summary');
    };

    const handleClinic = async (topic: TopicDefinition) => {
        setLoadingClinic(true);
        setSelectedTopic(topic);

        try {
            // Fetch failed questions for this topic
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: allProgress } = await supabase
                .from('user_progress')
                .select('question_id, is_correct, answered_at')
                .eq('user_id', user.id)
                .order('answered_at', { ascending: false });

            if (allProgress) {
                const latestByQuestion: Record<string, boolean> = {};
                allProgress.forEach((p: any) => {
                    if (latestByQuestion[p.question_id] === undefined) {
                        latestByQuestion[p.question_id] = p.is_correct;
                    }
                });

                const failedIds = Object.entries(latestByQuestion)
                    .filter(([_, isCorrect]) => !isCorrect)
                    .map(([id, _]) => id);

                if (failedIds.length > 0) {
                    const { data: questionData } = await supabase
                        .from('questions')
                        .select('*, topics(name)')
                        .eq('topic_id', topic.id)
                        .in('id', failedIds);

                    if (questionData) {
                        const mappedQuestions = questionData.map((q: any) => ({
                            ...q,
                            topic_name: q.topics?.name || topic.title
                        }));
                        setClinicQuestions(mappedQuestions);
                        setMode('clinic');
                    } else {
                        // Topic has no failures to show (already cured in other session)
                        alert("Non tes fallos neste tema!");
                    }
                }
            }
        } catch (err) {
            console.error('Error fetching topic clinic:', err);
        } finally {
            setLoadingClinic(false);
        }
    };

    const handleBackToList = () => {
        setMode('list');
        setSelectedTopic(null);
        setClinicQuestions([]);
    };

    return (
        <div className="space-y-6">
            {/* Header / Breadcrumb */}
            <header className="flex flex-col gap-4">
                {mode === 'list' ? (
                    <>
                        <h1 className="text-3xl font-bold text-forest-800 dark:text-forest-100">
                            Modo Estudo
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                            Selecciona un tema para repasar o contido teórico ou realizar un test específico.
                            Os tests neste modo non mostran as respostas ata o final.
                        </p>
                    </>
                ) : (
                    <button
                        onClick={handleBackToList}
                        className="self-start flex items-center gap-2 text-forest-600 hover:text-forest-800 dark:text-forest-400 dark:hover:text-forest-200 transition-colors"
                    >
                        <ArrowLeft size={20} />
                        <span>Volver ao listado</span>
                    </button>
                )}
            </header>

            <div className="mt-8">
                {loadingClinic && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                        <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-4">
                            <Loader2 className="animate-spin text-forest-600" size={32} />
                            <p className="font-bold text-forest-800">Cargando a túa clínica...</p>
                        </div>
                    </div>
                )}
                {mode === 'list' && (
                    <TopicSelector
                        onStudy={handleStudy}
                        onTest={handleTest}
                        onClinic={handleClinic}
                        onSummary={handleSummary}
                    />
                )}

                {mode === 'study' && selectedTopic && (
                    <SlideViewer
                        topic={selectedTopic}
                        initialDocIndex={selectedDocIndex}
                        onFinish={handleBackToList}
                    />
                )}

                {mode === 'test' && selectedTopic && (
                    <TestRunner
                        topic={selectedTopic}
                        onExit={handleBackToList}
                        onReviewTopic={() => handleStudy(selectedTopic)}
                    />
                )}

                {mode === 'clinic' && selectedTopic && (
                    <TestRunner
                        questions={clinicQuestions}
                        mode="clinic"
                        onExit={handleBackToList}
                        onComplete={handleBackToList}
                    />
                )}

                {mode === 'summary' && selectedTopic && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="w-full max-w-5xl">
                            <SummaryViewer
                                topic={selectedTopic}
                                onClose={handleBackToList}
                            />
                        </div>
                    </div>
                )}

                {/* Document Selector Modal */}
                {showDocSelector && topicToSelectDoc && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <FileText className="text-forest-600" />
                                        Selecciona un documento
                                    </h3>
                                    <button
                                        onClick={() => { setShowDocSelector(false); setTopicToSelectDoc(null); }}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {/* Principal docs first */}
                                    {topicToSelectDoc.documents?.some(d => d.isPrincipal) && (
                                        <>
                                            <p className="text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-forest-400 px-1 mb-1">★ Temario Oficial</p>
                                            {topicToSelectDoc.documents?.map((doc: any, idx: number) => doc.isPrincipal && (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleStartStudy(topicToSelectDoc, idx)}
                                                    className="w-full text-left p-4 rounded-xl border-2 border-forest-300 dark:border-forest-700 bg-forest-50 dark:bg-forest-900/20 hover:border-forest-500 hover:bg-forest-100 dark:hover:bg-forest-900/40 transition-all flex items-center justify-between group"
                                                >
                                                    <span className="font-semibold text-forest-800 dark:text-forest-200 group-hover:text-forest-700">
                                                        {doc.title}
                                                    </span>
                                                    <ArrowLeft size={16} className="text-forest-500 rotate-180 transition-opacity" />
                                                </button>
                                            ))}
                                            {topicToSelectDoc.documents?.some(d => !d.isPrincipal) && (
                                                <div className="flex items-center gap-2 pt-2 pb-1">
                                                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 whitespace-nowrap">Documentación Complementaria</p>
                                                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                                                </div>
                                            )}
                                            {topicToSelectDoc.documents?.map((doc: any, idx: number) => !doc.isPrincipal && (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleStartStudy(topicToSelectDoc, idx)}
                                                    className="w-full text-left p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-between group"
                                                >
                                                    <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                                                        {doc.title}
                                                    </span>
                                                    <ArrowLeft size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 rotate-180 transition-opacity" />
                                                </button>
                                            ))}
                                        </>
                                    )}
                                    {/* Fallback: no isPrincipal flags — flat list */}
                                    {!topicToSelectDoc.documents?.some(d => d.isPrincipal) && topicToSelectDoc.documents?.map((doc: any, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleStartStudy(topicToSelectDoc, idx)}
                                            className="w-full text-left p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-forest-500 hover:bg-forest-50 dark:hover:bg-forest-900/20 transition-all flex items-center justify-between group"
                                        >
                                            <span className="font-medium text-gray-800 dark:text-gray-200 group-hover:text-forest-700 dark:group-hover:text-forest-300">
                                                {doc.title}
                                            </span>
                                            <ArrowLeft size={16} className="text-forest-500 opacity-0 group-hover:opacity-100 rotate-180 transition-opacity" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
