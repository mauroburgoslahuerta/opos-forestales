export interface Announcement {
    id: string;
    title: string;
    content: string;
    type: 'info' | 'warning' | 'success' | 'new_content';
    date: string;
}

export const ANNOUNCEMENTS: Announcement[] = [
    {
        id: '20260307-todos-resumos',
        title: '¡Completo! Tódolos resumos dispoñibles',
        content: 'Xa están dispoñibles todos os resumos "GOLD", tanto dos temas comúns (T1-T8) como dos específicos (T1-T11).',
        type: 'success',
        date: '07 MAR'
    }
];
