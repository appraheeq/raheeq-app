export type AdhkarCategory = 'morning' | 'evening';

export interface DhikrItem {
  id: string;
  category: AdhkarCategory;
  order: number;
  title: string | null;
  text: string;
  fullText: string;
  rawText: string;
  count: number;
  countText: string;
}

export interface DhikrProgressState {
  category: AdhkarCategory;
  dateKey: string;
  progress: Record<string, number>; // dhikrId -> current count done
  completed: Record<string, boolean>; // dhikrId -> true if count >= target
  totalCount: number;
  completedCount: number;
}
