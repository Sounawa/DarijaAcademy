'use client';

import { useState } from 'react';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  AlertTriangle,
  Star,
  ChevronDown,
  ChevronUp,
  Info,
  Sparkles,
  Waves,
  MessageCircle,
  Lightbulb,
} from 'lucide-react';

/* ================================================================
   DATA: Arabic Alphabet with Darija specifics
   ================================================================ */

type Difficulty = 'easy' | 'medium' | 'hard';

interface ArabicLetter {
  letter: string;        // Arabic script
  name: string;          // French name
  phonetic: string;      // IPA-style phonetic
  frenchApprox: string;  // French approximation
  exampleAr: string;     // Example in Arabic script
  examplePh: string;     // Example phonetic
  exampleFr: string;     // Example French translation
  difficulty: Difficulty;
  note?: string;         // Optional note about the letter
}

const arabicAlphabet: ArabicLetter[] = [
  {
    letter: 'ا',
    name: 'Alif',
    phonetic: '/a/',
    frenchApprox: 'Comme "a" dans "pâte"',
    exampleAr: 'أُمّا',
    examplePh: 'umma',
    exampleFr: 'Maman',
    difficulty: 'easy',
    note: 'Lettre support, peut aussi être un coup de glotte',
  },
  {
    letter: 'ب',
    name: 'Ba',
    phonetic: '/b/',
    frenchApprox: 'Comme "b" dans "bon"',
    exampleAr: 'باب',
    examplePh: 'bab',
    exampleFr: 'Porte',
    difficulty: 'easy',
  },
  {
    letter: 'ت',
    name: 'Ta',
    phonetic: '/t/',
    frenchApprox: 'Comme "t" dans "très"',
    exampleAr: 'تبغا',
    examplePh: 'tbgha',
    exampleFr: 'Tu veux',
    difficulty: 'easy',
  },
  {
    letter: 'ث',
    name: 'Tha',
    phonetic: '/θ/',
    frenchApprox: 'Comme "th" dans "think" (anglais)',
    exampleAr: 'ثلاجة',
    examplePh: 'tallaja',
    exampleFr: 'Réfrigérateur',
    difficulty: 'hard',
    note: 'En darija, souvent prononcé comme "t" ou "s". Très rarement utilisé.',
  },
  {
    letter: 'ج',
    name: 'Jim',
    phonetic: '/dʒ/',
    frenchApprox: 'Comme "j" dans "journal"',
    exampleAr: 'جاد',
    examplePh: 'jad',
    exampleFr: 'Il a passé (le temps)',
    difficulty: 'easy',
    note: 'Dans certaines régions du Maroc, prononcé comme "g" doux (girafe).',
  },
  {
    letter: 'ح',
    name: 'Ha',
    phonetic: '/ħ/',
    frenchApprox: '"h" expiré du fond de la gorge',
    exampleAr: 'حبيبي',
    examplePh: 'ḥabibi',
    exampleFr: 'Mon amour',
    difficulty: 'hard',
    note: 'Consonne très importante en darija. Ne confondez pas avec le "h" anglais !',
  },
  {
    letter: 'خ',
    name: 'Kha',
    phonetic: '/x/',
    frenchApprox: 'Comme le "j" espagnol dans "Juan"',
    exampleAr: 'خويا',
    examplePh: 'khuya',
    exampleFr: 'Mon frère',
    difficulty: 'medium',
  },
  {
    letter: 'د',
    name: 'Dal',
    phonetic: '/d/',
    frenchApprox: 'Comme "d" dans "don"',
    exampleAr: 'دار',
    examplePh: 'dar',
    exampleFr: 'Maison',
    difficulty: 'easy',
  },
  {
    letter: 'ذ',
    name: 'Dhal',
    phonetic: '/ð/',
    frenchApprox: 'Comme "th" dans "this" (anglais)',
    exampleAr: 'ذ',
    examplePh: 'dha',
    exampleFr: '(lettre, rare en darija)',
    difficulty: 'hard',
    note: 'Presque absent en darija. Remplacé par "d" ou "z" dans la plupart des mots.',
  },
  {
    letter: 'ر',
    name: 'Ra',
    phonetic: '/r/',
    frenchApprox: '"r" roulé (comme en espagnol)',
    exampleAr: 'راه',
    examplePh: 'rah',
    exampleFr: 'Il est (déjà)',
    difficulty: 'medium',
    note: 'Toujours roulé en darija, jamais le "r" français guttural.',
  },
  {
    letter: 'ز',
    name: 'Zay',
    phonetic: '/z/',
    frenchApprox: 'Comme "z" dans "zéro"',
    exampleAr: 'زهر',
    examplePh: 'zhar',
    exampleFr: 'Fleur',
    difficulty: 'easy',
  },
  {
    letter: 'س',
    name: 'Sin',
    phonetic: '/s/',
    frenchApprox: 'Comme "s" dans "soir"',
    exampleAr: 'سميتي',
    examplePh: 'smiti',
    exampleFr: 'Mon nom',
    difficulty: 'easy',
  },
  {
    letter: 'ش',
    name: 'Shin',
    phonetic: '/ʃ/',
    frenchApprox: 'Comme "ch" dans "chat"',
    exampleAr: 'شكون',
    examplePh: 'chkoun',
    exampleFr: 'Qui ?',
    difficulty: 'easy',
  },
  {
    letter: 'ص',
    name: 'Sad',
    phonetic: '/sˁ/',
    frenchApprox: '"s" lourd et profond',
    exampleAr: 'صباح',
    examplePh: 'sbaḥ',
    exampleFr: 'Matin',
    difficulty: 'hard',
    note: 'Consonne emphatique : prononcez "s" en reculant la base de la langue.',
  },
  {
    letter: 'ض',
    name: 'Dad',
    phonetic: '/dˁ/',
    frenchApprox: '"d" lourd et profond',
    exampleAr: 'ضرب',
    examplePh: 'ḍrab',
    exampleFr: 'Il a frappé',
    difficulty: 'hard',
    note: 'Consonne emphatique. Très caractéristique de l\'arabe. Reculez la langue.',
  },
  {
    letter: 'ط',
    name: 'Ta emphatique',
    phonetic: '/tˁ/',
    frenchApprox: '"t" lourd et profond',
    exampleAr: 'طوموبيل',
    examplePh: 'ṭumubil',
    exampleFr: 'Voiture',
    difficulty: 'hard',
    note: 'Emphatique. La bouche doit être plus ouverte et la langue plus en arrière.',
  },
  {
    letter: 'ظ',
    name: 'Zha',
    phonetic: '/zˁ/',
    frenchApprox: '"z" lourd et profond',
    exampleAr: 'ظرف',
    examplePh: 'ẓarf',
    exampleFr: 'Enveloppe',
    difficulty: 'hard',
    note: 'Très rare en darija. Souvent remplacé par "z" normal.',
  },
  {
    letter: 'ع',
    name: 'Ain',
    phonetic: '/ʕ/',
    frenchApprox: 'Consonne gutturale profonde',
    exampleAr: 'عافاك',
    examplePh: 'ʿafak',
    exampleFr: 'S\'il te plaît',
    difficulty: 'hard',
    note: 'Son guttural unique. Serrez la gorge comme pour prononcer un "a" très profond.',
  },
  {
    letter: 'غ',
    name: 'Ghain',
    phonetic: '/ɣ/',
    frenchApprox: 'Comme le "r" parisien français',
    exampleAr: 'غادي',
    examplePh: 'ghadi',
    exampleFr: 'Il va / Il est en train de',
    difficulty: 'medium',
    note: 'LE son emblématique du darija ! Exactement comme le "r" français.',
  },
  {
    letter: 'ف',
    name: 'Fa',
    phonetic: '/f/',
    frenchApprox: 'Comme "f" dans "faire"',
    exampleAr: 'فهمت',
    examplePh: 'fhemt',
    exampleFr: 'J\'ai compris',
    difficulty: 'easy',
  },
  {
    letter: 'ق',
    name: 'Qaf',
    phonetic: '/q/ → /ʔ/',
    frenchApprox: 'Souvent un coup de glotte en darija',
    exampleAr: 'قبل',
    examplePh: 'qbəl / 2bəl',
    exampleFr: 'Avant',
    difficulty: 'medium',
    note: 'En darija marocain, le Qaf est presque toujours remplacé par un coup de glotte.',
  },
  {
    letter: 'ك',
    name: 'Kaf',
    phonetic: '/k/',
    frenchApprox: 'Comme "k" dans "kiwi"',
    exampleAr: 'كلشي',
    examplePh: 'kllchi',
    exampleFr: 'Tout',
    difficulty: 'easy',
  },
  {
    letter: 'ل',
    name: 'Lam',
    phonetic: '/l/',
    frenchApprox: 'Comme "l" dans "lune"',
    exampleAr: 'لاباس',
    examplePh: 'labas',
    exampleFr: 'Ça va ?',
    difficulty: 'easy',
  },
  {
    letter: 'م',
    name: 'Mim',
    phonetic: '/m/',
    frenchApprox: 'Comme "m" dans "manger"',
    exampleAr: 'مبروك',
    examplePh: 'mabrouk',
    exampleFr: 'Félicitations !',
    difficulty: 'easy',
  },
  {
    letter: 'ن',
    name: 'Nun',
    phonetic: '/n/',
    frenchApprox: 'Comme "n" dans "non"',
    exampleAr: 'نام',
    examplePh: 'nam',
    exampleFr: 'Il a dormi',
    difficulty: 'easy',
  },
  {
    letter: 'ه',
    name: 'Ha (léger)',
    phonetic: '/h/',
    frenchApprox: 'Comme "h" dans "hello" (anglais)',
    exampleAr: 'هو',
    examplePh: 'huwa',
    exampleFr: 'Lui',
    difficulty: 'easy',
    note: 'Ne pas confondre avec ح (Ha lourd). Celui-ci est doux et léger.',
  },
  {
    letter: 'و',
    name: 'Waw',
    phonetic: '/w/',
    frenchApprox: 'Comme "ou" dans "oui"',
    exampleAr: 'واش',
    examplePh: 'wash',
    exampleFr: 'Est-ce que',
    difficulty: 'easy',
    note: 'Peut aussi servir de voyelle longue "ou" : كوة / kwa / trou.',
  },
  {
    letter: 'ي',
    name: 'Ya',
    phonetic: '/j/',
    frenchApprox: 'Comme "y" dans "yeux"',
    exampleAr: 'يلا',
    examplePh: 'yalla',
    exampleFr: 'Allez !',
    difficulty: 'easy',
    note: 'Peut aussi servir de voyelle longue "i" : بيت / byit / maison.',
  },
];

/* ================================================================
   DATA: Special Moroccan Sounds
   ================================================================ */

interface SpecialSound {
  icon: string;
  title: string;
  arabic: string;
  phonetic: string;
  description: string;
  examples: { ar: string; ph: string; fr: string }[];
  tip: string;
}

const specialSounds: SpecialSound[] = [
  {
    icon: '🌟',
    title: 'Ghain (غ) — Le "R" français',
    arabic: 'غ',
    phonetic: '/ɣ/',
    description:
      'Le Ghain est LE son le plus caractéristique du darija marocain. Il se prononce exactement comme le "r" parisien français. Pour les francophones, c\'est le son le plus facile de l\'arabe !',
    examples: [
      { ar: 'غادي', ph: 'ghadi', fr: 'Il va / il est en train de...' },
      { ar: 'بغيت', ph: 'bghit', fr: 'J\'ai voulu' },
      { ar: 'شغالة', ph: 'shghala', fr: 'En train de travailler' },
      { ar: 'غربة', ph: 'ghrba', fr: 'Étranger / étrangeté' },
    ],
    tip: 'Si vous maîtrisez le "r" français, vous maîtrisez déjà le Ghain marocain ! Rien de plus facile pour un francophone.',
  },
  {
    icon: '⭐',
    title: 'Qaf (ق) — Le coup de glotte',
    arabic: 'ق',
    phonetic: '/ʔ/',
    description:
      'En darija marocain, le Qaf classique de l\'arabe est presque toujours remplacé par un coup de glotte (comme le "t" muet anglais dans "butter" prononcé à l\'anglaise). C\'est une différence majeure avec l\'arabe standard.',
    examples: [
      { ar: 'قال', ph: 'gal / 2al', fr: 'Il a dit' },
      { ar: 'قلب', ph: '2alb / qalb', fr: 'Cœur' },
      { ar: 'قهوة', ph: '2ahwa', fr: 'Café' },
      { ar: 'قبل', ph: '2bəl / qbəl', fr: 'Avant' },
    ],
    tip: 'En darija, "qalbi" (mon cœur) se prononce souvent "2albi". Ne soyez pas surpris ! Le coup de glotte est omniprésent.',
  },
  {
    icon: '⚡',
    title: 'Hamza (ء) — Le coup de glotte officiel',
    arabic: 'ء',
    phonetic: '/ʔ/',
    description:
      'Le Hamza représente un coup de glotte — une interruption brève du flux d\'air dans la gorge. Il est très fréquent en darija, souvent là où l\'arabe standard utiliserait un Qaf.',
    examples: [
      { ar: 'أكل', ph: '2akl', fr: 'Nourriture' },
      { ar: 'أنا', ph: 'ana', fr: 'Je / moi' },
      { ar: 'إمتى', ph: 'imta', fr: 'Quand ?' },
      { ar: 'سؤال', ph: 'su\'al', fr: 'Question' },
    ],
    tip: 'Le Hamza au début d\'un mot s\'écrit souvent avec un Alif de support : أ ou إ.',
  },
  {
    icon: '🔥',
    title: 'Les consonnes emphatiques',
    arabic: 'ص ض ط ظ',
    phonetic: '/sˁ/ /dˁ/ /tˁ/ /zˁ/',
    description:
      'Les emphatiques sont prononcées en reculant la langue vers la gorge et en élargissant la cavité buccale. Elles donnent un son "lourd" et "profond". Les voyelles autour d\'une emphatique deviennent aussi plus sombres.',
    examples: [
      { ar: 'صباح', ph: 'sbaḥ', fr: 'Matin (ص emphatique)' },
      { ar: 'ضرب', ph: 'ḍrab', fr: 'Il a frappé (ض emphatique)' },
      { ar: 'طريقة', ph: 'ṭariqa', fr: 'Méthode (ط emphatique)' },
      { ar: 'ظرف', ph: 'ẓarf', fr: 'Enveloppe (ظ emphatique, rare)' },
    ],
    tip: 'Exercice : prononcez un "s" normal, puis un "s" en imaginant que vous avalez quelque chose. La différence subtile est l\'emphase !',
  },
  {
    icon: '🎯',
    title: 'Ain (ع) — La gutturale mystérieuse',
    arabic: 'ع',
    phonetic: '/ʕ/',
    description:
      'L\'Ain est une consonne gutturale unique à l\'arabe. Elle se prononce au fond de la gorge en contractant les muscles pharyngiens. C\'est un son qui n\'existe pas en français, mais il est extrêmement fréquent en darija.',
    examples: [
      { ar: 'عافاك', ph: 'ʿafak', fr: 'S\'il te plaît' },
      { ar: 'علاش', ph: 'ʿlash', fr: 'Pourquoi ?' },
      { ar: 'عمر', ph: 'ʿmer', fr: 'Âge / jamais (dans ʿmer)', fr: 'Âge / jamais' },
      { ar: 'عمّر', ph: 'ʿammer', fr: 'Vieillard' },
    ],
    tip: 'Exercice : essayez de prononcer un "a" très profond en contractant la gorge. Vous vous rapprochez du son ع ! C\'est un son voisé (les cordes vocales vibrent).',
  },
];

/* ================================================================
   DATA: Common Sound Combinations
   ================================================================ */

interface SoundCombo {
  title: string;
  description: string;
  examples: { combo: string; ar: string; ph: string; fr: string }[];
}

const soundCombinations: SoundCombo[] = [
  {
    title: 'ش + consonne (ch +)',
    description: 'Le "ch" est extrêmement courant en darija et se combine avec presque toutes les consonnes.',
    examples: [
      { combo: 'ش + ك', ar: 'شكون', ph: 'chkoun', fr: 'Qui ?' },
      { combo: 'ش + ب', ar: 'شبّان', ph: 'shbban', fr: 'Jeune (homme)' },
      { combo: 'ش + ر', ar: 'شربة', ph: 'shorba', fr: 'Soupe' },
      { combo: 'ش + م', ar: 'شمس', ph: 'shems', fr: 'Soleil' },
      { combo: 'ش + ع', ar: 'شعار', ph: 'shiʿar', fr: 'Devise / slogan' },
    ],
  },
  {
    title: 'ل + consonne (l +)',
    description: 'La préfixation avec "l" est très fréquente, souvent pour l\'article défini ou les prépositions.',
    examples: [
      { combo: 'ل + ب', ar: 'لبرّا', ph: 'l-berra', fr: 'Dehors' },
      { combo: 'ل + ع', ar: 'لعافية', ph: 'l-ʿafiya', fr: 'Santé / bon appétit' },
      { combo: 'ل + م', ar: 'لماما', ph: 'l-mama', fr: 'Maman (avec article)' },
      { combo: 'ل + ق', ar: 'لقديم', ph: 'l-2dim', fr: 'L\'ancien' },
      { combo: 'ل + ح', ar: 'لحالة', ph: 'l-ḥala', fr: 'La situation' },
    ],
  },
  {
    title: 'ب + consonne (b +)',
    description: 'La préposition "b" (avec/par) se combine souvent avec la consonne suivante.',
    examples: [
      { combo: 'ب + خ', ar: 'بخاطر', ph: 'b-khatir', fr: 'Par cœur' },
      { combo: 'ب + س', ar: 'بسّ', ph: 'bess', fr: 'Suffit / juste' },
      { combo: 'ب + ر', ar: 'برّا', ph: 'berra', fr: 'Dehors' },
      { combo: 'ب + ع', ar: 'بالعافية', ph: 'b-l-ʿafiya', fr: 'Avec bonne santé / bon appétit' },
      { combo: 'ب + غ', ar: 'بغيت', ph: 'bghit', fr: 'J\'ai voulu' },
    ],
  },
  {
    title: 'م + consonne (m +)',
    description: 'Le "m" est très productif en darija : noms de lieu, participes actifs, noms d\'instruments.',
    examples: [
      { combo: 'م + ك', ar: 'مكتبة', ph: 'maktaba', fr: 'Bibliothèque' },
      { combo: 'م + ت', ar: 'مترو', ph: 'metro', fr: 'Métro' },
      { combo: 'م + ع', ar: 'معشّاق', ph: 'mʿashshaq', fr: 'Amateurs / fans' },
      { combo: 'م + ر', ar: 'مرحبا', ph: 'merḥba', fr: 'Bienvenue !' },
      { combo: 'م + ن', ar: 'منين', ph: 'mnin', fr: 'Depuis quand ?' },
    ],
  },
  {
    title: 'Consonnes doubles (gemination)',
    description: 'En darija, les consonnes doubles sont prononcées plus longtemps et plus fortement que les simples. Elles changent le sens du mot !',
    examples: [
      { combo: 'ك vs كك', ar: 'كتب (katab) / كتّب (kattab)', ph: 'katab / kattab', fr: 'Il a écrit / Il a fait écrire' },
      { combo: 'ب vs بب', ar: 'بيت (byit) / بيّت (byyet)', ph: 'byit / byyet', fr: 'Maison / Il a passé la nuit' },
      { combo: 'ر vs رر', ar: 'كبر (kber) / كبّر (kabber)', ph: 'kber / kabber', fr: 'Grand / Il a grandi' },
      { combo: 'ل vs لل', ar: 'علا (ʿla) / علّا (ʿalla)', ph: 'ʿla / ʿalla', fr: 'Il a monté / Il a enseigné' },
    ],
  },
  {
    title: 'Voyelles longues vs courtes',
    description: 'La longueur des voyelles change souvent le sens en darija. Une voyelle longue dure environ deux fois plus longtemps.',
    examples: [
      { combo: 'a vs aa', ar: 'كتب (katab) / كتا (kata)', ph: 'katab / kata', fr: 'Il a écrit / Il a écrivit' },
      { combo: 'i vs ii', ar: 'كبير (kbir) / كبير (kbiir)', ph: 'kbir', fr: 'Grand / Très grand (insistance)' },
      { combo: 'u vs uu', ar: 'بوك (buk) / بوك (buuk)', ph: 'buk / buuk', fr: 'Ton père / Beauté (dialectal)' },
    ],
  },
];

/* ================================================================
   DATA: Pronunciation Tips
   ================================================================ */

interface PronunciationTip {
  icon: string;
  title: string;
  tips: string[];
  category: 'pronunciation' | 'cultural' | 'practice';
}

const pronunciationTips: PronunciationTip[] = [
  {
    icon: '🗣️',
    title: 'Maîtriser les gutturales',
    category: 'pronunciation',
    tips: [
      'Les sons ح (ḥa) et ع (ʿayn) sont des consonnes, pas des voyelles. Ils sont produits dans la gorge.',
      'Pour le ح (ḥa), expirez fortement avec la gorge ouverte, comme pour embuer un miroir.',
      'Pour le ع (ʿayn), contractez les muscles de la gorge comme si vous avaliez quelque chose tout en parlant.',
      'Le خ (kha) est comme le "j" espagnol : positionnez la langue comme pour un "k", mais laissez l\'air passer sur les côtés.',
      'Le غ (ghayn) est votre allié francophone : c\'est exactement le "r" parisien !',
    ],
  },
  {
    icon: '🌍',
    title: 'Variétés régionales du Maroc',
    category: 'cultural',
    tips: [
      'Le nord (Tanger, Tétouan) a des influences espagnole et andalouse.',
      'Fès et Meknès sont réputées pour un darija très "pur" et conservateur.',
      'Casablanca et Rabat parlent un darija plus "moderne" et urbain.',
      'Le sud (Marrakech, Agadir) a un darija avec des influences berbères (amazigh).',
      'Dans le Rif, le Jim (ج) est souvent prononcé comme un "g" doux (girafe).',
      'Les phrases d\'accueil varient : "Salam" vs "Merhba" vs "Ahlan" selon la région.',
    ],
  },

  {
    icon: '🎵',
    title: 'Rythme et intonation du darija',
    category: 'pronunciation',
    tips: [
      'Le darija est parlé plus rapidement que le français — ne cherchez pas à prononcer chaque lettre.',
      'Les voyelles courtes non accentuées sont souvent réduites ou avalées : "kataba" → "katab".',
      'L\'accent tonique tombe généralement sur l\'avant-dernière syllabe.',
      'Les questions commencent souvent par "wash" (واش) avec une intonation montante.',
      'Utilisez "yalla !" (يلا) pour encourager ou presser — il adoucit n\'importe quelle demande.',
    ],
  },
  {
    icon: '🎯',
    title: 'Erreurs courantes des francophones',
    category: 'practice',
    tips: [
      'Ne prononcez pas le "r" arabe comme le "r" français : en arabe, le Ra est TOUJOURS roulé.',
      'Attention à "h" vs "ḥ" : "hub" (amour de la patrie) vs "ḥub" (amour) — ce ne sont pas les mêmes sons !',
      'N\'ajoutez pas de voyelle entre les consonnes : "ism" se prononce "ism", pas "isim".',
      'Le "l" dans "Allah" est prononcé comme un "l" normal, pas un "l" mouillé français.',
      'Ne confondez pas "q" et "k" : en darija, le "q" est presque toujours remplacé par le coup de glotte.',
    ],
  },
  {
    icon: '🇲🇦',
    title: 'Expressions avec des sons difficiles',
    category: 'cultural',
    tips: [
      '"Labas ʿlik ?" (لاباس عليك) — Ça va ? Utilise le ع et le ل enchaînés.',
      '"Bezzaf" (بزاف) — Beaucoup. Le "z" double est important.',
      '"Bghit nwassihek" (بغيت نسويك) — Je veux te faire. Enchaîne gh + t.',
      '"Mʿak" (معاك) — Avec toi. L\'Ain + M est très naturel en darija.',
      '"Shkoun ghadi yʿawnek ?" (شكون غادي يعاونك) — Qui va t\'aider ? Un grand mélange de sons !',
    ],
  },
];

/* ================================================================
   Difficulty badge helper
   ================================================================ */

function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const config = {
    easy: {
      label: 'Facile',
      className:
        'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    },
    medium: {
      label: 'Moyen',
      className:
        'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
    },
    hard: {
      label: 'Difficile',
      className:
        'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800',
    },
  };

  const c = config[difficulty];

  return (
    <Badge variant="outline" className={c.className}>
      {difficulty === 'easy' && '✓ '}
      {difficulty === 'medium' && '◆ '}
      {difficulty === 'hard' && '✦ '}
      {c.label}
    </Badge>
  );
}

/* ================================================================
   Animated letter card
   ================================================================ */

function LetterCard({ letter, index }: { letter: ArabicLetter; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.03, 0.6),
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card
        className="group cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden"
        onClick={() => setExpanded(!expanded)}
      >
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Arabic letter */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-950/50 dark:to-orange-950/50 border border-amber-200/50 dark:border-amber-800/30">
              <span className="font-arabic text-3xl text-amber-800 dark:text-amber-300">
                {letter.letter}
              </span>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-bold">{letter.name}</h3>
                <DifficultyBadge difficulty={letter.difficulty} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{letter.frenchApprox}</p>

              {/* Example */}
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-amber-50/80 dark:bg-amber-950/20 px-3 py-2 border border-amber-100 dark:border-amber-900/30">
                <span className="font-arabic text-lg text-amber-900 dark:text-amber-200">
                  {letter.exampleAr}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs">{letter.exampleFr}</span>
              </div>
            </div>

            {/* Expand indicator */}
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted/50 transition-transform duration-200 group-hover:bg-muted">
              {expanded ? (
                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Expanded note */}
          <AnimatePresence>
            {expanded && letter.note && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 p-3">
                  <Info className="h-4 w-4 mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{letter.note}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ================================================================
   Special sound detail card
   ================================================================ */

function SpecialSoundCard({ sound, index }: { sound: SpecialSound; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-terracotta/10 via-amber-warm/10 to-gold/10 dark:from-terracotta/20 dark:via-amber-warm/10 dark:to-gold/20 px-4 py-3 border-b border-amber-200/30 dark:border-amber-800/20">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{sound.icon}</span>
            <div>
              <h3 className="text-sm font-bold">{sound.title}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-arabic text-lg text-amber-800 dark:text-amber-300">
                  {sound.arabic}
                </span>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{sound.description}</p>

          {/* Examples */}
          <div className="space-y-2 mb-4">
            <p className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              Exemples en darija
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sound.examples.map((ex, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 px-3 py-2"
                >
                  <span className="font-arabic text-base text-amber-900 dark:text-amber-200">
                    {ex.ar}
                  </span>
                  <span className="text-muted-foreground/40 text-xs">|</span>
                  <span className="text-xs text-muted-foreground">{ex.fr}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          <div className="flex items-start gap-2 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 p-3">
            <Lightbulb className="h-4 w-4 mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
              {sound.tip}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ================================================================
   Sound combination section
   ================================================================ */

function CombinationCard({ combo, index }: { combo: SoundCombo; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-4">
          <button
            className="w-full text-left"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">{combo.title}</h3>
                <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                  {combo.description}
                </p>
              </div>
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40 transition-transform duration-200 ml-2">
                {expanded ? (
                  <ChevronUp className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                )}
              </div>
            </div>
          </button>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-3 space-y-2">
                  {combo.examples.map((ex, i) => (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100/50 dark:border-amber-900/30 px-3 py-2"
                    >
                      <Badge
                        variant="outline"
                        className="shrink-0 w-fit bg-terracotta/10 text-terracotta border-terracotta/20 dark:bg-terracotta/20 dark:text-terracotta dark:border-terracotta/30"
                      >
                        {ex.combo}
                      </Badge>
                      <span className="font-arabic text-base text-amber-900 dark:text-amber-200">
                        {ex.ar}
                      </span>
                      <span className="text-muted-foreground/40 text-xs hidden sm:inline">|</span>
                      <span className="text-xs text-muted-foreground">{ex.fr}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ================================================================
   Pronunciation tip card
   ================================================================ */

function TipCard({ tip, index }: { tip: PronunciationTip; index: number }) {
  const categoryConfig = {
    pronunciation: {
      label: 'Prononciation',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-950/30',
      border: 'border-amber-200/50 dark:border-amber-800/30',
      cardBg: 'from-amber-50/50 to-orange-50/30 dark:from-amber-950/15 dark:to-orange-950/10',
    },
    cultural: {
      label: 'Culture',
      color: 'text-teal-moroccan dark:text-teal-400',
      bg: 'bg-teal-100 dark:bg-teal-950/30',
      border: 'border-teal-200/50 dark:border-teal-800/30',
      cardBg: 'from-teal-50/50 to-emerald-50/30 dark:from-teal-950/15 dark:to-emerald-950/10',
    },
    practice: {
      label: 'Pratique',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-100 dark:bg-rose-950/30',
      border: 'border-rose-200/50 dark:border-rose-800/30',
      cardBg: 'from-rose-50/50 to-amber-50/30 dark:from-rose-950/15 dark:to-amber-950/10',
    },
  };

  const config = categoryConfig[tip.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <Card className={`overflow-hidden bg-gradient-to-br ${config.cardBg}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">{tip.icon}</span>
              <CardTitle className="text-sm">{tip.title}</CardTitle>
            </div>
            <Badge
              variant="outline"
              className={`${config.bg} ${config.color} ${config.border} text-[10px]`}
            >
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <ul className="space-y-2.5">
            {tip.tips.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${config.bg.replace('/30', '/60').replace('/20', '/40')}`}
                  style={{
                    backgroundColor:
                      tip.category === 'pronunciation'
                        ? '#F59E0B'
                        : tip.category === 'cultural'
                          ? '#1B9AAA'
                          : '#F43F5E',
                  }}
                />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ================================================================
   Stats summary bar
   ================================================================ */

function AlphabetStats() {
  const easyCount = arabicAlphabet.filter((l) => l.difficulty === 'easy').length;
  const mediumCount = arabicAlphabet.filter((l) => l.difficulty === 'medium').length;
  const hardCount = arabicAlphabet.filter((l) => l.difficulty === 'hard').length;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      {[
        { label: 'Faciles', count: easyCount, color: 'emerald', emoji: '✓' },
        { label: 'Moyennes', count: mediumCount, color: 'amber', emoji: '◆' },
        { label: 'Difficiles', count: hardCount, color: 'rose', emoji: '✦' },
      ].map((stat) => (
        <div
          key={stat.label}
          className="flex flex-col items-center gap-1 rounded-xl bg-amber-50/60 dark:bg-amber-950/15 border border-amber-100/50 dark:border-amber-900/30 p-3"
        >
          <span className="text-lg">
            {stat.emoji} {stat.count}
          </span>
          <span className="text-[10px] font-medium text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ================================================================
   Filter for alphabet
   ================================================================ */

type AlphabetFilter = 'all' | 'easy' | 'medium' | 'hard';

/* ================================================================
   MAIN COMPONENT
   ================================================================ */

export function PronunciationGuide() {
  const { setCurrentView } = useProgressStore();
  const [filter, setFilter] = useState<AlphabetFilter>('all');

  const filteredLetters =
    filter === 'all' ? arabicAlphabet : arabicAlphabet.filter((l) => l.difficulty === filter);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentView('home')}
          className="shrink-0 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Retour</span>
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold md:text-2xl flex items-center gap-2">
            <Waves className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            Alphabet et sons du darija
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Maîtrisez les sons du darija marocain 🇲🇦
          </p>
        </div>
      </div>

      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <Card className="overflow-hidden border-amber-200/50 dark:border-amber-800/30">
          <div className="relative bg-gradient-to-br from-amber-500 via-orange-500 to-terracotta p-6 text-white">
            <div className="moroccan-pattern absolute inset-0 opacity-10" />
            <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5" />
                <span className="text-sm font-semibold text-white/90">
                  Bienvenue dans le guide
                </span>
              </div>
              <h2 className="text-lg font-bold mb-2">
                Apprenez à prononcer le darija{' '}
                <span className="font-arabic text-xl">الدّارِجَة</span>
              </h2>
              <p className="text-sm text-white/80 leading-relaxed">
                Ce guide interactif couvre les 28 lettres arabes avec des exemples en darija
                marocain, les sons spécifiques au Maroc, les combinaisons fréquentes et des
                conseils pratiques. Cliquez sur chaque lettre pour en savoir plus !
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="alphabet" className="w-full">
        <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:grid-cols-4 gap-1 bg-amber-50 dark:bg-amber-950/20 p-1 rounded-xl border border-amber-200/50 dark:border-amber-800/30">
          <TabsTrigger
            value="alphabet"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-800 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300 text-xs sm:text-sm rounded-lg"
          >
            <BookOpen className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Alphabet
          </TabsTrigger>
          <TabsTrigger
            value="special"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-800 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300 text-xs sm:text-sm rounded-lg"
          >
            <Star className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Sons marocains
          </TabsTrigger>
          <TabsTrigger
            value="combinations"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-800 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300 text-xs sm:text-sm rounded-lg"
          >
            <Sparkles className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Combinaisons
          </TabsTrigger>
          <TabsTrigger
            value="tips"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-amber-800 dark:data-[state=active]:bg-amber-900/30 dark:data-[state=active]:text-amber-300 text-xs sm:text-sm rounded-lg"
          >
            <MessageCircle className="h-4 w-4 mr-1.5 hidden sm:inline" />
            Conseils
          </TabsTrigger>
        </TabsList>

        {/* ─── Alphabet Tab ─── */}
        <TabsContent value="alphabet">
          <AlphabetStats />

          {/* Difficulty filter */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <span className="text-xs font-medium text-muted-foreground mr-1">Filtrer :</span>
            {([
              { key: 'all', label: 'Toutes les lettres' },
              { key: 'easy', label: '✓ Faciles' },
              { key: 'medium', label: '◆ Moyennes' },
              { key: 'hard', label: '✦ Difficiles' },
            ] as { key: AlphabetFilter; label: string }[]).map((f) => (
              <Button
                key={f.key}
                variant={filter === f.key ? 'default' : 'outline'}
                size="sm"
                className={`h-7 text-xs rounded-full px-3 transition-all duration-200 ${
                  filter === f.key
                    ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600'
                    : 'border-amber-200 dark:border-amber-800 text-muted-foreground hover:text-foreground hover:border-amber-300 dark:hover:border-amber-700'
                }`}
                onClick={() => setFilter(f.key)}
              >
                {f.label}
              </Button>
            ))}
          </div>

          {/* Letter count */}
          <p className="text-xs text-muted-foreground mb-4">
            {filteredLetters.length} lettre{filteredLetters.length !== 1 ? 's' : ''}{' '}
            {filter !== 'all' && `en difficulté ${filter === 'easy' ? 'facile' : filter === 'medium' ? 'moyenne' : 'difficile'}`}
          </p>

          {/* Letters grid */}
          <div className="space-y-3 max-h-[720px] overflow-y-auto custom-scrollbar pr-1">
            {filteredLetters.map((letter, i) => (
              <LetterCard key={letter.name} letter={letter} index={i} />
            ))}
          </div>
        </TabsContent>

        {/* ─── Special Sounds Tab ─── */}
        <TabsContent value="special">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-3 rounded-xl bg-terracotta/5 dark:bg-terracotta/10 border border-terracotta/20 dark:border-terracotta/30 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-terracotta mt-0.5" />
              <div>
                <h3 className="text-sm font-bold mb-1">Sons spécifiques au darija</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Le darija marocain a des particularités qui le distinguent de
                  l&apos;arabe standard (MSA) et des autres dialectes arabes. Ces sons sont
                  essentiels pour parler naturellement.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {specialSounds.map((sound, i) => (
                <SpecialSoundCard key={sound.title} sound={sound} index={i} />
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* ─── Combinations Tab ─── */}
        <TabsContent value="combinations">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-3 rounded-xl bg-amber-warm/5 dark:bg-amber-warm/10 border border-amber-warm/20 dark:border-amber-warm/30 p-4">
              <BookOpen className="h-5 w-5 shrink-0 text-amber-warm mt-0.5" />
              <div>
                <h3 className="text-sm font-bold mb-1">Combinaisons de sons fréquentes</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  En darija, certaines combinaisons de consonnes sont extrêmement fréquentes.
                  Comprendre ces combinaisons vous aidera à décoder la lecture
                  naturelle et rapide des Marocains.
                </p>
              </div>
            </div>

            <div className="space-y-3 max-h-[720px] overflow-y-auto custom-scrollbar pr-1">
              {soundCombinations.map((combo, i) => (
                <CombinationCard key={combo.title} combo={combo} index={i} />
              ))}
            </div>
          </motion.div>
        </TabsContent>

        {/* ─── Tips Tab ─── */}
        <TabsContent value="tips">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-start gap-3 rounded-xl bg-emerald-deep/5 dark:bg-emerald-deep/10 border border-emerald-deep/20 dark:border-emerald-deep/30 p-4">
              <Lightbulb className="h-5 w-5 shrink-0 text-emerald-deep mt-0.5" />
              <div>
                <h3 className="text-sm font-bold mb-1">Conseils de lecture</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Ces conseils pratiques et culturels vous aideront à améliorer votre
                  lecture et à mieux comprendre les nuances du darija marocain.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pronunciationTips.map((tip, i) => (
                <TipCard key={tip.title} tip={tip} index={i} />
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
