import React, { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, ChevronRight, CheckCircle, X, BookOpen, AlertTriangle, Lightbulb } from 'lucide-react';
import Mermaid from './Mermaid';
import type { TopicDefinition } from '../../constants/topicRegistry';
// Card removed as it was unused


interface SlideViewerProps {
    topic: TopicDefinition;
    initialDocIndex?: number;
    onFinish: () => void;
}

type SlideType = 'cover' | 'section' | 'content';

interface SlideData {
    id: number;
    type: SlideType;
    title?: string;
    content: string;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({ topic, initialDocIndex, onFinish }) => {
    const [slides, setSlides] = useState<SlideData[]>([]);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [currentDocIndex, setCurrentDocIndex] = useState(initialDocIndex || 0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Process markdown into slides
    const processContent = useCallback((text: string) => {
        const lines = text.split('\n');
        const newSlides: SlideData[] = [];
        let currentBuffer: string[] = [];
        let currentType: SlideType = 'content';
        let currentTitle = '';

        // Helper to push a slide
        const pushSlide = (type: SlideType, contentLines: string[], title?: string) => {
            const contentJoined = contentLines.join('\n').trim();
            if (contentJoined.length === 0 && type === 'content' && !title) return;
            newSlides.push({
                id: newSlides.length,
                type,
                title,
                content: contentJoined
            });
        };

        lines.forEach((line) => {
            // Level 1: Main Title (Cover)
            if (line.startsWith('# ')) {
                // Push previous buffer
                pushSlide(currentType, currentBuffer, currentTitle);
                currentBuffer = [];
                // Push new cover
                pushSlide('cover', [], line.replace('# ', ''));
                currentType = 'content'; // Reset
                currentTitle = '';
                return;
            }

            // Level 2 and 3: Section Headers - Merged into content
            if (line.startsWith('## ') || line.startsWith('### ')) {
                pushSlide(currentType, currentBuffer, currentTitle);
                currentBuffer = [];
                currentTitle = line.replace(/^##+\s/, '');
                currentType = 'content';
                return;
            }

            // Level 4: Article -> Make it bold internally
            if (line.startsWith('#### ')) {
                currentBuffer.push(`**${line.replace('#### ', '')}**`);
                return;
            }

            // Normal line
            currentBuffer.push(line);

            // AUTO-CHUNKING: If buffer gets too long
            const currentText = currentBuffer.join('\n');
            if (currentText.length > 1200 && (line.trim() === '' || line.endsWith('.') || line.endsWith(':'))) {
                // Double check the buffer is not just a few words
                if (currentText.trim().length > 100) {
                    pushSlide(currentType, currentBuffer, currentTitle);
                    currentBuffer = [];
                    // Keep the same title for the next chunk to maintain context
                    if (currentTitle) {
                        currentTitle = currentTitle.includes('(Cont.)') ? currentTitle : `${currentTitle} (Cont.)`;
                    }
                }
            }
        });

        // Push remaining
        pushSlide(currentType, currentBuffer, currentTitle);

        // Filter empty slides (cleanup)
        const finalSlides = newSlides.filter(s => s.content.trim().length > 0 || s.type === 'cover');
        setSlides(finalSlides);
    }, []);

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            try {
                let fileToLoad = topic.sourceFile;
                if (topic.documents && topic.documents.length > 0) {
                    fileToLoad = topic.documents[currentDocIndex].file;
                }

                if (!fileToLoad) {
                    throw new Error('Agardando a que o equipo técnico suba os apuntamentos deste tema.');
                }
                const response = await fetch(fileToLoad);
                if (!response.ok) throw new Error('Failed to load topic content');
                const text = await response.text();

                if (text.trim().toLowerCase().startsWith('<!doctype html') || text.trim().toLowerCase().startsWith('<html')) {
                    throw new Error('Agardando a que o equipo técnico suba os apuntamentos deste tema.');
                }

                processContent(text);
                setCurrentSlideIndex(0);
            } catch (err: any) {
                console.error(err);
                setError(err.message || 'Erro ao cargar o temario. Por favor, inténteo de novo.');
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [topic, currentDocIndex, processContent]);

    const nextSlide = useCallback(() => {
        setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
    }, [slides.length]);

    const prevSlide = useCallback(() => {
        setCurrentSlideIndex(prev => Math.max(0, prev - 1));
    }, []);

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
        <div className="flex h-96 items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
        </div>
    );

    if (error) return (
        <div className="flex h-96 items-center justify-center flex-col text-red-500">
            <p className="text-lg font-semibold">{error}</p>
            <button onClick={onFinish} className="mt-4 text-forest-600 underline">Volver</button>
        </div>
    );

    const currentSlide = slides[currentSlideIndex];
    const isFirst = currentSlideIndex === 0;
    const isLast = currentSlideIndex === slides.length - 1;
    const progress = ((currentSlideIndex + 1) / slides.length) * 100;

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] max-h-[900px] w-full max-w-5xl mx-auto bg-gray-50 dark:bg-gray-900/50 rounded-2xl overflow-hidden relative shadow-xl border border-gray-200 dark:border-gray-800">

            {/* Top Bar: Progress & Close */}
            <div className="absolute top-0 left-0 right-0 z-20 p-4 flex items-center gap-4 bg-gradient-to-b from-black/50 to-black/10">
                <button onClick={onFinish} className="text-white/80 hover:text-white transition-colors">
                    <X size={24} />
                </button>

                {/* Document Selector Dropdown if multiple documents exist */}
                {topic.documents && topic.documents.length > 1 && (
                    <div className="flex items-center gap-2">
                        <select
                            value={currentDocIndex}
                            onChange={(e) => {
                                setCurrentDocIndex(Number(e.target.value));
                                setCurrentSlideIndex(0);
                            }}
                            className="bg-black/40 text-white/90 text-sm font-medium px-3 py-1.5 rounded-lg border border-white/20 backdrop-blur-md outline-none focus:ring-2 focus:ring-forest-500 cursor-pointer max-w-[220px] truncate"
                        >
                            {/* Principal docs first */}
                            {topic.documents.some(d => d.isPrincipal) && (
                                <optgroup label="── Temario Oficial ──" className="bg-gray-900 text-forest-400 font-bold">
                                    {topic.documents.map((doc, idx) => doc.isPrincipal && (
                                        <option key={idx} value={idx} className="bg-gray-900 text-white">
                                            ★ {doc.title}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                            {/* Complementario docs */}
                            {topic.documents.some(d => !d.isPrincipal) && (
                                <optgroup label="── Documentación Complementaria ──" className="bg-gray-900 text-gray-400">
                                    {topic.documents.map((doc, idx) => !doc.isPrincipal && (
                                        <option key={idx} value={idx} className="bg-gray-900 text-white/80">
                                            {doc.title}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                            {/* Fallback: no isPrincipal flags set — show all flat */}
                            {!topic.documents.some(d => d.isPrincipal) && topic.documents.map((doc, idx) => (
                                <option key={idx} value={idx} className="bg-gray-900 text-white">
                                    {doc.title}
                                </option>
                            ))}
                        </select>
                        {topic.documents[currentDocIndex]?.isPrincipal && (
                            <span className="text-xs bg-forest-500/80 text-white px-2 py-0.5 rounded-full font-semibold backdrop-blur-sm whitespace-nowrap">
                                ★ Oficial
                            </span>
                        )}
                    </div>
                )}

                <div className="flex-1 h-1.5 bg-white/30 rounded-full overflow-hidden backdrop-blur-sm">
                    <div
                        className="h-full bg-forest-400 transition-all duration-300 ease-out shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <span className="text-white/90 text-xs font-mono bg-black/40 px-2 py-1 rounded backdrop-blur-md">
                    {currentSlideIndex + 1} / {slides.length}
                </span>
            </div>

            {/* Slide Container */}
            <div className="flex-1 relative bg-white dark:bg-gray-900 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                {/* Content Render */}
                <div className="min-h-full flex flex-col justify-center p-8 md:p-16">

                    {currentSlide.type === 'cover' && (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="w-24 h-24 bg-forest-100 text-forest-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                                <BookOpen size={48} />
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-forest-900 dark:text-forest-100 uppercase tracking-tight leading-tight">
                                {currentSlide.title}
                            </h1>
                            <div className="w-32 h-2 bg-forest-500 mx-auto rounded-full" />
                            <p className="text-xl text-gray-500 max-w-2xl mx-auto mt-8">
                                Tema Oficial
                            </p>
                        </div>
                    )}

                    {currentSlide.type === 'section' && null}

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
                                <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-4xl mx-auto w-full
                                                 prose-headings:text-forest-800 dark:prose-headings:text-forest-100 
                                                 prose-headings:font-bold prose-headings:tracking-tight
                                                 prose-p:text-gray-600 dark:prose-p:text-gray-300 prose-p:leading-relaxed
                                                 prose-li:text-gray-600 dark:prose-li:text-gray-300
                                                 prose-strong:text-forest-700 dark:prose-strong:text-forest-300">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, className, children, ...props }) {
                                                const match = /language-mermaid/.exec(className || '');
                                                if (match) {
                                                    return <Mermaid chart={String(children).replace(/\n$/, '')} />;
                                                }
                                                return (
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                );
                                            },
                                            blockquote({ children }) {
                                                const text = React.Children.toArray(children).map(child =>
                                                    typeof child === 'string' ? child : (child as any)?.props?.children?.[0] || ''
                                                ).join('');

                                                if (text.includes('[!IMPORTANT]')) {
                                                    return (
                                                        <div className="my-6 p-4 border-l-4 border-red-500 bg-red-50 dark:bg-red-900/20 rounded-r-xl">
                                                            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-2">
                                                                <AlertTriangle size={20} />
                                                                <span>IMPORTANTE</span>
                                                            </div>
                                                            <div className="text-red-800 dark:text-red-200">
                                                                {React.Children.map(children, (child: any) => {
                                                                    if (child?.props?.children) {
                                                                        return React.cloneElement(child, {
                                                                            children: React.Children.map(child.props.children, (c: any) =>
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

                                                if (text.includes('[!TIP]')) {
                                                    return (
                                                        <div className="my-6 p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-900/20 rounded-r-xl">
                                                            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-bold mb-2">
                                                                <Lightbulb size={20} />
                                                                <span>TRUCO DE EXAME</span>
                                                            </div>
                                                            <div className="text-amber-800 dark:text-amber-200">
                                                                {React.Children.map(children, (child: any) => {
                                                                    if (child?.props?.children) {
                                                                        return React.cloneElement(child, {
                                                                            children: React.Children.map(child.props.children, (c: any) =>
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

                                                return <blockquote className="border-l-4 border-forest-200 pl-4 italic text-gray-500">{children}</blockquote>;
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

            {/* Navigation Buttons (Overlay) */}
            <div className="absolute inset-y-0 left-0 w-24 flex items-center justify-start pl-4 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none group">
                <button
                    onClick={prevSlide}
                    disabled={isFirst}
                    className="p-3 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 pointer-events-auto transform group-hover:scale-110 transition-transform disabled:opacity-0"
                >
                    <ChevronLeft size={32} />
                </button>
            </div>

            <div className="absolute inset-y-0 right-0 w-24 flex items-center justify-end pr-4 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none group">
                {!isLast ? (
                    <button
                        onClick={nextSlide}
                        className="p-3 bg-white/90 dark:bg-black/50 backdrop-blur-md rounded-full shadow-lg border border-gray-100 dark:border-gray-700 text-gray-800 dark:text-gray-200 pointer-events-auto transform group-hover:scale-110 transition-transform"
                    >
                        <ChevronRight size={32} />
                    </button>
                ) : (
                    <button
                        onClick={onFinish}
                        className="px-6 py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-full shadow-xl font-bold flex items-center gap-2 pointer-events-auto transform group-hover:scale-105 transition-transform animate-pulse"
                    >
                        <CheckCircle size={20} />
                        <span>Finalizar</span>
                    </button>
                )}
            </div>

        </div>
    );
};
