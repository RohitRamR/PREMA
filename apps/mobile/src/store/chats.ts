// In-memory conversations store (mock data until the messaging API lands).
import { useSyncExternalStore } from 'react';
import { PEOPLE, thumb } from './people';

export type Message = {
  id: string; from: 'me' | 'them'; text: string; at: number;
  image?: string; // photo attachment
  replyTo?: { id: string; text: string; from: 'me' | 'them' }; // quoted message
  reaction?: string; // one emoji reaction, set by the other person
};
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

/** Name, age, city, photo and match % come from the shared people list. */
const basics = (id: keyof typeof PEOPLE) => {
  const p = PEOPLE[id]!;
  return { id: p.id, name: p.name, age: p.age, city: p.city, match: p.match, photo: thumb(p.photos[0]!) };
};

let conversations: Conversation[] = [
  {
    ...basics('ananya'), online: true,
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
    ...basics('meera'),
    prompt: 'Which tradition from your family do you want to carry forward?',
    unread: 0,
    messages: [
      { id: 'm1', from: 'me', text: 'I loved your answer about Sunday music at your grandmother’s house.', at: now - 26 * 60 * min },
      { id: 'm2', from: 'them', text: 'Carnatic on the radio and the smell of rasam — every single week!', at: now - 25 * 60 * min },
    ],
  },
  {
    ...basics('kavya'),
    prompt: 'What’s a small ritual that keeps you grounded?',
    unread: 0,
    messages: [
      { id: 'k1', from: 'them', text: 'Morning walk, no phone, one podcast. Yours?', at: now - 3 * 24 * 60 * min },
    ],
  },
];

export const NEW_MATCHES: NewMatch[] = [
  basics('tara'),
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

export function sendMessage(
  id: string, text: string, from: Message['from'] = 'me',
  extra?: Pick<Message, 'image' | 'replyTo'>,
) {
  patch(id, (c) => ({
    ...c,
    messages: [...c.messages, { id: `${Date.now()}-${Math.random()}`, from, text, at: Date.now(), ...extra }],
  }));
}

/** React to a message with one emoji; the same emoji again removes it. */
export function reactToMessage(convoId: string, messageId: string, emoji: string) {
  patch(convoId, (c) => ({
    ...c,
    messages: c.messages.map((m) => (m.id === messageId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m)),
  }));
}

/** Total unread messages across all conversations (drives the Chats tab dot). */
export function useUnreadCount() {
  return useConversations().reduce((n, c) => n + c.unread, 0);
}

/** A new mutual match opens an empty conversation (no-op if one already exists). */
export function addMatch(p: { id: string; name: string; age: number; city: string; photo: string; match: number }) {
  if (conversations.some((c) => c.id === p.id)) return;
  conversations = [{
    ...p, online: false, unread: 0, messages: [],
    prompt: 'What made you smile this week?',
  }, ...conversations];
  emit();
}

/** Unmatch or block: the conversation disappears for both people. */
export function removeConversation(id: string) {
  conversations = conversations.filter((c) => c.id !== id);
  emit();
}

export const hasConversation = (id: string) => conversations.some((c) => c.id === id);

export function timeLabel(at: number) {
  const diff = Date.now() - at;
  if (diff < min) return 'now';
  if (diff < 60 * min) return `${Math.floor(diff / min)}m`;
  const d = new Date(at);
  if (diff < 24 * 60 * min) return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (diff < 7 * 24 * 60 * min) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}
