import { SlideViewer } from '../components/study/SlideViewer';
import { TOPIC_REGISTRY } from '../constants/topicRegistry';
import { useNavigate } from 'react-router-dom';

const PremiumPreview = () => {
    const navigate = useNavigate();
    const semopTopic = TOPIC_REGISTRY['t-esp-3-semop'];

    if (!semopTopic) {
        return <div className="p-8 text-red-500">Error: Tema 3 non atopado no rexistro.</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-forest-900 dark:text-forest-100">
                            Vista Previa Premium 🏆
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Demostración de renderizado visual (Mermaid + Alertas + Estructura de Slides)
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors"
                    >
                        Volver ao Dashboard
                    </button>
                </header>

                <SlideViewer
                    topic={semopTopic}
                    onFinish={() => navigate('/dashboard')}
                />
            </div>
        </div>
    );
};

export default PremiumPreview;
