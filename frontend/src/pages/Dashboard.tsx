import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { BookOpen, Database, Briefcase, FileText, User as UserIcon, Clock, AlertTriangle, Stethoscope } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface UserStats {
    totalAnswered: number;
    correctAnswers: number;
    accuracy: number;
}

interface RecentActivity {
    id: string;
    type: 'exam' | 'test';
    mode: string;
    score: number;
    total: number;
    date: string;
}

export const Dashboard = () => {
    const navigate = useNavigate();
    const { user, role, profile } = useAuth();

    const [questionCount, setQuestionCount] = useState<number | null>(null);
    const [stats, setStats] = useState<UserStats>({ totalAnswered: 0, correctAnswers: 0, accuracy: 0 });
    const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
    const [failedCount, setFailedCount] = useState<number>(0);

    // Admin features
    const [profiles, setProfiles] = useState<any[]>([]);
    const [targetUserId, setTargetUserId] = useState<string | null>(null);
    const [targetName, setTargetName] = useState<string>('');

    useEffect(() => {
        if (user && profile) {
            setTargetUserId(user.id);
            setTargetName(profile.full_name === 'Mauro' ? 'Eu (Mauro)' : profile.full_name);
        }
    }, [user, profile]);

    useEffect(() => {
        async function fetchProfiles() {
            if (role === 'admin') {
                const { data } = await supabase.from('profiles').select('id, full_name');
                if (data) setProfiles(data);
            }
        }
        fetchProfiles();
    }, [role]);

    useEffect(() => {
        async function fetchAllData() {
            if (!targetUserId) return;

            // 1. Total Questions in DB (Global)
            const { count: totalInDb } = await supabase
                .from('questions')
                .select('*', { count: 'exact', head: true });
            setQuestionCount(totalInDb);

            // 2. User Stats (Accuracy)
            const { data: progress } = await supabase
                .from('user_progress')
                .select('is_correct')
                .eq('user_id', targetUserId);

            if (progress) {
                const total = progress.length;
                const correct = progress.filter(p => p.is_correct).length;
                setStats({
                    totalAnswered: total,
                    correctAnswers: correct,
                    accuracy: total > 0 ? Math.round((correct / total) * 100) : 0
                });

                // 2.1 Calculate Failed Questions (last attempt was wrong)
                // We fetch all progress and sort by question_id and date
                const { data: allProgress } = await supabase
                    .from('user_progress')
                    .select('question_id, is_correct, answered_at')
                    .eq('user_id', targetUserId)
                    .order('answered_at', { ascending: false });

                if (allProgress) {
                    const latestByQuestion: Record<string, boolean> = {};
                    allProgress.forEach(p => {
                        if (latestByQuestion[p.question_id] === undefined) {
                            latestByQuestion[p.question_id] = p.is_correct;
                        }
                    });
                    const failed = Object.values(latestByQuestion).filter(isCorrect => !isCorrect).length;
                    setFailedCount(failed);
                }
            }

            // 3. Recent Activity (Exams)
            const { data: exams } = await supabase
                .from('exam_sessions')
                .select('*')
                .eq('user_id', targetUserId)
                .order('started_at', { ascending: false })
                .limit(5);

            if (exams) {
                setRecentActivity(exams.map(e => ({
                    id: e.id,
                    type: 'exam',
                    mode: e.mode === 'mock_real' ? 'Simulacro Real' : 'Test por Tema',
                    score: e.score || 0,
                    total: e.total_questions || 0,
                    date: new Date(e.started_at).toLocaleDateString('gl-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
                })));
            }
        }
        fetchAllData();
    }, [targetUserId]);

    const handleUserChange = (id: string, name: string) => {
        setTargetUserId(id);
        setTargetName(name === 'Mauro' ? 'Eu (Mauro)' : name);
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-4 max-w-2xl">
                    <div>
                        <h2 className="text-3xl font-bold text-forest-900 dark:text-forest-50">
                            Benvido, {role === 'admin' && targetUserId !== user?.id ? targetName : (profile?.full_name || 'Eu')}
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">
                            {targetUserId !== user?.id ? `Vendo as estatísticas de ${targetName}` : 'O teu progreso hoxe é excelente. Segue así!'}
                        </p>
                    </div>
                </div>

                {role === 'admin' && (
                    <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                        <UserIcon className="h-5 w-5 text-forest-500" />
                        <select
                            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
                            value={targetUserId || ''}
                            onChange={(e) => {
                                const prof = profiles.find(p => p.id === e.target.value);
                                handleUserChange(e.target.value, prof?.full_name || '');
                            }}
                        >
                            {profiles.map(p => (
                                <option key={p.id} value={p.id}>{p.full_name === 'Mauro' ? 'Eu (Mauro)' : p.full_name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Opciones de Examen - Destacadas */}
                <Card hover className="bg-gradient-to-br from-forest-600 to-forest-800 border-none text-white lg:col-span-2 group" onClick={() => navigate('/exame-oficial')}>
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3 text-2xl">
                            <FileText className="h-8 w-8 text-forest-200 group-hover:scale-110 transition-transform" />
                            Simulacro Oficial (60+20)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-forest-100 text-lg mb-4">Primeiro exercicio: 80 preguntas tipo test con repartición oficial por bloques.</p>
                        <div className="flex gap-4">
                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs">80 Preguntas</span>
                            <span className="bg-white/10 px-3 py-1 rounded-full text-xs">Puntuación real (sobre 40)</span>
                        </div>
                    </CardContent>
                </Card>

                <Card hover className="bg-gradient-to-br from-earth-600 to-earth-800 border-none text-white group" onClick={() => navigate('/caso-practico')}>
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3 text-2xl">
                            <Briefcase className="h-8 w-8 text-earth-200 group-hover:scale-110 transition-transform" />
                            Caso Práctico (40)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-earth-100 mb-4">Segundo exercicio: 40 preguntas específicas centradas en supostos técnicos.</p>
                        <div className="bg-white/10 p-3 rounded-lg text-sm italic">
                            Acceso directo aos temas de prevención e extinción.
                        </div>
                    </CardContent>
                </Card>

                {/* Modo Estudo - Agora Destacado */}
                <Card hover onClick={() => navigate('/study')} className="bg-gradient-to-br from-blue-600 to-indigo-800 border-none text-white lg:col-span-2 group">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-3 text-2xl">
                            <BookOpen className="h-8 w-8 text-blue-200 group-hover:scale-110 transition-transform" />
                            Modo Estudo
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-blue-100 text-lg mb-4">Repasa o temario oficial e consulta a lexislación vinculada cunha lectura fluida.</p>
                        <div className="flex gap-4 items-center">
                            {questionCount !== null && (
                                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs">
                                    <Database size={14} />
                                    <span>{questionCount} Preguntas na DB</span>
                                </div>
                            )}
                            <div className="text-xs text-blue-200 italic">
                                {stats.totalAnswered} preguntas respondidas por {targetUserId === user?.id ? 'ti' : targetName}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card
                    hover
                    onClick={() => failedCount > 0 ? navigate('/clinica') : null}
                    className={`border-none group cursor-default ${failedCount > 0
                        ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white cursor-pointer shadow-lg shadow-orange-200 dark:shadow-none'
                        : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                        }`}
                >
                    <CardHeader>
                        <CardTitle className={`flex items-center gap-3 ${failedCount > 0 ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                            <Stethoscope className={`h-6 w-6 ${failedCount > 0 ? 'text-orange-200' : 'text-orange-500'}`} />
                            Clínica de Erros
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {failedCount > 0 ? (
                            <div className="space-y-4">
                                <div>
                                    <div className="text-4xl font-black mb-1">{failedCount}</div>
                                    <p className="text-orange-100 text-sm font-medium">Preguntas pendentes de cura</p>
                                </div>
                                <div className="bg-white/20 p-2 rounded-lg text-xs flex items-center gap-2">
                                    <AlertTriangle size={14} />
                                    <span>Ataca os teus puntos débiles agora</span>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="text-2xl font-bold text-green-500">Limpo</div>
                                <p className="text-gray-500 text-xs">Non tes fallos pendentes. ¡Excelente traballo!</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Actividade Recente</h3>
                <Card>
                    <CardContent className="p-0">
                        {recentActivity.length > 0 ? (
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {recentActivity.map((activity) => (
                                    <div key={activity.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${activity.type === 'exam' ? 'bg-forest-100 text-forest-600' : 'bg-earth-100 text-earth-600'}`}>
                                                <Clock size={16} />
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{activity.mode}</p>
                                                <p className="text-xs text-gray-500">{activity.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-forest-600">{activity.score}/{activity.total}</p>
                                            <p className="text-[10px] uppercase text-gray-400 tracking-wider">Puntuación</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-gray-500">
                                Non hai actividade recente. Comeza o teu primeiro estudo!
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
