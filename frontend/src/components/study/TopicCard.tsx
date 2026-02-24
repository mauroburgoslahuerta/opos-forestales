import React from 'react';
import {
    BookOpen, Dumbbell, AlertCircle, Scale, Map, FileText, Eye,
    Briefcase, Users, Accessibility, Shield, Flame, Radio,
    Thermometer, Droplet, Hammer, Truck, HardHat, AlertTriangle, Signal, Sparkles, Stethoscope
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
    failedCount: number;
    onStudy: (topic: TopicDefinition) => void;
    onTest: (topic: TopicDefinition) => void;
    onClinic: (topic: TopicDefinition) => void;
    onSummary: (topic: TopicDefinition) => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({
    topic,
    questionCount,
    failedCount,
    onStudy,
    onTest,
    onClinic,
    onSummary
}) => {
    const hasQuestions = questionCount > 0;
    const hasFailures = failedCount > 0;
    const IconComponent = topic.icon ? ICON_MAP[topic.icon] : null;

    return (
        <Card hover className={`flex flex-col h-full transition-all border-l-4 ${hasFailures ? 'border-l-orange-500 bg-orange-50/10' : 'border-forest-100 dark:border-forest-900/30'}`}>
            <CardHeader className="pb-3 text-forest-900 dark:text-forest-100">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex gap-3">
                        {IconComponent && (
                            <div className={`p-2 rounded-lg shrink-0 ${hasFailures ? 'bg-orange-100 text-orange-600' : 'bg-forest-50 dark:bg-forest-900/30 text-forest-600 dark:text-forest-400'}`}>
                                <IconComponent size={24} />
                            </div>
                        )}
                        <CardTitle className="text-lg leading-tight line-clamp-2 min-h-[3rem]">
                            {topic.title}
                        </CardTitle>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${hasQuestions
                            ? 'bg-forest-100 text-forest-700 dark:bg-forest-900/50 dark:text-forest-300'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500'
                            }`}>
                            {questionCount} pregs
                        </span>
                        {hasFailures && (
                            <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full animate-pulse shadow-sm">
                                {failedCount} FALLOS
                            </span>
                        )}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-end gap-3 pt-0">
                {/* Study Action */}
                <div className="grid grid-cols-2 gap-2">
                    <button
                        onClick={() => onStudy(topic)}
                        className="flex items-center justify-center gap-2 py-2 px-3 bg-forest-50 hover:bg-forest-100 text-forest-700 rounded-lg transition-colors font-medium border border-forest-200 dark:bg-forest-900/20 dark:border-forest-800 dark:text-forest-300 dark:hover:bg-forest-900/40 text-sm"
                    >
                        <BookOpen size={16} />
                        <span>Estudar</span>
                    </button>

                    <button
                        onClick={() => onSummary(topic)}
                        className="flex items-center justify-center gap-2 py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors font-bold border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-300 dark:hover:bg-orange-900/40 shadow-sm text-sm"
                    >
                        <Sparkles size={16} className="animate-pulse" />
                        <span>Resumo</span>
                    </button>
                </div>

                {/* Clinic / Test Actions */}
                <div className="flex flex-col gap-2">
                    {hasFailures && (
                        <button
                            onClick={() => onClinic(topic)}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-bold shadow-md shadow-orange-200 dark:shadow-none"
                        >
                            <Stethoscope size={18} />
                            <span>Repasar Fallos</span>
                        </button>
                    )}

                    {hasQuestions ? (
                        <button
                            onClick={() => onTest(topic)}
                            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors font-medium shadow-sm ${hasFailures ? 'bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm' : 'bg-forest-600 hover:bg-forest-700 text-white'}`}
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
                </div>
            </CardContent>
        </Card>
    );
};
