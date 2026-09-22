/**
 * Centralized ASL Sign Asset Map
 * 
 * Provides unified, accessible, and high-performance visual reference assets
 * for the ASL Alphabet (A-Z), Essential Words, Numbers, and Phrases.
 */

export interface SignAsset {
  id: string;
  symbol: string;
  type: 'alphabet' | 'word' | 'phrase' | 'number';
  title: string;
  primaryImage: string;
  fallbackImage: string;
  altText: string;
  description: string;
}

// Official Lifeprint ASL Alphabet GIF repository
const ALPHABET_LETTERS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J',
  'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
  'U', 'V', 'W', 'X', 'Y', 'Z'
];

export const SIGN_ASSETS: {
  ALPHABET: Record<string, SignAsset>;
  WORDS: Record<string, SignAsset>;
  PHRASES: Record<string, SignAsset>;
  NUMBERS: Record<string, SignAsset>;
} = {
  ALPHABET: {},
  WORDS: {},
  PHRASES: {},
  NUMBERS: {},
};

// Generate Alphabet A - Z assets
ALPHABET_LETTERS.forEach((letter) => {
  const lower = letter.toLowerCase();
  SIGN_ASSETS.ALPHABET[letter] = {
    id: `alpha-${letter}`,
    symbol: letter,
    type: 'alphabet',
    title: `Letter ${letter}`,
    primaryImage: `/signs/alphabet/${lower}.gif`,
    fallbackImage: `https://www.lifeprint.com/asl101/fingerspelling/abc-gifs/${lower}.gif`,
    altText: `Official ASL hand sign demonstration for the letter ${letter}`,
    description: `Standard American Sign Language fingerspelling for letter ${letter}.`,
  };
});

// Essential Vocabulary Words with actual asset paths
const WORD_ENTRIES: Array<{ symbol: string; title: string; desc: string; file: string }> = [
  { symbol: 'HELLO', title: 'Hello', desc: 'Open flat hand moving gently outward from temple.', file: 'hello.jpg' },
  { symbol: 'THANK YOU', title: 'Thank You', desc: 'Flat hand fingertips moving outward from chin.', file: 'thank-you.jpg' },
  { symbol: 'PLEASE', title: 'Please', desc: 'Flat open palm rubbing chest in a clockwise circle.', file: 'please.gif' },
  { symbol: 'SORRY', title: 'Sorry', desc: 'Closed A-fist rubbing center of chest in a circular motion.', file: 'sorry.jpg' },
  { symbol: 'YES', title: 'Yes', desc: 'S-fist pivoting up and down like a nodding head.', file: 'yes.jpg' },
  { symbol: 'NO', title: 'No', desc: 'Index and middle fingers snapping shut against the thumb.', file: 'no.jpg' },
  { symbol: 'GOOD', title: 'Good', desc: 'Flat dominant hand moves from chin downward into open non-dominant palm.', file: 'good.jpg' },
  { symbol: 'HELP', title: 'Help', desc: 'Closed thumbs-up fist lifted by flat non-dominant palm.', file: 'help.jpg' },
  { symbol: 'FRIEND', title: 'Friend', desc: 'Interlocking index finger hooks linked together.', file: 'friend.jpg' },
  { symbol: 'WATER', title: 'Water', desc: 'W-handshape index finger tapping the corner of the lower lip.', file: 'water.jpg' },
  { symbol: 'FAMILY', title: 'Family', desc: 'Two F-hands touch index and thumb circles together and sweep out to pinkies.', file: 'family.jpg' },
  { symbol: 'MORE', title: 'More', desc: 'Flattened O-hands tap fingertips together repeatedly.', file: 'more.jpg' },
];

WORD_ENTRIES.forEach((w) => {
  SIGN_ASSETS.WORDS[w.symbol] = {
    id: `word-${w.symbol.toLowerCase().replace(/\s+/g, '-')}`,
    symbol: w.symbol,
    type: 'word',
    title: w.title,
    primaryImage: `/signs/words/${w.file}`,
    fallbackImage: `/signs/words/${w.file}`,
    altText: `ASL visual sign demonstration for ${w.title}`,
    description: w.desc,
  };
});

// Numbers 1 to 10
for (let i = 1; i <= 10; i++) {
  SIGN_ASSETS.NUMBERS[String(i)] = {
    id: `num-${i}`,
    symbol: String(i),
    type: 'number',
    title: `Number ${i}`,
    primaryImage: `/signs/numbers/${i}.jpg`,
    fallbackImage: `/signs/numbers/${i}.jpg`,
    altText: `ASL sign demonstration for the number ${i}`,
    description: `Standard ASL counting sign for number ${i}.`,
  };
}

// Common Phrases
const PHRASE_ENTRIES: Array<{ symbol: string; title: string; image: string; desc: string }> = [
  { symbol: 'HOW ARE YOU', title: 'How Are You', image: '/signs/words/hello.jpg', desc: 'Conversational ASL dialogue inquiry.' },
  { symbol: 'MY NAME IS', title: 'My Name Is', image: '/signs/words/hello.jpg', desc: 'Introduction sign pattern.' },
  { symbol: 'NICE TO MEET YOU', title: 'Nice To Meet You', image: '/signs/words/friend.jpg', desc: 'Polite acquaintance greeting.' },
  { symbol: 'SEE YOU LATER', title: 'See You Later', image: '/signs/words/hello.jpg', desc: 'Casual departure farewell.' },
  { symbol: 'WHAT IS YOUR NAME', title: 'What Is Your Name', image: '/signs/words/help.jpg', desc: 'Question asking for identity.' },
  { symbol: 'THANK YOU VERY MUCH', title: 'Thank You Very Much', image: '/signs/words/thank-you.jpg', desc: 'Emphatic expression of gratitude.' },
];

PHRASE_ENTRIES.forEach((p) => {
  SIGN_ASSETS.PHRASES[p.symbol] = {
    id: `phrase-${p.symbol.toLowerCase().replace(/\s+/g, '-')}`,
    symbol: p.symbol,
    type: 'phrase',
    title: p.title,
    primaryImage: p.image,
    fallbackImage: p.image,
    altText: `ASL demonstration for conversational phrase: ${p.symbol}`,
    description: p.desc,
  };
});

/**
 * Retrieve the SignAsset for any letter, word, or phrase
 */
export function getSignAsset(
  symbolOrTitle: string,
  type?: 'alphabet' | 'word' | 'phrase' | 'number'
): SignAsset {
  const normalized = (symbolOrTitle || '').trim().toUpperCase();

  // 1. Check Alphabet
  if (SIGN_ASSETS.ALPHABET[normalized]) {
    return SIGN_ASSETS.ALPHABET[normalized];
  }

  // 2. Check Words
  if (SIGN_ASSETS.WORDS[normalized]) {
    return SIGN_ASSETS.WORDS[normalized];
  }

  // 3. Check Numbers
  if (SIGN_ASSETS.NUMBERS[normalized]) {
    return SIGN_ASSETS.NUMBERS[normalized];
  }

  // 4. Check Phrases
  if (SIGN_ASSETS.PHRASES[normalized]) {
    return SIGN_ASSETS.PHRASES[normalized];
  }

  // 5. Default fallback to Alphabet A
  return SIGN_ASSETS.ALPHABET['A'];
}

/**
 * Get the best image URL for a sign
 */
export function getSignVisualUrl(symbolOrTitle: string): string {
  const asset = getSignAsset(symbolOrTitle);
  return asset.primaryImage;
}

/**
 * Get meaningful alt text for a sign
 */
export function getSignAltText(symbolOrTitle: string): string {
  const asset = getSignAsset(symbolOrTitle);
  return asset.altText;
}

export default SIGN_ASSETS;
