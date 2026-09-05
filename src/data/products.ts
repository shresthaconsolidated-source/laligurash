export type Family = 'souvenir' | 'terracotta' | 'floral' | 'glass';

export interface Product {
  slug: string;
  name: string;
  family: Family;
  tagline: string;
  description: string;
  /** Retail price in NPR (rounded from the 2026 costing sheet). Undefined = on request. */
  price?: number;
  priceNote?: string;
  image: string;
  gallery?: string[];
  scented: boolean;
  burn: string;
  featured?: boolean;
}

export const SCENTS = [
  { name: 'Rose', note: 'Soft, floral, familiar', color: '#D98A8A' },
  { name: 'Lemongrass', note: 'Bright, green, awake', color: '#B9C26A' },
  { name: 'Sandalwood', note: 'Warm, woody, temple-like', color: '#C69A6B' },
  { name: 'Lavender', note: 'Calm, herbal, evening', color: '#A392C2' },
];

export const FAMILIES: Record<Family, { label: string; blurb: string }> = {
  souvenir: { label: 'Souvenir Glass', blurb: 'Nepal in a shot glass. Om, stupa and Buddha-eye prints for the suitcase home.' },
  terracotta: { label: 'Terracotta', blurb: 'Soy wax poured into matkas, pots and saucers from valley kilns.' },
  floral: { label: 'Floral', blurb: 'Daisies, lotus and peonies sculpted in wax, one petal at a time.' },
  glass: { label: 'Glass Jar', blurb: 'Clear jars, wooden lids, a clean warm glow for any shelf.' },
};

export const PRODUCTS: Product[] = [
  {
    slug: 'souvenir-shot-glass',
    name: 'Souvenir Shot Glass Candle',
    family: 'souvenir',
    tagline: 'Nepal, printed on glass',
    description:
      'A scented soy candle in a shot glass printed with Om, Boudhanath stupa, prayer flags or Buddha eyes. Small enough for a backpack, made to be lit on the first night home.',
    price: 310,
    image: '/catalog/shot-glass-om.jpg',
    gallery: ['/catalog/shot-glass-om.jpg', '/catalog/shot-glass-stupa.jpg', '/catalog/shot-glass-trio.jpg'],
    scented: true,
    burn: '4+ hours',
    featured: true,
  },
  {
    slug: 'frosted-souvenir-glass',
    name: 'Frosted Souvenir Glass',
    family: 'souvenir',
    tagline: 'Same prints, softer light',
    description: 'The souvenir candle in frosted glass. The flame diffuses through the frost so the whole glass glows.',
    price: 375,
    image: '/catalog/shot-glass-trio.jpg',
    scented: true,
    burn: '4+ hours',
  },
  {
    slug: 'terracotta-matka',
    name: 'Terracotta Matka Soy Candle',
    family: 'terracotta',
    tagline: 'The water pot, lit',
    description:
      'Soy wax hand-poured into a miniature terracotta matka, the clay water pot found in every Nepali kitchen. Finished with our vintage floral label.',
    price: 225,
    image: '/catalog/matka-pair.jpg',
    scented: true,
    burn: '5+ hours',
    featured: true,
  },
  {
    slug: 'floral-terracotta-pot',
    name: 'Floral Terracotta Pot Candle',
    family: 'terracotta',
    tagline: 'A flowerpot that blooms in wax',
    description:
      'Rustic flowerpots topped with hand-molded wax daisies. Three sizes, from a palm-sized pot to a table centrepiece.',
    price: 265,
    priceNote: 'small size, up to NPR 375 for large',
    image: '/catalog/floral-pots.jpg',
    scented: true,
    burn: '5 to 9 hours',
    featured: true,
  },
  {
    slug: 'succulent-pot',
    name: 'Succulent Pot Candle',
    family: 'terracotta',
    tagline: 'The plant you cannot kill',
    description:
      'A wax succulent in a terracotta pot, boxed with a twine tag. The most-gifted piece in the range for a reason.',
    price: 235,
    image: '/catalog/succulent-pots.jpg',
    scented: true,
    burn: '6+ hours',
    featured: true,
  },
  {
    slug: 'blooming-lotus',
    name: 'Blooming Lotus Candle',
    family: 'floral',
    tagline: 'For the altar or the bath',
    description: 'A lotus sculpted in soy wax, set in a shallow terracotta saucer. Made for pujas, spas and quiet evenings.',
    price: 180,
    image: '/catalog/lotus-saucer.jpg',
    scented: true,
    burn: '4+ hours',
  },
  {
    slug: 'daisy-candle',
    name: 'Daisy Candle',
    family: 'floral',
    tagline: 'Small, bright, giftable',
    description: 'Single wax daisies on a printed card backing. Sold by the piece, priced for return gifts and party favours.',
    price: 75,
    image: '/catalog/daisy-cards.jpg',
    scented: true,
    burn: '1+ hour',
  },
  {
    slug: 'peony-bloom',
    name: 'Peony Bloom Candle',
    family: 'floral',
    tagline: 'The showpiece',
    description: 'Large peony and rose blooms in teal, coral and blush, presented in a terracotta dish. Made to order in your colours.',
    image: '/catalog/peony-blue.jpg',
    gallery: ['/catalog/peony-blue.jpg', '/catalog/peony-trio.jpg'],
    scented: true,
    burn: '3+ hours',
  },
  {
    slug: 'floral-diyo',
    name: 'Floral Diyo',
    family: 'floral',
    tagline: 'Tihar, by the dozen',
    description: 'A clay diyo filled with scented soy wax and a wax flower. Ordered in sets for Tihar, Dashain and housewarmings.',
    price: 45,
    image: '/images/4.png',
    scented: true,
    burn: '1+ hour',
  },
  {
    slug: 'clear-glass-jar',
    name: 'Clear Glass Jar Candle',
    family: 'glass',
    tagline: 'The everyday one',
    description: 'A plain glass tumbler, coloured soy wax and the Laligurash label. No frills, just a clean four-hour burn.',
    price: 190,
    image: '/catalog/glass-jar-lit.jpg',
    scented: true,
    burn: '4+ hours',
  },
  {
    slug: 'glass-jar-wooden-lid',
    name: 'Glass Jar with Wooden Lid',
    family: 'glass',
    tagline: 'Flowers under glass',
    description: 'Sculpted wax blooms in a clear jar, sealed with a natural wooden lid. Keeps the scent until you are ready.',
    image: '/catalog/glass-jar-lids.jpg',
    scented: true,
    burn: '6+ hours',
  },
];

export const featured = () => PRODUCTS.filter((p) => p.featured);
export const byFamily = (f: Family) => PRODUCTS.filter((p) => p.family === f);
export const npr = (n: number) => `NPR ${n.toLocaleString('en-IN')}`;
