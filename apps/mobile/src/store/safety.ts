// Who you've blocked or reported (mock until the trust & safety API lands).
// Blocked people never appear again in Discover, Likes or Chats.
import { createStore } from './create-store';
import { removeConversation } from './chats';

export type ReportReason =
  | 'fake' | 'inappropriate' | 'harassment' | 'safety' | 'scam' | 'underage' | 'other';

export const REPORT_REASONS: { id: ReportReason; label: string; icon: string }[] = [
  { id: 'fake', label: 'Fake profile or catfishing', icon: 'person_off' },
  { id: 'inappropriate', label: 'Inappropriate photos or messages', icon: 'visibility_off' },
  { id: 'harassment', label: 'Harassment or bullying', icon: 'report' },
  { id: 'safety', label: 'I felt unsafe on a date', icon: 'shield' },
  { id: 'scam', label: 'Scam, money or selling', icon: 'payments' },
  { id: 'underage', label: 'Seems under 18', icon: 'child_care' },
  { id: 'other', label: 'Something else', icon: 'more_horiz' },
];

type State = { blocked: string[]; reports: { id: string; reason: ReportReason; note: string; at: number }[] };
const store = createStore<State>({ blocked: [], reports: [] });
const set = (next: Partial<State>) => store.set((s) => ({ ...s, ...next }));

export const useSafety = () => store.use();
/** Current blocks and reports (outside React). */
export const getSafety = () => store.get();

export function blockPerson(id: string) {
  if (!store.get().blocked.includes(id)) set({ blocked: [...store.get().blocked, id] });
  removeConversation(id);
}

export function unblockPerson(id: string) {
  set({ blocked: store.get().blocked.filter((x) => x !== id) });
}

export function reportPerson(id: string, reason: ReportReason, note: string, alsoBlock: boolean) {
  set({ reports: [...store.get().reports, { id, reason, note, at: Date.now() }] });
  if (alsoBlock) blockPerson(id);
}
