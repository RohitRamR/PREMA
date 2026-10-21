// PREMA Date domain types. Shapes mirror the planned Supabase schema
// (docs/prema-date/PLAN.md §3) so the mock service can be swapped for real
// queries without touching screens. Money is integer paise.

export type CategoryId =
  | 'pottery' | 'painting' | 'candle' | 'cooking' | 'board_games' | 'diy_crafts' | 'coffee';

export type Category = { id: CategoryId; label: string; icon: string; photo: string };

export type Venue = {
  id: string;
  name: string;
  kind: string;
  area: string;
  city: string;
  address: string;
  photo: string;
  hours: string;
  phone: string;
  verified: boolean;
  accessibility: string;
  mapsQuery: string;
};

export type Slot = { id: string; startsAt: string; capacity: number; booked: number };

/** instant = bookable live slots; request = the venue confirms a requested time. */
export type BookingMode = 'instant' | 'request';

export type Activity = {
  id: string;
  venueId: string;
  category: CategoryId;
  title: string;
  summary: string;
  description: string;
  durationMin: number;
  priceForTwo: number | null; // paise; null = price on request
  bookingMode: BookingMode;
  includes: string[];
  excludes: string[];
  materials: string[];
  beginnerFriendly: boolean;
  accessibility: string;
  cancellation: string;
  photos: string[];
  slots: Slot[]; // empty for request-mode listings
  popular?: boolean;
};

export type OfferType = 'two_coffees' | 'coffee_min_spend' | 'coffee_pastry' | 'promo';

export type Offer = {
  id: string;
  venueId: string;
  type: OfferType;
  title: string;
  conditions: string;
  eligibleItems: string[];
  minSpend: number | null; // paise
  startsOn: string;
  expiresOn: string;
  perCoupleLimit: number;
  bookingRequirement: string;
  cancellation: string;
  noShow: string;
  terms: string[];
  photo: string;
  slots: Slot[];
};

export type EventFormat =
  | 'clay_social' | 'paint_picnic' | 'coffee_club' | 'game_night' | 'dessert_lab' | 'creative_weekend';

export type DateEvent = {
  id: string;
  format: EventFormat;
  title: string;
  host: string;
  venueId: string;
  startsAt: string;
  endsAt: string;
  pricePerCouple: number; // paise
  capacity: number; // couples
  seatsTaken: number;
  audience: 'couples_only' | 'open';
  activities: string[];
  includes: string[];
  excludes: string[];
  accessibility: string;
  photoPolicy: string;
  refundPolicy: string;
  rules: string[];
  photo: string;
};

export type SubjectType = 'activity' | 'offer' | 'event';
export type Subject = { type: SubjectType; id: string };

export type InvitationStatus = 'sent' | 'accepted' | 'declined' | 'countered' | 'cancelled';

export type Invitation = {
  id: string;
  matchId: string; // conversation/match id
  fromMe: boolean;
  subject: Subject;
  slotId: string | null; // instant/offer slot
  requestedTime: string | null; // request-mode preferred time (ISO)
  message: string;
  status: InvitationStatus;
  createdAt: string;
  parentId?: string;
};

export type BookingStatus =
  | 'draft' | 'invitation_sent' | 'awaiting_response' | 'payment_pending'
  | 'confirmed' | 'cancelled' | 'completed' | 'no_show' | 'refunded';

export type Review = {
  venue: number; activity: number; host: number; accuracy: number; overall: number;
  note: string; safetyConcern: boolean;
};

export type Booking = {
  id: string;
  invitationId: string | null;
  matchId: string;
  subject: Subject;
  startsAt: string;
  status: BookingStatus;
  totalPaise: number; // 0 for free offers (no payment record)
  consent: { me: string | null; them: string | null };
  pass: { token: string; validFrom: string; expiresAt: string; redeemedAt: string | null } | null;
  review: Review | null;
  createdAt: string;
  /** How the couple pays: one person covers it all, or each pays half. */
  payment?: { mode: PaymentMode; mePaid: boolean; themPaid: boolean };
};

export type PaymentMode = 'full' | 'split';
