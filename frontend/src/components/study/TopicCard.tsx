import React from 'react';
import {
    BookOpen, Dumbbell, AlertCircle, Scale, Map, FileText, Eye,
    Briefcase, Users, Accessibility, Shield, Flame, Radio,
    Thermometer, Droplet, Hammer, Truck, HardHat, AlertTriangle, Signal, Sparkles
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { TopicDefinition } from '../../constants/topicRegistry';

const ICON_MAP: Record<string, any> = {
    Scale, Map, FileText, Eye, Briefcase, Users, Accessibility,
    Shield, Flame, Radio, Thermometer, Droplet, Hammer, Truck,
    HardHat, AlertTriangle, Signal
};

interface TopicCardProps {
    topic: TopicDefinition;
    questionCount: number;
    onStudy: (topic: TopicDefinition) => void;
    onTest: (topic: TopicDefinition) => void;
    onSummary: (topic: TopicDefinition) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, questionCount, onStudy, onTest, onSummary }) => {
    const hasQuestions = questionCount > 0;
    const IconComponent = topic.icon ? ICON_MAP[topic.icon] : null;

    return (
        <Card hover className="flex flex-col h-full border-forest-100 dark:border-forest-900/30">
            <CardHeader className="pb-3 text-forest-900 dark:text-forest-100">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                        {IconComponent && (
                            <div className="p-2 bg-forest-50 dark:bg-forest-900/30 rounded-lg text-forest-600 dark:text-forest-400 shrink-0">
                                <IconComponent size={24} />
                            </div>
                        )}
                        <CardTitle className="text-lg leading-tight line-clamp-2 min-h-[3rem]">
                            {topic.title}
                        </CardTitle>
                    </div>
                    <span className={`text-xs font-mono px-2 py-1 rounded-full shrink-0 ${hasQuestions
                        ? 'bg-forest-100 text-forest-700 dark:bg-forest-900/50 dark:text-forest-300'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500'
                        }`}>
                        {questionCount} pregs
                    </span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end gap-3 pt-0">
                {/* Study Action */}
                <button
                    onClick={() => onStudy(topic)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-forest-50 hover:bg-forest-100 text-forest-700 rounded-lg transition-colors font-medium border border-forest-200 dark:bg-forest-900/20 dark:border-forest-800 dark:text-forest-300 dark:hover:bg-forest-900/40"
                >
                    <BookOpen size={18} />
                    <span>Estudar</span>
                </button>

                {/* Summary Action */}
                <button
                    onClick={() => onSummary(topic)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors font-bold border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-900/40 shadow-sm"
                >
                    <Sparkles size={18} className="animate-pulse" />
                    <span>Resumo</span>
                </button>

                {/* Test Action */}
                {hasQuestions ? (
                    <button
                        onClick={() => onTest(topic)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-forest-600 hover:bg-forest-700 text-white rounded-lg transition-colors font-medium shadow-sm"
                    >
                        <Dumbbell size={18} />
                        <span>Adestrar</span>
                    </button>
                ) : (
                    <div className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm">
                        <AlertCircle size={16} />
                        <span>Sen preguntas</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
