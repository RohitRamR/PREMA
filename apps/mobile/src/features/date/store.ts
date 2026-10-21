// PREMA Date client state (frontend preview).
// Catalogue reads go through the `catalogue` getters so they can become
// Supabase queries later. User state (saves, invitations, bookings) lives in a
// small external store. Every rule the server will enforce is mirrored here so
// the UI behaves correctly today:
//   • a booking only exists once BOTH people have accepted (consent.me + consent.them)
//   • request-mode activities wait for the venue; paid ones wait for payment
//   • QR passes are issued only for confirmed bookings and are single-use
import { useSyncExternalStore } from 'react';
import {
  ACTIVITIES, CATEGORIES, EVENTS, INITIAL_BOOKINGS, INITIAL_INVITATIONS, OFFERS, VENUES,
} from './mock';
import type {
  Activity, Booking, BookingStatus, DateEvent, Invitation, Offer, PaymentMode, Review, Slot, Subject, Venue,
} from './types';

// ── Catalogue (read-only; swap for API) ─────────────────────────────────────
export const catalogue = {
  categories: CATEGORIES,
  venues: VENUES,
  activities: ACTIVITIES,
  offers: OFFERS,
  events: EVENTS,
  venue: (id: string) => VENUES.find((v) => v.id === id),
  activity: (id: string) => ACTIVITIES.find((a) => a.id === id),
  offer: (id: string) => OFFERS.find((o) => o.id === id),
  event: (id: string) => EVENTS.find((e) => e.id === id),
};

export type SubjectInfo = {
  title: string; venue: Venue | undefined; photo: string; priceForTwo: number | null;
  durationMin: number | null; slots: Slot[]; bookingMode: 'instant' | 'request' | 'free' | 'ticket';
};

export function describe(subject: Subject): SubjectInfo | null {
  if (subject.type === 'activity') {
    const a = catalogue.activity(subject.id);
    if (!a) return null;
    return { title: a.title, venue: catalogue.venue(a.venueId), photo: a.photos[0], priceForTwo: a.priceForTwo,
      durationMin: a.durationMin, slots: a.slots, bookingMode: a.bookingMode };
  }
  if (subject.type === 'offer') {
    const o = catalogue.offer(subject.id);
    if (!o) return null;
    return { title: o.title, venue: catalogue.venue(o.venueId), photo: o.photo, priceForTwo: 0,
      durationMin: null, slots: o.slots, bookingMode: 'free' };
  }
  const e = catalogue.event(subject.id);
  if (!e) return null;
  return { title: e.title, venue: catalogue.venue(e.venueId), photo: e.photo, priceForTwo: e.pricePerCouple,
    durationMin: Math.round((+new Date(e.endsAt) - +new Date(e.startsAt)) / 60000), slots: [], bookingMode: 'ticket' };
}

// ── User state ──────────────────────────────────────────────────────────────
type State = {
  saved: string[]; // `${type}:${id}`
  invitations: Invitation[];
  bookings: Booking[];
  waitlist: string[]; // event ids
};

let state: State = {
  saved: ['activity:a-canvas', 'event:e-clay'],
  invitations: INITIAL_INVITATIONS,
  bookings: INITIAL_BOOKINGS,
  waitlist: [],
};

const listeners = new Set<() => void>();
const set = (next: Partial<State>) => { state = { ...state, ...next }; listeners.forEach((l) => l()); };
const subscribe = (l: () => void) => { listeners.add(l); return () => listeners.delete(l); };
const get = () => state;

export function useDateState() {
  return useSyncExternalStore(subscribe, get, get);
}

const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
const nowIso = () => new Date().toISOString();
export const keyOf = (s: Subject) => `${s.type}:${s.id}`;

export function toggleSave(subject: Subject) {
  const k = keyOf(subject);
  set({ saved: state.saved.includes(k) ? state.saved.filter((x) => x !== k) : [...state.saved, k] });
}

export function toggleWaitlist(eventId: string) {
  set({ waitlist: state.waitlist.includes(eventId) ? state.waitlist.filter((x) => x !== eventId) : [...state.waitlist, eventId] });
}

/** Proposer sends an invitation. Nothing is booked until the other person accepts. */
export function proposeDate(input: {
  matchId: string; subject: Subject; slotId: string | null; requestedTime: string | null; message: string; parentId?: string;
}) {
  const inv: Invitation = { id: uid('inv'), fromMe: true, status: 'sent', createdAt: nowIso(), ...input };
  set({ invitations: [inv, ...state.invitations] });
  return inv;
}

function startTimeFor(inv: Invitation): string {
  if (inv.subject.type === 'event') return catalogue.event(inv.subject.id)?.startsAt ?? nowIso();
  const info = describe(inv.subject);
  const slot = info?.slots.find((s) => s.id === inv.slotId);
  return slot?.startsAt ?? inv.requestedTime ?? nowIso();
}

function initialStatus(subject: Subject): BookingStatus {
  const info = describe(subject);
  if (!info) return 'draft';
  if (info.bookingMode === 'free') return 'confirmed';
  if (info.bookingMode === 'request') return 'awaiting_response'; // venue must confirm the time
  return 'payment_pending'; // instant paid activity or event ticket
}

function makePass(startsAt: string) {
  const t = +new Date(startsAt);
  const token = `PREMA-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  return { token, validFrom: new Date(t - 30 * 60000).toISOString(), expiresAt: new Date(t + 30 * 60000).toISOString(), redeemedAt: null };
}

/** Both sides have now consented → create the booking. */
function bookFromInvitation(inv: Invitation, myConsent: string, theirConsent: string) {
  const startsAt = startTimeFor(inv);
  const status = initialStatus(inv.subject);
  const info = describe(inv.subject);
  const booking: Booking = {
    id: uid('bk'), invitationId: inv.id, matchId: inv.matchId, subject: inv.subject, startsAt, status,
    totalPaise: info?.priceForTwo ?? 0, consent: { me: myConsent, them: theirConsent },
    pass: status === 'confirmed' ? makePass(startsAt) : null, review: null, createdAt: nowIso(),
  };
  set({ bookings: [booking, ...state.bookings] });
  return booking;
}

export function respondToInvitation(id: string, response: 'accept' | 'decline') {
  const inv = state.invitations.find((i) => i.id === id);
  if (!inv || inv.status !== 'sent' || inv.fromMe) return null;
  set({ invitations: state.invitations.map((i) => (i.id === id ? { ...i, status: response === 'accept' ? 'accepted' : 'declined' } : i)) });
  if (response === 'accept') return bookFromInvitation(inv, nowIso(), inv.createdAt);
  return null;
}

/** Counter-proposal: mark the original as countered and send a new one back. */
export function counterInvitation(id: string, slotId: string | null, requestedTime: string | null, message: string) {
  const inv = state.invitations.find((i) => i.id === id);
  if (!inv) return null;
  set({ invitations: state.invitations.map((i) => (i.id === id ? { ...i, status: 'countered' } : i)) });
  return proposeDate({ matchId: inv.matchId, subject: inv.subject, slotId, requestedTime, message, parentId: id });
}

export function cancelInvitation(id: string) {
  set({ invitations: state.invitations.map((i) => (i.id === id && i.status === 'sent' ? { ...i, status: 'cancelled' } : i)) });
}

/** PREVIEW ONLY — stands in for the match accepting on their phone. */
export function simulateTheyAccept(id: string) {
  const inv = state.invitations.find((i) => i.id === id);
  if (!inv || !inv.fromMe || inv.status !== 'sent') return null;
  set({ invitations: state.invitations.map((i) => (i.id === id ? { ...i, status: 'accepted' } : i)) });
  return bookFromInvitation(inv, inv.createdAt, nowIso());
}

function patchBooking(id: string, fn: (b: Booking) => Booking) {
  set({ bookings: state.bookings.map((b) => (b.id === id ? fn(b) : b)) });
}

/** PREVIEW ONLY — real confirmation happens after server-side payment verification. */
export function previewCompletePayment(id: string) {
  patchBooking(id, (b) => (b.status === 'payment_pending' ? { ...b, status: 'confirmed', pass: makePass(b.startsAt) } : b));
}

/** Half of the total, rounded up to the rupee, so splits never short the venue. */
export const halfOf = (paise: number) => Math.ceil(paise / 200) * 100;

/**
 * PREVIEW ONLY — you pay, either the whole amount or your half.
 * Full → confirmed straight away. Split → waits for the other half.
 */
export function payBooking(id: string, mode: PaymentMode) {
  patchBooking(id, (b) => {
    if (b.status !== 'payment_pending') return b;
    const themPaid = b.payment?.themPaid ?? false;
    if (mode === 'full' || themPaid) {
      return { ...b, status: 'confirmed', pass: makePass(b.startsAt), payment: { mode, mePaid: true, themPaid: mode === 'split' } };
    }
    return { ...b, payment: { mode: 'split', mePaid: true, themPaid: false } };
  });
}

/** PREVIEW ONLY — stands in for your date paying their half on their phone. */
export function previewPartnerPaysHalf(id: string) {
  patchBooking(id, (b) => {
    if (b.status !== 'payment_pending' || b.payment?.mode !== 'split') return b;
    return b.payment.mePaid
      ? { ...b, status: 'confirmed', pass: makePass(b.startsAt), payment: { ...b.payment, themPaid: true } }
      : { ...b, payment: { ...b.payment, themPaid: true } };
  });
}

/** PREVIEW ONLY — stands in for the venue confirming a requested time. */
export function previewVenueConfirms(id: string) {
  patchBooking(id, (b) => (b.status === 'awaiting_response'
    ? { ...b, status: (b.totalPaise ?? 0) > 0 ? 'payment_pending' : 'confirmed', pass: (b.totalPaise ?? 0) > 0 ? null : makePass(b.startsAt) }
    : b));
}

export function cancelBooking(id: string) {
  patchBooking(id, (b) => {
    if (!['confirmed', 'payment_pending', 'awaiting_response'].includes(b.status)) return b;
    // Any money taken (full payment, or one half of a split) is refunded.
    const paid = b.totalPaise > 0 && (b.status === 'confirmed' || !!b.payment?.mePaid || !!b.payment?.themPaid);
    return { ...b, status: paid ? 'refunded' : 'cancelled', pass: null };
  });
}

export function submitReview(id: string, review: Review) {
  patchBooking(id, (b) => ({ ...b, review }));
}

// ── Formatting helpers ──────────────────────────────────────────────────────
export function rupees(paise: number | null) {
  if (paise === null) return 'Price on request';
  if (paise === 0) return 'Free';
  return `₹${(paise / 100).toLocaleString('en-IN')}`;
}

export function duration(min: number | null) {
  if (!min) return '';
  const h = Math.floor(min / 60), m = min % 60;
  return h ? `${h} hr${h > 1 ? 's' : ''}${m ? ` ${m} min` : ''}` : `${m} min`;
}

export function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const that = new Date(d); that.setHours(0, 0, 0, 0);
  const diff = Math.round((+that - +today) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function timeLabel(iso: string) {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
}

export function whenLabel(iso: string) {
  return `${dayLabel(iso)} · ${timeLabel(iso)}`;
}

export const STATUS_COPY: Record<BookingStatus, { label: string; tone: 'sky' | 'green' | 'amber' | 'grey' | 'red' }> = {
  draft: { label: 'Draft', tone: 'grey' },
  invitation_sent: { label: 'Invitation sent', tone: 'sky' },
  awaiting_response: { label: 'Awaiting venue', tone: 'amber' },
  payment_pending: { label: 'Payment pending', tone: 'amber' },
  confirmed: { label: 'Confirmed', tone: 'green' },
  cancelled: { label: 'Cancelled', tone: 'grey' },
  completed: { label: 'Completed', tone: 'sky' },
  no_show: { label: 'No-show', tone: 'red' },
  refunded: { label: 'Refunded', tone: 'grey' },
};

export const isUpcoming = (b: Booking) =>
  ['confirmed', 'payment_pending', 'awaiting_response'].includes(b.status) && +new Date(b.startsAt) > Date.now() - 3 * 3600000;

export type { Activity, Offer, DateEvent };
