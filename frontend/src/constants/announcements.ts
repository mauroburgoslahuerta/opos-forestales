export interface Announcement {
    id: string;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'new_content';
    date: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
    {
        id: '20260225-especificos',
        title: 'Resumes dispoñibles',
        content: 'Xa están dispoñibles todos os resumos dos temas específicos. Os temas comúns estarán dispoñibles proximamente.',
        type: 'new_content',
        date: '25 FEB'
    }
];
