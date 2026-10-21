// Behaviour of the app's in-memory stores (chats, safety, PREMA Date).
// The stores are module-level singletons, so each test checks changes
// relative to the state it finds.
// Run: npm test (from apps/mobile)
import { describe, expect, it } from 'vitest';
import {
  addMatch, getConversations, hasConversation, markRead, removeConversation, sendMessage,
} from '../chats';
import { blockPerson, getSafety, reportPerson, unblockPerson } from '../safety';
import { getDateState, keyOf, toggleSave, toggleWaitlist } from '../../features/date/store';

const convo = (id: string) => getConversations().find((c) => c.id === id);

describe('chats store', () => {
  it('starts with the sample conversations', () => {
    expect(hasConversation('ananya')).toBe(true);
    expect(hasConversation('meera')).toBe(true);
  });

  it('appends a sent message to the right conversation', () => {
    const before = convo('meera')!.messages.length;
    sendMessage('meera', 'Hello!');
    const after = convo('meera')!.messages;
    expect(after).toHaveLength(before + 1);
    expect(after.at(-1)).toMatchObject({ from: 'me', text: 'Hello!' });
  });

  it('clears unread on markRead', () => {
    expect(convo('ananya')!.unread).toBeGreaterThan(0);
    markRead('ananya');
    expect(convo('ananya')!.unread).toBe(0);
  });

  it('adds a new match once, at the top', () => {
    const p = { id: 'test-match', name: 'Test', age: 25, city: 'Chennai', photo: '', match: 80 };
    addMatch(p);
    addMatch(p);
    expect(getConversations()[0]!.id).toBe('test-match');
    expect(getConversations().filter((c) => c.id === 'test-match')).toHaveLength(1);
    removeConversation('test-match');
    expect(hasConversation('test-match')).toBe(false);
  });
});

describe('safety store', () => {
  it('blocking someone records it once and removes their conversation', () => {
    expect(hasConversation('kavya')).toBe(true);
    blockPerson('kavya');
    blockPerson('kavya');
    expect(getSafety().blocked.filter((x) => x === 'kavya')).toHaveLength(1);
    expect(hasConversation('kavya')).toBe(false);
    unblockPerson('kavya');
    expect(getSafety().blocked).not.toContain('kavya');
  });

  it('a report is recorded, and blocks only when asked', () => {
    const before = getSafety().reports.length;
    reportPerson('tara', 'fake', 'test', false);
    expect(getSafety().reports).toHaveLength(before + 1);
    expect(getSafety().blocked).not.toContain('tara');
    reportPerson('neha', 'scam', '', true);
    expect(getSafety().blocked).toContain('neha');
  });
});

describe('PREMA Date store', () => {
  it('toggleSave adds and then removes a saved place', () => {
    const subject = { type: 'activity' as const, id: 'test-activity' };
    toggleSave(subject);
    expect(getDateState().saved).toContain(keyOf(subject));
    toggleSave(subject);
    expect(getDateState().saved).not.toContain(keyOf(subject));
  });

  it('toggleWaitlist adds and then removes an event', () => {
    toggleWaitlist('test-event');
    expect(getDateState().waitlist).toContain('test-event');
    toggleWaitlist('test-event');
    expect(getDateState().waitlist).not.toContain('test-event');
  });

  it('a change keeps the other fields', () => {
    const { invitations, bookings } = getDateState();
    toggleWaitlist('another-event');
    expect(getDateState().invitations).toBe(invitations);
    expect(getDateState().bookings).toBe(bookings);
  });
});
