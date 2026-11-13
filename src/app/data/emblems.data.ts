/**
 * What each governorate is best known for — shown as an animated emblem
 * (icon + photo) when the region is opened on the map.
 */
export interface RegionEmblem {
  icon: string;
  fr: string;
  ar: string;
  photo: string;
}

export const REGION_EMBLEMS: Readonly<Record<string, RegionEmblem>> = {
  tunis: {
    icon: '🕌',
    fr: 'sa médina et la mosquée Zitouna',
    ar: 'مدينتها العتيقة وجامع الزيتونة',
    photo: '/gouvernorats/Tunis/Lieux-a-visiter/03-mosquee-zitouna-1.jpg',
  },
  ariana: {
    icon: '🌹',
    fr: "la rose de l'Ariana",
    ar: 'وردة أريانة',
    photo: '/gouvernorats/Ariana/Lieux-a-visiter/01-parc-ennahli-1.jpg',
  },
  'ben-arous': {
    icon: '🍇',
    fr: 'les vignobles de Mornag',
    ar: 'كروم مرناق',
    photo: '/gouvernorats/Ben Arous/Gastronomie/02-produits-locaux-1.jpg',
  },
  manouba: {
    icon: '👑',
    fr: 'ses palais beylicaux',
    ar: 'قصورها البايلية',
    photo: '/gouvernorats/Manouba/Lieux-a-visiter/02-palais-de-la-manouba-1.jpg',
  },
  nabeul: {
    icon: '🌶️',
    fr: 'la harissa et la poterie',
    ar: 'الهريسة والفخار',
    photo: '/gouvernorats/Nabeul/Gastronomie/01-harissa-1.jpg',
  },
  bizerte: {
    icon: '🐟',
    fr: 'ses poissons et son vieux port',
    ar: 'أسماكها وميناؤها القديم',
    photo: '/gouvernorats/Bizerte/Gastronomie/01-poissons-1.jpg',
  },
  beja: {
    icon: '🌾',
    fr: 'son blé, ancien grenier de Rome',
    ar: 'قمحها، مطمور روما',
    photo: '/gouvernorats/Béja/Gastronomie/03-produits-cerealiers-1.jpg',
  },
  jendouba: {
    icon: '🌲',
    fr: 'ses forêts de chênes-lièges',
    ar: 'غابات الفلين',
    photo: '/gouvernorats/Jendouba/Lieux-a-visiter/03-forets-de-tabarka-1.jpg',
  },
  'le-kef': {
    icon: '🏰',
    fr: 'sa kasbah perchée',
    ar: 'قصبتها المعلقة',
    photo: '/gouvernorats/Le Kef/Lieux-a-visiter/01-kasbah-du-kef-1.jpg',
  },
  siliana: {
    icon: '⛰️',
    fr: 'ses montagnes et Makthar',
    ar: 'جبالها ومكثر',
    photo: '/gouvernorats/Siliana/Lieux-a-visiter/01-makthar-1.jpg',
  },
  zaghouan: {
    icon: '💧',
    fr: 'le temple des Eaux',
    ar: 'معبد المياه',
    photo: '/gouvernorats/Zaghouan/Lieux-a-visiter/01-temple-des-eaux-1.jpg',
  },
  sousse: {
    icon: '⛵',
    fr: 'son ribat et Port El Kantaoui',
    ar: 'رباطها ومرسى القنطاوي',
    photo: '/gouvernorats/Sousse/Lieux-a-visiter/01-ribat-de-sousse-1.jpg',
  },
  monastir: {
    icon: '🏖️',
    fr: 'ses plages et son ribat',
    ar: 'شواطئها ورباطها',
    photo: '/gouvernorats/Monastir/Lieux-a-visiter/01-ribat-de-monastir-1.jpg',
  },
  mahdia: {
    icon: '🧵',
    fr: 'ses soieries et la Skifa Kahla',
    ar: 'حريرها والسقيفة الكحلة',
    photo: '/gouvernorats/Mahdia/Lieux-a-visiter/02-skifa-kahla-1.jpg',
  },
  sfax: {
    icon: '🫒',
    fr: "ses oliveraies et sa médina",
    ar: 'زياتينها ومدينتها العتيقة',
    photo: '/gouvernorats/Sfax/Lieux-a-visiter/01-medina-de-sfax-1.jpg',
  },
  kairouan: {
    icon: '🧶',
    fr: 'ses tapis et sa Grande Mosquée',
    ar: 'زرابيها وجامعها الكبير',
    photo: '/gouvernorats/Kairouan/Lieux-a-visiter/01-grande-mosquee-1.jpg',
  },
  kasserine: {
    icon: '🏛️',
    fr: 'les ruines romaines de Sbeïtla',
    ar: 'آثار سبيطلة الرومانية',
    photo: '/gouvernorats/Kasserine/Lieux-a-visiter/01-sbeitla-1.jpg',
  },
  'sidi-bouzid': {
    icon: '🍅',
    fr: 'son maraîchage',
    ar: 'زراعاتها السقوية',
    photo: '/gouvernorats/Sidi Bouzid/Gastronomie/02-produits-agricoles-1.jpg',
  },
  gabes: {
    icon: '🌿',
    fr: "le henné et l'oasis maritime",
    ar: 'الحناء والواحة البحرية',
    photo: '/gouvernorats/Gabès/Gastronomie/01-henne-1.jpg',
  },
  medenine: {
    icon: '🏝️',
    fr: "l'île de Djerba",
    ar: 'جزيرة جربة',
    photo: '/gouvernorats/Médenine/Lieux-a-visiter/01-djerba-1.jpg',
  },
  tataouine: {
    icon: '🏜️',
    fr: 'ses ksour du désert',
    ar: 'قصورها الصحراوية',
    photo: '/gouvernorats/Tataouine/Lieux-a-visiter/01-ksour-1.jpg',
  },
  gafsa: {
    icon: '⛏️',
    fr: 'les phosphates et les piscines romaines',
    ar: 'الفسفاط والبرك الرومانية',
    photo: '/gouvernorats/Gafsa/Lieux-a-visiter/02-piscine-romaine-1.jpg',
  },
  tozeur: {
    icon: '🌴',
    fr: 'les dattes Deglet Nour',
    ar: 'تمور دقلة النور',
    photo: '/gouvernorats/Tozeur/Gastronomie/01-dattes-deglet-nour-1.jpg',
  },
  kebili: {
    icon: '🐪',
    fr: 'Douz, porte du Sahara',
    ar: 'دوز، بوابة الصحراء',
    photo: '/gouvernorats/Kébili/Lieux-a-visiter/01-douz-1.jpg',
  },
};
