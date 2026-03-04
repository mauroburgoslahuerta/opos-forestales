import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Maximize2, X } from 'lucide-react';

interface MermaidProps {
    chart: string;
}

mermaid.initialize({
    startOnLoad: true,
    theme: 'forest', // Using 'forest' theme to match the project aesthetics
    securityLevel: 'loose',
    fontFamily: 'Inter, sans-serif',
});

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
    const ref = useRef<HTMLDivElement>(null);
    const zoomRef = useRef<HTMLDivElement>(null);
    const [isZoomed, setIsZoomed] = useState(false);

    useEffect(() => {
        const renderMermaid = async (targetRef: React.RefObject<HTMLDivElement | null>, idSuffix: string, isBig: boolean = false) => {
            if (targetRef.current) {
                try {
                    // Update configuration for quality and scaling
                    mermaid.initialize({
                        startOnLoad: false,
                        theme: 'forest',
                        securityLevel: 'loose',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: isBig ? 24 : 16, // Scale font for zoomed view
                    });

                    const id = `mermaid-${idSuffix}-${Math.random().toString(36).substr(2, 9)}`;
                    const { svg } = await mermaid.render(id, chart);
                    if (targetRef.current) {
                        targetRef.current.innerHTML = svg;
                        // Force the SVG to be responsive within its container
                        const svgElement = targetRef.current.querySelector('svg');
                        if (svgElement) {
                            svgElement.style.maxWidth = '100%';
                            svgElement.style.height = 'auto';
                            if (isBig) {
                                svgElement.style.maxHeight = '85vh';
                            }
                        }
                    }
                } catch (error) {
                    console.error('Mermaid render error:', error);
                }
            }
        };

        renderMermaid(ref, 'normal', false);
        if (isZoomed) {
            renderMermaid(zoomRef, 'zoomed', true);
        }
    }, [chart, isZoomed]);

    return (
        <>
            <div
                className="group relative flex justify-center my-8 bg-white dark:bg-gray-800 p-2 md:p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 cursor-zoom-in transition-all hover:shadow-2xl hover:border-forest-300 hover:scale-[1.01] overflow-hidden"
                onClick={() => setIsZoomed(true)}
            >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-forest-600 text-white p-2 rounded-xl shadow-xl z-10">
                    <Maximize2 size={18} />
                </div>
                <div ref={ref} className="mermaid w-full flex justify-center overflow-x-auto" />
                <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-black text-forest-600/40 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Clic para ampliar diagrama
                </p>
            </div>

            {/* Zoom Modal */}
            {isZoomed && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-2xl animate-in fade-in duration-300 p-6 md:p-12 cursor-zoom-out"
                    onClick={() => setIsZoomed(false)}
                >
                    <button
                        className="absolute top-10 right-10 text-white/50 hover:text-white transition-all bg-white/10 p-4 rounded-full hover:bg-white/20 hover:scale-110 z-[110]"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsZoomed(false);
                        }}
                    >
                        <X size={40} />
                    </button>

                    {/* High contrast wrapper for the diagram */}
                    <div
                        className="bg-white/95 p-12 rounded-[40px] shadow-2xl w-full max-w-7xl max-h-[90vh] flex items-center justify-center overflow-auto animate-in zoom-in duration-500"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            ref={zoomRef}
                            className="mermaid-zoomed w-full h-full flex items-center justify-center"
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default Mermaid;
