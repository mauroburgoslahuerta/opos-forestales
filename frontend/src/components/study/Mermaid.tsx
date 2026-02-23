import React, { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

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

    useEffect(() => {
        if (ref.current) {
            mermaid.contentLoaded();
            // Force render
            try {
                mermaid.render(`mermaid-${Math.random().toString(36).substr(2, 9)}`, chart).then((result) => {
                    if (ref.current) {
                        ref.current.innerHTML = result.svg;
                    }
                });
            } catch (error) {
                console.error('Mermaid render error:', error);
            }
        }
    }, [chart]);

    return (
        <div className="flex justify-center my-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto">
            <div ref={ref} className="mermaid" />
        </div>
    );
};

export default Mermaid;
