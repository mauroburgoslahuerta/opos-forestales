import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Megaphone, Bell, Info, AlertTriangle, FilePlus } from 'lucide-react';
import { ANNOUNCEMENTS, type Announcement } from '../../constants/announcements';

const getIcon = (type: Announcement['type']) => {
    switch (type) {
        case 'new_content': return <FilePlus className="text-blue-500" size={20} />;
        case 'warning': return <AlertTriangle className="text-orange-500" size={20} />;
        case 'success': return <Bell className="text-green-500" size={20} />;
        default: return <Info className="text-forest-500" size={20} />;
    }
};

export const Announcements = () => {
    if (ANNOUNCEMENTS.length === 0) return null;

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Megaphone className="text-forest-600" size={20} />
                Avisos e Novidades
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ANNOUNCEMENTS.map((announcement) => (
                    <Card key={announcement.id} className="border-l-4 border-l-forest-500">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-base flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {getIcon(announcement.type)}
                                    <span>{announcement.title}</span>
                                </div>
                                <span className="text-[10px] uppercase text-gray-400 font-normal tracking-wider">
                                    {announcement.date}
                                </span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                {announcement.content}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};
