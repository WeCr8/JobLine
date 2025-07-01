import { supabase } from './api.service.ts';
import type { PassdownNote } from '../types';

export const passdownService = {
  /**
   * Fetch all passdown notes
   */
  async fetchNotes(): Promise<PassdownNote[]> {
    try {
      const { data, error } = await supabase
        .from('passdown_notes')
        .select(`
          *,
          five_s_checklists(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return (data || []).map(note => ({
        id: note.id,
        workOrder: note.work_order,
        shift: note.shift,
        date: note.date,
        operator: note.operator_name,
        machine: note.machine_id,
        laborType: note.labor_type,
        machineCondition: note.machine_condition,
        hoursWorked: note.hours_worked,
        partsCompleted: note.parts_completed,
        qualityIssues: note.quality_issues,
        machineIssues: note.machine_issues,
        fiveSChecklist: note.five_s_checklists[0] || {
          coolantLevel: false,
          coolantCondition: 'good',
          chipBinEmptied: false,
          chipBinCondition: 'empty',
          deskCleaned: false,
          toolingReturned: false,
          toolingCondition: 'good',
          workAreaOrganized: false,
          safetyChecked: false,
          notes: ''
        },
        nextShiftNotes: note.next_shift_notes,
        createdAt: note.created_at,
        updatedAt: note.updated_at
      }));
    } catch (err) {
      console.error('Error fetching passdown notes:', err);
      return [];
    }
  },

  /**
   * Add a new passdown note
   */
  async addNote(note: Omit<PassdownNote, 'id' | 'createdAt' | 'updatedAt'>): Promise<PassdownNote | null> {
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      // Insert the passdown note
      const { data, error } = await supabase
        .from('passdown_notes')
        .insert({
          work_order: note.workOrder,
          shift: note.shift,
          date: note.date,
          operator_id: user.id,
          operator_name: note.operator,
          machine_id: note.machine,
          labor_type: note.laborType,
          machine_condition: note.machineCondition,
          hours_worked: note.hoursWorked,
          parts_completed: note.partsCompleted,
          quality_issues: note.qualityIssues,
          machine_issues: note.machineIssues,
          next_shift_notes: note.nextShiftNotes
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Insert the 5S checklist
      const { error: checklistError } = await supabase
        .from('five_s_checklists')
        .insert({
          passdown_note_id: data.id,
          coolant_level: note.fiveSChecklist.coolantLevel,
          coolant_condition: note.fiveSChecklist.coolantCondition,
          chip_bin_emptied: note.fiveSChecklist.chipBinEmptied,
          chip_bin_condition: note.fiveSChecklist.chipBinCondition,
          desk_cleaned: note.fiveSChecklist.deskCleaned,
          tooling_returned: note.fiveSChecklist.toolingReturned,
          tooling_condition: note.fiveSChecklist.toolingCondition,
          work_area_organized: note.fiveSChecklist.workAreaOrganized,
          safety_checked: note.fiveSChecklist.safetyChecked,
          notes: note.fiveSChecklist.notes
        });
      
      if (checklistError) throw checklistError;
      
      return {
        id: data.id,
        workOrder: data.work_order,
        shift: data.shift,
        date: data.date,
        operator: data.operator_name,
        machine: data.machine_id,
        laborType: data.labor_type,
        machineCondition: data.machine_condition,
        hoursWorked: data.hours_worked,
        partsCompleted: data.parts_completed,
        qualityIssues: data.quality_issues,
        machineIssues: data.machine_issues,
        fiveSChecklist: note.fiveSChecklist,
        nextShiftNotes: data.next_shift_notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
    } catch (err) {
      console.error('Error adding passdown note:', err);
      return null;
    }
  }
};