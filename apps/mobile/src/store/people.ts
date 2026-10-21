// Sample people the app can show a full profile for (mock until the API lands).
// One place for names, photos and basics, so Discover, Likes, Chats and the
// profile page all agree on who someone is.

export type Person = {
  id: string;
  name: string;
  age: number;
  city: string;
  job: string;
  match: number;
  photos: string[];
  bio: string;
  lookingFor: string;
  interests: string[];
  prompt: { question: string; answer: string };
};

const u = (id: string, w = 1200) => `https://images.unsplash.com/${id}?auto=format&fit=crop&q=80&w=${w}`;

export const PEOPLE: Record<string, Person> = {
  meera: {
    id: 'meera', name: 'Meera', age: 27, city: 'Bengaluru', job: 'Product designer', match: 91,
    photos: [u('photo-1517841905240-472988babdf9'), u('photo-1524504388940-b1c1722653e1')],
    bio: 'Product designer who over-plans trips and under-plans weekends. Sunday mornings mean Carnatic on the radio and rasam on the stove.',
    lookingFor: 'Long-term relationship',
    interests: ['Travel', 'Carnatic music', 'Pottery', 'Board games', 'Baking'],
    prompt: { question: 'I’m weirdly good at…', answer: 'Finding the best momos in any city within an hour.' },
  },
  kavya: {
    id: 'kavya', name: 'Kavya', age: 26, city: 'Hyderabad', job: 'Doctor', match: 88,
    photos: [u('photo-1513207565459-d7f36bfa1222'), u('photo-1488426862026-3ee34a7d66df')],
    bio: 'Doctor with a soft spot for old Telugu songs and street biryani. Morning walks, no phone, one podcast.',
    lookingFor: 'Marriage within 1–2 years',
    interests: ['Board games', 'Yoga', 'Reading', 'Biryani trails', 'Volunteering'],
    prompt: { question: 'My love language is…', answer: 'Remembering the little things you mention once.' },
  },
  priya: {
    id: 'priya', name: 'Priya', age: 24, city: 'Chennai', job: 'Architect', match: 91,
    photos: [u('photo-1502823403499-6ccfcf4fb453'), u('photo-1529626455594-4ff0802cfb7e')],
    bio: 'Architect who sketches every staircase she likes. Always looking for my next adventure, ideally with a thermos of coffee.',
    lookingFor: 'Long-term relationship',
    interests: ['Art', 'Hiking', 'Architecture', 'Filter coffee'],
    prompt: { question: 'A perfect first date…', answer: 'A heritage walk that ends at a tiny tiffin place.' },
  },
  neha: {
    id: 'neha', name: 'Neha', age: 23, city: 'Bengaluru', job: 'Software engineer', match: 87,
    photos: [u('photo-1534528741775-53994a69daeb'), u('photo-1531123897727-8f129e1688ce')],
    bio: 'Debugging life one coffee at a time. Weekends are for bookshops and very long walks.',
    lookingFor: 'Taking it slow',
    interests: ['Tech', 'Reading', 'Road trips', 'Photography'],
    prompt: { question: 'Sundays are sacred for…', answer: 'A bookshop, a bakery and nowhere to be.' },
  },
  tara: {
    id: 'tara', name: 'Tara', age: 26, city: 'Chennai', job: 'Lawyer', match: 85,
    photos: [u('photo-1488426862026-3ee34a7d66df')],
    bio: 'Lawyer, sister of three, and the person who plans every family get-together.',
    lookingFor: 'Marriage within 1–2 years',
    interests: ['Family time', 'Yoga', 'Reading'],
    prompt: { question: 'My love language is…', answer: 'Showing up for the people I love, every time.' },
  },
  nila: {
    id: 'nila', name: 'Nila', age: 26, city: 'Chennai', job: 'Writer', match: 92,
    photos: [u('photo-1524504388940-b1c1722653e1')],
    bio: 'Writer who keeps a reading corner for every monsoon.',
    lookingFor: 'Long-term relationship',
    interests: ['Reading', 'Writing', 'Slow living'],
    prompt: { question: 'Sundays are sacred for…', answer: 'Rain, a window seat and a very long novel.' },
  },
  lakshmi: {
    id: 'lakshmi', name: 'Lakshmi', age: 25, city: 'Chennai', job: 'Bharatanatyam teacher', match: 86,
    photos: [u('photo-1617297873650-aef8f4e00b9b')],
    bio: 'I teach Bharatanatyam on weekends and work in UX on weekdays. Family-first, always up for a Margazhi season concert.',
    lookingFor: 'Intentional life partnership',
    interests: ['Dance', 'Carnatic music', 'Filter coffee', 'Temples', 'Yoga'],
    prompt: { question: 'Sundays are sacred for…', answer: 'Morning practice, a long lunch with family, and a nap I never regret.' },
  },
};

export const person = (id: string | undefined) => (id ? PEOPLE[id] : undefined);
