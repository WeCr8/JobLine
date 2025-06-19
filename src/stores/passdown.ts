import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { PassdownNote, LaborType, MachineCondition, FiveSChecklist } from '../types';

export const usePassdownStore = defineStore('passdown', () => {
  const notes = ref<PassdownNote[]>([]);
  const loading = ref(false);

  // Mock data
  const mockNotes: PassdownNote[] = [
    {
      id: '1',
      workOrder: 'J2024-001',
      shift: 'day',
      date: '2024-01-12',
      operator: 'John Smith',
      machine: 'CNC-001',
      laborType: 'run',
      machineCondition: 'running',
      hoursWorked: 8,
      partsCompleted: 15,
      qualityIssues: 'None - all parts within tolerance',
      machineIssues: 'Slight vibration in spindle - monitoring',
      fiveSChecklist: {
        coolantLevel: true,
        coolantCondition: 'good',
        chipBinEmptied: true,
        chipBinCondition: 'empty',
        deskCleaned: true,
        toolingReturned: true,
        toolingCondition: 'good',
        workAreaOrganized: true,
        safetyChecked: true,
        notes: 'All 5S tasks completed. Work area ready for next shift.'
      },
      nextShiftNotes: 'Continue with current setup. Monitor spindle vibration. Tool change due at part 40.',
      createdAt: '2024-01-12T16:00:00Z',
      updatedAt: '2024-01-12T16:00:00Z'
    },
    {
      id: '2',
      workOrder: 'J2024-002',
      shift: 'evening',
      date: '2024-01-12',
      operator: 'Sarah Johnson',
      machine: 'CNC-002',
      laborType: 'setup',
      machineCondition: 'in-setup',
      hoursWorked: 6,
      partsCompleted: 0,
      qualityIssues: 'N/A - still in setup',
      machineIssues: 'Waiting for tooling verification from tool crib',
      fiveSChecklist: {
        coolantLevel: true,
        coolantCondition: 'needs-change',
        chipBinEmptied: false,
        chipBinCondition: 'half-full',
        deskCleaned: true,
        toolingReturned: false,
        toolingCondition: 'good',
        workAreaOrganized: true,
        safetyChecked: true,
        notes: 'Coolant needs changing before production starts. Previous job chips still in bin.'
      },
      nextShiftNotes: 'Setup 80% complete. Need tool verification and coolant change. First article inspection ready.',
      createdAt: '2024-01-12T23:30:00Z',
      updatedAt: '2024-01-12T23:30:00Z'
    },
    {
      id: '3',
      workOrder: 'J2024-004',
      shift: 'night',
      date: '2024-01-11',
      operator: 'Lisa Chen',
      machine: 'CNC-001',
      laborType: 'run',
      machineCondition: 'running',
      hoursWorked: 4,
      partsCompleted: 8,
      qualityIssues: 'Material quality issue discovered - parts 15-20 out of spec',
      machineIssues: 'None',
      fiveSChecklist: {
        coolantLevel: true,
        coolantCondition: 'good',
        chipBinEmptied: true,
        chipBinCondition: 'empty',
        deskCleaned: true,
        toolingReturned: true,
        toolingCondition: 'worn',
        workAreaOrganized: true,
        safetyChecked: true,
        notes: 'Cutting tool showing wear. Recommend replacement soon.'
      },
      nextShiftNotes: 'Job on hold due to material quality. Contacted supervisor. Waiting for replacement material.',
      createdAt: '2024-01-11T06:00:00Z',
      updatedAt: '2024-01-11T06:00:00Z'
    }
  ];

  const fetchNotes = async () => {
    loading.value = true;
    await new Promise(resolve => setTimeout(resolve, 800));
    notes.value = mockNotes;
    loading.value = false;
  };

  const addNote = async (note: Omit<PassdownNote, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: PassdownNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    notes.value.unshift(newNote);
  };

  const updateNote = async (id: string, updates: Partial<PassdownNote>) => {
    const index = notes.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
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
    notesByShift,
    notesByMachine,
    recentNotes,
    fetchNotes,
    addNote,
    updateNote
  };
});