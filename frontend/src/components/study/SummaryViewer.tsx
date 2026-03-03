import React, { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, ChevronRight, CheckCircle, X, BookOpen, AlertTriangle, Lightbulb, FileText } from 'lucide-react';
import Mermaid from './Mermaid';
import type { TopicDefinition } from '../../constants/topicRegistry';

interface SummaryViewerProps {
    topic: TopicDefinition;
    onClose: () => void;
}

type SlideType = 'cover' | 'section' | 'content';

interface SlideData {
    id: number;
    type: SlideType;
    title?: string;
    content: string;
}

export const SummaryViewer: React.FC<SummaryViewerProps> = ({ topic, onClose }) => {
    const [slides, setSlides] = useState<SlideData[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Process markdown into slides (Optimized to merge headers with content)
    const processContent = useCallback((text: string) => {
        // Normalize line endings and trim trailing whitespace
        const normalizedText = text.replace(/\r\n/g, '\n').split('\n').map(l => l.trimEnd()).join('\n');
        const lines = normalizedText.split('\n');
        const newSlides: SlideData[] = [];
        let currentBuffer: string[] = [];
        let currentType: SlideType = 'content';
        let currentTitle = topic.title; // Start with topic title as default

        const pushSlide = (type: SlideType, contentLines: string[], title?: string) => {
            const contentJoined = contentLines.join('\n').trim();
            if (contentJoined.length === 0 && type === 'content' && !title) return;

            newSlides.push({
                id: newSlides.length,
                type,
                title: title || currentTitle,
                content: contentJoined
            });
        };

        lines.forEach((line) => {
            const trimmedLine = line.trim();

            // Document Title (Cover)
            if (trimmedLine.startsWith('# ')) {
                pushSlide(currentType, currentBuffer, currentTitle);
                currentBuffer = [];
                pushSlide('cover', [], trimmedLine.replace('# ', ''));
                currentTitle = topic.title;
                return;
            }

            // Segment Headers (##, ###, ####) - Trigger new slide
            if (trimmedLine.startsWith('## ') || trimmedLine.startsWith('### ') || trimmedLine.startsWith('#### ')) {
                pushSlide(currentType, currentBuffer, currentTitle);
                currentBuffer = [];
                currentTitle = trimmedLine.replace(/^#+\s/, '');
                currentType = 'content';
                return;
            }

            // List handling - Ensure newline before lists for better parser detection
            if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ') || /^\d+\.\s/.test(trimmedLine)) {
                if (currentBuffer.length > 0 && currentBuffer[currentBuffer.length - 1].trim() !== '' && !currentBuffer[currentBuffer.length - 1].startsWith('-')) {
                    currentBuffer.push('');
                }
            }

            currentBuffer.push(line);

            // Chunking for readability (If slide gets too long)
            const currentText = currentBuffer.join('\n');
            const isInTable = trimmedLine.startsWith('|');
            const isInCode = currentText.split('```').length % 2 === 0;

            if (currentText.length > 1800 && !isInTable && !isInCode && (trimmedLine === '' || trimmedLine.endsWith('.') || trimmedLine.endsWith(':'))) {
                if (currentText.trim().length > 100) {
                    pushSlide(currentType, currentBuffer, currentTitle);
                    currentBuffer = [];
                    // Title stays the same for continuation
                }
            }
        });

        pushSlide(currentType, currentBuffer, currentTitle);
        setSlides(newSlides.filter(s => s.content.length > 0 || s.type === 'cover'));
    }, [topic.title]);

    useEffect(() => {
        const fetchSummary = async () => {
            setLoading(true);
            try {
                // Fetch from /resumenes/ using slug
                const response = await fetch(`/resumenes/${topic.slug}.md`);
                if (!response.ok) throw new Error('Resumo non atopado');
                const text = await response.text();

                // Safety check: Avoid rendering index.html if Vite returns it as a fallback
                if (text.trim().toLowerCase().startsWith('<!doctype html') || text.trim().toLowerCase().startsWith('<html')) {
                    throw new Error('Resumo en proceso de actualización');
                }

                processContent(text);
                setCurrentSlideIndex(0);
            } catch (err) {
                console.error(err);
                setError('Este tema aínda non ten un resumo premium. Estamos traballando nel!');
            } finally {
                setLoading(false);
            }
        };

        fetchSummary();
    }, [topic, processContent]);

    const nextSlide = useCallback(() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1)), [slides.length]);
    const prevSlide = useCallback(() => setCurrentSlideIndex(prev => Math.max(0, prev - 1)), []);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') nextSlide();
            if (e.key === 'ArrowLeft') prevSlide();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [nextSlide, prevSlide]);

    if (loading) return (
        <div className="flex bg-white dark:bg-gray-900 rounded-3xl h-96 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
        </div>
    );

    if (error) return (
        <div className="flex h-96 items-center justify-center flex-col text-center p-8 bg-white dark:bg-gray-900 rounded-3xl border border-red-100">
            <AlertTriangle size={48} className="text-red-500 mb-4" />
            <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">{error}</p>
            <button onClick={onClose} className="mt-6 px-6 py-2 bg-forest-600 text-white rounded-lg">Volver</button>
        </div>
    );

    const currentSlide = slides[currentSlideIndex];
    if (!currentSlide) return null;
    const progress = ((currentSlideIndex + 1) / slides.length) * 100;

    return (
        <div className="flex flex-col h-[85vh] w-full max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-3xl overflow-hidden relative shadow-2xl border border-forest-100 dark:border-forest-900/30 animate-in fade-in zoom-in duration-300">

            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center gap-4 bg-gradient-to-b from-black/20 to-transparent">
                <button onClick={onClose} className="text-gray-800 dark:text-white/80 hover:text-forest-600 transition-colors bg-white/50 dark:bg-black/20 p-2 rounded-full backdrop-blur-md">
                    <X size={20} />
                </button>
                <div className="flex-1 h-1.5 bg-gray-200 dark:bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-forest-500 transition-all duration-300 shadow-[0_0_8px_rgba(34,197,94,0.4)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-forest-600 text-white rounded-full">
                    RESUMO: {currentSlideIndex + 1} / {slides.length}
                </span>
            </div>

            {/* Slide Content */}
            <div className="flex-1 relative overflow-y-auto scrollbar-none">
                <div className="min-h-full flex flex-col justify-center p-8 md:p-16">
                    {currentSlide.type === 'cover' && (
                        <div className="text-center space-y-4 animate-in fade-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-forest-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                                <FileText size={32} />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter leading-tight px-4">
                                {currentSlide.title}
                            </h1>
                            <div className="w-20 h-1.5 bg-forest-500 mx-auto rounded-full" />
                            <p className="text-forest-600 font-bold tracking-[0.3em] uppercase text-xs">Resumo de Excelencia</p>
                        </div>
                    )}

                    {currentSlide.type === 'content' && (
                        <div className="flex flex-col h-full animate-in fade-in duration-300">
                            {/* Integrated Header - Top Aligned */}
                            {currentSlide.title && (
                                <div className="flex-none mb-8 border-b-2 border-forest-100 dark:border-forest-900/30 pb-4">
                                    <h2 className="text-2xl md:text-3xl font-black text-forest-700 dark:text-forest-200 uppercase tracking-tight">
                                        {currentSlide.title}
                                    </h2>
                                </div>
                            )}

                            {/* Centered Content Area */}
                            <div className="flex-1 flex flex-col justify-center">
                                <article className="prose prose-xl dark:prose-invert max-w-none w-full
                                             prose-headings:text-forest-600 dark:prose-headings:text-forest-300 
                                             prose-headings:font-bold
                                             prose-p:text-lg md:prose-p:text-xl
                                             prose-p:text-gray-900 dark:prose-p:text-gray-100
                                             prose-p:leading-relaxed
                                             prose-li:text-base md:prose-li:text-lg
                                             prose-li:text-gray-900 dark:prose-li:text-gray-100
                                             prose-li:leading-relaxed
                                             prose-li:leading-relaxed
                                             prose-ul:list-disc prose-ul:pl-8
                                             prose-ol:list-decimal prose-ol:pl-8
                                             prose-strong:text-forest-700 dark:prose-strong:text-forest-400
                                             prose-strong:font-black
                                             prose-table:block prose-table:overflow-x-auto prose-table:w-full prose-table:text-xl prose-table:my-8
                                             prose-th:bg-forest-50 dark:prose-th:bg-forest-900/40 prose-th:p-4 prose-th:text-forest-800 dark:prose-th:text-forest-100 prose-th:font-black prose-th:min-w-[200px]
                                             prose-td:p-4 prose-td:border-b prose-td:border-forest-100 dark:prose-td:border-forest-900/30 prose-td:min-w-[200px]
                                             ">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, className, children, ...props }) {
                                                const match = /language-mermaid/.exec(className || '');
                                                if (match) return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                                                return <code className="bg-forest-100 dark:bg-forest-900/50 px-2 py-0.5 rounded text-forest-800 dark:text-forest-200 font-bold" {...props}>{children}</code>;
                                            },
                                            blockquote({ children }) {
                                                const content = React.Children.toArray(children);
                                                const textContent = content.map(c => typeof c === 'string' ? c : (c as any).props?.children).join('');

                                                if (textContent.includes('[!IMPORTANT]')) {
                                                    return (
                                                        <div className="my-8 p-8 border-l-[12px] border-red-500 bg-red-50 dark:bg-red-900/20 rounded-3xl shadow-md animate-pulse-subtle">
                                                            <div className="flex items-center gap-4 mb-4 text-red-700 dark:text-red-400 font-black uppercase text-lg tracking-widest">
                                                                <AlertTriangle size={28} />
                                                                <span>Crítico / IMPORTANTE</span>
                                                            </div>
                                                            <div className="text-gray-900 dark:text-gray-100 text-lg md:text-xl leading-relaxed">
                                                                {React.Children.map(children, child => {
                                                                    if (typeof child === 'string') return child.replace('[!IMPORTANT]', '');
                                                                    const pChild = child as any;
                                                                    if (pChild.props?.children) {
                                                                        return React.cloneElement(pChild, {
                                                                            children: React.Children.map(pChild.props.children, c =>
                                                                                typeof c === 'string' ? c.replace('[!IMPORTANT]', '') : c
                                                                            )
                                                                        });
                                                                    }
                                                                    return child;
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (textContent.includes('[!NOTE]')) {
                                                    return (
                                                        <div className="my-8 p-8 border-l-[12px] border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded-3xl shadow-md">
                                                            <div className="flex items-center gap-4 mb-4 text-blue-700 dark:text-blue-400 font-black uppercase text-lg tracking-widest">
                                                                <BookOpen size={28} />
                                                                <span>Nota Explicativa</span>
                                                            </div>
                                                            <div className="text-gray-900 dark:text-gray-100 text-lg md:text-xl leading-relaxed">
                                                                {React.Children.map(children, child => {
                                                                    if (typeof child === 'string') return child.replace('[!NOTE]', '');
                                                                    const pChild = child as any;
                                                                    if (pChild.props?.children) {
                                                                        return React.cloneElement(pChild, {
                                                                            children: React.Children.map(pChild.props.children, c =>
                                                                                typeof c === 'string' ? c.replace('[!NOTE]', '') : c
                                                                            )
                                                                        });
                                                                    }
                                                                    return child;
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                if (textContent.includes('[!TIP]')) {
                                                    return (
                                                        <div className="my-8 p-8 border-l-[12px] border-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-3xl shadow-md">
                                                            <div className="flex items-center gap-4 mb-4 text-amber-700 dark:text-amber-400 font-black uppercase text-lg tracking-widest">
                                                                <Lightbulb size={28} />
                                                                <span>Consello de Estudo</span>
                                                            </div>
                                                            <div className="text-gray-900 dark:text-gray-100 text-lg md:text-xl leading-relaxed">
                                                                {React.Children.map(children, child => {
                                                                    if (typeof child === 'string') return child.replace('[!TIP]', '');
                                                                    const pChild = child as any;
                                                                    if (pChild.props?.children) {
                                                                        return React.cloneElement(pChild, {
                                                                            children: React.Children.map(pChild.props.children, c =>
                                                                                typeof c === 'string' ? c.replace('[!TIP]', '') : c
                                                                            )
                                                                        });
                                                                    }
                                                                    return child;
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                }
                                                return <blockquote className="border-l-[12px] border-forest-200 pl-8 py-4 italic text-gray-600 dark:text-gray-400 text-2xl md:text-3xl my-8">{children}</blockquote>;
                                            }
                                        }}
                                    >
                                        {currentSlide.content}
                                    </ReactMarkdown>
                                </article>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Overlay */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center pointer-events-none">
                <button
                    onClick={prevSlide}
                    disabled={currentSlideIndex === 0}
                    className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 pointer-events-auto disabled:opacity-0 transition-opacity"
                >
                    <ChevronLeft size={24} />
                </button>

                {currentSlideIndex === slides.length - 1 ? (
                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-forest-600 text-white rounded-2xl shadow-xl font-bold flex items-center gap-2 pointer-events-auto transform hover:scale-105 transition-transform"
                    >
                        <CheckCircle size={20} />
                        <span>Finalizar</span>
                    </button>
                ) : (
                    <button
                        onClick={nextSlide}
                        className="p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 pointer-events-auto transition-transform hover:translate-x-1"
                    >
                        <ChevronRight size={24} />
                    </button>
                )}
            </div>
        </div>
    );
};
