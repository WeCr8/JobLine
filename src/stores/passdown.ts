import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { passdownService } from '../services/passdown.service';
import type { PassdownNote, LaborType, MachineCondition, FiveSChecklist } from '../types';
import { demoService } from '../services/demo.service';
import { useAuthStore } from './auth';

export const usePassdownStore = defineStore('passdown', () => {
  const notes = ref<PassdownNote[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const authStore = useAuthStore();

  const fetchNotes = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      // Check if we're in demo mode
      if (import.meta.env.VITE_DEMO_MODE === 'true' && authStore.user?.email?.includes('demo')) {
        // Use hardcoded demo data
        notes.value = demoService.getDemoData('passdownNotes') as PassdownNote[];
      } else {
        // Use real data from API
        const fetchedNotes = await passdownService.fetchNotes();
        notes.value = fetchedNotes;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error fetching passdown notes:', err);
    } finally {
      loading.value = false;
    }
  };

  const addNote = async (note: Omit<PassdownNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true;
    error.value = null;
    
    try {
      // Check if we're in demo mode
      if (import.meta.env.VITE_DEMO_MODE === 'true' && authStore.user?.email?.includes('demo')) {
        // Create a new note in memory
        const newNote: PassdownNote = {
          id: `note-${Date.now()}`,
          ...note,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        notes.value.unshift(newNote);
        return newNote;
      } else {
        // Use real API
        const newNote = await passdownService.addNote(note);
        
        if (newNote) {
          notes.value.unshift(newNote);
        }
        
        return newNote;
      }
    } catch (err: any) {
      error.value = err.message;
      console.error('Error adding passdown note:', err);
      return null;
    } finally {
      loading.value = false;
    }
  };

  // Computed properties
  const notesByShift = computed(() => {
    const shifts = { day: 0, evening: 0, night: 0 };
    notes.value.forEach(note => {
      shifts[note.shift]++;
    });
    return shifts;
  });

  const notesByMachine = computed(() => {
    const machines: Record<string, number> = {};
    notes.value.forEach(note => {
      machines[note.machine] = (machines[note.machine] || 0) + 1;
    });
    return machines;
  });

  const recentNotes = computed(() => 
    notes.value.slice(0, 10).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  );

  return {
    notes,
    loading,
    error,
    notesByShift,
    notesByMachine,
    recentNotes,
    fetchNotes,
    addNote
  };
});