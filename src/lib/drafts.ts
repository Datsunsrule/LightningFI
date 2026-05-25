import type { Individual, Vehicle, FILocation } from './types';

export interface DraftForm {
  fiNumber: string;
  contactDateTime: string;
  location: FILocation;
  individuals: Individual[];
  vehicles: Vehicle[];
  reason: string;
  narrative: string;
}

const STORAGE_KEY = 'lightningfi_drafts';

export const getDrafts = (): DraftForm[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DraftForm[]) : [];
  } catch {
    return [];
  }
};

export const saveDraft = (draft: DraftForm): void => {
  const drafts = getDrafts();
  // Replace existing draft with same FI number, or add new
  const idx = drafts.findIndex((d) => d.fiNumber === draft.fiNumber);
  if (idx >= 0) {
    drafts[idx] = draft;
  } else {
    drafts.unshift(draft);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
};

export const deleteDraft = (fiNumber: string): void => {
  const drafts = getDrafts().filter((d) => d.fiNumber !== fiNumber);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
};

export const isDirty = (form: DraftForm): boolean => {
  if (form.location.text.trim()) return true;
  if (form.reason.trim()) return true;
  if (form.narrative.trim()) return true;
  if (form.vehicles.length > 0) return true;
  for (const ind of form.individuals) {
    if (
      ind.firstName || ind.middleName || ind.lastName ||
      ind.dob || ind.age || ind.sex || ind.race ||
      ind.height || ind.weight || ind.hairColor || ind.eyeColor ||
      ind.notes || ind.alias || ind.address || ind.idNumber
    ) return true;
  }
  return false;
};
