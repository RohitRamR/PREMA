// ─────────────────────────────────────────────────────────────────────────────
// PREVIEW DATA — frontend development only.
// These venues, prices and slots are fictional placeholders so the PREMA Date
// UI can be built before the backend exists. They are NOT partners and must
// never ship. Replace `service.ts` reads with Supabase queries (see
// docs/prema-date/PLAN.md) and delete this file.
// ─────────────────────────────────────────────────────────────────────────────
import type {
  Activity, Booking, Category, DateEvent, Invitation, Offer, Slot, Venue,
} from './types';

const img = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;

/** ISO timestamp `days` from today at hh:mm local time (keeps preview dates upcoming). */
export function at(days: number, hh: number, mm = 0) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hh, mm, 0, 0);
  return d.toISOString();
}

const slots = (prefix: string, defs: [number, number, number, number, number][]): Slot[] =>
  defs.map(([day, h, m, cap, booked], i) => ({ id: `${prefix}-s${i}`, startsAt: at(day, h, m), capacity: cap, booked }));

export const CATEGORIES: Category[] = [
  { id: 'pottery', label: 'Clay & pottery', icon: 'spa', photo: img('photo-1565193566173-7a0ee3dbe261', 600) },
  { id: 'painting', label: 'Painting', icon: 'image', photo: img('photo-1513364776144-60967b0f800f', 600) },
  { id: 'candle', label: 'Candle making', icon: 'wb_twilight', photo: img('photo-1602874801007-bd458bb1b8b6', 600) },
  { id: 'cooking', label: 'Cooking', icon: 'restaurant', photo: img('photo-1556910103-1c02745aae4d', 600) },
  { id: 'board_games', label: 'Board games', icon: 'hub', photo: img('photo-1610890716171-6b1bb98ffd09', 600) },
  { id: 'diy_crafts', label: 'DIY crafts', icon: 'filter_vintage', photo: img('photo-1460661419201-fd4cecdf8a8b', 600) },
  { id: 'coffee', label: 'Coffee', icon: 'local_cafe', photo: img('photo-1442512595331-e89e73853f31', 600) },
];

export const VENUES: Venue[] = [
  {
    id: 'v-mitti', name: 'Mitti & Wheel Studio', kind: 'Pottery studio', area: 'Alwarpet', city: 'Chennai',
    address: '12 Sample Lane, Alwarpet, Chennai 600018', photo: img('photo-1565193566173-7a0ee3dbe261'),
    hours: 'Tue–Sun · 10 AM – 8 PM', phone: '+91 00000 00001', verified: true,
    accessibility: 'Ground-floor studio, step-free entry, seated wheels available.', mapsQuery: 'Alwarpet Chennai',
  },
  {
    id: 'v-canvas', name: 'Canvas House', kind: 'Art studio', area: 'Indiranagar', city: 'Bengaluru',
    address: '4 Sample Road, Indiranagar, Bengaluru 560038', photo: img('photo-1513364776144-60967b0f800f'),
    hours: 'Daily · 11 AM – 9 PM', phone: '+91 00000 00002', verified: true,
    accessibility: 'First floor, lift available. Easels adjustable for seated painting.', mapsQuery: 'Indiranagar Bengaluru',
  },
  {
    id: 'v-wick', name: 'Wick & Bloom', kind: 'Candle studio', area: 'Koramangala', city: 'Bengaluru',
    address: '88 Sample Street, Koramangala, Bengaluru 560034', photo: img('photo-1602874801007-bd458bb1b8b6'),
    hours: 'Wed–Mon · 12 PM – 8 PM', phone: '+91 00000 00003', verified: true,
    accessibility: 'Step-free entry. Strong scents in the studio — unscented sessions on request.', mapsQuery: 'Koramangala Bengaluru',
  },
  {
    id: 'v-tavola', name: 'Tavola Kitchen Studio', kind: 'Cooking studio', area: 'Adyar', city: 'Chennai',
    address: '21 Sample Avenue, Adyar, Chennai 600020', photo: img('photo-1556910103-1c02745aae4d'),
    hours: 'Thu–Sun · 11 AM – 9 PM', phone: '+91 00000 00004', verified: true,
    accessibility: 'Step-free kitchen with a lowered counter station.', mapsQuery: 'Adyar Chennai',
  },
  {
    id: 'v-dice', name: 'The Dice Room', kind: 'Board-game café', area: 'HSR Layout', city: 'Bengaluru',
    address: '7 Sample Cross, HSR Layout, Bengaluru 560102', photo: img('photo-1632501641765-e568d28b0015'),
    hours: 'Daily · 12 PM – 11 PM', phone: '+91 00000 00005', verified: true,
    accessibility: 'Step-free entry, accessible restroom. Quiet tables bookable.', mapsQuery: 'HSR Layout Bengaluru',
  },
  {
    id: 'v-bean', name: 'Second Bean Coffee', kind: 'Specialty café', area: 'Besant Nagar', city: 'Chennai',
    address: '3 Sample Beach Road, Besant Nagar, Chennai 600090', photo: img('photo-1501339847302-ac426a4a7cbb'),
    hours: 'Daily · 8 AM – 10 PM', phone: '+91 00000 00006', verified: true,
    accessibility: 'Step-free entry and outdoor seating.', mapsQuery: 'Besant Nagar Chennai',
  },
  {
    id: 'v-brew', name: 'Slow Brew Lab', kind: 'Coffee roastery', area: 'Jayanagar', city: 'Bengaluru',
    address: '15 Sample Main, Jayanagar, Bengaluru 560041', photo: img('photo-1554118811-1e0d58224f24'),
    hours: 'Daily · 9 AM – 9 PM', phone: '+91 00000 00007', verified: true,
    accessibility: 'Two steps at entry; ramp available on request.', mapsQuery: 'Jayanagar Bengaluru',
  },
  {
    id: 'v-kiln', name: 'Kiln & Co. Craft Café', kind: 'Craft café', area: 'Nungambakkam', city: 'Chennai',
    address: '9 Sample Road, Nungambakkam, Chennai 600034', photo: img('photo-1460661419201-fd4cecdf8a8b'),
    hours: 'Tue–Sun · 11 AM – 9 PM', phone: '+91 00000 00008', verified: true,
    accessibility: 'Step-free entry, large-print instructions available.', mapsQuery: 'Nungambakkam Chennai',
  },
];

const STD_CANCEL = 'Free cancellation up to 24 hours before. 50% refund within 24 hours. No refund for no-shows.';

export const ACTIVITIES: Activity[] = [
  {
    id: 'a-wheel', venueId: 'v-mitti', category: 'pottery', title: 'Pottery wheel for two',
    summary: 'Throw your first bowls side by side on the wheel.', durationMin: 120, priceForTwo: 320000,
    description: 'A guided wheel session for two. Learn centring, opening and pulling, then each shape a bowl or mug. Pieces are trimmed, glazed in a colour you choose and fired — ready to collect in about three weeks.',
    bookingMode: 'instant', includes: ['Instructor for the session', 'Clay and tools', 'Glazing & firing of 2 pieces'],
    excludes: ['Home delivery of pieces', 'Food & drinks'], materials: ['Stoneware clay', 'Aprons', 'Wheel tools'],
    beginnerFriendly: true, accessibility: 'Seated wheels; studio is step-free.', cancellation: STD_CANCEL,
    photos: [img('photo-1565193566173-7a0ee3dbe261')], popular: true,
    slots: slots('a-wheel', [[2, 11, 0, 4, 1], [2, 16, 0, 4, 4], [3, 11, 0, 4, 2], [5, 17, 30, 4, 0]]),
  },
  {
    id: 'a-handbuild', venueId: 'v-kiln', category: 'pottery', title: 'Hand-built ceramics & chai',
    summary: 'Pinch, coil and slab a keepsake together.', durationMin: 90, priceForTwo: 240000,
    description: 'No wheel needed — build small planters or trinket dishes by hand, with masala chai on the table. Glazed and fired for collection.',
    bookingMode: 'request', includes: ['Clay & tools', 'Firing of 2 pieces', 'A pot of chai'], excludes: ['Delivery'],
    materials: ['Air-dry and stoneware clay'], beginnerFriendly: true, accessibility: 'Step-free café.',
    cancellation: STD_CANCEL, photos: [img('photo-1565193566173-7a0ee3dbe261')], slots: [],
  },
  {
    id: 'a-canvas', venueId: 'v-canvas', category: 'painting', title: 'Couple canvas painting',
    summary: 'One guided theme, two canvases — or one shared piece.', durationMin: 150, priceForTwo: 280000,
    description: 'An artist walks you through a calm landscape step by step. Paint side by side, or try the shared-canvas challenge where each of you paints half. Beverages are non-alcoholic unless the venue lists otherwise.',
    bookingMode: 'instant', includes: ['Two 16×20" canvases', 'Acrylics & brushes', 'Guided instruction', 'Tea or coffee'],
    excludes: ['Framing'], materials: ['Acrylic paints', 'Brushes', 'Aprons'], beginnerFriendly: true,
    accessibility: 'Lift access; adjustable easels.', cancellation: STD_CANCEL,
    photos: [img('photo-1513364776144-60967b0f800f'), img('photo-1460661419201-fd4cecdf8a8b')], popular: true,
    slots: slots('a-canvas', [[1, 18, 0, 6, 3], [4, 17, 0, 6, 1], [6, 11, 0, 6, 6]]),
  },
  {
    id: 'a-candle', venueId: 'v-wick', category: 'candle', title: 'Scent-blend candle studio',
    summary: 'Blend a signature scent and pour two candles.', durationMin: 90, priceForTwo: 220000,
    description: 'Smell through a library of oils, blend a scent that is yours as a pair, then pour and label two soy candles to take home.',
    bookingMode: 'instant', includes: ['Two 200g soy candles', 'Fragrance oils', 'Custom labels'], excludes: ['Gift boxes'],
    materials: ['Soy wax', 'Cotton wicks', 'Glass jars'], beginnerFriendly: true,
    accessibility: 'Unscented sessions on request.', cancellation: STD_CANCEL,
    photos: [img('photo-1602874801007-bd458bb1b8b6')], slots: slots('a-candle', [[3, 15, 0, 5, 2], [5, 12, 0, 5, 0]]),
  },
  {
    id: 'a-pasta', venueId: 'v-tavola', category: 'cooking', title: 'Fresh pasta from scratch',
    summary: 'Knead, roll and sauce — then sit down to eat it.', durationMin: 150, priceForTwo: 390000,
    description: 'Make egg-free semolina pasta by hand, shape two styles and cook a seasonal sauce. The session ends at a shared table with what you made.',
    bookingMode: 'instant', includes: ['Ingredients', 'Chef instruction', 'The meal you cook', 'Recipe cards'],
    excludes: ['Alcoholic beverages'], materials: ['Aprons', 'Pasta tools'], beginnerFriendly: true,
    accessibility: 'Lowered counter station available.', cancellation: STD_CANCEL,
    photos: [img('photo-1556910103-1c02745aae4d'), img('photo-1556761223-4c4282c73f77')], popular: true,
    slots: slots('a-pasta', [[2, 18, 30, 6, 2], [6, 12, 0, 6, 1]]),
  },
  {
    id: 'a-chocolate', venueId: 'v-tavola', category: 'cooking', title: 'Chocolate & dessert lab',
    summary: 'Temper, fill and decorate bonbons together.', durationMin: 120, priceForTwo: 340000,
    description: 'Learn to temper single-origin Indian chocolate, then fill and decorate a box of bonbons to share (or not).',
    bookingMode: 'request', includes: ['Ingredients', 'A box of 12 bonbons'], excludes: ['Delivery'],
    materials: ['Chocolate', 'Moulds'], beginnerFriendly: true, accessibility: 'Step-free kitchen.',
    cancellation: STD_CANCEL, photos: [img('photo-1606312619070-d48b4c652a52')], slots: [],
  },
  {
    id: 'a-games', venueId: 'v-dice', category: 'board_games', title: 'Co-op game night table',
    summary: 'A reserved quiet table and a game guru’s picks.', durationMin: 180, priceForTwo: 120000,
    description: 'A table for two with a curated stack of cooperative and conversation games. A game guide explains rules so you can just play.',
    bookingMode: 'instant', includes: ['Table for 3 hours', 'Game guide', 'Unlimited library access'],
    excludes: ['Food & drinks'], materials: ['200+ games'], beginnerFriendly: true,
    accessibility: 'Step-free, quiet tables.', cancellation: 'Free cancellation up to 3 hours before.',
    photos: [img('photo-1632501641765-e568d28b0015'), img('photo-1610890716171-6b1bb98ffd09')],
    slots: slots('a-games', [[1, 19, 0, 8, 5], [2, 19, 0, 8, 2], [3, 20, 0, 8, 0]]),
  },
  {
    id: 'a-mugpaint', venueId: 'v-kiln', category: 'diy_crafts', title: 'Paint a pair of mugs',
    summary: 'Design each other’s mug — glazed and fired.', durationMin: 90, priceForTwo: 180000,
    description: 'Choose bisque mugs and underglaze colours, then paint one for each other. Glazed and kiln-fired for collection in 10 days.',
    bookingMode: 'instant', includes: ['Two bisque mugs', 'Underglazes', 'Firing'], excludes: ['Delivery'],
    materials: ['Bisque ware', 'Underglaze', 'Brushes'], beginnerFriendly: true, accessibility: 'Step-free café.',
    cancellation: STD_CANCEL, photos: [img('photo-1460661419201-fd4cecdf8a8b')],
    slots: slots('a-mugpaint', [[4, 16, 0, 6, 1]]),
  },
  {
    id: 'a-latte', venueId: 'v-brew', category: 'coffee', title: 'Latte art & tasting',
    summary: 'Cup three origins, then pour your first hearts.', durationMin: 75, priceForTwo: 150000,
    description: 'A barista leads a short cupping of three Indian estates, then you each steam milk and attempt latte art on the bar machine.',
    bookingMode: 'instant', includes: ['Cupping flight', 'Barista instruction', 'Drinks you make'], excludes: ['Beans to take home'],
    materials: ['Espresso machine', 'Milk jugs'], beginnerFriendly: true, accessibility: 'Ramp on request.',
    cancellation: STD_CANCEL, photos: [img('photo-1509042239860-f550ce710b93'), img('photo-1442512595331-e89e73853f31')],
    popular: true, slots: slots('a-latte', [[1, 10, 30, 3, 1], [3, 10, 30, 3, 3], [4, 16, 0, 3, 0]]),
  },
];

export const OFFERS: Offer[] = [
  {
    id: 'o-bean', venueId: 'v-bean', type: 'two_coffees', title: 'Two complimentary coffees',
    conditions: 'Any two hot or iced coffees from the classics menu.',
    eligibleItems: ['Filter coffee', 'Cappuccino', 'Latte', 'Cold brew'], minSpend: null,
    startsOn: at(-10, 0), expiresOn: at(40, 23, 59), perCoupleLimit: 1,
    bookingRequirement: 'Both of you must accept the coffee date in PREMA before the pass is issued.',
    cancellation: 'Cancel or reschedule up to 2 hours before.', noShow: 'A no-show uses this couple’s offer.',
    terms: ['Funded by the café, not PREMA.', 'One redemption per matched couple.', 'Pass valid 30 minutes either side of your booked time.', 'Not exchangeable for cash.'],
    photo: img('photo-1495474472287-4d71bcdd2085'),
    slots: slots('o-bean', [[1, 17, 0, 4, 1], [2, 10, 0, 4, 0], [2, 17, 30, 4, 2], [3, 11, 0, 4, 0]]),
  },
  {
    id: 'o-brew', venueId: 'v-brew', type: 'coffee_pastry', title: 'Coffee & a shared pastry',
    conditions: 'Two pour-overs and one pastry of the day.', eligibleItems: ['Pour-over of the day', 'Pastry of the day'],
    minSpend: null, startsOn: at(-3, 0), expiresOn: at(21, 23, 59), perCoupleLimit: 1,
    bookingRequirement: 'Booked time required; walk-ins not eligible.',
    cancellation: 'Cancel up to 2 hours before.', noShow: 'A no-show uses this couple’s offer.',
    terms: ['Café-funded promotion.', 'Weekdays only.', 'One redemption per couple.'],
    photo: img('photo-1442512595331-e89e73853f31'), slots: slots('o-brew', [[1, 9, 30, 3, 0], [2, 15, 0, 3, 1]]),
  },
  {
    id: 'o-dice', venueId: 'v-dice', type: 'coffee_min_spend', title: 'Free coffees with game table',
    conditions: 'Two coffees free with a minimum spend of ₹600 on food or table time.',
    eligibleItems: ['Americano', 'Cappuccino'], minSpend: 60000, startsOn: at(-1, 0), expiresOn: at(14, 23, 59),
    perCoupleLimit: 1, bookingRequirement: 'Table booking required.', cancellation: 'Cancel up to 3 hours before.',
    noShow: 'A no-show uses this couple’s offer.', terms: ['Minimum spend excludes taxes.', 'One redemption per couple.'],
    photo: img('photo-1632501641765-e568d28b0015'), slots: slots('o-dice', [[2, 19, 0, 6, 1]]),
  },
];

export const EVENTS: DateEvent[] = [
  {
    id: 'e-clay', format: 'clay_social', title: 'PREMA Clay Social', host: 'Mitti & Wheel Studio', venueId: 'v-mitti',
    startsAt: at(9, 16, 0), endsAt: at(9, 19, 0), pricePerCouple: 450000, capacity: 10, seatsTaken: 6, audience: 'couples_only',
    activities: ['Wheel demo', 'Hand-building at shared tables', 'Glaze bar'],
    includes: ['All materials', 'Firing of 2 pieces', 'Tea & snacks'], excludes: ['Delivery of pieces'],
    accessibility: 'Step-free studio, seated wheels.', photoPolicy: 'Photos only with your consent — opt out at check-in.',
    refundPolicy: 'Full refund up to 72 hours before; credit after that.', rules: ['Arrive 15 minutes early', 'Closed shoes recommended'],
    photo: img('photo-1565193566173-7a0ee3dbe261'),
  },
  {
    id: 'e-paint', format: 'paint_picnic', title: 'PREMA Paint & Picnic', host: 'Canvas House', venueId: 'v-canvas',
    startsAt: at(12, 16, 30), endsAt: at(12, 19, 0), pricePerCouple: 380000, capacity: 12, seatsTaken: 12, audience: 'couples_only',
    activities: ['Guided sunset painting', 'Picnic platter'], includes: ['Canvases & paints', 'Picnic platter'],
    excludes: ['Alcohol'], accessibility: 'Rooftop via lift.', photoPolicy: 'Consent-based photography only.',
    refundPolicy: 'Full refund up to 72 hours before.', rules: ['Weather backup indoors'],
    photo: img('photo-1460661419201-fd4cecdf8a8b'),
  },
  {
    id: 'e-coffee', format: 'coffee_club', title: 'PREMA Coffee Club', host: 'Slow Brew Lab', venueId: 'v-brew',
    startsAt: at(6, 10, 0), endsAt: at(6, 12, 0), pricePerCouple: 180000, capacity: 8, seatsTaken: 3, audience: 'open',
    activities: ['Brewing demo', 'Origin tasting', 'Conversation cards'], includes: ['Tasting flight', 'Pastry'],
    excludes: ['Retail beans'], accessibility: 'Ramp on request.', photoPolicy: 'No photography of guests.',
    refundPolicy: 'Full refund up to 48 hours before.', rules: ['Open to couples and individuals'],
    photo: img('photo-1442512595331-e89e73853f31'),
  },
  {
    id: 'e-dessert', format: 'dessert_lab', title: 'PREMA Dessert Lab', host: 'Tavola Kitchen Studio', venueId: 'v-tavola',
    startsAt: at(15, 18, 0), endsAt: at(15, 20, 30), pricePerCouple: 520000, capacity: 8, seatsTaken: 5, audience: 'couples_only',
    activities: ['Chocolate tempering', 'Plated dessert challenge'], includes: ['Ingredients', 'Dessert box to take home'],
    excludes: ['Alcohol'], accessibility: 'Lowered counter available.', photoPolicy: 'Consent-based photography only.',
    refundPolicy: 'Full refund up to 72 hours before.', rules: ['Let the host know about allergies'],
    photo: img('photo-1563805042-7684c019e1cb'),
  },
];

export const INITIAL_INVITATIONS: Invitation[] = [
  {
    id: 'inv-kavya', matchId: 'kavya', fromMe: false, subject: { type: 'activity', id: 'a-games' },
    slotId: 'a-games-s1', requestedTime: null, status: 'sent',
    message: 'You said you love strategy games — want to lose to me at Pandemic? 😄', createdAt: at(0, 9, 0),
  },
];

export const INITIAL_BOOKINGS: Booking[] = [
  {
    id: 'bk-ananya', invitationId: null, matchId: 'ananya', subject: { type: 'offer', id: 'o-bean' },
    startsAt: at(2, 17, 30), status: 'confirmed', totalPaise: 0,
    consent: { me: at(-1, 20, 0), them: at(-1, 21, 0) },
    pass: { token: 'PREMA-PREVIEW-7F3K-Q9', validFrom: at(2, 17, 0), expiresAt: at(2, 18, 0), redeemedAt: null },
    review: null, createdAt: at(-1, 21, 0),
  },
  {
    id: 'bk-meera', invitationId: null, matchId: 'meera', subject: { type: 'activity', id: 'a-wheel' },
    startsAt: at(-4, 11, 0), status: 'completed', totalPaise: 320000,
    consent: { me: at(-9, 10, 0), them: at(-9, 12, 0) }, pass: null, review: null, createdAt: at(-9, 12, 0),
  },
];
