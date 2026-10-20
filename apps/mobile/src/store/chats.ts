// In-memory conversations store (mock data until the messaging API lands).
import { useSyncExternalStore } from 'react';

export type Message = { id: string; from: 'me' | 'them'; text: string; at: number };
export type Conversation = {
  id: string;
  name: string;
  age: number;
  photo: string;
  city: string;
  match: number; // compatibility %
  online?: boolean;
  prompt: string; // today's guided prompt for this pair
  unread: number;
  messages: Message[];
};
export type NewMatch = { id: string; name: string; photo: string; match: number };

const min = 60_000;
const now = Date.now();

let conversations: Conversation[] = [
  {
    id: 'ananya', name: 'Ananya', age: 24, city: 'Chennai', match: 96, online: true,
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
    prompt: 'What does a perfect slow Sunday look like for you?',
    unread: 2,
    messages: [
      { id: 'a1', from: 'them', text: 'Your note about courtyard homes made me smile. Have you been to the Chettinad mansions?', at: now - 95 * min },
      { id: 'a2', from: 'me', text: 'Only once, years ago — the light through those Athangudi tiles stayed with me.', at: now - 80 * min },
      { id: 'a3', from: 'them', text: 'Then you have to see Kanadukathan in the monsoon. It’s a different world.', at: now - 12 * min },
      { id: 'a4', from: 'them', text: 'Also… filter coffee or chai? This is important 😌', at: now - 11 * min },
    ],
  },
  {
    id: 'meera', name: 'Meera', age: 27, city: 'Bengaluru', match: 91,
    photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300',
    prompt: 'Which tradition from your family do you want to carry forward?',
    unread: 0,
    messages: [
      { id: 'm1', from: 'me', text: 'I loved your answer about Sunday music at your grandmother’s house.', at: now - 26 * 60 * min },
      { id: 'm2', from: 'them', text: 'Carnatic on the radio and the smell of rasam — every single week!', at: now - 25 * 60 * min },
    ],
  },
  {
    id: 'kavya', name: 'Kavya', age: 26, city: 'Hyderabad', match: 88,
    photo: 'https://images.unsplash.com/photo-1513207565459-d7f36bfa1222?auto=format&fit=crop&q=80&w=300',
    prompt: 'What’s a small ritual that keeps you grounded?',
    unread: 0,
    messages: [
      { id: 'k1', from: 'them', text: 'Morning walk, no phone, one podcast. Yours?', at: now - 3 * 24 * 60 * min },
    ],
  },
];

export const NEW_MATCHES: NewMatch[] = [
  { id: 'riya', name: 'Riya', match: 94, photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300' },
  { id: 'diya', name: 'Diya', match: 90, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=300' },
  { id: 'isha', name: 'Isha', match: 87, photo: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=300' },
  { id: 'tara', name: 'Tara', match: 85, photo: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&q=80&w=300' },
];

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const getAll = () => conversations;

export function useConversations() {
  return useSyncExternalStore(subscribe, getAll, getAll);
}

export function useConversation(id: string | undefined) {
  const all = useConversations();
  return all.find((c) => c.id === id);
}

function patch(id: string, fn: (c: Conversation) => Conversation) {
  conversations = conversations.map((c) => (c.id === id ? fn(c) : c));
  emit();
}

export function markRead(id: string) {
  const c = conversations.find((x) => x.id === id);
  if (c && c.unread > 0) patch(id, (x) => ({ ...x, unread: 0 }));
}

export function sendMessage(id: string, text: string, from: Message['from'] = 'me') {
  patch(id, (c) => ({
    ...c,
    messages: [...c.messages, { id: `${Date.now()}-${Math.random()}`, from, text, at: Date.now() }],
  }));
}

export function timeLabel(at: number) {
  const diff = Date.now() - at;
  if (diff < min) return 'now';
  if (diff < 60 * min) return `${Math.floor(diff / min)}m`;
  const d = new Date(at);
  if (diff < 24 * 60 * min) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (diff < 7 * 24 * 60 * min) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}
