import type { PassdownNote } from '../types';
export declare const passdownService: {
    /**
     * Fetch all passdown notes
     */
    fetchNotes(): Promise<PassdownNote[]>;
    /**
     * Add a new passdown note
     */
    addNote(note: Omit<PassdownNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<PassdownNote | null>;
};
