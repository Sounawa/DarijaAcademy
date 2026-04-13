'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { levels } from '@/data/curriculum';
import { useProgressStore } from '@/store/progress-store';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  RotateCcw,
  Trophy,
  Users,
  Phone,
  ShoppingBag,
  Utensils,
  MapPin,
  Stethoscope,
  Handshake,
  PartyPopper,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────
type Speaker = 'vous' | 'interlocuteur';

interface ChoiceOption {
  /** @deprecated Not displayed in UI — kept for data compatibility */
  phonetic?: string;
  arabic: string;
  french: string;
}

interface DialogLine {
  id: string;
  speaker: Speaker;
  arabic: string;
  /** @deprecated Not displayed in UI — kept for data compatibility */
  phonetic?: string;
  french: string;
  choices?: ChoiceOption[];
  correctIndex?: number;
}

interface Scenario {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  level: number;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  icon: React.ReactNode;
  color: string;
  cefrLevel: string;
  lines: DialogLine[];
}

// ─── Conversation Scenarios ──────────────────────────────────
const SCENARIOS: Scenario[] = [
  // ═══ Level 1: Au marché ═══
  {
    id: 'market',
    title: 'Au marché',
    titleAr: 'فِالسُّوقِ',
    description: 'Acheter des fruits et légumes au souk local.',
    level: 1,
    difficulty: 'Débutant',
    icon: <ShoppingBag className="h-5 w-5" />,
    color: 'from-rose-500 to-pink-600',
    cefrLevel: 'A1.1',
    lines: [
      {
        id: 'm1',
        speaker: 'interlocuteur',
        arabic: 'مَرْحَبَا! بَغِيتي شْنُو؟',
        french: 'Bonjour ! Vous voulez quoi ?',
      },
      {
        id: 'm2',
        speaker: 'vous',
        arabic: 'بَغِيت تْفَاحَة وَ خِيَار.',
        french: 'Je veux des pommes et des concombres.',
        choices: [
          { phonetic: 'bghit tfa7a w khiyar.', arabic: 'بَغِيت تْفَاحَة وَ خِيَار.', french: 'Je veux des pommes et des concombres.' },
          { phonetic: 'bghit khobz w zaytun.', arabic: 'بَغِيت خُبْز وَ زَيْتُون.', french: 'Je veux du pain et des olives.' },
          { phonetic: 'ma-bghitch ay 7aja.', arabic: 'مَا بَغِيتْش أَي حَاجَة.', french: 'Je ne veux rien.' },
        ],
        correctIndex: 0,
      },
      {
        id: 'm3',
        speaker: 'interlocuteur',
        arabic: 'شْحَال بْغِيتي مِنْ تْفَاحَة؟',
        french: 'Combien en voulez-vous ?',
      },
      {
        id: 'm4',
        speaker: 'vous',
        arabic: 'ثَلَاثَة كِيلُو، 3َافَاك.',
        french: 'Trois kilos, s\'il te plaît.',
        choices: [
          { phonetic: 'wahed kilo, 3afak.', arabic: 'وَاحِد كِيلُو، عَافَاك.', french: 'Un kilo, s\'il te plaît.' },
          { phonetic: 'tlata kilo, 3afak.', arabic: 'ثَلَاثَة كِيلُو، عَافَاك.', french: 'Trois kilos, s\'il te plaît.' },
          { phonetic: '3ishrin kilo, 3afak.', arabic: 'عِشْرِينَ كِيلُو، عَافَاك.', french: 'Vingt kilos, s\'il te plaît.' },
        ],
        correctIndex: 1,
      },
      {
        id: 'm5',
        speaker: 'interlocuteur',
        arabic: 'طَازَجَة بْزَاف! ثَلَاثِينَ دِّرْهَم.',
        french: 'Très frais ! Trente dirhams.',
      },
      {
        id: 'm6',
        speaker: 'vous',
        arabic: 'غَالِي بْزَاف! نَقِّص شْوِيَّة.',
        french: 'Trop cher ! Réduis un peu.',
        choices: [
          { phonetic: 'shukran bzzaf!', arabic: 'شُكْرًا بْزَاف!', french: 'Merci beaucoup !' },
          { phonetic: 'ghali bzzaf! n9es shwiya.', arabic: 'غَالِي بْزَاف! نَقِّص شْوِيَّة.', french: 'Trop cher ! Réduis un peu.' },
          { phonetic: 'mashi mzyan, bslama.', arabic: 'مَاشِي مْزْيَان، بِالسَّلَامَة.', french: 'Ce n\'est pas bon, au revoir.' },
        ],
        correctIndex: 1,
      },
      {
        id: 'm7',
        speaker: 'interlocuteur',
        arabic: 'خَمْسَة وَعِشْرُونَ دِّرْهَم، خَاصِّيَة لَك.',
        french: 'Vingt-cinq dirhams, c\'est spécial pour vous.',
      },
      {
        id: 'm8',
        speaker: 'vous',
        arabic: 'مَزْيَان! هَا ذَاك الخَمْسَة وَعِشْرُونَ.',
        french: 'D\'accord ! Voilà les vingt-cinq.',
        choices: [
          { phonetic: 'mzyan! hadak khamsa w-3ishrin.', arabic: 'مَزْيَان! هَادَاك الخَمْسَة وَعِشْرُونَ.', french: 'D\'accord ! Voilà les vingt-cinq.' },
          { phonetic: 'la, bghit n-shuf shi 7aja khra.', arabic: 'لَا، بَغِيت نْشُوف شِي حَاجَة خْرَا.', french: 'Non, je veux voir autre chose.' },
          { phonetic: 'bslama, allah y3awnek.', arabic: 'بِالسَّلَامَة، اللّٰه يَعَاوِنَك.', french: 'Au revoir, que Dieu t\'aide.' },
        ],
        correctIndex: 0,
      },
    ],
  },

  // ═══ Level 1: Salutations ═══
  {
    id: 'greetings',
    title: 'Salutations',
    titleAr: 'التَّحِيَّاتُ',
    description: 'Rencontrer quelqu\'un pour la première fois.',
    level: 1,
    difficulty: 'Débutant',
    icon: <Users className="h-5 w-5" />,
    color: 'from-rose-500 to-pink-600',
    cefrLevel: 'A1.1',
    lines: [
      {
        id: 'g1',
        speaker: 'interlocuteur',
        arabic: 'سَلَام! كِفَاش نْتِيَّا؟',
        french: 'Bonjour ! Comment vas-tu ?',
      },
      {
        id: 'g2',
        speaker: 'vous',
        arabic: 'لَبَاس، الحَمْدُ لِلّٰه. وَ نْتِيَّا؟',
        french: 'Ça va, grâce à Dieu. Et toi ?',
        choices: [
          { phonetic: 'labas, hamdullah. w ntiya?', arabic: 'لَبَاس، الحَمْدُ لِلّٰه. وَ نْتِيَّا؟', french: 'Ça va, grâce à Dieu. Et toi ?' },
          { phonetic: 'ma-kansh labas.', arabic: 'مَا كَنْش لَبَاس.', french: 'Ça ne va pas.' },
          { phonetic: 'salam, bslama.', arabic: 'سَلَام، بِالسَّلَامَة.', french: 'Bonjour, au revoir.' },
        ],
        correctIndex: 0,
      },
      {
        id: 'g3',
        speaker: 'interlocuteur',
        arabic: 'لَبَاس! شْنُو سْمِيَتَكْ؟',
        french: 'Ça va ! Comment tu t\'appelles ?',
      },
      {
        id: 'g4',
        speaker: 'vous',
        arabic: 'أَنَا سْمِيَتِي سَارَة. وَ نْتَا؟',
        french: 'Je m\'appelle Sara. Et toi ?',
        choices: [
          { phonetic: 'ana smiyti sara. w nta?', arabic: 'أَنَا سْمِيَتِي سَارَة. وَ نْتَا؟', french: 'Je m\'appelle Sara. Et toi ?' },
          { phonetic: 'ma-bghitch nkellmek smiyti.', arabic: 'مَا بَغِيتْش نْكَلِّمَكْ سْمِيَتِي.', french: 'Je ne veux pas te dire mon nom.' },
          { phonetic: 'sh7al 3omrek?', arabic: 'شْحَال عُمْرَكْ؟', french: 'Quel âge as-tu ?' },
        ],
        correctIndex: 0,
      },
      {
        id: 'g5',
        speaker: 'interlocuteur',
        arabic: 'أَنَا يُوسُف. تَفَرَّجْنَا عَلَى وَقِيلَة!',
        french: 'Je suis Youssef. Enchanté de faire ta connaissance !',
      },
      {
        id: 'g6',
        speaker: 'vous',
        arabic: 'تَفَرَّجْنَا! مُنْتَا مِنِّينَ؟',
        french: 'Enchanté ! D\'où viens-tu ?',
        choices: [
          { phonetic: 'tfarrajna! mnta mnin?', arabic: 'تَفَرَّجْنَا! مُنْتَا مِنِّينَ؟', french: 'Enchanté ! D\'où viens-tu ?' },
          { phonetic: 'imta bghiti t-ru7?', arabic: 'إِمْتَى بَغِيتِي تْرُوح؟', french: 'Quand veux-tu partir ?' },
          { phonetic: 'shukran, bslama.', arabic: 'شُكْرًا، بِالسَّلَامَة.', french: 'Merci, au revoir.' },
        ],
        correctIndex: 0,
      },
      {
        id: 'g7',
        speaker: 'interlocuteur',
        arabic: 'أَنَا مِنْ الدَّارِ البَيْضَاء. وَ نْتِيَّا؟',
        french: 'Je suis de Casablanca. Et toi ?',
      },
      {
        id: 'g8',
        speaker: 'vous',
        arabic: 'أَنَا مِنْ فِرَنْسَا، سَكَنْ فِ الرِّبَاط.',
        french: 'Je suis de France, j\'habite à Rabat.',
        choices: [
          { phonetic: 'ana mn fransa, sken f r-rbat.', arabic: 'أَنَا مِنْ فِرَنْسَا، سَكَنْ فِ الرِّبَاط.', french: 'Je suis de France, j\'habite à Rabat.' },
          { phonetic: 'ana mn t-tilifun dyali.', arabic: 'أَنَا مِن التِّلِيفُون دْيَالِي.', french: 'Je suis de mon téléphone.' },
          { phonetic: 'ma-3raftch mnin ana.', arabic: 'مَا عَرَفْتْش مِنِّين أَنَا.', french: 'Je ne sais pas d\'où je suis.' },
        ],
        correctIndex: 0,
      },
    ],
  },

  // ═══ Level 2: Au restaurant ═══
  {
    id: 'restaurant',
    title: 'Au restaurant',
    titleAr: 'فِالرِّيستُورَا',
    description: 'Commander à manger dans un restaurant marocain.',
    level: 2,
    difficulty: 'Débutant',
    icon: <Utensils className="h-5 w-5" />,
    color: 'from-amber-500 to-orange-600',
    cefrLevel: 'A1.1',
    lines: [
      {
        id: 'r1',
        speaker: 'interlocuteur',
        arabic: 'مَرْحَبَا! تْفَضَّل، شْنُو بَغِيتِي تَاكُل؟',
        french: 'Bonjour ! Je vous en prie, qu\'est-ce que vous voulez manger ?',
      },
      {
        id: 'r2',
        speaker: 'vous',
        arabic: '3َافَاك، شْنُو عَنْدَكُم مِن الطَّعَام؟',
        french: 'S\'il te plaît, qu\'est-ce que vous avez comme nourriture ?',
        choices: [
          { phonetic: '3afak, chnou 3andakum mn t-ta3am?', arabic: 'عَافَاك، شْنُو عَنْدَكُم مِن الطَّعَام؟', french: 'S\'il te plaît, qu\'est-ce que vous avez comme nourriture ?' },
          { phonetic: 'ma-bghitch n-akel l-yum.', arabic: 'مَا بَغِيتْش نَاكُل اليَوْم.', french: 'Je ne veux pas manger aujourd\'hui.' },
          { phonetic: 'hadak khobz, sh7al?', arabic: 'هَادَاك خُبْز، شْحَال؟', french: 'Ce pain, combien ?' },
        ],
        correctIndex: 0,
      },
      {
        id: 'r3',
        speaker: 'interlocuteur',
        arabic: 'عَنْدَنَا طَاجِين دَجَّاج وَكُسْكُس وَحَرِيرَة.',
        french: 'Nous avons un tajine de poulet, du couscous et de la harira.',
      },
      {
        id: 'r4',
        speaker: 'vous',
        arabic: 'هَات لِيَّ طَاجِين دَجَّاج بَزَاف شُكْرَان.',
        french: 'Apporte-moi un tajine de poulet, merci beaucoup.',
        choices: [
          { phonetic: 'hat liyya kuskus, 3afak.', arabic: 'هَات لِيَّ كُسْكُس، عَافَاك.', french: 'Apporte-moi du couscous, s\'il te plaît.' },
          { phonetic: 'hat liyya tajin djaj, bzzaf shukran.', arabic: 'هَات لِيَّ طَاجِين دَجَّاج، بْزَاف شُكْرًا.', french: 'Apporte-moi un tajine de poulet, merci beaucoup.' },
          { phonetic: 'ma-bghitch ay 7aja, shukran.', arabic: 'مَا بَغِيتْش أَي حَاجَة، شُكْرًا.', french: 'Je ne veux rien, merci.' },
        ],
        correctIndex: 1,
      },
      {
        id: 'r5',
        speaker: 'interlocuteur',
        arabic: 'مَزْيَان! بَغِيتِي شِي شَاي أَو عَصِير؟',
        french: 'D\'accord ! Voulez-vous du thé ou du jus ?',
      },
      {
        id: 'r6',
        speaker: 'vous',
        arabic: 'شَاي بِنَّعْنَاع، 3َافَاك.',
        french: 'Thé à la menthe, s\'il te plaît.',
        choices: [
          { phonetic: '3asir l-limon, 3afak.', arabic: 'عَصِير اللَّيْمُون، عَافَاك.', french: 'Jus de citron, s\'il te plaît.' },
          { phonetic: 'shay b-na3na3, 3afak.', arabic: 'شَاي بِنَّعْنَاع، عَافَاك.', french: 'Thé à la menthe, s\'il te plaît.' },
          { phonetic: 'ma-bghitch walo.', arabic: 'مَا بَغِيتْش وَالُو.', french: 'Je ne veux rien du tout.' },
        ],
        correctIndex: 1,
      },
      {
        id: 'r7',
        speaker: 'interlocuteur',
        arabic: 'بِالصِّحَّة وَالسَّلَامَة! الطَّاجِين جَاهِز.',
        french: 'Bon appétit ! Le tajine est prêt.',
      },
      {
        id: 'r8',
        speaker: 'vous',
        arabic: 'يَاك! بَلْهِينَة مْزْيَانَة بْزَاف! اللّٰه يَجَازِيك بِالخَيْر!',
        french: 'Wow ! C\'est très délicieux ! Que Dieu te récompense !',
        choices: [
          { phonetic: 'ma-3ajebnich, ghali bzzaf.', arabic: 'مَا عْجَبْنِيَش، غَالِي بْزَاف.', french: 'Ça ne me plaît pas, c\'est trop cher.' },
          { phonetic: 'yak! b-l7ina mzyana bzzaf! allah y-jazik b-l-khir!', arabic: 'يَاك! بَلْهِينَة مْزْيَانَة بْزَاف! اللّٰه يَجَازِيك بِالخَيْر!', french: 'Wow ! C\'est très délicieux ! Que Dieu te récompense !' },
          { phonetic: 'hat liyya l-7isab, 3afak.', arabic: 'هَات لِيَّ الحِسَاب، عَافَاك.', french: 'Apporte-moi l\'addition, s\'il te plaît.' },
        ],
        correctIndex: 1,
      },
      {
        id: 'r9',
        speaker: 'interlocuteur',
        arabic: 'تَشَرَّفْنَا! اللّٰه يَعْطِيك الصِّحَّة.',
        french: 'C\'est un honneur ! Que Dieu te donne la santé.',
      },
      {
        id: 'r10',
        speaker: 'vous',
        arabic: 'بِالسَّلَامَة! شُكْرًا بْزَاف.',
        french: 'Au revoir ! Merci beaucoup.',
        choices: [
          { phonetic: 'bslama! shukran bzzaf.', arabic: 'بِالسَّلَامَة! شُكْرًا بْزَاف.', french: 'Au revoir ! Merci beaucoup.' },
          { phonetic: 'n9es shwiya f l-7isab!', arabic: 'نَقِّص شْوِيَّة فِالحِسَاب!', french: 'Réduis un peu l\'addition !' },
          { phonetic: 'rgud, ma-kandersh.', arabic: 'رْجُد، مَا كَنْدَرْش.', french: 'Non merci, je ne peux pas.' },
        ],
        correctIndex: 0,
      },
    ],
  },

  // ═══ Level 2: Demander son chemin ═══
  {
    id: 'directions',
    title: 'Demander son chemin',
    titleAr: 'طَلَابُ الطَّرِيقِ',
    description: 'Se repérer et demander des directions dans la médina.',
    level: 2,
    difficulty: 'Débutant',
    icon: <MapPin className="h-5 w-5" />,
    color: 'from-amber-500 to-orange-600',
    cefrLevel: 'A1.1',
    lines: [
      {
        id: 'd1',
        speaker: 'vous',
        arabic: 'سْمَح لِيَّ، فِينَ المَسْجِد الكَبِير؟',
        french: 'Excusez-moi, où est la grande mosquée ?',
        choices: [
          { phonetic: 'smeh liyya, fina l-masjed l-kbir?', arabic: 'سْمَح لِيَّ، فِينَ المَسْجِد الكَبِير؟', french: 'Excusez-moi, où est la grande mosquée ?' },
          { phonetic: 'smeh liyya, imta s-sa3a?', arabic: 'سْمَح لِيَّ، إِمْتَى السَّاعَة؟', french: 'Excusez-moi, quelle heure est-il ?' },
          { phonetic: 'smeh liyya, sh7al hadchi?', arabic: 'سْمَح لِيَّ، شْحَال هَادَ الشِّيء؟', french: 'Excusez-moi, combien ça coûte ?' },
        ],
        correctIndex: 0,
      },
      {
        id: 'd2',
        speaker: 'interlocuteur',
        arabic: 'تْمَشِّي تُولِّي لِلْمِين، ثُمَّ تْمَشِّي مُسْتَقِيم.',
        french: 'Tourne à gauche, puis continue tout droit.',
      },
      {
        id: 'd3',
        speaker: 'vous',
        arabic: 'بَعِيد أَو قَرِيب؟',
        french: 'C\'est loin ou proche ?',
        choices: [
          { phonetic: 'sh7al s-sa3a?', arabic: 'شْحَال السَّاعَة؟', french: 'Quelle heure est-il ?' },
          { phonetic: 'b3id w-la qarib?', arabic: 'بَعِيد أَو قَرِيب؟', french: 'C\'est loin ou proche ?' },
          { phonetic: 'kifash n-mshi?', arabic: 'كِفَاش نْمْشِي؟', french: 'Comment je marche ?' },
        ],
        correctIndex: 1,
      },
      {
        id: 'd4',
        speaker: 'interlocuteur',
        arabic: 'قَرِيب بْزَاف! خَمْس دَقَائِيق بَالرِّجْل.',
        french: 'Très proche ! Cinq minutes à pied.',
      },
      {
        id: 'd5',
        speaker: 'vous',
        arabic: 'شُكْرًا بْزَاف! اللّٰه يَجَازِيك بِالخَيْر!',
        french: 'Merci beaucoup ! Que Dieu te récompense !',
        choices: [
          { phonetic: 'shukran bzzaf! allah y-jazik b-l-khir!', arabic: 'شُكْرًا بْزَاف! اللّٰه يَجَازِيك بِالخَيْر!', french: 'Merci beaucoup ! Que Dieu te récompense !' },
          { phonetic: 'ma-fhemtch, t3awd liyya.', arabic: 'مَا فَهْمْتْش، تْعَاوِد لِيَّ.', french: 'Je n\'ai pas compris, répète.' },
          { phonetic: 'bslama!', arabic: 'بِالسَّلَامَة!', french: 'Au revoir !' },
        ],
        correctIndex: 0,
      },
      {
        id: 'd6',
        speaker: 'interlocuteur',
        arabic: 'بِلَا جَمِيل! تَفَضَّل بِالصِّحَّة.',
        french: 'De rien ! Allez, bonne route !',
      },
      {
        id: 'd7',
        speaker: 'vous',
        arabic: 'لَقِيتُو! شُكْرًا لَك!',
        french: 'Je l\'ai trouvé ! Merci à toi !',
        choices: [
          { phonetic: 'ma-l9itch, dkhel l-liyya.', arabic: 'مَا لْقِيتْش، دْخُل لِيَّ.', french: 'Je ne l\'ai pas trouvé, entre pour moi.' },
          { phonetic: 'l9ituh! shukran l-k!', arabic: 'لَقِيتُو! شُكْرًا لَك!', french: 'Je l\'ai trouvé ! Merci à toi !' },
          { phonetic: 'fiha mushkil.', arabic: 'فِيهَا مُشْكِل.', french: 'Il y a un problème.' },
        ],
        correctIndex: 1,
      },
    ],
  },

  // ═══ Level 3: Chez le médecin ═══
  {
    id: 'doctor',
    title: 'Chez le médecin',
    titleAr: 'عِنْدَ الطَّبِيبِ',
    description: 'Décrire ses symptômes lors d\'une visite médicale.',
    level: 3,
    difficulty: 'Intermédiaire',
    icon: <Stethoscope className="h-5 w-5" />,
    color: 'from-emerald-500 to-teal-600',
    cefrLevel: 'A1.1',
    lines: [
      {
        id: 'doc1',
        speaker: 'interlocuteur',
        arabic: 'مَرْحَبَا! فِينَ المُشْكِل؟ شْنُو لِيك؟',
        french: 'Bonjour ! Quel est le problème ? Qu\'avez-vous ?',
      },
      {
        id: 'doc2',
        speaker: 'vous',
        arabic: 'الدُّكْتُور، 3َنْدِي وَجَع فِ الرَّاس وَ الحُمَّى.',
        french: 'Docteur, j\'ai mal à la tête et de la fièvre.',
        choices: [
          { phonetic: 'd-duktur, 3ndi wja3 f r-ras w l-homma.', arabic: 'الدُّكْتُور، عَنْدِي وَجَع فِالرَّاس وَ الحُمَّى.', french: 'Docteur, j\'ai mal à la tête et de la fièvre.' },
          { phonetic: 'd-duktur, ana mzyan l-hamdullah.', arabic: 'الدُّكْتُور، أَنَا مْزْيَان الحَمْدُ لِلّٰه.', french: 'Docteur, je vais bien grâce à Dieu.' },
          { phonetic: 'd-duktur, bghit n-shri dawa.', arabic: 'الدُّكْتُور، بَغِيت نْشْرِي دَوَاء.', french: 'Docteur, je veux acheter des médicaments.' },
        ],
        correctIndex: 0,
      },
      {
        id: 'doc3',
        speaker: 'interlocuteur',
        arabic: 'مِنْ إِمْتَى؟ شَحَال مِن الوَقْت؟',
        french: 'Depuis quand ? Ça fait combien de temps ?',
      },
      {
        id: 'doc4',
        speaker: 'vous',
        arabic: 'مِنْ جُمْعَة، ثَلَاثَة أَيَّام.',
        french: 'Depuis vendredi, trois jours.',
        choices: [
          { phonetic: 'mn juma, tlata ayyam.', arabic: 'مِنْ جُمْعَة، ثَلَاثَة أَيَّام.', french: 'Depuis vendredi, trois jours.' },
          { phonetic: 'mn sba7, wahed nhar.', arabic: 'مِنْ صُبْح، وَاحِد نَهَار.', french: 'Depuis ce matin, un jour.' },
          { phonetic: 'mn merra, mashi 3araf.', arabic: 'مِنْ مَرَّة، مَاشِي عَارَف.', french: 'Je ne sais pas.' },
        ],
        correctIndex: 0,
      },
      {
        id: 'doc5',
        speaker: 'interlocuteur',
        arabic: 'وَاش كَتَاكُل وَاش كَتَشْرَب بْزَاف؟',
        french: 'Mangez-vous et buvez-vous suffisamment ?',
      },
      {
        id: 'doc6',
        speaker: 'vous',
        arabic: 'لَا، مَا كَنْأَكُلْش بْزَاف مَعَاد كَنْقَد مِن الوَجَع.',
        french: 'Non, je ne mange pas beaucoup à cause de la douleur.',
        choices: [
          { phonetic: 'ah, kanakel bzzaf l-hamdullah.', arabic: 'آه، كَنَاكُل بْزَاف الحَمْدُ لِلّٰه.', french: 'Oui, je mange beaucoup grâce à Dieu.' },
          { phonetic: 'la, ma-knakelsh bzzaf, 3ad kanqed mn l-wja3.', arabic: 'لَا، مَا كَنْأَكُلْش بْزَاف، عَد كَنْقَد مِن الوَجَع.', french: 'Non, je ne mange pas beaucoup à cause de la douleur.' },
          { phonetic: 'kanakel w kan-shreb l-yum kamel.', arabic: 'كَنَاكُل وَ كَنْشْرَب اليَوْم كَامِل.', french: 'Je mange et bois toute la journée.' },
        ],
        correctIndex: 1,
      },
      {
        id: 'doc7',
        speaker: 'interlocuteur',
        arabic: 'خُد هَادَ الدَّوَاء ثَلَاث مَرَّات فِ اليَوْم وَاسْتَرِيح بْزَاف.',
        french: 'Prenez ce médicament trois fois par jour et reposez-vous bien.',
      },
      {
        id: 'doc8',
        speaker: 'vous',
        arabic: 'شُكْرًا بْزَاف الدُّكْتُور! اللّٰه يَخَلِّيك!',
        french: 'Merci beaucoup docteur ! Que Dieu te garde !',
        choices: [
          { phonetic: 'shukran bzzaf d-duktur! allah y-khallek!', arabic: 'شُكْرًا بْزَاف الدُّكْتُور! اللّٰه يَخَلِّيك!', french: 'Merci beaucoup docteur ! Que Dieu te garde !' },
          { phonetic: 'ma-bghitch d-dawa.', arabic: 'مَا بَغِيتْش الدَّوَاء.', french: 'Je ne veux pas le médicament.' },
          { phonetic: 'ghali bzzaf!', arabic: 'غَالِي بْزَاف!', french: 'C\'est trop cher !' },
        ],
        correctIndex: 0,
      },
    ],
  },

  // ═══ Level 3: Négocier un prix ═══
  {
    id: 'negotiate',
    title: 'Négocier un prix',
    titleAr: 'المُسَاوَمَة فِ السُّوق',
    description: 'Marchander et négocier dans le souk traditionnel.',
    level: 3,
    difficulty: 'Intermédiaire',
    icon: <Handshake className="h-5 w-5" />,
    color: 'from-emerald-500 to-teal-600',
    cefrLevel: 'A1.1',
    lines: [
      {
        id: 'n1',
        speaker: 'interlocuteur',
        arabic: 'أَهْلًا وَسَهْلًا! هَاذَا الجَزْمَان جَدِيد، صَنِيع يَد فِ مَرَّاكِش.',
        french: 'Bienvenue ! Ce bracelet est neuf, fait main à Marrakech.',
      },
      {
        id: 'n2',
        speaker: 'vous',
        arabic: 'مْزْيَان بَزَاف! بَشْحَال؟',
        french: 'Très beau ! Combien ça coûte ?',
        choices: [
          { phonetic: 'mzyan bzzaf! b-sh7al?', arabic: 'مْزْيَان بْزَاف! بِشْحَال؟', french: 'Très beau ! Combien ça coûte ?' },
          { phonetic: 'ma-3ajebnich.', arabic: 'مَا عْجَبْنِيَش.', french: 'Ça ne me plaît pas.' },
          { phonetic: 'bghit wahed khra.', arabic: 'بَغِيت وَاحِد خْرَا.', french: 'Je veux un autre.' },
        ],
        correctIndex: 0,
      },
      {
        id: 'n3',
        speaker: 'interlocuteur',
        arabic: 'مِيَّة وَ خَمْسِينَ دِّرْهَم لَك، صَاحِبِي!',
        french: 'Cent cinquante dirhams pour vous, mon ami !',
      },
      {
        id: 'n4',
        speaker: 'vous',
        arabic: 'مِيَّة وَ خَمْسِينَ! غَالِي بْزَاف! خَمْسِينَ دِّرْهَم!',
        french: 'Cent cinquante ! Trop cher ! Cinquante dirhams !',
        choices: [
          { phonetic: 'mzyan, hadu khamsin w khamsin.', arabic: 'مْزْيَان، هَادُو خَمْسِينَ وَ خَمْسِينَ.', french: 'D\'accord, voilà cinquante et cinquante.' },
          { phonetic: 'miya w khamssin! ghali bzzaf! khamssin d-drahm!', arabic: 'مِيَّة وَ خَمْسِينَ! غَالِي بْزَاف! خَمْسِينَ دِّرْهَم!', french: 'Cent cinquante ! Trop cher ! Cinquante dirhams !' },
          { phonetic: 'n3tik miya, mashi ghali.', arabic: 'نْعْطِيك مِيَّة، مَاشِي غَالِي.', french: 'Je te donne cent, ce n\'est pas cher.' },
        ],
        correctIndex: 1,
      },
      {
        id: 'n5',
        speaker: 'interlocuteur',
        arabic: 'خَمْسِينَ! اللّٰه يَسْتُر عَلَيَّ! سَبْعِينَ، آخِر ثَمَن!',
        french: 'Cinquante ! Que Dieu me protège ! Soixante-dix, dernier prix !',
      },
      {
        id: 'n6',
        speaker: 'vous',
        arabic: 'سِتِّينَ دِّرْهَم، وَ أَنَا نَخُو لِيك وَاحِد!',
        french: 'Soixante dirhams, et je te prends aussi un autre !',
        choices: [
          { phonetic: 'la, bslama.', arabic: 'لَا، بِالسَّلَامَة.', french: 'Non, au revoir.' },
          { phonetic: 'se6in d-drahm, w ana n-khuw l-k wahed!', arabic: 'سِتِّينَ دِّرْهَم، وَ أَنَا نَخُو لِيك وَاحِد!', french: 'Soixante dirhams, et je te prends aussi un autre !' },
          { phonetic: 'seb3in mzyan, hadu l-flus.', arabic: 'سَبْعِينَ مْزْيَان، هَادُو الفْلُوس.', french: 'Soixante-dix d\'accord, voilà l\'argent.' },
        ],
        correctIndex: 1,
      },
      {
        id: 'n7',
        speaker: 'interlocuteur',
        arabic: 'صَاحِبِي كَتْعَرْف تْبِيع! مَزْيَان، سِتِّينَ دِّرْهَم وَاجِدُوهَا!',
        french: 'Mon ami, tu sais marchander ! D\'accord, soixante dirhams pour les deux !',
      },
      {
        id: 'n8',
        speaker: 'vous',
        arabic: 'شُكْرًا لَك! تَشَرَّفْنَا! اللّٰه يَعْطِيك العَافِيَة!',
        french: 'Merci ! Merci pour l\'accueil ! Que Dieu te donne la santé !',
        choices: [
          { phonetic: 'bslama, mashi mzyan.', arabic: 'بِالسَّلَامَة، مَاشِي مْزْيَان.', french: 'Au revoir, ce n\'est pas bon.' },
          { phonetic: 'shukran l-k! t-sharrafna! allah y-3tik l-3afiya!', arabic: 'شُكْرًا لَك! تَشَرَّفْنَا! اللّٰه يَعْطِيك العَافِيَة!', french: 'Merci ! Merci pour l\'accueil ! Que Dieu te donne la santé !' },
          { phonetic: 'ma-n-shri walo.', arabic: 'مَا نْشْرِي وَالُو.', french: 'Je n\'achète rien.' },
        ],
        correctIndex: 1,
      },
    ],
  },

  // ═══ Level 4: Inviter quelqu'un ═══
  {
    id: 'invite',
    title: 'Inviter quelqu\'un',
    titleAr: 'دَعْوَة',
    description: 'Inviter un ami à dîner ou à une fête chez soi.',
    level: 4,
    difficulty: 'Avancé',
    icon: <PartyPopper className="h-5 w-5" />,
    color: 'from-violet-500 to-purple-600',
    cefrLevel: 'A1.2',
    lines: [
      {
        id: 'i1',
        speaker: 'vous',
        arabic: 'السَّلَامُ عَلَيْكُم! بَغِيت نْدْعُوك لَلْعَشَاء بُوكَ فِ البَيْت.',
        french: 'Que la paix soit sur vous ! Je voudrais t\'inviter à dîner chez moi.',
        choices: [
          { phonetic: 's-salam 3likum! bghit n-d3uk l-l-3asha buka f l-bla.', arabic: 'السَّلَامُ عَلَيْكُم! بَغِيت نْدْعُوك لَلْعَشَاء بُوكَ فِالبَيْت.', french: 'Que la paix soit sur vous ! Je voudrais t\'inviter à dîner chez moi.' },
          { phonetic: 'salam! kifash ntiya?', arabic: 'سَلَام! كِفَاش نْتِيَّا؟', french: 'Bonjour ! Comment vas-tu ?' },
          { phonetic: 'bslama!', arabic: 'بِالسَّلَامَة!', french: 'Au revoir !' },
        ],
        correctIndex: 0,
      },
      {
        id: 'i2',
        speaker: 'interlocuteur',
        arabic: 'وَعَلَيْكُم السَّلَام! يَاك! مَرْحَبَة! فِينَ؟',
        french: 'Et paix sur vous ! Génial ! C\'est sympa ! Où ?',
      },
      {
        id: 'i3',
        speaker: 'vous',
        arabic: 'فِ البَيْت فِ الدَّارِ البَيْضَاء. جِيب مَعَك لَخْوَتَك.',
        french: 'Chez moi à Casablanca. Apporte ton frère avec toi.',
        choices: [
          { phonetic: 'f l-bla f ddar b-bi7da. jib m3ak l-khwtek.', arabic: 'فِالبَيْت فِالدَّارِ البَيْضَاء. جِيب مَعَك لَخْوَتَك.', french: 'Chez moi à Casablanca. Apporte ton frère avec toi.' },
          { phonetic: 'f l-mat7af f r-rbat.', arabic: 'فِالمَتْحَف فِالرِّبَاط.', french: 'Au musée à Rabat.' },
          { phonetic: 'ma-3raftch fina.', arabic: 'مَا عَرَفْتْش فِينَ.', french: 'Je ne sais pas où.' },
        ],
        correctIndex: 0,
      },
      {
        id: 'i4',
        speaker: 'interlocuteur',
        arabic: 'مَزْيَان! وَاش غَادِي نَاكُل شِي حَاجَة خَاصَّة؟',
        french: 'D\'accord ! Est-ce qu\'on va manger quelque chose de spécial ?',
      },
      {
        id: 'i5',
        speaker: 'vous',
        arabic: 'طَاجِين دَجَّاج بِالزَّيْتُون وَ كُسْكُس وَ حَلَاوَة!',
        french: 'Tajine de poulet aux olives, couscous et dessert !',
        choices: [
          { phonetic: 'ma-bghitch n-tb3et.', arabic: 'مَا بَغِيتْش نْتْبَعَت.', french: 'Je ne veux pas cuisiner.' },
          { phonetic: 'tajin djaj b-z-zaytun w kuskus w halaoua!', arabic: 'طَاجِين دَجَّاج بِالزَّيْتُون وَ كُسْكُس وَ حَلَاوَة!', french: 'Tajine de poulet aux olives, couscous et dessert !' },
          { phonetic: 'ghadi n-jib mn l-mahal.', arabic: 'غَادِي نْجِيب مِن المَحَل.', french: 'Je vais acheter du magasin.' },
        ],
        correctIndex: 1,
      },
      {
        id: 'i6',
        speaker: 'interlocuteur',
        arabic: 'يَاك! كَدَابَا! اللّٰه يَبَارَك فِيك! مِيمَنَ إِمْتَى؟',
        french: 'Génial ! Super ! Que Dieu te bénisse ! À partir de quand ?',
      },
      {
        id: 'i7',
        speaker: 'vous',
        arabic: 'الجُمْعَة بِاللَّيْل بِالسَّاعَة ثَمَانِيَة.',
        french: 'Vendredi soir à huit heures.',
        choices: [
          { phonetic: 'sbt sba7.', arabic: 'السَّبْت صُبْح.', french: 'Samedi matin.' },
          { phonetic: 'l-juma b-l-lel b-s-sa3a tmenya.', arabic: 'الجُمُعَة بِاللَّيْل بِالسَّاعَة ثَمَانِيَة.', french: 'Vendredi soir à huit heures.' },
          { phonetic: 'ma-3raftch imta.', arabic: 'مَا عَرَفْتْش إِمْتَى.', french: 'Je ne sais pas quand.' },
        ],
        correctIndex: 1,
      },
      {
        id: 'i8',
        speaker: 'interlocuteur',
        arabic: 'نْكُون حَاضِر إِن شَاءَ اللّٰه! شُكْرًا بْزَاف!',
        french: 'Je serai présent si Dieu veut ! Merci beaucoup !',
      },
      {
        id: 'i9',
        speaker: 'vous',
        arabic: 'تَشَرَّفْنَا! نَسْتَنَاوُك بِالصِّحَّة!',
        french: 'C\'est un honneur ! Nous t\'attendons en bonne santé !',
        choices: [
          { phonetic: 't-sharrafna! n-stannawk b-s-s7a!', arabic: 'تَشَرَّفْنَا! نَسْتَنَاوُك بِالصِّحَّة!', french: 'C\'est un honneur ! Nous t\'attendons en bonne santé !' },
          { phonetic: 'ma-jِيتش.', arabic: 'مَا جِيتْش.', french: 'Ne viens pas.' },
          { phonetic: 'jib ma3ak shi 7aja.', arabic: 'جِيب مَعَك شِي حَاجَة.', french: 'Apporte quelque chose avec toi.' },
        ],
        correctIndex: 0,
      },
    ],
  },

  // ═══ Level 5: Au téléphone ═══
  {
    id: 'phone',
    title: 'Au téléphone',
    titleAr: 'فِالتِّلِيفُون',
    description: 'Passer un appel téléphonique et prendre un rendez-vous.',
    level: 5,
    difficulty: 'Avancé',
    icon: <Phone className="h-5 w-5" />,
    color: 'from-orange-500 to-red-600',
    cefrLevel: 'A2.1',
    lines: [
      {
        id: 'p1',
        speaker: 'vous',
        arabic: 'اللّو! مَمْكِن أَتْحَدَّث مَع خَالِد؟',
        french: 'Allô ! Je peux parler avec Khalid ?',
        choices: [
          { phonetic: 'allaw! mumkin n-t-hadded m3a khalid?', arabic: 'اللَّو! مَمْكِن أَتْحَدَّث مَع خَالِد؟', french: 'Allô ! Je peux parler avec Khalid ?' },
          { phonetic: 'allaw! sh7al hadchi?', arabic: 'اللَّو! شْحَال هَادَ الشِّيء؟', french: 'Allô ! Combien ça coûte ?' },
          { phonetic: 'bslama!', arabic: 'بِالسَّلَامَة!', french: 'Au revoir !' },
        ],
        correctIndex: 0,
      },
      {
        id: 'p2',
        speaker: 'interlocuteur',
        arabic: 'أُوه، غَادِي نْوَلِّيك. تْسَتَنَّا شْوِيَّة.',
        french: 'Ah oui, je te passe. Attends un instant.',
      },
      {
        id: 'p3',
        speaker: 'interlocuteur',
        arabic: 'اللَّو! مَن هَاذَا؟',
        french: 'Allô ! Qui est à l\'appareil ?',
      },
      {
        id: 'p4',
        speaker: 'vous',
        arabic: 'أَنَا كَرِيم. بَغِيت نْخُو مَعَاك رِنْدِيفُو لِالغَد.',
        french: 'C\'est Karim. Je voudrais prendre rendez-vous pour demain.',
        choices: [
          { phonetic: 'ana karim. bghit n-khuw m3ak rendezvous l-l-ghadda.', arabic: 'أَنَا كَرِيم. بَغِيت نْخُو مَعَاك رِنْدِيفُو لِالغَد.', french: 'C\'est Karim. Je voudrais prendre rendez-vous pour demain.' },
          { phonetic: 'ghadi n-ru7 sba7.', arabic: 'غَادِي نْرُوح صُبْح.', french: 'Je vais partir le matin.' },
          { phonetic: 'ma-bghitch at-hadded.', arabic: 'مَا بَغِيتْش أَتْحَدَّث.', french: 'Je ne veux pas parler.' },
        ],
        correctIndex: 0,
      },
      {
        id: 'p5',
        speaker: 'interlocuteur',
        arabic: 'مَزْيَان كَرِيم! بَغِيتِي مِيمَن السَّاعَة؟',
        french: 'D\'accord Karim ! À partir de quelle heure ?',
      },
      {
        id: 'p6',
        speaker: 'vous',
        arabic: 'إِنْ كَانَتْ مُمْكِينَة، السَّاعَة عَشْرَة صُبْح نْخَلِّص بْزَرْعَة.',
        french: 'Si c\'est possible, à dix heures du matin, on finirait vite.',
        choices: [
          { phonetic: 's-sa3a wla n-nss l-lel.', arabic: 'السَّاعَة وَلَا النِّص اللَّيْل.', french: 'À minuit.' },
          { phonetic: 'ma-3raftch l-waqt.', arabic: 'مَا عَرَفْتْش الوَقْت.', french: 'Je ne sais pas l\'heure.' },
          { phonetic: 'in kanet mumkina, s-sa3a 3ashra sba7 n-khelles b-zra3a.', arabic: 'إِنْ كَانَتْ مُمْكِينَة، السَّاعَة عَشْرَة صُبْح نْخَلِّص بْزَرْعَة.', french: 'Si c\'est possible, à dix heures du matin, on finirait vite.' },
        ],
        correctIndex: 2,
      },
      {
        id: 'p7',
        speaker: 'interlocuteur',
        arabic: 'سَاعَة عَشْرَة مُشْكِلَة، غَادِي نْكُون فِالمُقَابَلَة. السَّاعَة وَاحِدَة وَالنِّص نِيمَكِن؟',
        french: 'Dix heures c\'est difficile, j\'ai une réunion. Une heure et demie, ça va ?',
      },
      {
        id: 'p8',
        speaker: 'vous',
        arabic: 'مُشْكِيلَة، السَّاعَة وَاحِدَة وَالنِّص مَزْيَان لِيَّ. نَشُوفُوك بُوكَ!',
        french: 'Pas de problème, une heure et demie c\'est bon pour moi. À plus tard !',
        choices: [
          { phonetic: 'la, ghadi t-wqef l-ghadda.', arabic: 'لَا، غَادِي تْوَقَّف الغَدَّا.', french: 'Non, j\'annule pour demain.' },
          { phonetic: 'mushkil la, sa3a wahed w-n-ss mzyan l-i. n-shufuk buka!', arabic: 'مُشْكِيلَة، السَّاعَة وَاحِدَة وَالنِّص مَزْيَان لِيَّ. نَشُوفُوك بُوكَ!', french: 'Pas de problème, une heure et demie c\'est bon pour moi. À plus tard !' },
          { phonetic: 'ghadda ma-n9derch.', arabic: 'غَدَّا مَا نْقَدَرْش.', french: 'Demain je ne peux pas.' },
        ],
        correctIndex: 1,
      },
      {
        id: 'p9',
        speaker: 'interlocuteur',
        arabic: 'بِالصِّحَّة! نَسْتَنَّاوُك. بِالسَّلَامَة!',
        french: 'Bonne santé ! On t\'attend. Au revoir !',
      },
      {
        id: 'p10',
        speaker: 'vous',
        arabic: 'بِالسَّلَامَة! اللّٰه يَعْطِيك الصِّحَّة!',
        french: 'Au revoir ! Que Dieu te donne la santé !',
        choices: [
          { phonetic: 'bslama! allah y-3tik s-s7a!', arabic: 'بِالسَّلَامَة! اللّٰه يَعْطِيك الصِّحَّة!', french: 'Au revoir ! Que Dieu te donne la santé !' },
          { phonetic: 'la, t-wqef t-t-lifun!', arabic: 'لَا، وَقَّف التِّلِيفُون!', french: 'Non, raccroche le téléphone !' },
          { phonetic: 'ma-fhemtch chnou gelti.', arabic: 'مَا فَهْمْتْش شْنُو قُلْتِي.', french: 'Je n\'ai pas compris ce que tu as dit.' },
        ],
        correctIndex: 0,
      },
    ],
  },
];

// ─── Animation variants ──────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

const bubbleVariants = {
  hidden: (speaker: Speaker) => ({
    opacity: 0,
    x: speaker === 'vous' ? 40 : -40,
    scale: 0.95,
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } },
};

const resultVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

// ─── Difficulty badge colors ─────────────────────────────────
const DIFFICULTY_COLORS: Record<string, string> = {
  'Débutant': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300',
  'Intermédiaire': 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300',
  'Avancé': 'bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300',
};

// ═══════════════════════════════════════════════════════════════
// Main Component
// ═══════════════════════════════════════════════════════════════
export function ConversationPractice() {
  const { setCurrentView } = useProgressStore();
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [showTranslation, setShowTranslation] = useState(true);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, number>>({});
  const [checkedAnswers, setCheckedAnswers] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [revealedLines, setRevealedLines] = useState<Set<string>>(new Set());
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat when lines are revealed
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [revealedLines]);

  // Compute stats for a scenario
  const getScenarioStats = useCallback((scenario: Scenario) => {
    const choiceLines = scenario.lines.filter((l) => l.choices);
    return { choiceCount: choiceLines.length, lineCount: scenario.lines.length };
  }, []);

  // Get total correct and total questions
  const getScoreDisplay = useCallback(() => {
    if (!selectedScenario) return { correct: 0, total: 0 };
    const choiceLines = selectedScenario.lines.filter((l) => l.choices);
    const total = choiceLines.length;
    let correct = 0;
    for (const line of choiceLines) {
      if (checkedAnswers[line.id]) {
        correct += 1;
      }
    }
    return { correct, total };
  }, [selectedScenario, checkedAnswers]);

  // Handle scenario selection
  const handleSelectScenario = useCallback((scenario: Scenario) => {
    setSelectedScenario(scenario);
    setSelectedChoices({});
    setCheckedAnswers({});
    setShowResults(false);
    setShowTranslation(true);
    setRevealedLines(new Set());
    setScore({ correct: 0, total: 0 });
  }, []);

  // Handle back to scenario list
  const handleBackToList = useCallback(() => {
    setSelectedScenario(null);
  }, []);

  // Handle back to home
  const handleBackHome = useCallback(() => {
    setCurrentView('home');
  }, [setCurrentView]);

  // Handle choice selection
  const handleChoiceSelect = useCallback((lineId: string, choiceIndex: number) => {
    setSelectedChoices((prev) => ({ ...prev, [lineId]: choiceIndex }));
  }, []);

  // Handle check answer for a single line
  const handleCheckLine = useCallback((line: DialogLine) => {
    if (line.correctIndex === undefined || selectedChoices[line.id] === undefined) return;
    const isCorrect = selectedChoices[line.id] === line.correctIndex;
    setCheckedAnswers((prev) => ({ ...prev, [line.id]: isCorrect }));
  }, [selectedChoices]);

  // Reveal next line
  const handleRevealNext = useCallback(() => {
    if (!selectedScenario) return;
    setRevealedLines((prev) => {
      const next = new Set(prev);
      const currentIndex = selectedScenario.lines.findIndex((l) => !next.has(l.id));
      if (currentIndex >= 0) {
        next.add(selectedScenario.lines[currentIndex].id);
      }
      return next;
    });
  }, [selectedScenario]);

  // Reveal all lines
  const handleRevealAll = useCallback(() => {
    if (!selectedScenario) return;
    setRevealedLines(new Set(selectedScenario.lines.map((l) => l.id)));
  }, [selectedScenario]);

  // Check all answers
  const handleCheckAll = useCallback(() => {
    if (!selectedScenario) return;
    const choiceLines = selectedScenario.lines.filter((l) => l.choices && selectedChoices[l.id] !== undefined);
    let correct = 0;
    const newChecked: Record<string, boolean> = {};
    for (const line of choiceLines) {
      const isCorrect = selectedChoices[line.id] === line.correctIndex;
      newChecked[line.id] = isCorrect;
      if (isCorrect) correct++;
    }
    setCheckedAnswers((prev) => ({ ...prev, ...newChecked }));
    setScore({ correct, total: choiceLines.length });
    setShowResults(true);
  }, [selectedScenario, selectedChoices]);

  // Reset scenario
  const handleReset = useCallback(() => {
    if (!selectedScenario) return;
    setSelectedChoices({});
    setCheckedAnswers({});
    setShowResults(false);
    setRevealedLines(new Set());
    setScore({ correct: 0, total: 0 });
  }, [selectedScenario]);

  // Current revealed count
  const revealedCount = selectedScenario ? revealedLines.size : 0;
  const totalLines = selectedScenario ? selectedScenario.lines.length : 0;
  const allRevealed = selectedScenario ? revealedLines.size === selectedScenario.lines.length : false;
  const allChoiceLinesAnswered = selectedScenario
    ? selectedScenario.lines
        .filter((l) => l.choices)
        .every((l) => selectedChoices[l.id] !== undefined)
    : false;

  const scoreDisplay = getScoreDisplay();

  // ═══════════════════════════════════════════════════════════
  // Scenario Selection Screen
  // ═══════════════════════════════════════════════════════════
  if (!selectedScenario) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-4xl space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
                Pratique
              </span>{' '}
              Conversation
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Simulez des dialogues réels en darija marocain
            </p>
          </div>
        </motion.div>

        {/* Stats overview */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Scénarios', value: SCENARIOS.length, icon: <MessageSquare className="h-5 w-5" />, gradient: 'from-teal-50 to-emerald-50 dark:from-teal-950/30 dark:to-emerald-950/30', iconBg: 'bg-teal-100 dark:bg-teal-900/50', iconColor: 'text-teal-600 dark:text-teal-400', valueColor: 'text-teal-700 dark:text-teal-300' },
            { label: 'Débutant', value: SCENARIOS.filter(s => s.difficulty === 'Débutant').length, icon: <Users className="h-5 w-5" />, gradient: 'from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30', iconBg: 'bg-emerald-100 dark:bg-emerald-900/50', iconColor: 'text-emerald-600 dark:text-emerald-400', valueColor: 'text-emerald-700 dark:text-emerald-300' },
            { label: 'Intermédiaire', value: SCENARIOS.filter(s => s.difficulty === 'Intermédiaire').length, icon: <Handshake className="h-5 w-5" />, gradient: 'from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30', iconBg: 'bg-amber-100 dark:bg-amber-900/50', iconColor: 'text-amber-600 dark:text-amber-400', valueColor: 'text-amber-700 dark:text-amber-300' },
            { label: 'Avancé', value: SCENARIOS.filter(s => s.difficulty === 'Avancé').length, icon: <PartyPopper className="h-5 w-5" />, gradient: 'from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30', iconBg: 'bg-rose-100 dark:bg-rose-900/50', iconColor: 'text-rose-600 dark:text-rose-400', valueColor: 'text-rose-700 dark:text-rose-300' },
          ].map((stat) => (
            <Card key={stat.label} className={`overflow-hidden border-0 bg-gradient-to-br ${stat.gradient} shadow-sm`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.iconBg}`}>
                    <div className={stat.iconColor}>{stat.icon}</div>
                  </div>
                  <div>
                    <p className={`text-2xl font-extrabold ${stat.valueColor}`}>{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Scenario Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
        >
          {SCENARIOS.map((scenario) => {
            const stats = getScenarioStats(scenario);
            const levelData = levels.find((l) => l.id === scenario.level);
            return (
              <motion.div key={scenario.id} variants={cardVariants}>
                <Card
                  className="group cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-amber-300 dark:hover:border-amber-700 overflow-hidden"
                  onClick={() => handleSelectScenario(scenario)}
                >
                  <CardContent className="p-0">
                    <div className={`h-1.5 w-full bg-gradient-to-r ${scenario.color}`} />
                    <div className="p-5">
                      {/* Header */}
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${scenario.color} text-white shadow-sm`}>
                            {scenario.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground leading-tight">{scenario.title}</h3>
                            <p className="font-arabic text-sm text-muted-foreground mt-0.5">{scenario.titleAr}</p>
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="mb-3 text-sm text-muted-foreground leading-relaxed">{scenario.description}</p>

                      {/* Badges */}
                      <div className="mb-3 flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="text-[10px] font-bold">
                          {levelData?.icon} {scenario.cefrLevel}
                        </Badge>
                        <Badge className={`text-[10px] font-bold ${DIFFICULTY_COLORS[scenario.difficulty]}`}>
                          {scenario.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {stats.lineCount} répliques
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {stats.choiceCount} choix
                        </Badge>
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-1.5 text-sm font-medium text-teal-600 dark:text-teal-400 transition-colors group-hover:text-teal-700 dark:group-hover:text-teal-300">
                        <MessageSquare className="h-4 w-4" />
                        Commencer la conversation
                        <ChevronRight className="ml-auto h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Back Button */}
        <motion.div variants={itemVariants} className="pb-4">
          <Button variant="ghost" size="sm" onClick={handleBackHome}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Retour à l&apos;accueil
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  // ═══════════════════════════════════════════════════════════
  // Conversation View
  // ═══════════════════════════════════════════════════════════
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-3xl space-y-4"
    >
      {/* Header bar */}
      <motion.div variants={itemVariants} className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBackToList} className="shrink-0" aria-label="Retour">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-lg font-extrabold sm:text-xl leading-tight">
              {selectedScenario.title}
              <span className="font-arabic text-muted-foreground font-normal ml-2 text-base">{selectedScenario.titleAr}</span>
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-[10px]">
                {selectedScenario.difficulty}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {selectedScenario.cefrLevel}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Translation toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTranslation(!showTranslation)}
            className="gap-1.5 text-xs"
          >
            {showTranslation ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Français</span>
          </Button>
          {/* Reset */}
          <Button variant="outline" size="icon" onClick={handleReset} className="h-8 w-8" aria-label="Réinitialiser">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </motion.div>

      {/* Progress bar */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-muted-foreground">
            {revealedCount} / {totalLines} répliques
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {Math.round((revealedCount / totalLines) * 100)}%
          </span>
        </div>
        <Progress value={(revealedCount / totalLines) * 100} className="h-2" />
      </motion.div>

      {/* Score display */}
      {Object.keys(checkedAnswers).length > 0 && (
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between rounded-xl border bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2.5 dark:from-amber-950/30 dark:to-orange-950/30">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold">
                {scoreDisplay.correct} / {scoreDisplay.total} réponses correctes
              </span>
            </div>
            {scoreDisplay.total > 0 && (
              <span className={`text-sm font-bold ${scoreDisplay.correct === scoreDisplay.total ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {Math.round((scoreDisplay.correct / scoreDisplay.total) * 100)}%
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Chat area */}
      <motion.div
        variants={itemVariants}
        className="space-y-3 rounded-2xl border bg-background/50 p-4 min-h-[300px] max-h-[60vh] overflow-y-auto"
      >
        <AnimatePresence mode="popLayout">
          {selectedScenario.lines
            .filter((line) => revealedLines.has(line.id))
            .map((line) => {
              const isVous = line.speaker === 'vous';
              const selectedIdx = selectedChoices[line.id];
              const isChecked = checkedAnswers[line.id] !== undefined;
              const isCorrect = checkedAnswers[line.id];

              return (
                <motion.div
                  key={line.id}
                  custom={line.speaker}
                  variants={bubbleVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  layout
                  className={`flex ${isVous ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] sm:max-w-[75%]`}>
                    {/* Speaker label */}
                    <p className={`text-[11px] font-medium mb-1 ${isVous ? 'text-right text-amber-600 dark:text-amber-400' : 'text-left text-teal-600 dark:text-teal-400'}`}>
                      {isVous ? 'Vous' : 'Interlocuteur'}
                    </p>

                    {/* Bubble */}
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-sm ${
                        isVous
                          ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-br-md'
                          : 'bg-gradient-to-br from-teal-500 to-emerald-500 text-white rounded-bl-md'
                      } ${isChecked && line.choices ? (isCorrect ? 'ring-2 ring-emerald-400 ring-offset-2 dark:ring-offset-background' : 'ring-2 ring-red-400 ring-offset-2 dark:ring-offset-background') : ''}`}
                    >
                      {/* Arabic text */}
                      <p className="font-arabic text-lg leading-relaxed mb-1" dir="rtl">
                        {line.arabic}
                      </p>

                      {/* French translation */}
                      {showTranslation && (
                        <p className="text-xs opacity-70 border-t border-white/20 pt-1 mt-1">
                          {line.french}
                        </p>
                      )}
                    </div>

                    {/* Choice options */}
                    {line.choices && isVous && (
                      <div className="mt-2 space-y-1.5">
                        {line.choices.map((choice, idx) => {
                          const isSelected = selectedIdx === idx;
                          const showCorrectFeedback = isChecked && idx === line.correctIndex;
                          const showWrongFeedback = isChecked && isSelected && idx !== line.correctIndex;

                          return (
                            <button
                              key={idx}
                              onClick={() => !isChecked && handleChoiceSelect(line.id, idx)}
                              disabled={isChecked}
                              className={`w-full text-left rounded-xl border px-3 py-2 text-sm transition-all duration-200 ${
                                isChecked
                                  ? showCorrectFeedback
                                    ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                                    : showWrongFeedback
                                      ? 'border-red-400 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300'
                                      : 'border-muted bg-muted/30 text-muted-foreground opacity-60'
                                  : isSelected
                                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600'
                                    : 'border-muted bg-background hover:border-amber-200 hover:bg-amber-50/50 dark:hover:border-amber-800 dark:hover:bg-amber-950/20 cursor-pointer'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {/* Status icon */}
                                <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                                  {showCorrectFeedback && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                                  {showWrongFeedback && <XCircle className="h-4 w-4 text-red-500" />}
                                  {!isChecked && isSelected && (
                                    <div className="h-3 w-3 rounded-full border-2 border-amber-500 dark:border-amber-400" />
                                  )}
                                </span>
                                <span className="flex-1 min-w-0">
                                  <span className="font-arabic text-base">{choice.arabic}</span>
                                  <span className="block text-xs text-muted-foreground mt-0.5">{choice.french}</span>
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </motion.div>

      {/* Results overlay */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            variants={resultVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="rounded-2xl border bg-gradient-to-br from-amber-50 to-orange-50 p-6 text-center dark:from-amber-950/30 dark:to-orange-950/30"
          >
            <div className="mb-3 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/20">
                <Trophy className="h-8 w-8 text-white" />
              </div>
            </div>
            <h3 className="text-xl font-extrabold mb-1">
              {score.correct === score.total
                ? 'Parfait ! 🎉'
                : score.correct >= score.total * 0.7
                  ? 'Très bien ! 👏'
                  : 'Continuez ! 💪'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {score.correct === score.total
                ? 'Vous avez maîtrisé cette conversation !'
                : `Vous avez obtenu ${score.correct} sur ${score.total} réponses correctes.`}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" size="sm" onClick={handleReset}>
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Recommencer
              </Button>
              <Button variant="outline" size="sm" onClick={handleBackToList}>
                <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                Autres scénarios
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action buttons */}
      {!showResults && (
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 pb-4">
          {!allRevealed && (
            <Button onClick={handleRevealNext} className="gap-1.5 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-sm">
              <ChevronRight className="h-4 w-4" />
              Réplique suivante
            </Button>
          )}
          {!allRevealed && (
            <Button variant="outline" size="sm" onClick={handleRevealAll}>
              Tout révéler
            </Button>
          )}
          {allChoiceLinesAnswered && !showResults && (
            <Button onClick={handleCheckAll} className="gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm">
              <CheckCircle2 className="h-4 w-4" />
              Vérifier les réponses
            </Button>
          )}
          {!allChoiceLinesAnswered && allRevealed && (
            <p className="text-sm text-muted-foreground">
              Sélectionnez une réponse pour chaque choix pour vérifier.
            </p>
          )}
        </motion.div>
      )}

      {/* Back Button */}
      <motion.div variants={itemVariants} className="pb-4">
        <Button variant="ghost" size="sm" onClick={handleBackHome}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Retour à l&apos;accueil
        </Button>
      </motion.div>
    </motion.div>
  );
}
