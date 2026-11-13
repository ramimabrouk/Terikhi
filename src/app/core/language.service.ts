import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type Language = 'fr' | 'ar';

type TranslationKey =
  | 'brand.subtitle'
  | 'search'
  | 'regions'
  | 'all'
  | 'north'
  | 'centre'
  | 'south'
  | 'zoom'
  | 'governorates'
  | 'clickToOpen'
  | 'browse'
  | 'governorateIndex'
  | 'backToMap'
  | 'scroll'
  | 'sheet'
  | 'history'
  | 'origin'
  | 'places'
  | 'food'
  | 'sections'
  | 'region'
  | 'population'
  | 'area'
  | 'altitude'
  | 'specialties'
  | 'capital'
  | 'lastViewed'
  | 'generalIndex'
  | 'searchPlaceholder'
  | 'regionFilter'
  | 'removeRegionFilter'
  | 'noResults'
  | 'noMatch'
  | 'tryAnother'
  | 'resetSearch'
  | 'governoratesCount'
  | 'fourSections'
  | 'previous'
  | 'next'
  | 'openAtlas'
  | 'skipIntro'
  | 'twentyFourGovernorates'
  | 'atlasIntro'
  | 'foodAndPlaces'
  | 'gallery'
  | 'closeGallery'
  | 'photos'
  | 'choosePhoto'
  | 'language'
  | 'inhabitants'
  | 'squareKilometers'
  | 'coastal'
  | 'inland'
  | 'rubric'
  | 'etymology'
  | 'showPhoto'
  | 'interactiveAvatar'
  | 'avatarHint'
  | 'avatarAria'
  | 'narration'
  | 'narrationOn'
  | 'narrationOff'
  | 'voice'
  | 'speed'
  | 'testVoice'
  | 'noVoice'
  | 'puzzle'
  | 'puzzleTitle'
  | 'puzzleIntro'
  | 'easy'
  | 'expert'
  | 'hint'
  | 'shuffle'
  | 'close'
  | 'time'
  | 'moves'
  | 'placed'
  | 'bravo'
  | 'puzzleDone'
  | 'yourName'
  | 'saveScore'
  | 'leaderboard'
  | 'playAgain'
  | 'offline'
  | 'copied'
  | 'knownFor'
  | 'popular'
  | 'views'
  | 'meetGuide'
  | 'scoreSaved'
  | 'copy'
;

const TRANSLATIONS: Record<Language, Record<TranslationKey, string>> = {
  fr: {
    'brand.subtitle': 'Atlas éditorial · Édition 2026',
    search: 'Rechercher',
    regions: 'Régions',
    all: 'Toutes',
    north: 'Nord',
    centre: 'Centre',
    south: 'Sud',
    zoom: 'Zoom sur',
    governorates: 'gouvernorats',
    clickToOpen: 'Cliquez un gouvernorat pour ouvrir sa fiche.',
    browse: 'Parcourir',
    governorateIndex: 'Index des gouvernorats',
    backToMap: 'Retour à la carte',
    scroll: 'Défiler',
    sheet: 'Fiche',
    history: 'Histoire',
    origin: 'Origine du nom',
    places: 'À visiter',
    food: 'Gastronomie',
    sections: 'Rubriques',
    region: 'Région',
    population: 'Population',
    area: 'Superficie',
    altitude: 'Altitude',
    specialties: 'Spécialités',
    capital: 'Capitale',
    lastViewed: 'Dernière fiche',
    generalIndex: 'Index général',
    searchPlaceholder: 'Nom, région, spécialité…',
    regionFilter: 'Filtre de région',
    removeRegionFilter: 'Retirer le filtre de région',
    noResults: 'Aucun résultat',
    noMatch: 'Aucun gouvernorat ne correspond à cette recherche.',
    tryAnother: 'Essayez un autre nom, une région ou une spécialité locale.',
    resetSearch: 'Réinitialiser la recherche',
    governoratesCount: 'gouvernorats',
    fourSections: 'quatre rubriques',
    previous: 'Précédent',
    next: 'Suivant',
    openAtlas: "Ouvrir l'atlas",
    skipIntro: "Passer l'introduction",
    twentyFourGovernorates: 'Vingt-quatre gouvernorats',
    atlasIntro: 'Introduction à l’atlas de Tunisie',
    foodAndPlaces: 'À voir et à goûter',
    gallery: 'Galerie de photos',
    closeGallery: 'Fermer la galerie',
    photos: 'photos',
    choosePhoto: 'Choisir une photo',
    language: 'العربية',
    inhabitants: 'hab.',
    squareKilometers: 'km²',
    coastal: 'Littoral',
    inland: 'Intérieur',
    rubric: 'Rubrique',
    etymology: 'Étymologie',
    showPhoto: 'Afficher la photo',
    interactiveAvatar: 'Votre guide',
    avatarHint: 'Elle suit vos gestes · cliquez pour l’écouter',
    avatarAria: 'Avatar SVG d’Élissa, reine fondatrice de Carthage, qui réagit à vos gestes',
    narration: 'Narration',
    narrationOn: 'Narration activée',
    narrationOff: 'Narration coupée',
    voice: 'Voix',
    speed: 'Vitesse',
    testVoice: 'Tester la voix',
    noVoice: 'Aucune voix disponible dans ce navigateur',
    puzzle: 'Puzzle',
    puzzleTitle: 'Reconstituez la Tunisie',
    puzzleIntro: 'Glissez chaque gouvernorat à sa place. Il s’aimante quand il est proche.',
    easy: 'Facile',
    expert: 'Expert',
    hint: 'Indice',
    shuffle: 'Mélanger',
    close: 'Fermer',
    time: 'Temps',
    moves: 'Coups',
    placed: 'Placés',
    bravo: 'Bravo !',
    puzzleDone: 'La Tunisie est reconstituée.',
    yourName: 'Votre nom',
    saveScore: 'Enregistrer',
    leaderboard: 'Meilleurs temps',
    playAgain: 'Rejouer',
    offline: 'hors ligne · scores locaux',
    copied: 'Copié dans le presse-papiers',
    knownFor: 'Réputée pour',
    popular: 'Les plus explorés',
    views: 'vues',
    meetGuide: 'Je suis Élissa, reine fondatrice de Carthage. Promenez-vous sur la carte, je vous raconte la Tunisie.',
    scoreSaved: 'Score enregistré',
    copy: 'Copier',
  },
  ar: {
    'brand.subtitle': 'أطلس تحريري · إصدار 2026',
    search: 'بحث',
    regions: 'المناطق',
    all: 'الكل',
    north: 'الشمال',
    centre: 'الوسط',
    south: 'الجنوب',
    zoom: 'تكبير',
    governorates: 'ولاية',
    clickToOpen: 'اضغط على ولاية لفتح بطاقتها.',
    browse: 'تصفح',
    governorateIndex: 'فهرس الولايات',
    backToMap: 'العودة إلى الخريطة',
    scroll: 'مرر',
    sheet: 'بطاقة',
    history: 'التاريخ',
    origin: 'أصل الاسم',
    places: 'أماكن للزيارة',
    food: 'المأكولات',
    sections: 'الأقسام',
    region: 'المنطقة',
    population: 'السكان',
    area: 'المساحة',
    altitude: 'الارتفاع',
    specialties: 'المميزات',
    capital: 'العاصمة',
    lastViewed: 'آخر بطاقة',
    generalIndex: 'الفهرس العام',
    searchPlaceholder: 'الاسم، المنطقة، التخصص…',
    regionFilter: 'تصفية المنطقة',
    removeRegionFilter: 'إزالة تصفية المنطقة',
    noResults: 'لا توجد نتائج',
    noMatch: 'لا توجد ولاية تطابق هذا البحث.',
    tryAnother: 'جرّب اسماً أو منطقة أو تخصصاً محلياً آخر.',
    resetSearch: 'إعادة ضبط البحث',
    governoratesCount: 'ولايات',
    fourSections: 'أربعة أقسام',
    previous: 'السابق',
    next: 'التالي',
    openAtlas: 'فتح الأطلس',
    skipIntro: 'تخطي المقدمة',
    twentyFourGovernorates: 'أربع وعشرون ولاية',
    atlasIntro: 'مقدمة أطلس تونس',
    foodAndPlaces: 'أماكن ومذاقات',
    gallery: 'معرض الصور',
    closeGallery: 'إغلاق المعرض',
    photos: 'صور',
    choosePhoto: 'اختر صورة',
    language: 'Français',
    inhabitants: 'نسمة',
    squareKilometers: 'كم²',
    coastal: 'ساحلي',
    inland: 'داخلي',
    rubric: 'القسم',
    etymology: 'أصل الكلمة',
    showPhoto: 'عرض الصورة',
    interactiveAvatar: 'مرشدة تفاعلية',
    avatarHint: 'تتبع حركاتك · اضغط لتسمعها',
    avatarAria: 'صورة SVG لعليسة، الملكة المؤسسة لقرطاج، تتفاعل مع حركاتك',
    narration: 'السرد الصوتي',
    narrationOn: 'السرد مفعّل',
    narrationOff: 'السرد متوقف',
    voice: 'الصوت',
    speed: 'السرعة',
    testVoice: 'تجربة الصوت',
    noVoice: 'لا يوجد صوت متاح في هذا المتصفح',
    puzzle: 'لغز',
    puzzleTitle: 'أعد تركيب خريطة تونس',
    puzzleIntro: 'اسحب كل ولاية إلى مكانها. تلتصق عندما تقترب.',
    easy: 'سهل',
    expert: 'خبير',
    hint: 'تلميح',
    shuffle: 'خلط',
    close: 'إغلاق',
    time: 'الوقت',
    moves: 'الحركات',
    placed: 'في مكانها',
    bravo: 'أحسنت!',
    puzzleDone: 'اكتملت خريطة تونس.',
    yourName: 'اسمك',
    saveScore: 'حفظ',
    leaderboard: 'أفضل الأوقات',
    playAgain: 'العب مجدداً',
    offline: 'غير متصل · نتائج محلية',
    copied: 'تم النسخ',
    knownFor: 'تشتهر بـ',
    popular: 'الأكثر استكشافاً',
    views: 'مشاهدة',
    meetGuide: 'أنا عليسة، الملكة المؤسسة لقرطاج. تجوّل في الخريطة وسأحكي لك عن تونس.',
    scoreSaved: 'تم حفظ النتيجة',
    copy: 'نسخ',
  },
};

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  readonly language = signal<Language>(this.readLanguage());
  readonly isArabic = computed(() => this.language() === 'ar');

  constructor() {
    effect(() => {
      const language = this.language();
      this.document.documentElement.lang = language;
      this.document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      this.document.defaultView?.localStorage.setItem('tunisia-explorer:language', language);
    });
  }

  t(key: TranslationKey): string {
    return TRANSLATIONS[this.language()][key];
  }

  toggle(): void {
    this.language.update((language) => (language === 'fr' ? 'ar' : 'fr'));
  }

  private readLanguage(): Language {
    try {
      return this.document.defaultView?.localStorage.getItem('tunisia-explorer:language') === 'ar'
        ? 'ar'
        : 'fr';
    } catch {
      return 'fr';
    }
  }
}
