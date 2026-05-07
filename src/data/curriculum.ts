// Moroccan Darija Learning Curriculum - B1 Level (12 Levels, 43 Lessons)
// Task ID: 3-a | Agent: Data Builder
// All content uses authentic Moroccan Darija, not Modern Standard Arabic.
// Phonetic conventions: 3=ع, 7=ح, 9=ص, 6=ط, 'hamza=ء, gh=غ, kh=خ, q=ق, sh=ش

export interface VocabularyItem {
  french: string;
  phonetic: string;
  arabic: string;
  notes?: string;
}

export interface Phrase {
  french: string;
  phonetic: string;
  arabic: string;
  context?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  hint?: string;
}

export interface Lesson {
  id: string;
  title: string;
  titleAr: string;
  description: string;
  duration: string;
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  grammar?: string;
  tips?: string[];
  quiz: QuizQuestion[];
}

export interface Level {
  id: number;
  title: string;
  titleAr: string;
  description: string;
  cefrLevel: string;
  icon: string;
  lessons: Lesson[];
  color: string;
}

export const levels: Level[] = [
  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 1: Les bases de l'alphabet et les sons (A1.1)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 1,
    title: "Les bases de l'alphabet et les sons",
    titleAr: "أَسَاسِيَاتُ الحُرُوفِ وَالنُّطْقِ",
    description: "Apprenez à reconnaître les lettres arabes et maîtriser les sons uniques du darija marocain.",
    cefrLevel: "A1.1",
    icon: "🔤",
    color: "from-rose-500 to-pink-600",
    lessons: [
      {
        id: "1-1",
        title: "L'alphabet arabe marocain",
        titleAr: "الحُرُوفُ العَرَبِيَّةُ المَغْرِبِيَّةُ",
        description: "Découvrez les 28 lettres de l'alphabet arabe utilisées en darija marocain.",
        duration: "7 min",
        vocabulary: [
          { french: "lettre (alphabet)", phonetic: "7arf", arabic: "حَرْفٌ", notes: "Pluriel : 7rouf (حُرُوف)" },
          { french: "alphabet", phonetic: "l-alfba", arabic: "الأَلِفْبَاءُ", notes: "On dit souvent 'l-helf' en darija" },
          { french: "A (alif)", phonetic: "alif", arabic: "أَلِفٌ", notes: "Première lettre, aussi un son long 'aa'" },
          { french: "B (ba)", phonetic: "ba", arabic: "بَاءٌ", notes: "Se prononce comme le B français" },
          { french: "T (ta)", phonetic: "ta", arabic: "تَاءٌ", notes: "Comme le T français" },
          { french: "T emphatique (ta)", phonetic: "6a", arabic: "طَاءٌ", notes: "T épais, prononcé avec la langue plate (transcrit '6')" },
          { french: "S (sin)", phonetic: "sin", arabic: "سِينٌ", notes: "Comme le S français" },
          { french: "S emphatique (sad)", phonetic: "sad", arabic: "صَادٌ", notes: "S épais, comme un S résonant (transcrit '9')" },
          { french: "D (dal)", phonetic: "dal", arabic: "دَالٌ", notes: "Comme le D français" },
          { french: "D emphatique (dad)", phonetic: "dad", arabic: "ضَادٌ", notes: "D épais, typique de l'arabe (transcrit 'dˁ')" },
          { french: "R (ra)", phonetic: "ra", arabic: "رَاءٌ", notes: "R roulé comme en espagnol" },
          { french: "W (waw)", phonetic: "waw", arabic: "وَاوٌ", notes: "Peut être consonne ou voyelle longue 'uu'" },
        ],
        phrases: [
          { french: "Comment ça s'écrit ?", phonetic: "kifash katktib ?", arabic: "كِفَاش كَتْكْتِبْ ؟", context: "Pour demander l'orthographe" },
          { french: "Montre-moi la lettre", phonetic: "wurini l-7arf", arabic: "وُرِينِي الحَرْفَ", context: "Pour apprendre une nouvelle lettre" },
          { french: "C'est quelle lettre ?", phonetic: "chnou had l-7arf ?", arabic: "شْنُو هَادَ الحَرْفُ ؟", context: "Pour identifier une lettre" },
          { french: "Répète après moi", phonetic: "3awd liyya", arabic: "عَاوِدْ لِيَّ", context: "Pour la pratique" },
          { french: "Je ne sais pas lire", phonetic: "ma-kandersh n-qra", arabic: "مَا كَنْدَرْش نِقْرَا", context: "Quand on ne peut pas déchiffrer" },
          { french: "Écris-le en arabe", phonetic: "kteb b-l-3arbi", arabic: "كْتِب بِالعَرْبِيِّ", context: "Pour demander une traduction écrite" },
        ],
        grammar: `L'alphabet arabe compte 28 lettres, toutes consonnes. Les voyelles (a, i, u) sont indiquées par des diacritiques (harakat) placées au-dessus ou en dessous des consonnes.

Les lettres se divisent en deux catégories :
- **Lettres solaires** (chamsiya) : elles absorbent le « l » de l'article « el- » et se doublent. Ex. : ech-chams (الشَّمْس)
- **Lettres lunaires** (qamariya) : elles gardent le « l ». Ex. : el-qamar (القَمَر)

L'arabe s'écrit de droite à gauche, et les lettres changent de forme selon leur position (début, milieu, fin, isolée).`,
        tips: [
          "L'alphabet arabe s'écrit de droite à gauche. N'essayez pas de le lire de gauche à droite !",
          "Au Maroc, beaucoup de mots sont écrits en latin (arabizi/chat), surtout sur les réseaux sociaux.",
          "Les lettres arabes n'ont pas de majuscules ni de minuscules.",
          "Il existe 4 formes pour chaque lettre : isolée, initiale, médiane et finale.",
        ],
        quiz: [
          {
            question: "Combien de lettres compte l'alphabet arabe ?",
            options: ["26", "28", "30", "24"],
            correctIndex: 1,
            hint: "C'est deux de plus que l'alphabet latin.",
          },
          {
            question: "Dans quelle direction lit-on l'arabe ?",
            options: ["De gauche à droite", "De droite à gauche", "De haut en bas", "En spirale"],
            correctIndex: 1,
          },
          {
            question: "Comment s'écrit phonétiquement la lettre 'B' en arabe ?",
            options: ["ba", "pa", "va", "da"],
            correctIndex: 0,
          },
          {
            question: "Quelle lettre arabe est roulée comme en espagnol ?",
            options: ["dal (د)", "ra (ر)", "sin (س)", "waw (و)"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'lettre' en darija ?",
            options: ["kelma", "7arf", "jumla", "kitaab"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "1-2",
        title: "Les sons spéciaux du darija",
        titleAr: "أَصْوَاتُ الدَّارِجَةِ الخَاصَّةُ",
        description: "Maîtrisez les sons qui n'existent pas en français : ghain, khâ, qâf, hamza et le '3'.",
        duration: "6 min",
        vocabulary: [
          { french: "Ayn ع (son guttural)", phonetic: "3ayn", arabic: "عَيْنٌ", notes: "Son guttural profond, transcrit par '3'. Très courant en darija." },
          { french: "Ha ح (h aspiré)", phonetic: "7a", arabic: "حَاءٌ", notes: "H aspiré profond, transcrit par '7'. Comme un h fort." },
          { french: "Kha خ (son guttural)", phonetic: "kha", arabic: "خَاءٌ", notes: "Comme le 'ch' allemand (Bach). Transcrit par 'kh'." },
          { french: "Ghain غ (son ronflant)", phonetic: "ghayn", arabic: "غَيْنٌ", notes: "Son ronflant comme le R parisien. Transcrit par 'gh'." },
          { french: "Qaf ق (q guttural)", phonetic: "qaf", arabic: "قَافٌ", notes: "K prononcé au fond de la gorge. En darija, souvent prononcé comme un G dur." },
          { french: "Hamza ء (coup de glotte)", phonetic: "hamza", arabic: "هَمْزَةٌ", notes: "Coup de glotte, comme dans le 'oh oh' anglais." },
          { french: "Chin ش (ch)", phonetic: "chin", arabic: "شِينٌ", notes: "Comme le 'ch' français. Transcrit par 'sh'." },
          { french: "Dad ض (d emphatique)", phonetic: "dad", arabic: "ضَادٌ", notes: "D épais, la lettre caractéristique de l'arabe." },
          { french: "Son", phonetic: "9awt", arabic: "صَوْتٌ", notes: "Mot utile pour demander la prononciation" },
          { french: "Prononciation", phonetic: "l-fukhha", arabic: "الفُخَّةُ", notes: "En darija, on dit 'l-fukhha' pour la prononciation" },
        ],
        phrases: [
          { french: "Comment on prononce ça ?", phonetic: "kifash kat-lqri had sh-shi ?", arabic: "كِفَاش كَتْلَقْرِي هَادَ الشِّيء ؟", context: "Pour demander la prononciation" },
          { french: "Prononce plus lentement", phonetic: "iqra b-shwiya", arabic: "اقْرَأْ بِشْوِيَّة", context: "Quand on ne comprend pas" },
          { french: "C'est difficile à prononcer", phonetic: "s3ib nutqu", arabic: "صْعِيبٌ نُطْقُو", context: "Pour exprimer une difficulté" },
          { french: "Encore une fois", phonetic: "mara tanya", arabic: "مَرَّةً تَانِيَّةً", context: "Pour réentendre" },
          { french: "Ce n'est pas comme en français", phonetic: "mashi m3a l-fransawiya", arabic: "مَاشِي مَعَ الفِرَنْسَاوِيَّة", context: "Comparer les sons" },
          { french: "Tu prononces bien !", phonetic: "kat-lqra mzyan !", arabic: "كَتْلَقْرَى مْزْيَان !", context: "Encourager quelqu'un" },
        ],
        grammar: `Les sons spéciaux du darija marocain :

**ع (3ayn)** : Son guttural produit au fond de la gorge. Très utilisé : 3ali, 3omri, 3afak.
**ح (7a)** : H aspiré profond. Différent du h normal (ه). Exemple : 7aja (chose), 7alal (permis).
**خ (kha)** : Comme le jota espagnol ou le ch allemand. Exemple : khobz (pain), kheedma (travail).
**غ (ghayn)** : Son ronflant guttural, similaire au R parisien grasseyé. Exemple : ghir (seulement), ghadi (futur).
**ق (qaf)** : En darija, souvent prononcé comme un G dur (gu) contrairement à l'arabe classique. Exemple : gal = a dit, ga3da = assise.
**ء (hamza)** : Coup de glotte. Exemple : sa'a (heure), ra's (tête).

Le darija marocain se distingue aussi par la transformation de certains sons classiques : le ق (qaf) devient souvent un G, le ج (jim) devient souvent J (comme en français) ou parfois DZ.`,
        tips: [
          "Au Maroc, le lettre ق (qaf) se prononce souvent comme un 'g' français (ex: gal au lieu de qal).",
          "Le ع (3ayn) est le son le plus caractéristique de l'arabe. Pratiquez-le en expirant depuis le fond de la gorge.",
          "Le غ (ghayn) ressemble au R parisien grasseyé. Si vous maîtrisez le R français, vous êtes proche !",
          "Ne vous inquiétez pas si ces sons sont difficiles au début. Les Marocains sont très indulgents avec les étrangers.",
        ],
        quiz: [
          {
            question: "Quel symbole représente le son guttural '3ayn' (ع) ?",
            options: ["7", "gh", "3", "kh"],
            correctIndex: 2,
          },
          {
            question: "En darija marocain, le ق (qaf) se prononce souvent comment ?",
            options: ["K français", "G français dur", "T français", "P français"],
            correctIndex: 1,
          },
          {
            question: "Comment on transcrit le ح (ha) ?",
            options: ["h", "7", "kh", "gh"],
            correctIndex: 1,
          },
          {
            question: "Le خ (kha) ressemble à quel son européen ?",
            options: ["Le ch français", "Le jota espagnol", "Le th anglais", "Le sch allemand"],
            correctIndex: 1,
          },
          {
            question: "Que signifie 'mara tanya' ?",
            options: ["Bienvenue", "Encore une fois", "Merci", "Au revoir"],
            correctIndex: 1,
          },
          {
            question: "Comment dire 'son' en darija ?",
            options: ["kalma", "9awt", "3in", "nhar"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "1-3",
        title: "Les voyelles courtes et longues",
        titleAr: "الحَرَكَاتُ القَصِيرَةُ وَالطَّوِيلَةُ",
        description: "Apprenez les voyelles brèves (fatha, kasra, damma) et les voyelles longues.",
        duration: "5 min",
        vocabulary: [
          { french: "fatha (voyelle a)", phonetic: "fatha", arabic: "فَتْحَةٌ", notes: "Petit trait au-dessus de la lettre : ـَ → son 'a'" },
          { french: "kasra (voyelle i)", phonetic: "kasra", arabic: "كَسْرَةٌ", notes: "Petit trait en dessous : ـِ → son 'i'" },
          { french: "damma (voyelle u)", phonetic: "damma", arabic: "ضَمَّةٌ", notes: "Petit waw au-dessus : ـُ → son 'u'" },
          { french: "sukun (absence de voyelle)", phonetic: "sukun", arabic: "سُكُونٌ", notes: "Petit cercle au-dessus : ـْ → consonne sans voyelle" },
          { french: "shadda (redoublement)", phonetic: "shadda", arabic: "شَدَّةٌ", notes: "Petit w au-dessus : ـّ → consonne doublée" },
          { french: "madda (allongement)", phonetic: "madda", arabic: "مَدَّةٌ", notes: "Petit trait ~ au-dessus de alif : آ → 'aa' long" },
          { french: "tashkeel (diacritiques)", phonetic: "tashkeel", arabic: "تَشْكِيلٌ", notes: "Ensemble des marques vocaliques" },
          { french: "mot", phonetic: "kalma", arabic: "كَلِمَةٌ", notes: "Unité de base du vocabulaire" },
          { french: "voyelle longue", phonetic: "haraka twila", arabic: "حَرَكَةٌ طَوِيلَةٌ", notes: "Alif=aa, Waw=uu, Ya=ii" },
        ],
        phrases: [
          { french: "Est-ce que ça a une voyelle ?", phonetic: "kayn fih haraka ?", arabic: "كَايِنْ فِيه حَرَكَة ؟", context: "Concernant les diacritiques" },
          { french: "Lis avec les voyelles", phonetic: "qra b-l-harakat", arabic: "اقْرَأْ بِالحَرَكَاتِ", context: "Pour une lecture correcte" },
          { french: "Cette lettre se prononce comment ?", phonetic: "kifash kat-qra had l-7arf ?", arabic: "كِفَاش كَتْقَرَا هَادَ الحَرْفُ ؟", context: "Pour demander la lecture" },
          { french: "C'est une voyelle longue", phonetic: "hadi haraka twila", arabic: "هَادِي حَرَكَةٌ طَوِيلَةٌ", context: "Identifier un son long" },
          { french: "Sans voyelle, c'est différent", phonetic: "bla haraka, ghayr", arabic: "بِلَا حَرَكَة غَيْر", context: "Expliquer une différence" },
        ],
        grammar: `Les voyelles en arabe se divisent en deux types :

**Voyelles brèves (harakat) :**
- **Fatha (َ)** : produit le son « a ». Exemple : بَ = ba
- **Kasra (ِ)** : produit le son « i ». Exemple : بِ = bi
- **Damma (ُ)** : produit le son « u ». Exemple : بُ = bu
- **Sukun (ْ)** : absence de voyelle. Exemple : بْ = b (sans voyelle)

**Voyelles longues :**
- **Alif (ا)** : prolonge le fatha en « aa ». Exemple : بَا = baa
- **Waw (و)** : prolonge la damma en « uu ». Exemple : بُو = buu
- **Ya (ي)** : prolonge la kasra en « ii ». Exemple : بِي = bii

**Shadda (ّ)** : redouble la consonne. Exemple : بّ = bb

Dans le darija écrit courant (arabizi), les diacritiques sont rarement utilisés. Ils servent surtout dans les textes religieux et l'apprentissage.`,
        tips: [
          "Dans la vie quotidienne au Maroc, les voyelles courtes ne sont presque jamais écrites. On les déduit du contexte.",
          "Le darija est surtout parlé et écrit en caractères latins (arabizi) par les jeunes Marocains.",
          "Les diacritiques sont essentielles pour le Coran et la poésie, mais optionnels au quotidien.",
          "Pratiquez les trois sons de base (a, i, u) avant de passer aux longs.",
        ],
        quiz: [
          {
            question: "Quel diacritique produit le son 'a' ?",
            options: ["kasra (ِ)", "fatha (َ)", "damma (ُ)", "sukun (ْ)"],
            correctIndex: 1,
          },
          {
            question: "Que signifie le sukun (ْ) ?",
            options: ["Voyelle 'a'", "Voyelle 'u'", "Absence de voyelle", "Consonne doublée"],
            correctIndex: 2,
          },
          {
            question: "Quelle lettre prolonge le son 'u' en 'uu' ?",
            options: ["Alif (ا)", "Waw (و)", "Ya (ي)", "Hamza (ء)"],
            correctIndex: 1,
          },
          {
            question: "Que fait la shadda (ّ) ?",
            options: ["Raccourcit la consonne", "Double la consonne", "Ajoute une voyelle", "Supprime le son"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'mot' en darija ?",
            options: ["7arf", "kalma", "haraka", "9awt"],
            correctIndex: 1,
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 2: Salutations et présentations (A1.1)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 2,
    title: "Salutations et présentations",
    titleAr: "التَّحِيَّاتُ وَالتَّعَارُفُ",
    description: "Apprenez à saluer, vous présenter et utiliser les expressions de politesse essentielles.",
    cefrLevel: "A1.1",
    icon: "👋",
    color: "from-amber-500 to-orange-600",
    lessons: [
      {
        id: "2-1",
        title: "Dire bonjour et au revoir",
        titleAr: "التَّحِيَّاتُ وَالوَدَاعُ",
        description: "Les salutations marocaines essentielles pour chaque situation.",
        duration: "5 min",
        vocabulary: [
          { french: "bonjour / paix", phonetic: "salam", arabic: "سَلَامٌ", notes: "Salutation universelle au Maroc" },
          { french: "comment vas-tu ?", phonetic: "kidayr / kidayra ?", arabic: "كِيدَايْر / كِيدَايْرَا ؟", notes: "Vrai darija. Masc : kidayr, Fém : kidayra. Ou 'labas 3lik ?'" },
          { french: "ça va / bien", phonetic: "labas", arabic: "لاباس", notes: "Réponse universelle : labas = ça va" },
          { french: "au revoir", phonetic: "bslama", arabic: "بِالسَّلَامَةِ", notes: "Littéralement 'avec la paix'" },
          { french: "bonsoir", phonetic: "msa l-khir", arabic: "مَسَاءُ الخَيْرِ", notes: "Après la prière du 'asr (~15h)" },
          { french: "bonne nuit", phonetic: "lila mbarka", arabic: "لَيْلَةٌ مُبَارَكَةٌ", notes: "Se dit le soir pour souhaiter une bonne nuit" },
          { french: "merci", phonetic: "shukran", arabic: "شُكْرًا", notes: "Très courant, compris partout" },
          { french: "bienvenue", phonetic: "mer7ba", arabic: "مَرْحَبَا", notes: "Pour accueillir quelqu'un" },
          { french: "et toi ?", phonetic: "w-ntiya ?", arabic: "وَنْتِيَّا ؟", notes: "Pour retourner la question" },
          { french: "la paix soit sur vous", phonetic: "salam 3likum", arabic: "السَّلَامُ عَلَيْكُمْ", notes: "Salutation formelle, réponse : wa 3likum s-salam" },
        ],
        phrases: [
          { french: "Bonjour, ça va ?", phonetic: "salam, labas ?", arabic: "سَلَام، لَبَاس ؟", context: "Salutation informelle quotidienne" },
          { french: "Wa 3likum s-salam (et paix sur vous)", phonetic: "wa 3likum s-salam", arabic: "وَعَلَيْكُمُ السَّلَامُ", context: "Réponse à 'salam 3likum'" },
          { french: "Labas 3lik ? (Ça va pour toi ?)", phonetic: "labas 3lik ?", arabic: "لَبَاس عَلِيكْ ؟", context: "Question familière de politesse" },
          { french: "Labas, hamdullah", phonetic: "labas, hamdullah", arabic: "لَبَاس، الحَمْدُ لِلّٰهِ", context: "Labas, grâce à Dieu" },
          { french: "Au revoir et bonne route !", phonetic: "bslama, tri9 salama !", arabic: "بِالسَّلَامَة طَرِيق سَلَامَة !", context: "Dire au revoir à quelqu'un qui part en voyage" },
          { french: "Bon week-end !", phonetic: "juma mubarka !", arabic: "جُمْعَةٌ مُبَارَكَة !", context: "Le vendredi, jour saint de la semaine" },
          { french: "À demain !", phonetic: "n-shufek ghadda !", arabic: "نَشُوفَك غَدَّا !", context: "Pour se dire à demain" },
        ],
        grammar: `**Les salutations en darija :**

- **Salam** (سَلَام) : C'est le « bonjour » universel au Maroc.
- **Salam 3likum** (السَّلَامُ عَلَيْكُمْ) : Plus formel, utilisé dans tous les contextes.
- **Labas 3lik ?** (لَبَاس عَلِيكْ) : « Ça va ? » (litt. "il y a du bien sur toi ?").
- **Bslama** (بِالسَّلَامَةِ) : « Au revoir » (litt. "avec la sécurité").

**Réponses typiques :**
- Labas, hamdullah (ça va, grâce à Dieu)
- Labas, shukran (ça va, merci)
- 3la rbibi (sur mon Dieu = ça va bien)

**Expressions de temps :**
- Sba7 l-khir : Bonjour (matin, litt. "matin de bien")
- Msa l-khir : Bonsoir (litt. "soir de bien")`,
        tips: [
          "Au Maroc, on se salue toujours, même avec des inconnus. Il est impoli de ne pas dire 'salam'.",
          "On utilise souvent la main sur le cœur en disant 'salam' ou 'shukran' : c'est un geste de sincérité.",
          "Les hommes se serrent la main (parfois en touchant le cœur après). Les femmes entre elles se font la bise.",
          "Entre hommes et femmes, la poignée de main dépend du contexte : attendez que l'autre tende la main.",
        ],
        quiz: [
          {
            question: "Comment dit-on 'bonjour' en darija ?",
            options: ["salam", "bslama", "shukran", "mer7ba"],
            correctIndex: 0,
          },
          {
            question: "Que signifie 'bslama' ?",
            options: ["Bonjour", "Merci", "Au revoir", "Bienvenue"],
            correctIndex: 2,
          },
          {
            question: "Comment répond-on à 'labas 3lik ?'",
            options: ["bslama", "labas, hamdullah", "shukran bzzaf", "salam 3likum"],
            correctIndex: 1,
          },
          {
            question: "Que dit-on pour souhaiter bonne nuit ?",
            options: ["sba7 l-khir", "msa l-khir", "lila mbarka", "juma mubarka"],
            correctIndex: 2,
          },
          {
            question: "Que signifie 'mer7ba' ?",
            options: ["Au revoir", "Bienvenue", "Merci", "Pardon"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "2-2",
        title: "Se présenter",
        titleAr: "التَّقْدِيمُ بِالنَّفْسِ",
        description: "Apprenez à donner votre nom, votre origine et des informations de base sur vous.",
        duration: "6 min",
        vocabulary: [
          { french: "je / moi", phonetic: "ana", arabic: "أَنَا", notes: "Pronom sujet à la première personne" },
          { french: "nom", phonetic: "smiya", arabic: "سْمِيَّةٌ", notes: "Ou 'ism' dans un registre plus classique" },
          { french: "mon nom est...", phonetic: "smiyti...", arabic: "سْمِيَّتِي...", notes: "Littéralement 'mon nom est...'" },
          { french: "d'où / de où", phonetic: "mnin", arabic: "مِنِّينَ", notes: "Pour demander l'origine" },
          { french: "Maroc", phonetic: "l-maghrib", arabic: "المَغْرِبُ", notes: "Le pays" },
          { french: "France", phonetic: "fransa", arabic: "فِرَنْسَا", notes: "En darija, on garde les noms de pays" },
          { french: "ville", phonetic: "mdina", arabic: "مَدِينَةٌ", notes: "Ou 'blad' (pays/ville)" },
          { french: "Casa (Casablanca)", phonetic: "bda / casa", arabic: "بَيْضَاء / كَازَا", notes: "Bda est le nom darija de Casablanca" },
          { french: "Rabat", phonetic: "rbat", arabic: "رِّبَاطُ", notes: "Capitale du Maroc" },
          { french: "âge", phonetic: "3omr", arabic: "عُمْرٌ", notes: "Pour donner son âge" },
          { french: "an(s)", phonetic: "sana / snin", arabic: "سَنَة / سِنِينَ", notes: "singulier et pluriel" },
        ],
        phrases: [
          { french: "Je m'appelle...", phonetic: "ana smiyti...", arabic: "أَنَا سْمِيَّتِي...", context: "Se présenter" },
          { french: "Tu t'appelles comment ?", phonetic: "chnou smiytek ?", arabic: "شْنُو سْمِيَّتَكْ ؟", context: "Demander le nom" },
          { french: "D'où viens-tu ?", phonetic: "mnta mnin ?", arabic: "مُنْتَا مِنِّينَ ؟", context: "Demander l'origine" },
          { french: "Je suis de France", phonetic: "ana mn fransa", arabic: "أَنَا مِنْ فِرَنْسَا", context: "Dire son pays d'origine" },
          { french: "J'habite à Casablanca", phonetic: "sken f casa", arabic: "سَكَنْ فِ كَازَا", context: "Dire où on vit" },
          { french: "Quel âge as-tu ?", phonetic: "sh7al 3omrek ?", arabic: "شْحَال عُمْرَكْ ؟", context: "Demander l'âge" },
          { french: "J'ai 25 ans", phonetic: "3ndi 25 sana", arabic: "عَنْدِي خَمْسَةٌ وَعِشْرُونَ سَنَةً", context: "Donner son âge" },
          { french: "Enchanté(e) !", phonetic: "tfarrajna 3la weqila !", arabic: "تَفَرَّجْنَا عَلَى وَقِيلَة !", context: "Après une présentation (litt. on a vu une chose rare)" },
        ],
        grammar: `**Se présenter en darija :**

Le verbe « être » n'existe pas au présent en darija. On utilise simplement le pronom + le nom/adjectif :
- **Ana smiyti Mohamed** = Je (suis) Mohamed
- **Ana mn fransa** = Je (suis) de France

**Les pronoms sujets :**
- ana (أنا) = je
- nta (نتا) = tu (masc.)
- nti (نتي) = tu (fém.)
- huwa (هو) = il
- hya (هي) = elle
- n7na (نحنا) = nous
- ntuma (نتوما) = vous
- houma (هوما) = ils/elles

**Dire son âge :**
En darija, on utilise « 3ndi » (j'ai) : **3ndi 25 sana** (j'ai 25 ans).
Ne traduisez pas littéralement « je suis X ans » !`,
        tips: [
          "'Tfarrajna 3la weqila' est l'équivalent de 'enchanté'. Littéralement : 'on a vu une chose précieuse'.",
          "Les Marocains adorent savoir d'où vous venez. C'est souvent la première question après le nom.",
          "Il est normal de demander l'âge au Maroc, ce n'est pas impoli comme en Occident.",
          "Après s'être présentés, on se pose souvent des questions sur la famille et le travail.",
        ],
        quiz: [
          {
            question: "Comment dit-on 'je m'appelle Mohamed' en darija ?",
            options: ["ana Mohamed", "ana smiyti Mohamed", "smiytek chnou ?", "kifash smiya"],
            correctIndex: 1,
          },
          {
            question: "Comment demande-t-on l'origine ?",
            options: ["sh7al 3omrek ?", "chnou smiytek ?", "mnta mnin ?", "kifash kat-tsawi ?"],
            correctIndex: 2,
          },
          {
            question: "Comment dit-on 'j'ai 30 ans' en darija ?",
            options: ["ana 30 sana", "kansniw 30 sana", "3ndi 30 sana", "3omri 30"],
            correctIndex: 2,
          },
          {
            question: "Que signifie 'tfarrajna 3la weqila' ?",
            options: ["Au revoir", "Merci beaucoup", "Enchanté de faire ta connaissance", "Comment ça va"],
            correctIndex: 2,
          },
          {
            question: "Comment dit-on 'Maroc' en darija ?",
            options: ["maroc", "l-maghrib", "maghreb", "morocco"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "2-3",
        title: "Politesse et expressions courantes",
        titleAr: "الأَدَبُ وَالتَّعْبِيرَاتُ الشَّائِعَةُ",
        description: "Les formules de politesse indispensables et les expressions les plus utilisées au quotidien.",
        duration: "5 min",
        vocabulary: [
          { french: "s'il te plaît", phonetic: "3afak", arabic: "عَافَاكَ", notes: "S'il te plaît (informel)" },
          { french: "s'il vous plaît (formel)", phonetic: "law sama7ti", arabic: "لَوْ سَمَحْتِي", notes: "Plus poli et formel" },
          { french: "merci beaucoup", phonetic: "shukran bzzaf", arabic: "شُكْرًا بْزَافٍ", notes: "bzzaf = beaucoup" },
          { french: "de rien", phonetic: "bla jmil", arabic: "بِلَا جَمِيلٍ", notes: "Litt. 'sans beau geste'" },
          { french: "pardon / excusez-moi", phonetic: "smeh liyya", arabic: "سْمَحْ لِيَّ", notes: "Pour s'excuser ou attirer l'attention" },
          { french: "oui", phonetic: "ah / yeh", arabic: "آه / يَه", notes: "ah est très courant" },
          { french: "non", phonetic: "la", arabic: "لَا", notes: "Non simple" },
          { french: "peut-être", phonetic: "ybqash", arabic: "يِبْقَاش", notes: "Contraction de 'yabqa shi'" },
          { french: "je ne sais pas", phonetic: "ma-3raftch", arabic: "مَا عَرَفْتْش", notes: "Ma + verbe + ch = négation" },
          { french: "je comprends", phonetic: "fhemt", arabic: "فَهْمْتُ", notes: "J'ai compris" },
        ],
        phrases: [
          { french: "S'il te plaît, aide-moi", phonetic: "3afak, 3awwni", arabic: "عَافَاك، عَاوِنِّي", context: "Demander de l'aide" },
          { french: "Merci beaucoup !", phonetic: "allah yjazik b-l-khir !", arabic: "اللّٰه يُجَازِيكَ بِالخَيْرِ", context: "Merci sincère (Dieu te récompense)" },
          { french: "Excusez-moi, je suis en retard", phonetic: "smeh liyya, ana mwekker", arabic: "سْمَحْ لِيَّ، أَنَا مُوَخَّر", context: "S'excuser pour le retard" },
          { french: "Non, merci", phonetic: "la, shukran", arabic: "لَا، شُكْرًا", context: "Refuser poliment" },
          { french: "Vous parlez français ?", phonetic: "kat-hedru b-fransawiya ?", arabic: "كَتْهَدْرُو بِالفِرَنْسَاوِيَّة ؟", context: "Demander si quelqu'un parle français (hedru = vrai darija, pas kellmu)" },
          { french: "Je ne parle pas bien darija", phonetic: "ma-ndersh bzzaf b-darija", arabic: "مَا نْدَرْش بْزَاف بِالدَّارِجَةِ", context: "Excuse pour la langue" },
          { french: "Peux-tu répéter ?", phonetic: "tqder t3awd liyya ?", arabic: "تِقْدَر تْعَاوِد لِيَّ ؟", context: "Quand on n'a pas compris" },
          { french: "Bismillah (Au nom de Dieu)", phonetic: "bismillah", arabic: "بِسْمِ اللّٰهِ", context: "Avant de manger, de partir, etc." },
        ],
        grammar: `**La négation en darija :**

La négation est formée avec **ma...sh** (ou **ma...chi**) autour du verbe :
- **Ma-3raftsh** (مَا عَرَفْتْش) = Je ne sais pas
- **Ma-bghitch** (مَا بَغِيتْش) = Je ne veux pas
- **Ma-fhemtch** (مَا فَهْمْتْش) = Je n'ai pas compris

**Les expressions de politesse :**
- **Allah yjazik b-l-khir** : « Que Dieu te récompense » (très courant au Maroc)
- **Bla jmil** : « De rien »
- **Smeh liyya** : « Pardon / excuse-moi »
- **3afak** : « S'il te plaît »

Note : Le darija n'a pas d'équivalent direct de « vous » de politesse dans la grammaire, mais on utilise des formules plus longues comme **law sama7ti** pour être plus poli.`,
        tips: [
          "'Allah yjazik b-l-khir' est la façon la plus sincère de dire merci au Maroc. Les Marocains l'utilisent très souvent.",
          "Dire 'bismillah' avant de manger est très apprécié, même par les non-pratiquants.",
          "Ne soyez pas surpris si un Marocain vous dit 'tfaddal' (تَفَضَّل) en vous invitant : c'est l'hospitalité marocaine !",
          "Le mot 'bzzaf' (بزاف) signifie 'beaucoup' et est utilisé constamment : shukran bzzaf, ghadi bzzaf, etc.",
        ],
        quiz: [
          {
            question: "Comment dit-on 's'il te plaît' en darija ?",
            options: ["shukran", "3afak", "bslama", "smeh liyya"],
            correctIndex: 1,
          },
          {
            question: "Comment forme-t-on la négation ?",
            options: ["la + verbe", "ma + verbe + sh", "verbe + la", "ma + verbe"],
            correctIndex: 1,
          },
          {
            question: "Que signifie 'allah yjazik b-l-khir' ?",
            options: ["Que Dieu te garde", "Merci beaucoup", "Dieu est grand", "Au nom de Dieu"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'je ne comprends pas' en darija ?",
            options: ["ma-fhemtch", "ma-3raftch", "ma-bghitch", "ma-kandersh"],
            correctIndex: 0,
          },
          {
            question: "Que signifie 'bzzaf' ?",
            options: ["Un peu", "Beaucoup", "Maintenant", "Demain"],
            correctIndex: 1,
          },
          {
            question: "Comment dire 'de rien' ?",
            options: ["shukran", "3afak", "bla jmil", "smeh liyya"],
            correctIndex: 2,
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 3: Nombres et temps (A1.1)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 3,
    title: "Nombres et temps",
    titleAr: "الأَعْدَادُ وَالوَقْتُ",
    description: "Maîtrisez les nombres, les jours, les mois et l'heure en darija marocain.",
    cefrLevel: "A1.1",
    icon: "🔢",
    color: "from-emerald-500 to-teal-600",
    lessons: [
      {
        id: "3-1",
        title: "Les nombres de 0 à 20",
        titleAr: "الأَعْدَادُ مِنَ الصِّفْرِ إِلَى العِشْرِينَ",
        description: "Apprenez à compter de 0 à 20 en darija marocain.",
        duration: "6 min",
        vocabulary: [
          { french: "zéro", phonetic: "sifr", arabic: "صِفْرٌ" },
          { french: "un (1)", phonetic: "wahed", arabic: "وَاحِدٌ", notes: "Ou 'jed' dans certains contextes" },
          { french: "deux (2)", phonetic: "jouj", arabic: "جُوجٌ" },
          { french: "trois (3)", phonetic: "tlata", arabic: "تْلَاتَةٌ" },
          { french: "quatre (4)", phonetic: "reb3a", arabic: "رَبْعَةٌ" },
          { french: "cinq (5)", phonetic: "khamsa", arabic: "خَمْسَةٌ" },
          { french: "six (6)", phonetic: "setta", arabic: "سِتَّةٌ" },
          { french: "sept (7)", phonetic: "seb3a", arabic: "سَبْعَةٌ" },
          { french: "huit (8)", phonetic: "tmenya", arabic: "تْمَنْيَةٌ" },
          { french: "neuf (9)", phonetic: "tes3a", arabic: "تِسْعَةٌ" },
          { french: "dix (10)", phonetic: "3ashra", arabic: "عَشَرَةٌ" },
          { french: "combien ?", phonetic: "sh7al ?", arabic: "شْحَال ؟", notes: "Question essentielle pour demander un nombre" },
        ],
        phrases: [
          { french: "Combien ça coûte ?", phonetic: "sh7al hadchi ?", arabic: "شْحَال هَادَ الشِّيءُ ؟", context: "Demander le prix" },
          { french: "J'en veux deux", phonetic: "bghit jouj", arabic: "بَغِيت جُوج", context: "Commander au marché" },
          { french: "Donnez-moi cinq dirhams", phonetic: "3tini khamsa d-drahm", arabic: "عْطِينِي خَمْسَة دِّرْهَم", context: "Payer ou rendre la monnaie" },
          { french: "Un, deux, trois...", phonetic: "wahed, jouj, tlata...", arabic: "وَاحِد، جُوج، تْلَاتَة...", context: "Compter" },
          { french: "Il y a dix personnes", phonetic: "kayn 3ashra nass", arabic: "كَايِن عَشَرَة نَاس", context: "Donner un nombre" },
        ],
        grammar: `**Les nombres de 11 à 20 en darija :**

- 11 : heddash (هِدَّاش)
- 12 : tnaash (تْنَاش)
- 13 : tlettaash (تْلِتَّاش)
- 14 : reb3atash (رَبْعَتَاش)
- 15 : khemstaash (خَمْسْتَاش)
- 16 : settash (سِتَّاش)
- 17 : seb3atash (سَبْعَتَاش)
- 18 : tmenyaash (تْمَنْيَاش)
- 19 : tes3aash (تِسْعَاش)
- 20 : 3ishrin (عِشْرِينَ)

Notez que les nombres 11-19 se forment avec le suffixe -aash, contrairement à l'arabe classique. C'est une particularité du darija marocain.`,
        tips: [
          "Les nombres sont essentiels pour marchander au souk. Apprenez-les par cœur !",
          "Le dirham (Dh) est la monnaie marocaine. 1 euro ≈ 11 dirhams.",
          "Au marché, les vendeurs utilisent souvent les chiffres arabes (٠١٢٣٤٥٦٧٨٩).",
          "Pour les nombres ordinaux (premier, deuxième...), on utilise 'l-walad' (le premier), 't-tani' (le deuxième), etc.",
        ],
        quiz: [
          {
            question: "Comment dit-on 'cinq' en darija ?",
            options: ["setta", "seb3a", "khamsa", "tes3a"],
            correctIndex: 2,
          },
          {
            question: "Comment dit-on 'deux' en darija ?",
            options: ["wahed", "tlata", "jouj", "reb3a"],
            correctIndex: 2,
          },
          {
            question: "Que signifie 'sh7al' ?",
            options: ["Combien ?", "Quand ?", "Où ?", "Pourquoi ?"],
            correctIndex: 0,
          },
          {
            question: "Comment dit-on 'douze' en darija ?",
            options: ["heddash", "tnaash", "tlettaash", "3ishrin"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'dix' ?",
            options: ["tes3a", "seb3a", "3ashra", "tmenya"],
            correctIndex: 2,
          },
        ],
      },
      {
        id: "3-2",
        title: "Les nombres 21-100 et au-delà",
        titleAr: "الأَعْدَادُ مِنَ 21 إِلَى 100 وَمَا فَوْقَ",
        description: "Apprenez les dizaines et les centaines en darija.",
        duration: "7 min",
        vocabulary: [
          { french: "vingt (20)", phonetic: "3ishrin", arabic: "عِشْرِينَ" },
          { french: "trente (30)", phonetic: "tlatin", arabic: "ثَلَاثِينَ" },
          { french: "quarante (40)", phonetic: "reb3in", arabic: "رْبَعِينَ" },
          { french: "cinquante (50)", phonetic: "khamsin", arabic: "خَمْسِينَ" },
          { french: "soixante (60)", phonetic: "settin", arabic: "سِتِّينَ" },
          { french: "soixante-dix (70)", phonetic: "seb3in", arabic: "سَبْعِينَ" },
          { french: "quatre-vingts (80)", phonetic: "tmenin", arabic: "ثَمَانِينَ" },
          { french: "quatre-vingt-dix (90)", phonetic: "tes3in", arabic: "تِسْعِينَ" },
          { french: "cent (100)", phonetic: "miya", arabic: "مِيَّةٌ" },
          { french: "mille (1000)", phonetic: "alf", arabic: "أَلْفٌ" },
        ],
        phrases: [
          { french: "Ça coûte combien ?", phonetic: "b-sh7al ?", arabic: "بِشْحَال ؟", context: "Demander un prix" },
          { french: "C'est 50 dirhams", phonetic: "khamsin d-drahm", arabic: "خَمْسِينَ دِّرْهَم", context: "Dire un prix" },
          { french: "Trop cher !", phonetic: "ghali bzzaf !", arabic: "غَالِي بْزَاف !", context: "Négocier" },
          { french: "Cent dirhams, pas plus", phonetic: "miya d-drahm, w-la ziyada", arabic: "مِيَّة دِّرْهَم وَلَا زِيَادَة", context: "Fixer un prix" },
          { french: "C'est 200 dirhams", phonetic: "miya w-miya d-drahm", arabic: "مِيَّة وَمِيَّة دِّرْهَم", context: "200 = cent et cent" },
          { french: "Réduis un peu", phonetic: "nqes shwiya", arabic: "نَقِّص شْوِيَّة", context: "Demander une réduction" },
        ],
        grammar: `**Les dizaines en darija :**

Les dizaines se forment en ajoutant -in au nombre : tlatin (30), reb3in (40), khamsin (50)...

**Composer les nombres :**
En darija, on utilise **w** (و = et) pour composer :
- 21 : wahed w-3ishrin (واحد وعشرين)
- 35 : khamsa w-tlatin (خمسة وثلاثين)
- 100 : miya (ميّة)
- 200 : miya w-miya (ميّة وميّة)
- 500 : khams miya (خمس ميّة)
- 1000 : alf (ألف)

**La monnaie :**
- Dirham (دّرهَم) = la monnaie marocaine, abrégé Dh ou د.م
- Les pièces : 1, 2, 5, 10 Dh
- Les billets : 20, 50, 100, 200 Dh`,
        tips: [
          "Les prix sont souvent négociés au Maroc, surtout dans les souks. Sachez au moins compter jusqu'à 100 !",
          "Dans les grandes surfaces et les taxis avec compteur, les prix sont fixes.",
          "Pour 200, 300, etc., on dit 'miya w-miya', 'tlata miya'...",
          "Au Maroc, on compte souvent avec les doigts de façon différente : on commence par le pouce.",
        ],
        quiz: [
          {
            question: "Comment dit-on 'cinquante' en darija ?",
            options: ["settin", "khamsin", "seb3in", "tlatin"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'cent' en darija ?",
            options: ["alf", "3ishrin", "miya", "3ashra"],
            correctIndex: 2,
          },
          {
            question: "Comment compose-t-on 35 en darija ?",
            options: ["khamsa tlatin", "tlata w-khamsin", "khamsa w-tlatin", "tlata tlatin"],
            correctIndex: 2,
          },
          {
            question: "Que signifie 'ghali bzzaf' ?",
            options: ["C'est très bon", "C'est trop cher", "C'est pas mal", "C'est gratuit"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'mille' ?",
            options: ["miya", "alf", "3ishrin", "settin"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "3-3",
        title: "Les jours de la semaine et les mois",
        titleAr: "أَيَّامُ الأُسْبُوعِ وَالشُّهُورُ",
        description: "Sachez nommer les jours et les mois pour organiser votre emploi du temps.",
        duration: "6 min",
        vocabulary: [
          { french: "lundi", phonetic: "ttnin", arabic: "التَّنِّينُ", notes: "Litt. 'le deux', car deuxième jour" },
          { french: "mardi", phonetic: "tlat", arabic: "التَّلَاتُ", notes: "Litt. 'le trois'" },
          { french: "mercredi", phonetic: "larb3", arabic: "لَارْبَعُ", notes: "Litt. 'le quatre'" },
          { french: "jeudi", phonetic: "lkhmis", arabic: "لَخْمِيسُ", notes: "Litt. 'le cinq'" },
          { french: "vendredi", phonetic: "ljuma", arabic: "الجُمُعَةُ", notes: "Jour de la prière du vendredi" },
          { french: "samedi", phonetic: "sbt", arabic: "السَّبْتُ", notes: "Jour de repos (avant le dimanche dans la semaine marocaine)" },
          { french: "dimanche", phonetic: "l7ad", arabic: "الأَحَدُ", notes: "Premier jour de la semaine au Maroc" },
          { french: "semaine", phonetic: "semana / ssemaina", arabic: "سْمِينَة / السَّمِينَة" },
          { french: "aujourd'hui", phonetic: "l-yum / be-daba", arabic: "اليَوْم / بِالدَّابَا" },
          { french: "demain", phonetic: "ghadda", arabic: "غَدَّا" },
          { french: "hier", phonetic: "imbarih", arabic: "إِمْبَارِيح" },
        ],
        phrases: [
          { french: "Quel jour sommes-nous ?", phonetic: "chnou nhar hadu ?", arabic: "شْنُو نَهَار هَادُو ؟", context: "Demander le jour" },
          { french: "On se voit demain", phonetic: "n-shufuk ghadda", arabic: "نْشُوفُوك غَدَّا", context: "Prendre rendez-vous" },
          { french: "Le vendredi, c'est fermé", phonetic: "l-juma msakkar", arabic: "الجُمُعَة مَسَكَّر", context: "Information pratique (msakkar = fermé en vrai darija, pas mashghul)" },
          { french: "Quand ? / Quand est-ce ?", phonetic: "imta ?", arabic: "إِمْتَى ؟", context: "Question essentielle" },
          { french: "La semaine prochaine", phonetic: "s-semana jaya", arabic: "السَّمِينَة الجَايَة", context: "Parler de l'avenir" },
          { french: "La semaine dernière", phonetic: "s-semana li fatet", arabic: "السَّمِينَة الَّتِي فَاتَتْ", context: "Parler du passé" },
        ],
        grammar: `**Les jours de la semaine :**

Au Maroc, la semaine commence le **dimanche** (l-7ad) :
- L-7ad (الأحد) = dimanche
- Ttnin (التَّنِّين) = lundi
- Tlat (التَّلَات) = mardi
- L-arb3 (لأربع) = mercredi
- L-khmis (لخميس) = jeudi
- L-juma (الجُمعة) = vendredi
- Sbt (السبت) = samedi

Notez que les noms de jours utilisent les chiffres (deux, trois, quatre, cinq), ce qui est typique du darija.

**Hier/Aujourd'hui/Demain :**
- Imbarih = hier
- L-yum ou be-daba = aujourd'hui
- Ghadda = demain
- B3ad ghadda = après-demain`,
        tips: [
          "Le vendredi est le jour de prière (juma). Beaucoup de magasins et administrations ferment le vendredi après-midi.",
          "Au Maroc, le week-end est le samedi-dimanche, comme en Europe.",
          "'Be-daba' signifie littéralement 'maintenant, tout de suite' mais peut aussi vouloir dire 'aujourd'hui'.",
          "Les rendez-vous au Maroc sont souvent approximatifs. 'Ghadda' peut parfois signifier 'dans quelques jours' !",
        ],
        quiz: [
          {
            question: "Quel est le premier jour de la semaine au Maroc ?",
            options: ["lundi (ttnin)", "dimanche (l-7ad)", "samedi (sbt)", "vendredi (ljuma)"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'vendredi' en darija ?",
            options: ["lkhmis", "sbt", "ljuma", "larb3"],
            correctIndex: 2,
          },
          {
            question: "Que signifie 'imta' ?",
            options: ["Où", "Quand", "Combien", "Comment"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'demain' ?",
            options: ["imbarih", "be-daba", "ghadda", "l-yum"],
            correctIndex: 2,
          },
          {
            question: "Comment dit-on 'hier' ?",
            options: ["ghadda", "l-yum", "be-daba", "imbarih"],
            correctIndex: 3,
          },
        ],
      },
      {
        id: "3-4",
        title: "Dire l'heure et les périodes de la journée",
        titleAr: "التَّوْقِيتُ وَفَتَرَاتُ النَّهَارِ",
        description: "Apprenez à dire l'heure et à situer les moments de la journée.",
        duration: "5 min",
        vocabulary: [
          { french: "heure", phonetic: "sa3a", arabic: "سَاعَةٌ", notes: "Sert aussi pour 1 heure, 1h du matin, etc." },
          { french: "quelle heure ?", phonetic: "sh7al f-sa3a ?", arabic: "شْحَال فِالسَّاعَة ؟", notes: "Ou 'kifash sa3a ?'" },
          { french: "midi", phonetic: "n-nss l-kbir", arabic: "النِّصَّ الكَبِير", notes: "Litt. 'la grande moitié'" },
          { french: "minuit", phonetic: "n-nss s-sghir", arabic: "النِّصِّ الصَّغِير", notes: "Litt. 'la petite moitié'" },
          { french: "le matin", phonetic: "sba7", arabic: "صُبْحٌ", notes: "De l'aube à environ 11h" },
          { french: "l'après-midi", phonetic: "n-nhar", arabic: "النَّهَار", notes: "Après la prière du dhohr (~14h)" },
          { french: "le soir", phonetic: "l-mghrib / l-lel", arabic: "المَغْرِب / اللَّيْل", notes: "Après le coucher du soleil" },
          { french: "aube / fin de nuit", phonetic: "l-fajr / n-nss l-lil", arabic: "الفَجْر / نِصِّ اللَّيْل" },
          { french: "tôt", phonetic: "bwwaf", arabic: "بَوَّافْ" },
          { french: "tard", phonetic: "mret7el", arabic: "مُرْتَحِل", notes: "Ou 'ba3d shwiya' (un peu plus tard)" },
        ],
        phrases: [
          { french: "Quelle heure est-il ?", phonetic: "sh7al f-sa3a ?", arabic: "شْحَال فِالسَّاعَة ؟", context: "Demander l'heure" },
          { french: "Il est trois heures", phonetic: "sa3a tlata", arabic: "سَاعَة تْلَاتَة", context: "Dire l'heure pile" },
          { french: "Il est trois heures et demie", phonetic: "sa3a tlata w-n-nss", arabic: "سَاعَة تْلَاتَة وَالنِّصّ", context: "Demi-heure" },
          { french: "Et quart / moins le quart", phonetic: "w-rba3 / nqes rba3", arabic: "وَرُبُع / نَقِّص رُبُع", context: "Quarts d'heure" },
          { french: "On se retrouve à quelle heure ?", phonetic: "n-shufu m3a sh7al ?", arabic: "نْشُوفُو مَعَ شْحَال ؟", context: "Prendre rendez-vous" },
          { french: "Viens tôt le matin", phonetic: "ji bwwaf sba7", arabic: "جِي بَوَّاف صُبْح", context: "Donner un horaire" },
        ],
        grammar: `**Dire l'heure en darija :**

On utilise **sa3a** (ساعة) suivi du nombre :
- **Sa3a wahed** = 1 heure
- **Sa3a jouj** = 2 heures
- **Sa3a tlata w-n-nss** = 3 heures et demie (وَالنِّصّ = et la moitié)

**Ajouter des précisions :**
- **w-rba3** (وَرُبُع) = et quart
- **nqes rba3** (نَقِّص رُبُع) = moins le quart
- **w-khamsa d-dqayeg** (وَخَمْسَة دِّقَائِق) = et 5 minutes

**Le système horaire marocain :**
- Heures du jour (0h-12h) et heures du soir (12h-24h)
- Pour être précis : **sa3a tlata n-nhar** (3h de l'après-midi)
- **N-nss l-kbir** (midi) et **n-nss s-sghir** (minuit)

**Périodes de la journée :**
- Sba7 (صبح) = matin
- D-dohr (الظهر) = midi
- N-nhar (النهار) = après-midi
- L-mghrib (المغرب) = coucher du soleil / début de soirée
- L-lel (ليل) = nuit`,
        tips: [
          "Les Marocains utilisent le format 12h, pas 24h. Précisez 'n-nhar' ou 'l-lel' si nécessaire.",
          "'Sh7al f-sa3a ?' est la façon la plus courante de demander l'heure.",
          "Les horaires au Maroc sont flexibles. 'Je viens dans 5 minutes' peut signifier 30 minutes !",
          "La prière détermine les repères temporels : le 'mghrib' (coucher du soleil) sépare le jour de la nuit.",
        ],
        quiz: [
          {
            question: "Comment demande-t-on l'heure en darija ?",
            options: ["imta ?", "kifash sa3a ?", "sh7al f-sa3a ?", "sh7al nhar ?"],
            correctIndex: 2,
          },
          {
            question: "Comment dit-on 'midi' ?",
            options: ["n-nss l-kbir", "n-nss s-sghir", "sa3a 12", "n-nhar"],
            correctIndex: 0,
          },
          {
            question: "Comment dit-on '3 heures et demie' ?",
            options: ["sa3a tlata w-rba3", "sa3a tlata w-n-nss", "sa3a tlata w-khamsa", "tlata w-n-nss"],
            correctIndex: 1,
          },
          {
            question: "Que signifie 'bwwaf' ?",
            options: ["Tard", "Tôt", "Maintenant", "Demain"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'le matin' en darija ?",
            options: ["n-nhar", "l-lel", "sba7", "l-mghrib"],
            correctIndex: 2,
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 4: Famille et relations (A1.2)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 4,
    title: "Famille et relations",
    titleAr: "العَائِلَةُ وَالعَلَاقَاتُ",
    description: "Découvrez le vocabulaire de la famille, très important dans la culture marocaine.",
    cefrLevel: "A1.2",
    icon: "👨‍👩‍👧‍👦",
    color: "from-violet-500 to-purple-600",
    lessons: [
      {
        id: "4-1",
        title: "La famille proche",
        titleAr: "العَائِلَةُ القَرِيبَةُ",
        description: "Les membres de la famille immédiate : parents, frères, sœurs, enfants.",
        duration: "6 min",
        vocabulary: [
          { french: "famille", phonetic: "3a'ila", arabic: "عَائِلَةٌ", notes: "Ou 'l-3ila' plus simplement" },
          { french: "père", phonetic: "baba / buba", arabic: "بَابَا / بُوبَا", notes: "Termes affectueux très courants" },
          { french: "mère", phonetic: "mama / yemma", arabic: "مَامَا / يَمَّة", notes: "Yemma est très affectueux et courant" },
          { french: "frère", phonetic: "khu", arabic: "خُو", notes: "Pluriel : khwat (خوات)" },
          { french: "sœur", phonetic: "ukht", arabic: "أُخْتٌ", notes: "Pluriel : khwat (خوات)" },
          { french: "fils / garçon", phonetic: "weld", arabic: "وَلَدٌ", notes: "Très courant dans l'adresse : 'weldi' = mon fils" },
          { french: "fille", phonetic: "bnt", arabic: "بِنْتٌ", notes: "Pluriel : banat (بنات)" },
          { french: "mari / époux", phonetic: "rajel", arabic: "رَجَّلٌ", notes: "Litt. 'homme'" },
          { french: "femme / épouse", phonetic: "mra", arabic: "مَرَّةٌ", notes: "Litt. 'femme' ; pluriel : niswa (نسوة)" },
          { french: "enfant", phonetic: "tfel / wld", arabic: "طَفْل / وَلْد", notes: "tfel = enfant en bas âge" },
          { french: "bébé", phonetic: "sghir / sghira", arabic: "صْغِير / صْغِيرَة", notes: "Litt. 'petit / petite'" },
        ],
        phrases: [
          { french: "J'ai un frère et une sœur", phonetic: "3ndi khu w-ukht", arabic: "عَنْدِي خُو وَأُخْت", context: "Parler de sa fratrie" },
          { french: "Je suis fils unique", phonetic: "ana weld wahed", arabic: "أَنَا وَلَد وَاحِد", context: "Décrire sa famille" },
          { french: "Où est ton père ?", phonetic: "fin baba ?", arabic: "فِين بَابَا ؟", context: "Demander où est quelqu'un" },
          { french: "Ma mère est au foyer", phonetic: "yemma f-l-dar", arabic: "يَمَّة فِالدَّار", context: "Parler de la situation familiale" },
          { french: "J'ai deux enfants", phonetic: "3ndi jouj d-wlad", arabic: "عَنْدِي جُوج دِوَّلَاد", context: "Dire le nombre d'enfants" },
          { french: "Comment va ta famille ?", phonetic: "kifash l-3ila dyalek ?", arabic: "كِفَاش العَائِلَة دْيَالَكْ ؟", context: "Demander des nouvelles de la famille" },
          { french: "Dieu garde tes parents", phonetic: "allah y7faz 3la l-waldinek", arabic: "اللّٰه يِحْفَظ عَلَى الوَالِدِينِك", context: "Bénédiction très courante" },
        ],
        grammar: `**Possession en darija (dyal) :**

Pour exprimer la possession, on utilise **dyal** (دْيَال) après le nom :
- **L-3ila dyali** = ma famille (العائلة ديالي)
- **Baba dyali** = mon père (بابا ديالي)
- **Dar dyalna** = notre maison (الدار ديالنا)

**Dire « avoir » :**
On utilise **3ndi** (عندي) :
- **3ndi khu** = j'ai un frère
- **3ndha ukht** = elle a une sœur
- **3ndu weld** = il a un fils

**Les terminaisons possessives :**
- dyali (ديالي) = mon/ma
- dyalek (ديالك) = ton (masc.)
- dyalek (ديالك) = ta (fém.)
- dyalu (ديالو) = son
- dyalha (ديالها) = sa
- dyalna (ديالنا) = notre
- dyalkum (ديالكم) = votre`,
        tips: [
          "La famille est sacrée au Maroc. Poser des questions sur la famille est un signe d'intérêt sincère.",
          "Il est très courant d'appeler les personnes plus âgées 'khu' ou 'ukht' (frère/sœur) comme marque de respect.",
          "Le mot 'yemma' (maman) est aussi utilisé affectueusement pour les femmes âgées respectées.",
          "En darija, 'weld' peut signifier 'garçon' ou 'fils' selon le contexte.",
        ],
        quiz: [
          {
            question: "Comment dit-on 'mère' en darija de façon affectueuse ?",
            options: ["mama", "yemma", "ukht", "mra"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'frère' en darija ?",
            options: ["weld", "rajel", "khu", "3am"],
            correctIndex: 2,
          },
          {
            question: "Comment exprime-t-on la possession en darija ?",
            options: ["Avec '3ndi'", "Avec 'dyal'", "Avec 'fih'", "Avec 'ma3a'"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'j'ai un frère' ?",
            options: ["ana khu", "3ndi khu", "khu dyali", "fih khu"],
            correctIndex: 1,
          },
          {
            question: "Que signifie 'allah y7faz 3la l-waldinek' ?",
            options: ["Comment vont tes parents ?", "Dieu garde tes parents", "Où sont tes parents ?", "Tes parents sont gentils"],
            correctIndex: 1,
          },
        ],
      },
      {
        id: "4-2",
        title: "La famille élargie",
        titleAr: "العَائِلَةُ المُوَسَّعَةُ",
        description: "Grands-parents, oncles, tantes, cousins et les relations familiales au Maroc.",
        duration: "6 min",
        vocabulary: [
          { french: "grand-père", phonetic: "jdd", arabic: "جَدُّ", notes: "Jidd en arabe classique" },
          { french: "grand-mère", phonetic: "jda", arabic: "جَدَّةُ", notes: "Très respectées dans la culture marocaine" },
          { french: "oncle (paternel)", phonetic: "3amm", arabic: "عَمُّ", notes: "Frère du père" },
          { french: "oncle (maternel)", phonetic: "khal", arabic: "خَالٌ", notes: "Frère de la mère" },
          { french: "tante (paternelle)", phonetic: "3amma", arabic: "عَمَّةُ", notes: "Sœur du père" },
          { french: "tante (maternelle)", phonetic: "khala", arabic: "خَالَةُ", notes: "Sœur de la mère" },
          { french: "cousin (masc.)", phonetic: "bn-3amm / bn-khal", arabic: "ابْنُ عَمٍّ / ابْنُ خَالٍ", notes: "Fils de l'oncle / de la tante" },
          { french: "cousine (fém.)", phonetic: "bnt-3amm / bnt-khal", arabic: "بِنْتُ عَمٍّ / بِنْتُ خَالٍ", notes: "Fille de l'oncle / de la tante" },
          { french: "beau-père / beau-frère", phonetic: "nusba", arabic: "نُّسْبَةٌ", notes: "Terme générique pour la belle-famille" },
          { french: "parent / allié", phonetic: "qarib", arabic: "قَرِيبٌ", notes: "Membre de la famille élargie" },
        ],
        phrases: [
          { french: "J'ai beaucoup de cousins", phonetic: "3ndi bzzaf d-bnan-3amm", arabic: "عَنْدِي بْزَاف دِبْنَان عَمّ", context: "Parler de sa famille élargie" },
          { french: "Ma grand-mère habite à Fès", phonetic: "jda dyali sknat f fas", arabic: "جَدَّة دْيَالِي سَكَنْت فِ فَاس", context: "Localiser un membre de la famille (sknat = 3ème pers. féminin)" },
          { french: "On se réunit tous les vendredis", phonetic: "n-jtma3u kull juma", arabic: "نَجْتَمَعُو كُلّ جُمُعَة", context: "Tradition familiale" },
          { french: "Mon oncle est commerçant", phonetic: "3ammi tajer", arabic: "عَمِّي تَاجِر", context: "Parler du métier d'un parent (tajer = forme correcte)" },
          { french: "Les cousins sont comme des frères", phonetic: "bnan-3amm k-hwat", arabic: "بْنَان عَمّ كَالخَوَات", context: "Expression culturelle" },
        ],
        grammar: `**La parenté en darija :**

Le darija distingue clairement entre :
- Côté paternel : **3amm** (عمّ = oncle paternel), **3amma** (عمّة = tante paternelle)
- Côté maternel : **khal** (خال = oncle maternel), **khala** (خالة = tante maternelle)

Les cousins se définissent par rapport à l'oncle :
- **bn-3amm** (ابن عمّ) = cousin paternel
- **bn-khal** (ابن خال) = cousin maternel

**Le pluriel :**
Les noms de famille au pluriel :
- jdad (جُدود) = grands-pères
- 3yamem (عَيَامِم) = oncles paternels
- khwal (خْوَال) = oncles maternels`,
        tips: [
          "La famille élargie est très importante au Maroc. Les repas du vendredi et les fêtes réunissent souvent toute la famille.",
          "Il est courant de vivre dans le même quartier ou la même ville que ses parents et grands-parents.",
          "Les cousins sont considérés comme des frères et sœurs. On ne les appelle pas par leur prénom parfois.",
          "Le respect envers les aînés est fondamental : on embrasse la main des grands-parents comme salutation.",
        ],
        quiz: [
          {
            question: "Comment dit-on 'grand-père' en darija ?",
            options: ["3amm", "jdd", "khal", "rajel"],
            correctIndex: 1,
          },
          {
            question: "Quelle est la différence entre '3amm' et 'khal' ?",
            options: ["Père et oncle", "Oncle paternel et maternel", "Grand-père et oncle", "Frère et cousin"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'cousin (paternel)' en darija ?",
            options: ["khu", "bn-3amm", "3ammi", "walid"],
            correctIndex: 1,
          },
          {
            question: "Que signifie 'jda' ?",
            options: ["Tante maternelle", "Grand-mère", "Mère", "Sœur"],
            correctIndex: 1,
          },
          {
            question: "Comment dit-on 'oncle maternel' ?",
            options: ["3amm", "jdd", "khal", "nusba"],
            correctIndex: 2,
          },
        ],
      },
      {
        id: "4-3",
        title: "Décrire sa famille et les relations",
        titleAr: "وَصْفُ العَائِلَةِ وَالعَلَاقَاتِ",
        description: "Apprenez à décrire les membres de votre famille et les relations familiales.",
        duration: "7 min",
        vocabulary: [
          { french: "grand / grande", phonetic: "kbir / kbira", arabic: "كَبِير / كَبِيرَة", notes: "Pour l'âge ou la taille" },
          { french: "petit / petite", phonetic: "sghir / sghira", arabic: "صْغِير / صْغِيرَة", notes: "Pour l'âge ou la taille" },
          { french: "gentil(le)", phonetic: "mzyan / mzyana", arabic: "مْزْيَان / مْزْيَانَة", notes: "Masc. et fém." },
          { french: "travailleur / travailleuse", phonetic: "kaddab / kaddaba", arabic: "كَدَّاب / كَدَّابَة", notes: "Litt. 'celui / celle qui peine'" },
          { french: "âgé / âgée", phonetic: "3ajuz / 3ajouza", arabic: "عَجُوز / عَجُوزَة", notes: "Pour les personnes âgées" },
          { french: "jeune", phonetic: "shab / shabba", arabic: "شَابٌّ / شَبَّة", notes: "Jeune homme / jeune fille" },
          { french: "marié(e)", phonetic: "mzawej / mzawja", arabic: "مَزَوَّج / مَزَوَّجَة" },
          { french: "célibataire", phonetic: "3zab / 3zaba", arabic: "عَزَاب / عَزَابَة", notes: "En darija, on dit aussi 'ma-mzawej-ch' (non marié)" },
          { french: "heureux / heureuse", phonetic: "farhan / farhana", arabic: "فَرْحَان / فَرْحَانَة" },
          { french: "ressemblant (comme)", phonetic: "shbih / shbiha", arabic: "شْبِيه / شْبِيهَة", notes: "Ressemble à quelqu'un" },
        ],
        phrases: [
          { french: "Mon père est grand et gentil", phonetic: "baba dyali kbir w-mzyan", arabic: "بَابَا دْيَالِي كَبِير وَمْزْيَان", context: "Décrire un parent" },
          { french: "Ma mère cuisine très bien", phonetic: "yemma dyali t-khel3 mzyan bzzaf", arabic: "يَمَّة دْيَالِي تَخْلَع مْزْيَان بْزَاف", context: "Décrire une compétence" },
          { french: "Mon frère ressemble à mon père", phonetic: "khu dyali shbih b-baba", arabic: "خُو دْيَالِي شْبِيه بِبَابَا", context: "Comparer des personnes" },
          { french: "Ma sœur est mariée", phonetic: "ukhti mzawja", arabic: "أُخْتِي مَزَوَّجَة", context: "État civil" },
          { french: "On est une famille nombreuse", phonetic: "n7na 3a'ila kbira", arabic: "نْحَنَا عَائِلَة كَبِيرَة", context: "Taille de la famille" },
          { french: "J'aime beaucoup ma famille", phonetic: "kanbghi 3ilati bzzaf", arabic: "كَنْبْغِي عَائِلَتِي بْزَاف", context: "Exprimer de l'affection" },
        ],
        grammar: `**Adjectifs en darija :**

Les adjectifs s'accordent en genre :
- **Masc.** : mzyan (مْزيان), kbir (كبير), sghir (صغير)
- **Fém.** : mzyana (مْزيانة), kbira (كبيرة), sghira (صغيرة)

Le féminin se forme généralement en ajoutant **-a** à la fin.

**La phrase descriptive :**
Sujet + adjectif (sans verbe « être ») :
- **Baba dyali kbir** = Mon père (est) grand
- **Yemma dyali mzyana** = Ma mère (est) gentille

**Les verbes d'état :**
- **Kan7ebb 3la** = j'aime / j'apprécie
- **T-khel3 mzyan** = elle cuisine bien (t-khel3 = elle fait la cuisine)
- **Shbih b-** = ressemble à`,
        tips: [
          "Dire du bien de sa famille est très valorisé au Maroc. Ne soyez pas surpris si on vous pose beaucoup de questions.",
          "La cuisine de la mère ('khl3 dyal yemma') est un sujet de fierté nationale au Maroc !",
          "Il est courant de comparer les enfants : 'shbih b-baba' (il ressemble à son père) est un compliment.",
          "Le mot 'mzyan' est l'adjectif le plus utilisé en darija. Il peut signifier gentil, bon, beau, bien, etc.",
        ],
        quiz: [
          {
            question: "Comment dit-on 'gentil' (féminin) en darija ?",
            options: ["mzyan", "mzyana", "kbir", "sghir"],
            correctIndex: 1,
          },
          {
            question: "Comment forme-t-on le féminin d'un adjectif en darija ?",
            options: ["On ajoute -i", "On ajoute -a", "On ajoute -u", "On ne change rien"],
            correctIndex: 1,
          },
          {
            question: "Que signifie 'shbih' ?",
            options: ["Grand", "Petit", "Ressemblant", "Gentil"],
            correctIndex: 2,
          },
          {
            question: "Comment dit-on 'marié' en darija (masculin) ?",
            options: ["3zab", "shab", "mzawej", "farhan"],
            correctIndex: 2,
          },
          {
            question: "Comment dit-on 'j'aime ma famille' ?",
            options: ["kanbghi 3ilati bzzaf", "3ndi 3ila mzyana", "3ilati kbira", "kandham bzzaf 3la 3ilati"],
            correctIndex: 1,
          },
          {
            question: "Que signifie '3ajuz' ?",
            options: ["Jeune", "Gentil", "Âgé", "Riche"],
            correctIndex: 2,
          },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 5: Nourriture et courses (A1.2)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 5,
    title: "Nourriture et courses",
    titleAr: "الأَكْلُ وَالتَّسَوُّقُ",
    description: "Tout le vocabulaire essentiel pour manger, cuisiner et faire les courses au Maroc.",
    cefrLevel: "A1.2",
    icon: "🥘",
    color: "from-orange-500 to-red-600",
    lessons: [
      {
        id: "5-1",
        title: "Les aliments de base",
        titleAr: "الأَغْذِيَةُ الأَسَاسِيَّةُ",
        description: "Le pain, l'huile, les légumes et les ingrédients quotidiens marocains.",
        duration: "7 min",
        vocabulary: [
          { french: "pain", phonetic: "khobz", arabic: "خُبْزٌ", notes: "Aliment de base n°1 au Maroc" },
          { french: "huile d'olive", phonetic: "zzit / z-zitoun", arabic: "الزَّيْت / زَيْتُونٌ", notes: "L'huile d'olive marocaine est réputée" },
          { french: "légumes", phonetic: "khodra", arabic: "خَضْرَاء", notes: "Au marché, on achète des 'khodra'" },
          { french: "tomates", phonetic: "tmatish", arabic: "تَمَاطِيش", notes: "Indispensables dans la cuisine marocaine" },
          { french: "oignons", phonetic: "bsl / bsla", arabic: "بَصَل / بَصَلَةٌ", notes: "Base de presque tous les plats" },
          { french: "viande", phonetic: "l7em", arabic: "لَحْمٌ", notes: "Poulet, boeuf, agneau" },
          { french: "poulet", phonetic: "djaj", arabic: "دَجَّاجٌ", notes: "La viande la plus consommée" },
          { french: "poisson", phonetic: "hout", arabic: "حُوتٌ", notes: "Très populaire dans les villes côtières" },
          { french: "sel", phonetic: "ml7a", arabic: "مِلْحَة", notes: "Sel" },
          { french: "eau", phonetic: "l-ma", arabic: "المَاءُ", notes: "Essentiel ! On dit 'jib l-ma' = apporte de l'eau" },
        ],
        phrases: [
          { french: "Je veux du pain", phonetic: "bghit khobz", arabic: "بَغِيت خُبْز", context: "Commander à la boulangerie" },
          { french: "Il n'y a plus de tomates", phonetic: "ma-bqatsh tmatish", arabic: "مَا بَقَاش تَمَاطِيش", context: "Au marché, stock épuisé" },
          { french: "Le poulet est frais ?", phonetic: "djaj jdid ?", arabic: "دَجَّاج جَدِيد ؟", context: "Demander la fraîcheur" },
          { french: "Donne-moi un kilo de viande", phonetic: "3tini kilo d-l7em", arabic: "عْطِينِي كِيلُو دِلَّحْم", context: "Chez le boucher" },
          { french: "Apporte de l'eau", phonetic: "jib l-ma", arabic: "جِيب المَاء", context: "Demander à apporter de l'eau" },
          { french: "Bismillah, mangeons !", phonetic: "bismillah, nbda n-kul !", arabic: "بِسْمِ اللّٰهِ، نْبْدَا نَكُول !", context: "Avant de commencer à manger" },
        ],
        grammar: `**Le verbe « vouloir » (bghit) :**

- **Kanbghi** (كَنْبْغِي) = je veux (présent)
- **Katbghi** (كَاتْبْغِي) = tu veux (présent, masc. et fém.)
- **Bghit** (بَغِيت) = je voulais (passé)
- **Bghiti** (بَغِيتِي) = tu voulais (passé, masc. et fém.)

**Demander quelque chose :**
- **3tini...** (عْطِينِي...) = Donne-moi...
- **Bghit...** (بَغِيت...) = Je veux...

**Quantités :**
- **Kilo** = kilo (كيلو)
- **Wahed / jouj / tlata** = un/deux/trois
- **Shwiya** = un peu (شوية)`,
        tips: [
          "Le pain marocain (khobz) est vendu dans les fours traditionnels (furn). Il est rond et plat.",
          "Au Maroc, on mange souvent avec la main droite, en utilisant le pain comme cuillère.",
          "Bismillah se dit toujours avant de manger. C'est une coutume respectée par tous.",
          "Les légumes au Maroc sont très abordables, surtout en saison.",
        ],
        quiz: [
          { question: "Comment dit-on 'pain' en darija ?", options: ["khobz", "djaj", "hout", "l7em"], correctIndex: 0 },
          { question: "Que signifie 'khodra' ?", options: ["Viande", "Pain", "Légumes", "Huile"], correctIndex: 2 },
          { question: "Comment dit-on 'je veux du poulet' ?", options: ["bghit djaj", "bghit l7em", "bghit hout", "bghit khobz"], correctIndex: 0 },
          { question: "Que signifie 'tmatish' ?", options: ["Oignons", "Légumes", "Sel", "Tomates"], correctIndex: 3 },
          { question: "Comment dit-on 'eau' en darija ?", options: ["zzit", "l-ma", "ml7a", "khobz"], correctIndex: 1 },
        ],
      },
      {
        id: "5-2",
        title: "Au marché / au souk",
        titleAr: "فِالسُّوقِ",
        description: "Apprenez à faire vos courses et à marchander comme un Marocain.",
        duration: "7 min",
        vocabulary: [
          { french: "marché / souk", phonetic: "s-suk / s-suq", arabic: "السُّوقُ", notes: "Le marché traditionnel marocain" },
          { french: "prix", phonetic: "thaman / prix", arabic: "ثَمَن / بْرِي", notes: "On utilise souvent le mot français" },
          { french: "cher / coûteux", phonetic: "ghali / ghalia", arabic: "غَالِي / غَالِيَة", notes: "Le premier mot à apprendre pour marchander" },
          { french: "pas cher / bon marché", phonetic: "rakhis / rakhsa", arabic: "رَخِيص / رَخِيصَة", notes: "Prix raisonnable" },
          { french: "marchander / négocier", phonetic: "msawat", arabic: "مُسَاوَات", notes: "Art essentiel au Maroc ! Forme féminine correcte en darija" },
          { french: "combien ?", phonetic: "b-sh7al ?", arabic: "بِشْحَال ؟", notes: "Demander le prix" },
          { french: "un peu", phonetic: "shwiya", arabic: "شْوِيَّة", notes: "Très utilisé pour marchander" },
          { french: "beaucoup", phonetic: "bzzaf", arabic: "بْزَاف", notes: "Mot le plus utilisé en darija" },
          { french: "donne / donne-moi", phonetic: "3tini", arabic: "عْطِينِي", notes: "Indispensable pour acheter" },
          { french: "assez / ça suffit", phonetic: "bssa7", arabic: "بَصَح", notes: "Quand on a assez" },
        ],
        phrases: [
          { french: "Combien ça coûte ?", phonetic: "b-sh7al hadshi ?", arabic: "بِشْحَال هَادَ الشِّيء ؟", context: "Premier geste du marchandage" },
          { french: "C'est trop cher !", phonetic: "ghali bzzaf !", arabic: "غَالِي بْزَاف !", context: "Exprimer son désaccord sur le prix" },
          { french: "Réduis un peu", phonetic: "nqes shwiya", arabic: "نَقِّص شْوِيَّة", context: "Demander une réduction" },
          { french: "Donne-moi pour X dirhams", phonetic: "3tini b-X d-drahm", arabic: "عْطِينِي بِ-X دِّرْهَم", context: "Fixer votre prix" },
          { french: "Je le prends !", phonetic: "khassni !", arabic: "خَاصْنِي !", context: "Accepter le prix final" },
          { french: "Non, merci, j'ai assez", phonetic: "la shukran, 3ndi bssa7", arabic: "لَا شُكْرًا، عَنْدِي بَصَح", context: "Refuser poliment" },
          { french: "Je vais regarder ailleurs", phonetic: "ghadi n-shuf f-bla7d", arabic: "غَادِي نْشُوف فِبَلَحْد", context: "Technique de négociation" },
          { french: "C'est un bon prix", phonetic: "prix mzyan", arabic: "بْرِي مْزْيَان", context: "Approuver un prix" },
        ],
        grammar: `**Le marchandage au souk :**

Le marchandage (msawra) est une tradition au Maroc. Voici les étapes :

1. **Demander le prix** : « B-sh7al ? » (Combien ?)
2. **Réagir** : « Ghali bzzaf ! » (Trop cher !)
3. **Proposer** : « 3tini b-miya d-drahm » (Donne pour 100 Dh)
4. **Négocier** : « Nqes shwiya » (Réduis un peu)
5. **Accepter ou partir** : « Khassni ! » ou « Ghadi n-shuf f-bla7d »

**Les prépositions de lieu :**
- **F-** (فِ) = dans/en/à : f-s-suq (au marché)
- **Mn-** (مِن) = de : mn s-suq (du marché)
- **L-** (لِ) = pour/à : l-dar (à la maison)`,
        tips: [
          "Le marchandage est attendu et apprécié au souk. Ne payez jamais le premier prix !",
          "Commencez par proposer 30-50% du prix demandé et négociez vers 60-70%.",
          "Partir en faisant semblant de regarder ailleurs est une technique très efficace.",
          "Dans les supermarchés et les magasins avec étiquettes, les prix sont fixes.",
          "Souriez et soyez amical pendant la négociation : c'est un jeu social, pas un combat !",
        ],
        quiz: [
          { question: "Comment dit-on 'trop cher' en darija ?", options: ["rakhis", "ghali bzzaf", "prix mzyan", "bssa7"], correctIndex: 1 },
          { question: "Que signifie 'msawat' ?", options: ["Acheter", "Marchander", "Vendre", "Regarder"], correctIndex: 1 },
          { question: "Comment demande-t-on le prix ?", options: ["fin ghadi ?", "b-sh7al ?", "imta ?", "chnou hadchi ?"], correctIndex: 1 },
          { question: "Que signifie 'nqes shwiya' ?", options: ["C'est beaucoup", "Ajoute un peu", "Réduis un peu", "C'est gratuit"], correctIndex: 2 },
          { question: "Comment dit-on 'je le prends' ?", options: ["ma-bghitch", "khassni", "bssa7", "ghali"], correctIndex: 1 },
        ],
      },
      {
        id: "5-3",
        title: "Commander au restaurant",
        titleAr: "الطَّلَبُ فِالمَطْعَمِ",
        description: "Sachez commander à manger et à boire dans un restaurant marocain.",
        duration: "6 min",
        vocabulary: [
          { french: "restaurant", phonetic: "m-ta3m", arabic: "مَطْعَمٌ", notes: "Ou 'resto' (emprunt français)" },
          { french: "le menu / la carte", phonetic: "l-menu / l-karta", arabic: "المَيْنُو / الكَارْتَة" },
          { french: "plat", phonetic: "l-makla", arabic: "المَاكِلَة", notes: "La nourriture / le repas" },
          { french: "tajine", phonetic: "t-jin", arabic: "الطَّاجِينُ", notes: "Plat national marocain en terre cuite" },
          { french: "couscous", phonetic: "ksksu", arabic: "الكُسْكُسُ", notes: "Plat traditionnel du vendredi" },
          { french: "pastilla (bstila)", phonetic: "b-stila", arabic: "البَسْتِيلَة", notes: "Feuilleté sucré-salé" },
          { french: "harira", phonetic: "l-7arira", arabic: "الحَرِيرَة", notes: "Soupe traditionnelle marocaine" },
          { french: "l'addition", phonetic: "l-hsab", arabic: "الحِسَابُ", notes: "La note à payer" },
          { french: "délicieux / délicieuse", phonetic: "bnin / bnina", arabic: "بَنِين / بَنِينَة", notes: "Mot très utilisé pour compliment" },
          { french: "j'ai faim", phonetic: "3ndi l-3af", arabic: "عَنْدِي العَاف", notes: "l-3af = faim" },
        ],
        phrases: [
          { french: "Donnez-moi le menu", phonetic: "3tini l-menu 3afak", arabic: "عْطِينِي المَيْنُو عَافَاك", context: "Arriver au restaurant" },
          { french: "Je veux un tajine de poulet", phonetic: "bghit t-jin d-djaj", arabic: "بَغِيت طَاجِين دِدَجَّاج", context: "Commander un plat" },
          { french: "Sans oignon, s'il vous plaît", phonetic: "bla bsl 3afak", arabic: "بِلَا بَصَل عَافَاك", context: "Préciser une préférence" },
          { french: "C'est délicieux !", phonetic: "bnin bzzaf !", arabic: "بَنِين بْزَاف !", context: "Complimenter le cuisinier" },
          { french: "L'addition, s'il vous plaît", phonetic: "l-hsab 3afak", arabic: "الحِسَاب عَافَاك", context: "Demander à payer" },
          { french: "Je suis rassasié", phonetic: "3ebbt", arabic: "عَبَّتُّ", context: "Quand on a assez mangé" },
          { french: "Bismillah", phonetic: "bismillah", arabic: "بِسْمِ اللّٰهِ", context: "Avant de commencer à manger" },
        ],
        grammar: `**Les plats marocains typiques :**
- **Tajine** (طاجين) : ragoût cuit dans un plat en terre cuite conique
- **Couscous** (كسكس) : semoule vapeur avec légumes et viande
- **Harira** (حريرة) : soupe épaisse aux lentilles et pois chiches
- **Bastila** (بسطيلة) : feuilleté au poulet, amandes et cannelle
- **Méchoui** (مِشْوِي) : viande grillée au four
- **Tanjiya** (طَنْجِيَّة) : tajine de Marrakech à la viande et aux œufs`,
        tips: [
          "Le tajine est le plat incontournable. Il existe des dizaines de variétés : poulet aux olives, kéfta, légumes...",
          "Au Maroc, on mange avec la main droite en utilisant le pain comme cuillère.",
          "Le couscous est traditionnellement mangé le vendredi midi.",
          "Dire 'bnin' (délicieux) au cuisinier est très apprécié.",
          "Ne soyez pas surpris si on vous apporte du thé ou des amandes gratuitement : c'est l'hospitalité !",
        ],
        quiz: [
          { question: "Comment dit-on 'plat' en darija ?", options: ["l-hsab", "l-makla", "l-menu", "t-jin"], correctIndex: 1 },
          { question: "Quel est le plat national marocain ?", options: ["Pizza", "Tajine", "Hamburger", "Sushi"], correctIndex: 1 },
          { question: "Que signifie 'bnin' ?", options: ["Cher", "Délicieux", "Froid", "Rapide"], correctIndex: 1 },
          { question: "Comment demande-t-on l'addition ?", options: ["3tini l-menu", "l-hsab 3afak", "bghit t-jin", "3ndi zz3af"], correctIndex: 1 },
          { question: "Comment dit-on 'j'ai faim' ?", options: ["3ndi l3ib", "3ndi zz3af", "3ndi 3ya", "3ndi lqra"], correctIndex: 1 },
        ],
      },
      {
        id: "5-4",
        title: "Les boissons marocaines",
        titleAr: "المَشْرُوبَاتُ المَغْرِبِيَّةُ",
        description: "Découvrez les boissons emblématiques du Maroc : thé, café, jus et plus.",
        duration: "5 min",
        vocabulary: [
          { french: "thé à la menthe", phonetic: "atay", arabic: "الأَتَايُ", notes: "Boisson nationale du Maroc" },
          { french: "café", phonetic: "qahwa", arabic: "القَهْوَة", notes: "Servi noir (qahwa sda)" },
          { french: "jus d'orange", phonetic: "3asir l-3anja", arabic: "عَصِير العَنْجَة", notes: "Au Maroc, limun = citron, l-3anja = orange (les oranges marocaines sont fameuses)" },
          { french: "jus", phonetic: "3asir", arabic: "عَصِيرٌ", notes: "Jus de fruits" },
          { french: "eau", phonetic: "l-ma", arabic: "المَاءُ" },
          { french: "lait", phonetic: "l-7lib", arabic: "الحَلِيبُ", notes: "Lait frais ou caillé (l-ben)" },
          { french: "boisson / verre", phonetic: "sharba / kass", arabic: "شَرْبَة / كَأْسٌ" },
          { french: "sucre", phonetic: "sukkar", arabic: "سُكَّرٌ", notes: "Le thé marocain est très sucré" },
          { french: "froid / froide", phonetic: "brdan / brdana", arabic: "بَرْدَان / بَرْدَانَة", notes: "Pour une boisson fraîche" },
          { french: "chaud / chaude", phonetic: "skhun / skhuna", arabic: "سُخُون / سُخُونَة", notes: "Pour une boisson chaude" },
        ],
        phrases: [
          { french: "Un thé à la menthe, s'il vous plaît", phonetic: "atay wahed 3afak", arabic: "أَتَاي وَاحِد عَافَاك", context: "Commander un thé" },
          { french: "Sans sucre", phonetic: "bla sukkar", arabic: "بِلَا سُكَّر", context: "Préciser pour le thé/café" },
          { french: "Un verre d'eau", phonetic: "kass d-l-ma", arabic: "كَأْس دِلْمَاء", context: "Demander de l'eau" },
          { french: "Un jus d'orange frais", phonetic: "3asir l-3anja jdid", arabic: "عَصِير العَنْجَة جَدِيد", context: "Commander un jus (l-3anja = orange au Maroc)" },
          { french: "Thé ou café ?", phonetic: "atay w-la qahwa ?", arabic: "أَتَاي وَلَا قَهْوَة ؟", context: "Proposer une boisson" },
          { french: "Le thé marocain est très bon", phonetic: "atay l-maghribi bnin bzzaf", arabic: "الأَتَاي المَغْرِبِي بَنِين بْزَاف", context: "Compliment culturel" },
        ],
        grammar: `**La culture du thé au Maroc :**

L'atay (thé à la menthe) est la boisson nationale. Il est préparé avec :
- Du thé vert (gunpowder)
- De la menthe fraîche
- Beaucoup de sucre

**Le rituel :**
Le thé est versé de haut pour créer de la mousse (le « chapeau » du thé). On le sert trois fois :
1. **« Bsa7 l-3ych »** (Léger comme la vie) — premier verre, doux
2. **« Bsa7 l-hayat »** (Doux comme l'amour) — deuxième, équilibré
3. **« Bsa7 l-mawt »** (Amer comme la mort) — troisième, fort

**Vocabulaire :**
- **Tfaddal** = je t'en prie / sers-toi
- **Zidni** = sers-moi encore
- **Kifash baghih** = comment le veux-tu ?`,
        tips: [
          "Refuser le thé offert par un Marocain peut être perçu comme impoli. Acceptez toujours !",
          "Le thé marocain est très sucré. Si vous n'aimez pas sucré, demandez 'bla sukkar' ou 'shwiya de sukkar'.",
          "Le café noir ('qahwa sda') est très fort. Le café au lait se dit 'nss nsawi'.",
          "Les jus d'orange frais sont partout au Maroc et coûtent environ 5-10 Dh.",
        ],
        quiz: [
          { question: "Comment dit-on 'thé à la menthe' en darija ?", options: ["qahwa", "3asir", "atay", "l-7lib"], correctIndex: 2 },
          { question: "Que signifie 'bla sukkar' ?", options: ["Avec sucre", "Beaucoup de sucre", "Sans sucre", "Peu de sucre"], correctIndex: 2 },
          { question: "Comment dit-on 'un verre d'eau' ?", options: ["kass d-l-ma", "3asir l-3anja", "atay wahed", "qahwa sda"], correctIndex: 0 },
          { question: "Comment dit-on 'jus d'orange' au Maroc ?", options: ["atay limun", "3asir l-3anja", "l-7lib limun", "sharba limun"], correctIndex: 1 },
          { question: "Le thé est versé de haut pour...", options: ["Le refroidir", "Créer de la mousse", "Le filtrer", "Montrer le savoir-faire"], correctIndex: 1 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 6: Directions et transport (A2.1)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 6,
    title: "Directions et transport",
    titleAr: "الاِتِّجَاهَاتُ وَالنَّقْلُ",
    description: "Apprenez à vous orienter, demander votre chemin et utiliser les transports marocains.",
    cefrLevel: "A2.1",
    icon: "🚌",
    color: "from-cyan-500 to-blue-600",
    lessons: [
      {
        id: "6-1",
        title: "Demander et donner des directions",
        titleAr: "السُّؤَالُ عَنِ الاتِّجَاهَاتِ",
        description: "Savoir demander et indiquer un chemin dans une ville marocaine.",
        duration: "7 min",
        vocabulary: [
          { french: "où ?", phonetic: "fin ?", arabic: "فِينَ ؟" },
          { french: "droite", phonetic: "l-yamina", arabic: "اليُمْنَى" },
          { french: "gauche", phonetic: "l-shmal", arabic: "الشِّمَالُ" },
          { french: "tout droit", phonetic: "mashi qbdam", arabic: "مَاشِي قُبْدَام", notes: "Ou 'd-darouri'" },
          { french: "près de / à côté de", phonetic: "qrib mn", arabic: "قَرِيب مِن" },
          { french: "loin", phonetic: "b3id", arabic: "بَعِيدٌ" },
          { french: "ici", phonetic: "hna", arabic: "هُنَا", notes: "Ou 'daba' (maintenant)" },
          { french: "là-bas", phonetic: "hnek / tamm", arabic: "هُنَاكَ / تَمّ" },
          { french: "la rue", phonetic: "z-znqa / t-tariq", arabic: "الزِّنْقَة / الطَّرِيقُ" },
          { french: "le quartier", phonetic: "l-7ay", arabic: "الحَيُّ", notes: "Le quartier en vrai darija. 'd-shra' signifie la campagne, pas le quartier" },
        ],
        phrases: [
          { french: "Où est la place Jemaa el-Fna ?", phonetic: "fin jamaa l-fna ?", arabic: "فِين جَامِعَة الفَنَا ؟", context: "Demande de direction touristique" },
          { french: "Tournez à droite", phonetic: "3ewwel l-yamina", arabic: "عَوِّل اليُمْنَى", context: "Indiquer une direction" },
          { french: "Continuez tout droit", phonetic: "mashi qbdaam", arabic: "مَاشِي قُبْدَام", context: "Donner un itinéraire" },
          { french: "C'est loin d'ici ?", phonetic: "b3id mn hna ?", arabic: "بَعِيد مِن هُنَا ؟", context: "Connaître la distance" },
          { french: "C'est à 5 minutes à pied", phonetic: "khamsa d-dqayeg mcha", arabic: "خَمْسَة دِّقَائِق مْشِي", context: "Indiquer le temps de trajet" },
          { french: "Je suis perdu(e)", phonetic: "dallit / dallet", arabic: "دَلِّيت / دَلَّتْ", context: "Quand on ne trouve pas son chemin" },
          { french: "Prenez le premier à gauche", phonetic: "khudh l-awwal l-shmal", arabic: "خُوذ الأَوَّل الشِّمَال", context: "Indication précise" },
        ],
        grammar: `**Les directions en darija :**

- **qbda** (قُبْدَام) = tout droit / devant
- **L-yamina** (اليُمْنَى) = à droite
- **L-shmal** (الشِّمَال) = à gauche
- **Fou9** (فَوْق) = en haut
- **Lta7t** (لِتَحْت) = en bas
- **Qrib** (قَرِيب) = près
- **B3id** (بَعِيد) = loin

**Les verbes de mouvement :**
- **Mshi** (مشي) = va / marche
- **3ewwel** (عوّل) = tourne
- **Khudh** (خُوذ) = prends
- **Wqa3** (وَقَع) = arrête-toi`,
        tips: [
          "Les rues marocaines (surtout dans les médinas) sont un labyrinthe. N'hésitez pas à demander plusieurs fois !",
          "Les Marocains sont généralement très aimables pour indiquer le chemin, parfois en vous y accompagnant.",
          "Utilisez les monuments connus comme points de repère (mosquée, place, marché).",
          "Google Maps fonctionne assez bien dans les grandes villes, mais pas dans les médinas anciennes.",
        ],
        quiz: [
          { question: "Comment dit-on 'où' en darija ?", options: ["imta", "fin", "kifash", "chnou"], correctIndex: 1 },
          { question: "Comment dit-on 'tout droit' ?", options: ["l-yamina", "l-shmal", "mashi qbdam", "qrib"], correctIndex: 2 },
          { question: "Que signifie 'b3id' ?", options: ["Près", "Loin", "Ici", "Là-bas"], correctIndex: 1 },
          { question: "Comment dit-on 'je suis perdu' ?", options: ["dallit", "ma-3raftch", "fin ana", "b3id"], correctIndex: 0 },
          { question: "'3ewwel l-yamina' signifie...", options: ["Va tout droit", "Tourne à gauche", "Tourne à droite", "Arrête-toi"], correctIndex: 2 },
        ],
      },
      {
        id: "6-2",
        title: "Les moyens de transport",
        titleAr: "وَسَائِلُ النَّقْلِ",
        description: "Taxis, bus, tramway et tous les transports marocains.",
        duration: "6 min",
        vocabulary: [
          { french: "taxi", phonetic: "taksi", arabic: "التَّاكْسِي", notes: "Petit taxi (jaune) ou grand taxi" },
          { french: "bus", phonetic: "kar / bas", arabic: "الكَار / البَاص" },
          { french: "tramway", phonetic: "trama", arabic: "التْرَامْوَايُ" },
          { french: "train", phonetic: "tran / qitar", arabic: "التْرَان / القِطَار", notes: "Le train est très utilisé entre villes" },
          { french: "voiture", phonetic: "tomobil", arabic: "التُّومُوبِيل" },
          { french: "moto / scooter", phonetic: "moto", arabic: "المُوتُو" },
          { french: "gare / station", phonetic: "mahatta", arabic: "المَحَطَّة", notes: "La gare de train ou de bus" },
          { french: "arrêt de bus", phonetic: "ma7att l-kar", arabic: "مَحَطَّة الكَار" },
          { french: "billet / ticket", phonetic: "warqa / billet", arabic: "وَرْقَة / بِيلَات" },
          { french: "le compteur (taxi)", phonetic: "l-konter", arabic: "الكُونْتَر" },
        ],
        phrases: [
          { french: "Je veux aller à la gare", phonetic: "bghit n-mshi l-mahatta", arabic: "بَغِيت نْمْشِي لِلْمَحَطَّة", context: "Au taxi" },
          { french: "Mettez le compteur, s'il vous plaît", phonetic: "shghel l-konter 3afak", arabic: "شَغِّل الكُونْتَر عَافَاك", context: "Dans un taxi" },
          { french: "C'est combien le trajet ?", phonetic: "b-sh7al d-dar ? / b-sh7al l-9ariya ?", arabic: "بِشْحَال الدَّار ؟", context: "Demander le prix d'un trajet" },
          { french: "Ici, s'il vous plaît (arrêtez-vous)", phonetic: "hna 3afak", arabic: "هُنَا عَافَاك", context: "Demander au chauffeur de s'arrêter" },
          { french: "Où est l'arrêt de tram ?", phonetic: "fin ma7att t-trama ?", arabic: "فِين مَحَطَّة التْرَامْ ؟", context: "Trouver un arrêt" },
          { french: "Le train pour Marrakech", phonetic: "tren n-marrakch", arabic: "تْرَان نَمَرَّاكْش", context: "A la gare" },
        ],
        grammar: `**Les transports au Maroc :**

1. **Petit taxi** (jaune) : urbain, compteur obligatoire. Maximum 3 passagers.
2. **Grand taxi** (blanc/bleu) : interurbain, prix à négocier. Maximum 6 passagers.
3. **Bus** : économique mais parfois bondé. En ville et interurbain (CTM, Supratours).
4. **Train** (ONCF) : moderne et confortable. Al Boraq TGV Casablanca-Tanger.
5. **Tramway** : Casa, Rabat (pas cher).
6. **Moto/scooter** : très populaire, moyen de transport principal des jeunes.

**Verbes utiles :**
- **N-mshi l-** = je vais à
- **N-wsel f-** = j'arrive à
- **Khudh** = prends (le bus, le train)`,
        tips: [
          "Toujours demander au chauffeur de taxi de mettre le compteur ('shghel l-konter').",
          "Les grands taxis partent quand ils sont pleins (6 personnes). C'est moins cher mais plus long.",
          "Le train ONCF est un excellent moyen de voyager entre les grandes villes.",
          "Les prix des grands taxis et bus interurbains se négocient ou sont affichés.",
        ],
        quiz: [
          { question: "Comment demande-t-on au taxi de mettre le compteur ?", options: ["shghel l-konter", "fin t-mshi", "b-sh7al", "hna 3afak"], correctIndex: 0 },
          { question: "Comment dit-on 'gare' en darija ?", options: ["mahatta", "garaj", "mdina", "7ay"], correctIndex: 0 },
          { question: "Quelle est la différence entre petit et grand taxi ?", options: ["Couleur", "Prix", "Tous les deux", "Rien"], correctIndex: 0 },
          { question: "Comment dit-on 'je veux aller à...' ?", options: ["bghit n-koul", "bghit n-mshi l-", "bghit n-rje3", "bghit n-n3as"], correctIndex: 1 },
          { question: "Que signifie 'hna 3afak' dans un taxi ?", options: ["Partez", "Accélérez", "Arrêtez-vous ici", "Tournez"], correctIndex: 2 },
        ],
      },
      {
        id: "6-3",
        title: "Voyager au Maroc",
        titleAr: "التَّنَقُّلُ فِالمَغْرِبِ",
        description: "Pratiquez pour voyager en train, bus et taxi entre les villes marocaines.",
        duration: "7 min",
        vocabulary: [
          { french: "billet de train", phonetic: "billet d-tren", arabic: "بِيلَات دِتْرَان" },
          { french: "première classe / deuxième classe", phonetic: "darja wla / darja juz", arabic: "دَرْجَة وُلَا / دَرْجَة جُوز" },
          { french: "départ", phonetic: "khuruja", arabic: "خُرُوجَةٌ" },
          { french: "arrivée", phonetic: "wusul", arabic: "وُصُولٌ" },
          { french: "Casablanca", phonetic: "casa / bda", arabic: "كَازَا / بَيْضَاء" },
          { french: "Marrakech", phonetic: "marrakch", arabic: "مَرَّاكْشُ" },
          { french: "Fès", phonetic: "fas", arabic: "فَاسُ" },
          { french: "Tanger", phonetic: "6anja", arabic: "طَنْجَةُ", notes: "Le 6 se prononce 'ta' emphatique" },
          { french: "Agadir", phonetic: "agadir", arabic: "أَكَادِيرُ" },
          { french: "Rabat", phonetic: "rrbat", arabic: "رِّبَاطُ" },
        ],
        phrases: [
          { french: "Un billet aller-retour pour Fès", phonetic: "billet riha w-rja3 l-fas", arabic: "بِيلَات رِيحَة وَرْجَعَة لِفَاس", context: "À la gare" },
          { french: "À quelle heure part le train ?", phonetic: "imta kay-khrej t-tren ?", arabic: "إِمْتَى كَايْخْرُج التْرَان ؟", context: "Information horaire" },
          { french: "C'est direct ou il faut changer ?", phonetic: "mubashir w-la kayn ta3yit ?", arabic: "مُبَاشِر وَلَا كَايِن تَعْيِيت ؟", context: "Demander si c'est direct" },
          { french: "Combien de temps ?", phonetic: "sh7al d-waqt ?", arabic: "شْحَال دِوَّقْت ؟", context: "Durée du trajet" },
          { french: "Je voudrais une place côté fenêtre", phonetic: "bghit blassa qrib men l-shbaka", arabic: "بَغِيت بَلَسَّة قَرِيب مِن الشَّبَاكَة", context: "Préférence de place" },
        ],
        grammar: `**Voyager en train au Maroc (ONCF) :**

Les trains marocains sont modernes et confortables. Il y a deux classes :
- **Darja wla** (première classe) : climatisée, 8 places par wagon
- **Darja juz** (deuxième classe) : économique, 8 places aussi

**Le TGV Al Boraq :** relie Casablanca à Tanger en 2h10.

**Expressions utiles :**
- **Rihet-jaya** = aller-retour (ريهة-جاية)
- **Riha** = aller simple (ريحة)
- **Khuruja** = départ (خروج)
- **Wusul** = arrivée (وصول)
- **Ta3yit** = correspondance (تعييت)`,
        tips: [
          "Réservez vos billets de train en ligne sur oncf.ma pour les grandes lignes.",
          "Les bus CTM et Supratours sont confortables et fiables pour les longues distances.",
          "Le Al Boraq (TGV) nécessite une réservation anticipée, surtout en été.",
          "Entre villes proches, les grands taxis partagés sont plus rapides que les bus.",
        ],
        quiz: [
          { question: "Comment dit-on 'aller-retour' en darija ?", options: ["riha", "rihet-jaya", "khuruja", "wusul"], correctIndex: 1 },
          { question: "Comment dit-on 'départ' ?", options: ["wusul", "khuruja", "ta3yit", "darja"], correctIndex: 1 },
          { question: "Comment dit-on 'Marrakech' en darija ?", options: ["marakesh", "marrakch", "markash", "murakuch"], correctIndex: 1 },
          { question: "Que signifie 'sh7al d-waqt' ?", options: ["Où c'est ?", "Combien ça coûte ?", "Combien de temps ?", "Quand ?"], correctIndex: 2 },
          { question: "Combien de classes dans les trains marocains ?", options: ["1", "2", "3", "4"], correctIndex: 1 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 7: Routine quotidienne (A2.1)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 7,
    title: "Routine quotidienne",
    titleAr: "الرُّوتِينُ اليَوْمِيُّ",
    description: "Décrivez votre journée du matin au soir avec le vocabulaire de la vie quotidienne.",
    cefrLevel: "A2.1",
    icon: "☀️",
    color: "from-lime-500 to-green-600",
    lessons: [
      {
        id: "7-1",
        title: "Le matin",
        titleAr: "الصُّبْحُ",
        description: "Se lever, le petit-déjeuner et les activités matinales.",
        duration: "6 min",
        vocabulary: [
          { french: "se réveiller", phonetic: "n-qedd", arabic: "نَقِدُّ", notes: "Se réveiller du sommeil" },
          { french: "se lever", phonetic: "n-tla3", arabic: "نَطْلَعُ", notes: "Se lever du lit" },
          { french: "se laver", phonetic: "n-ghesel", arabic: "نَغْسِل", notes: "Se laver le visage, les mains" },
          { french: "prendre une douche", phonetic: "n-khodh d-douch", arabic: "نَخُوذ دُّوش", notes: "Emprunt au français 'douche'" },
          { french: "le petit-déjeuner", phonetic: "l-ftur", arabic: "الفْطُور", notes: "Souvent pain, huile, thé, miel" },
          { french: "s'habiller", phonetic: "n-lbes", arabic: "نَلْبَسُ", notes: "Mettre ses vêtements" },
          { french: "se préparer", phonetic: "n-jihhaz", arabic: "نَجِهَّز", notes: "Se préparer pour sortir" },
          { french: "sortir (on sort)", phonetic: "n-khriwu", arabic: "نَخْرِيُو", notes: "Pluriel 'on sort' en vrai darija. Singulier : n-khriy" },
          { french: "maison", phonetic: "dar", arabic: "الدَّار", notes: "La maison" },
          { french: "tard / en retard", phonetic: "mwekker", arabic: "مُوَخَّر", notes: "Être en retard" },
        ],
        phrases: [
          { french: "Je me réveille à 7 heures", phonetic: "kanqedd sa3a seb3a", arabic: "كَنْقِدُّ سَاعَة سَبْعَة", context: "Décrire son réveil" },
          { french: "Je prends le petit-déjeuner", phonetic: "kan-koul l-ftur", arabic: "كَنْكُول الفْطُور", context: "Le repas du matin" },
          { french: "Je dois partir", phonetic: "khassni n-khriw", arabic: "خَاصْنِي نَخْرِي", context: "Quand il est temps de partir" },
          { french: "Je suis en retard !", phonetic: "ana mwekker !", arabic: "أَنَا مُوَخَّر !", context: "Pressé le matin" },
          { french: "Il est tôt", phonetic: "sba7 bwwaf", arabic: "صُبْح بَوَّاف", context: "Quand il est encore tôt" },
          { french: "Je me dépêche", phonetic: "kan-jered", arabic: "كَنْجِرِد", context: "Se dépêcher" },
        ],
        grammar: `**Les verbes quotidiens au présent :**

En darija, le présent se forme avec le préfixe **ka-** (ou **ta-** à la 2e personne) :
- **Kan-tla3** (كَنْطْلَع) = je me lève
- **Kan-lbes** (كَنْلْبَس) = je m'habille
- **Kan-koul** (كَنْكُول) = je mange
- **Kan-shreb** (كَنْشْرِب) = je bois
- **Kan-mshi** (كَنْمْشِي) = je vais

**L'obligation :**
- **Khassni** (خَاصْنِي) = je dois / il faut que je
- **Khassak** (خَاصْك) = tu dois
- **Khassu** (خَاصُّو) = il doit`,
        tips: [
          "Le petit-déjeuner marocain typique : pain, huile d'olive, miel, thé à la menthe.",
          "Beaucoup de Marocains commencent la journée avec une prière (salat s-sbah).",
          "Il est courant de dire 'sba7 l-khir' (bonjour) en se croisant le matin.",
          "Les horaires de travail commencent généralement vers 8h30-9h au Maroc.",
        ],
        quiz: [
          { question: "Comment dit-on 'je me lève' en darija ?", options: ["kan-qedd", "kan-tla3", "kan-n3as", "kan-lbes"], correctIndex: 1 },
          { question: "Que signifie 'l-ftur' ?", options: ["Le dîner", "Le déjeuner", "Le petit-déjeuner", "Le goûter"], correctIndex: 2 },
          { question: "Comment dit-on 'je dois partir' ?", options: ["kan-mshi", "bghit n-khriw", "khassni n-khriw", "ma-bghitch n-khriw"], correctIndex: 2 },
          { question: "Que signifie 'mwekker' ?", options: ["En avance", "En retard", "À l'heure", "Absent"], correctIndex: 1 },
          { question: "Comment dit-on 'maison' en darija ?", options: ["mdina", "dar", "mahal", "7yawan"], correctIndex: 1 },
        ],
      },
      {
        id: "7-2",
        title: "La journée de travail/école",
        titleAr: "يَوْمُ الشُّغْلِ أَوِ المَدْرَسَةِ",
        description: "Vocabulaire pour le travail et les études au Maroc.",
        duration: "6 min",
        vocabulary: [
          { french: "travail", phonetic: "khedma", arabic: "الخِدْمَة", notes: "Le travail / l'emploi" },
          { french: "école / université", phonetic: "l-mdrasa / jami3a", arabic: "المَدْرَسَة / الجَامِعَة" },
          { french: "bureau", phonetic: "l-maktab", arabic: "المَكْتَب" },
          { french: "collègue", phonetic: "zamil", arabic: "زَمِيلٌ" },
          { french: "chef / patron", phonetic: "l-mudir", arabic: "المُدِير", notes: "Directeur / responsable" },
          { french: "commencer", phonetic: "n-bda", arabic: "نَبْدَأ", notes: "Commencer une activité" },
          { french: "finir / terminer", phonetic: "n-khlas", arabic: "نَخْلَص", notes: "Terminer quelque chose" },
          { french: "déjeuner", phonetic: "l-ghda", arabic: "الغَدَاء", notes: "Repas de midi" },
          { french: "la pause", phonetic: "l-barra7a / l-waqt", arabic: "البَرَّاحَة / الوَقْت", notes: "La pause déjeuner" },
          { french: "fatigué(e)", phonetic: "3yan / 3yana", arabic: "عَيَان / عَيَانَة", notes: "Être fatigué" },
        ],
        phrases: [
          { french: "Je vais au travail", phonetic: "kan-mshi l-l-khedma", arabic: "كَنْمْشِي لِلخِدْمَة", context: "Le matin" },
          { french: "Le travail est bien", phonetic: "l-khedma mzyana", arabic: "الخِدْمَة مْزْيَانَة", context: "Parler de son travail" },
          { french: "Je suis fatigué", phonetic: "ana 3yan", arabic: "أَنَا عَيَان", context: "En fin de journée" },
          { french: "C'est la pause déjeuner", phonetic: "waqt l-ghda", arabic: "وَقْت الغَدَاء", context: "Annoncer la pause" },
          { french: "J'ai beaucoup de travail", phonetic: "3ndi khedma bzzaf", arabic: "عَنْدِي خِدْمَة بْزَاف", context: "Dire qu'on est occupé" },
          { french: "Qu'est-ce que tu fais comme travail ?", phonetic: "ash-kaddaz ?", arabic: "أَشْ كَدَّاز ؟", context: "Question courante au Maroc" },
        ],
        grammar: `**Parler de son travail :**

- **Kaddaz** (كَدَّاز) = que fais-tu (comme travail) ?
- **Kan-khedem fi...** = je travaille dans...
- **Kan-khedem f-l-maktab** = je travaille au bureau
- **Khedma mzyana** = le travail est bon

**Le verbe « travailler » :**
- **Kan-khedem** (كَنْخَدَم) = je travaille
- **Kat-khedmi** (كَتْخَدْمِي) = tu travailles (fém.)
- **Kay-khedem** (كَايْخَدَم) = il travaille
- **Kan-khedmo** = nous travaillons

Note : En darija, on utilise souvent **kan-** (je) et **kay-** (il/elle) pour le présent. La distinction est importante !`,
        tips: [
          "La question 'ash kaddaz ?' est l'une des plus posées au Maroc après les salutations.",
          "La pause déjeuner au Maroc est généralement de 12h à 14h.",
          "Le vendredi est demi-journée de travail dans beaucoup d'entreprises.",
          "Il est normal de demander combien on gagne, ce n'est pas tabou comme en France.",
        ],
        quiz: [
          { question: "Comment dit-on 'travail' en darija ?", options: ["l-mdrasa", "l-maktab", "khedma", "l-ghda"], correctIndex: 2 },
          { question: "Que signifie 'ash kaddaz' ?", options: ["Où vas-tu ?", "Que fais-tu comme travail ?", "Comment tu vas ?", "Qu'est-ce que tu manges ?"], correctIndex: 1 },
          { question: "Comment dit-on 'je suis fatigué' ?", options: ["ana mzyan", "ana 3yan", "ana j3an", "ana farhan"], correctIndex: 1 },
          { question: "Comment dit-on 'je travaille' ?", options: ["kan-n3as", "kan-khedem", "kan-l3eb", "kan-koul"], correctIndex: 1 },
          { question: "Que signifie 'l-ghda' ?", options: ["Petit-déjeuner", "Déjeuner", "Dîner", "Goûter"], correctIndex: 1 },
        ],
      },
      {
        id: "7-3",
        title: "Le soir et les activités du weekend",
        titleAr: "المَسَاءُ وَأَنْشِطَةُ نِهَايَةِ الأُسْبُوعِ",
        description: "Le dîner, la soirée et les activités du weekend au Maroc.",
        duration: "6 min",
        vocabulary: [
          { french: "le dîner", phonetic: "l-3sha", arabic: "العِشَاء", notes: "Repas du soir, souvent tard" },
          { french: "regarder la télé", phonetic: "t-farraj", arabic: "تَفَرَّج", notes: "Regarder (la télé, un film...)" },
          { french: "sortir avec des amis", phonetic: "n-khriwu m3a s7abi", arabic: "نَخْرِيُو مَعَ صَحْبِي", notes: "Sortir le soir (pluriel on sort)" },
          { french: "rentrer chez soi", phonetic: "n-rje3 l-dar", arabic: "نَرْجِع لِالدَّار" },
          { french: "se coucher / dormir", phonetic: "n-n3as", arabic: "نَنْعَاس", notes: "Aller dormir" },
          { french: "le weekend", phonetic: "l-wikend", arabic: "الوِيْكِنْد", notes: "Samedi-dimanche au Maroc" },
          { french: "se promener", phonetic: "n-tmasha", arabic: "نَتْمَشَى", notes: "Marcher pour le plaisir" },
          { french: "visiter", phonetic: "n-zur", arabic: "نَزُور", notes: "Visiter un lieu ou quelqu'un" },
          { french: "ami(e) / copain", phonetic: "s7ab / s7abi", arabic: "صَحْب / صَحْبِي", notes: "Amis intimes" },
          { french: "fête / soirée", phonetic: "l-hafla", arabic: "الحَفْلَة", notes: "Fête, célébration" },
        ],
        phrases: [
          { french: "Qu'est-ce que tu fais ce soir ?", phonetic: "ash-katsawi l-lela ?", arabic: "أَشْ كَتْسَاوِي اللَّيْلَة ؟", context: "Demander les projets du soir" },
          { french: "Je vais me coucher", phonetic: "ghadi n-n3as", arabic: "غَادِي نَنْعَاس", context: "Avant de dormir" },
          { french: "Bonne nuit", phonetic: "lila mbarka", arabic: "لَيْلَة مُبَارَكَة", context: "Souhaiter bonne nuit" },
          { french: "On sort ce weekend ?", phonetic: "n-khriwu l-wikend ?", arabic: "نَخْرِيُو الوِيْكِنْد ؟", context: "Proposer une sortie (pluriel)" },
          { french: "Je me repose", phonetic: "kan-stre7", arabic: "كَنْسْتَرِيح", context: "Se reposer le weekend" },
          { french: "À demain !", phonetic: "n-shufek ghadda !", arabic: "نَشُوفَك غَدَّا !", context: "Se dire au revoir le soir" },
        ],
        grammar: `**Le futur avec « ghadi » :**

En darija, le futur se forme avec **ghadi** + verbe :
- **Ghadi n-mshi** (غادي نمشي) = je vais partir
- **Ghadi n-koul** (غادي نكول) = je vais manger
- **Ghadi n-n3as** (غادي ننعاس) = je vais dormir

**Les activités du soir :**
- **T-farraj** = regarder (la télé)
- **T-kellem m3a** = parler avec
- **N-khrej** = sortir
- **N-rje3** = rentrer
- **N-stre7** = se reposer`,
        tips: [
          "Le dîner au Maroc se prend souvent tard (21h-22h), surtout en été.",
          "Le vendredi soir est un moment de rassemblement familial important.",
          "Les cafés sont très populaires le soir : les hommes s'y retrouvent pour discuter.",
          "Le cinéma, les malls et les restaurants sont les sorties les plus courantes le weekend.",
        ],
        quiz: [
          { question: "Comment dit-on 'dîner' en darija ?", options: ["l-ftur", "l-ghda", "l-3sha", "l-3asira"], correctIndex: 2 },
          { question: "Comment forme-t-on le futur ?", options: ["kan- + verbe", "ghadi + verbe", "ma- + verbe", "bghit + verbe"], correctIndex: 1 },
          { question: "Que signifie 'n-n3as' ?", options: ["Je mange", "Je dors", "Je sors", "Je travaille"], correctIndex: 1 },
          { question: "Comment dit-on 'regarder la télé' ?", options: ["n-qra", "n-koul", "t-farraj", "n-shreb"], correctIndex: 2 },
          { question: "Que signifie 'lila mbarka' ?", options: ["Bonsoir", "Bonne nuit", "Bonjour", "Bonne journée"], correctIndex: 1 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 8: Santé et corps (A2.1)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 8,
    title: "Santé et corps",
    titleAr: "الصِّحَّةُ وَالجَسَدُ",
    description: "Les parties du corps, la santé et les visites chez le médecin.",
    cefrLevel: "A2.1",
    icon: "🏥",
    color: "from-red-500 to-rose-600",
    lessons: [
      {
        id: "8-1",
        title: "Les parties du corps",
        titleAr: "أَعْضَاءُ الجَسَدِ",
        description: "Le vocabulaire essentiel du corps humain en darija.",
        duration: "6 min",
        vocabulary: [
          { french: "tête", phonetic: "ras", arabic: "الرَّأْسُ" },
          { french: "yeux", phonetic: "3in / 3yun", arabic: "العَيْن / العُيُون" },
          { french: "bouche", phonetic: "famm", arabic: "الفَمُّ" },
          { french: "nez", phonetic: "anf", arabic: "الأَنْفُ" },
          { french: "oreille", phonetic: "wedn", arabic: "الوِدْن" },
          { french: "main", phonetic: "yedd / yd", arabic: "اليَدُ / اليَدِ" },
          { french: "pied", phonetic: "rrejl", arabic: "الرِّجْل" },
          { french: "ventre", phonetic: "baten / batn", arabic: "البَطْنُ" },
          { french: "dos", phonetic: "dhr", arabic: "الظَّهْرُ", notes: "Le dh est un D emphatique" },
          { french: "cœur", phonetic: "gelb", arabic: "القَلْبُ", notes: "En darija, ق se prononce G" },
        ],
        phrases: [
          { french: "J'ai mal à la tête", phonetic: "3ndi l-qra f-ras", arabic: "عَنْدِي القَرَة فِرَاس", context: "Se plaindre d'un mal" },
          { french: "J'ai mal au ventre", phonetic: "3ndi l-qra f-l-batn", arabic: "عَنْدِي القَرَة فِلْبَطْن", context: "Mal de ventre" },
          { french: "Ferme les yeux", phonetic: "qful 3inik", arabic: "قْفُل عَيْنِيك", context: "Indication médicale" },
          { french: "Ouvre la bouche", phonetic: "fta7 fammak", arabic: "افْتَح فَمَّاك", context: "Chez le médecin" },
          { french: "Mes pieds me font mal", phonetic: "rjluya kaysa3uni", arabic: "رِجْلُوَا كَيْسَعُونِي", context: "Se plaindre" },
        ],
        grammar: `**Dire « j'ai mal à... » :**

On utilise **3ndi l-qra f-** (j'ai la douleur dans) + partie du corps :
- **3ndi l-qra f-ras** = j'ai mal à la tête
- **3ndi l-qra f-l-dhr** = j'ai mal au dos
- **3ndi l-qra f-l-yedd** = j'ai mal à la main

**Singulier et pluriel :**
- Ras (راس) = tête → Rous (روس)
- 3in (عين) = œil → 3yun (عيون)
- Yedd (يد) = main → Yidin (يدين)
- Rejl (رجل) = pied → Rjel (رجال)`,
        tips: [
          "L'expression '3ndi l-qra f...' est la façon la plus courante d'exprimer la douleur.",
          "Au Maroc, quand on a mal quelque part, on touche l'endroit en le mentionnant.",
          "Le mot 'gelb' (cœur) sert aussi à exprimer les émotions : 'gelbi farhan' (je suis heureux).",
        ],
        quiz: [
          { question: "Comment dit-on 'tête' en darija ?", options: ["famm", "ras", "gelb", "anf"], correctIndex: 1 },
          { question: "Comment dit-on 'j'ai mal à la tête' ?", options: ["3ndi l-qra f-ras", "ras dyali 3yan", "ras dyali kbir", "ma-kaynch f-ras"], correctIndex: 0 },
          { question: "Que signifie 'wedn' ?", options: ["Nez", "Bouche", "Oreille", "Œil"], correctIndex: 2 },
          { question: "Comment dit-on 'cœur' en darija ?", options: ["batn", "dhr", "gelb", "ras"], correctIndex: 2 },
          { question: "Le pluriel de '3in' (œil) est...", options: ["3inan", "3yun", "3ayn", "3yuna"], correctIndex: 1 },
        ],
      },
      {
        id: "8-2",
        title: "Chez le médecin",
        titleAr: "لَدَى الطَّبِيبِ",
        description: "Savoir expliquer ses symptômes et comprendre le médecin.",
        duration: "7 min",
        vocabulary: [
          { french: "médecin", phonetic: "tabib / daktur", arabic: "طَبِيب / دَكْتُور" },
          { french: "pharmacie", phonetic: "l-3aydariya", arabic: "العَيْدَارِيَّة", notes: "Mot d'origine espagnole" },
          { french: "hôpital", phonetic: "l-mustashfa", arabic: "المُسْتَشْفَى" },
          { french: "maladie", phonetic: "l-mard", arabic: "المَرَضُ" },
          { french: "fièvre", phonetic: "l-humma", arabic: "الحُمَّى" },
          { french: "rhume", phonetic: "l-zkama", arabic: "الزُّكَامَة" },
          { french: "médicament", phonetic: "l-dawa", arabic: "الدَّوَاء" },
          { french: "ordonnance", phonetic: "l-waraqa", arabic: "الوَرْقَة", notes: "Litt. 'le papier'" },
          { french: "douleur / mal", phonetic: "l-qra", arabic: "القَرَة", notes: "Mot fondamental pour la santé" },
          { french: "allergie", phonetic: "l-hassasiya", arabic: "الحَسَّاسِيَّة" },
        ],
        phrases: [
          { french: "Je ne me sens pas bien", phonetic: "ma-kansh khyr", arabic: "مَا كَنْش خَيْر", context: "Expliquer qu'on est malade" },
          { french: "J'ai de la fièvre", phonetic: "3ndi l-humma", arabic: "عَنْدِي الحُمَّى", context: "Décrire un symptôme" },
          { french: "Depuis combien de temps ?", phonetic: "mnin ?", arabic: "مِنِّين ؟", context: "Question du médecin" },
          { french: "Prenez ce médicament", phonetic: "khudh had l-dawa", arabic: "خُوذ هَاد الدَّوَاء", context: "Ordonnance du médecin" },
          { french: "Trois fois par jour", phonetic: "tlata marrat f-nhar", arabic: "تْلَاتَة مَرَّات فِالنَّهَار", context: "Posologie" },
          { french: "Il faut aller à l'hôpital", phonetic: "khassna n-mshiw l-mustashfa", arabic: "خَصْنَا نْمْشِيو لِلْمُسْتَشْفَى", context: "Recommandation médicale" },
        ],
        grammar: `**Chez le médecin : vocabulaire essentiel :**

Questions du médecin :
- **Kifash kaysirk ?** (كيفاش كيسيرك) = Comment tu vas ?
- **Mnin had l-mard ?** = Depuis quand cette maladie ?
- **Fin kay-dwir l-qra ?** = Où est la douleur ?

Le patient :
- **Ma-kansh khyr** = je ne me sens pas bien
- **3ndi l-qra f-...** = j'ai mal à...
- **3ndi l-humma** = j'ai de la fièvre
- **Ma-nqderch n-koul** = je ne peux pas manger

**La pharmacie :**
Les pharmacies au Maroc sont identifiables par une croix verte. Beaucoup de médicaments sont vendus sans ordonnance.`,
        tips: [
          "Les pharmacies marocaines sont nombreuses et souvent ouvertes 24h/24 en ville.",
          "Dans les grandes villes, on trouve des cliniques privées de bonne qualité.",
          "L'assurance maladie (AMO) couvre une partie des frais médicaux.",
          "Si vous avez besoin d'aide, demandez : 'fin l-3aydariya ?' (où est la pharmacie ?).",
        ],
        quiz: [
          { question: "Comment dit-on 'médecin' en darija ?", options: ["9aydariya", "tabib", "mard", "dawa"], correctIndex: 1 },
          { question: "Que signifie 'l-qra' ?", options: ["Médicament", "Douleur", "Fièvre", "Ordonnance"], correctIndex: 1 },
          { question: "Comment dit-on 'j'ai de la fièvre' ?", options: ["3ndi l-qra", "3ndi l-humma", "3ndi l-mard", "3ndi l-dawa"], correctIndex: 1 },
          { question: "Que signifie 'l-3aydariya' ?", options: ["Hôpital", "Pharmacie", "Clinique", "Médecin"], correctIndex: 1 },
          { question: "Comment dit-on 'médicament' en darija ?", options: ["l-qra", "l-mard", "l-dawa", "l-humma"], correctIndex: 2 },
        ],
      },
      {
        id: "8-3",
        title: "Expressions de santé et bien-être",
        titleAr: "تَعْبِيرَاتُ الصِّحَّةِ وَالعَافِيَةِ",
        description: "Les expressions courantes pour parler de la santé et du bien-être.",
        duration: "5 min",
        vocabulary: [
          { french: "bonne santé", phonetic: "s7a", arabic: "الصِّحَّةُ", notes: "S7a w-salam = santé et paix" },
          { french: "épuisé / épuisée", phonetic: "m3yan / m3yana", arabic: "مُعْيَان / مُعْيَانَة" },
          { french: "stressé / stressée", phonetic: "m3yaqq / m3yaaqa", arabic: "مُعَيَّق / مُعَيَّقَة", notes: "En darija, on utilise aussi le mot français 'stresse'" },
          { french: "content / heureux", phonetic: "farhan / farhana", arabic: "فَرْحَان / فَرْحَانَة" },
          { french: "triste", phonetic: "z3lan / z3lana", arabic: "زَعْلَان / زَعْلَانَة" },
          { french: "en forme", phonetic: "f-l-hal", arabic: "فِالحَال", notes: "Être en bonne forme physique" },
          { french: "malade", phonetic: "mrid / mrida", arabic: "مَرِيض / مَرِيضَة" },
          { french: "guéri / rétabli", phonetic: "shafa / y-shfa", arabic: "شَفَا / يِشْفَى" },
          { french: "énergie / force", phonetic: "l-qowa", arabic: "القُوَّة" },
          { french: "repos", phonetic: "r-a7a / l-stra7a", arabic: "الرَّاحَة / الِسْتِرَاحَة" },
        ],
        phrases: [
          { french: "Comment tu vas ? Tu es en forme ?", phonetic: "ki dayr ? nta f-l-hal ?", arabic: "كِي دَايْر ؟ نْتَا فِالحَال ؟", context: "Demander des nouvelles de santé (ki dayr = vrai darija, pas kifash nta)" },
          { french: "Je suis épuisé", phonetic: "ana m3yan", arabic: "أَنَا مَعْيَان", context: "Après une longue journée (m3yan = épuisé en vrai darija)" },
          { french: "Dieu te guérisse !", phonetic: "allah y-shfak !", arabic: "اللّٰه يُشْفَاك !", context: "Quand quelqu'un est malade" },
          { french: "Tu dois te reposer", phonetic: "khassak t-stre7", arabic: "خَاصَّك تَسْتَرِيح", context: "Conseil de santé" },
          { french: "Santé ! (en trinquant)", phonetic: "s7a !", arabic: "صِحَّة !", context: "Avant de boire" },
          { french: "Je me sens bien", phonetic: "kansh khyr", arabic: "كَنْش خَيْر", context: "Dire qu'on va bien" },
        ],
        grammar: `**Les expressions de bien-être :**

Dire comment on va :
- **Kansh khyr** (كَنْش خَيْر) = je vais bien
- **Kansh lhal** (كَنْش لِحَال) = je suis en forme
- **Ma-kanshch khyr** = je ne vais pas bien
- **Ana mrid** = je suis malade

Les émotions :
- **Farhan** = heureux (masc.) / **Farhana** = heureuse (fém.)
- **Z3lan** = triste (masc.) / **Z3lana** = triste (fém.)
- **M3yaqq** = stressé (masc.) / **M3yaaqa** = stressée (fém.)

Formules de politesse pour la santé :
- **Allah y-shfak** = Que Dieu te guérisse
- **Allah y-7afdek** = Que Dieu te protège
- **S7a w-salam** = Santé et paix`,
        tips: [
          "Les Marocains posent souvent la question 'kifash s7a?' (comment va ta santé ?).",
          "Dire 'allah y-shfak' à quelqu'un de malade est très apprécié.",
          "Le repos est très valorisé au Maroc. Ne sous-estimez pas l'importance de la sieste !",
          "L'expression 's7a' (santé) se dit aussi en portant un toast.",
        ],
        quiz: [
          { question: "Comment dit-on 'je suis épuisé' ?", options: ["ana mrid", "ana m3yan", "ana z3lan", "ana farhan"], correctIndex: 1 },
          { question: "Que signifie 'allah y-shfak' ?", options: ["Merci", "Au revoir", "Dieu te guérisse", "Dieu te garde"], correctIndex: 2 },
          { question: "Comment dit-on 'en forme' ?", options: ["mrid", "m3yan", "f-l-hal", "z3lan"], correctIndex: 2 },
          { question: "Comment dit-on 'épuisé' (masculin) ?", options: ["farhan", "m3yan", "z3lan", "mkhayyef"], correctIndex: 1 },
          { question: "Comment dit-on 'malade' (masculin) ?", options: ["farhan", "mrid", "z3lan", "mkhayyef"], correctIndex: 1 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 9: Travail et professions (A2.2)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 9,
    title: "Travail et professions",
    titleAr: "الشُّغْلُ وَالمِهَنُ",
    description: "Les métiers, le vocabulaire de bureau et la recherche d'emploi au Maroc.",
    cefrLevel: "A2.2",
    icon: "💼",
    color: "from-yellow-500 to-amber-600",
    lessons: [
      {
        id: "9-1",
        title: "Les métiers courants au Maroc",
        titleAr: "المِهَنُ الشَّائِعَةُ فِالمَغْرِبِ",
        description: "Découvrez les noms des professions les plus courantes au Maroc.",
        duration: "7 min",
        vocabulary: [
          { french: "professeur / professeure", phonetic: "ustadh / ustadha / m3alem / m3alma", arabic: "أُسْتَاذ / أُسْتَاذَة / مُعَلِّم / مُعَلِّمَة" },
          { french: "médecin", phonetic: "tabib / tabiba", arabic: "طَبِيب / طَبِيبَة" },
          { french: "ingénieur", phonetic: "muhandis / muhandisa", arabic: "مُهَنْدِس / مُهَنْدِسَة" },
          { french: "commerçant / commerçante", phonetic: "tajer / tajra", arabic: "تَاجِر / تَاجِرَة", notes: "Vendeur au souk (forme correcte, pas tojjer)" },
          { french: "artisan", phonetic: "3ammal", arabic: "عَمَّالٌ", notes: "Maroquinier, menuisier..." },
          { french: "paysan / paysanne", phonetic: "fallah / fallaha", arabic: "فَلَّاح / فَلَّاحَة", notes: "L'agriculture est importante au Maroc" },
          { french: "chauffeur", phonetic: "swwaq / swwaqa", arabic: "سُوَّاق / سُوَّاقَة" },
          { french: "policier", phonetic: "bulees / shurti", arabic: "بُولِيس / شُرْطِي" },
          { french: "informaticien / informaticienne", phonetic: "mubarmij / mubarmija", arabic: "مُبَرْمِج / مُبَرْمِجَة", notes: "Développeur / programmeur" },
          { french: "fonctionnaire", phonetic: "mwaddaf / mwaddafa", arabic: "مُوَظَّف / مُوَظَّفَة", notes: "Travaille dans l'administration" },
        ],
        phrases: [
          { french: "Tu fais quoi comme travail ?", phonetic: "ash kaddaz ?", arabic: "أَشْ كَدَّاز ؟", context: "Demander la profession" },
          { french: "Je suis ingénieur", phonetic: "ana muhandis", arabic: "أَنَا مُهَنْدِس", context: "Dire sa profession" },
          { french: "Mon père est commerçant", phonetic: "baba dyali tajer", arabic: "بَابَا دْيَالِي تَاجِر", context: "Profession d'un parent" },
          { french: "C'est un bon métier", phonetic: "had khedma mzyana", arabic: "هَاد الخِدْمَة مْزْيَانَة", context: "Donner son avis" },
          { french: "Le travail est difficile", phonetic: "l-khedma s3iba", arabic: "الخِدْمَة صْعِيبَة", context: "Se plaindre du travail" },
        ],
        grammar: `**Dire sa profession :**

En darija, on dit simplement :
- **Ana + [profession]** : Je suis [profession]
- **Ana muhandis** = je suis ingénieur
- **Ana tabib** = je suis médecin

**Le féminin :**
La plupart des professions féminines ne changent pas en darija :
- **Ana muhandisa** = je suis ingénieure (-a)
- **Ana tabiba** = je suis femme médecin (-a)

**Question : « Ash kaddaz ? »**
C'est la façon la plus naturelle de demander la profession. Littéralement : « Que fais-tu comme travail ? »`,
        tips: [
          "La question 'ash kaddaz' est la plus posée après les salutations au Maroc.",
          "Les métiers artisanaux sont très valorisés au Maroc (maroquinerie, zellige, poterie).",
          "Le secteur informatique est en pleine croissance au Maroc.",
          "Les fonctionnaires (mwaddafin) représentent une grande partie de la population active.",
        ],
        quiz: [
          { question: "Comment demande-t-on la profession en darija ?", options: ["fin khedemek ?", "ash kaddaz ?", "kifash smiytek ?", "sh7al 3omrek ?"], correctIndex: 1 },
          { question: "Comment dit-on 'commerçant' en darija ?", options: ["tabib", "muhandis", "tajer", "mwaddaf"], correctIndex: 2 },
          { question: "Comment dit-on 'ingénieur' ?", options: ["mubarmij", "ustadh", "muhandis", "swwaq"], correctIndex: 2 },
          { question: "Le féminin de 'tabib' est...", options: ["tabib", "tabiba", "tabibt", "t-tabiba"], correctIndex: 1 },
          { question: "Que signifie 'mwaddaf' ?", options: ["Artisan", "Chauffeur", "Fonctionnaire", "Paysan"], correctIndex: 2 },
        ],
      },
      {
        id: "9-2",
        title: "Au travail - vocabulaire de bureau",
        titleAr: "فِالخِدْمَة - مُفْرَدَاتُ المَكْتَبِ",
        description: "Le vocabulaire essentiel pour travailler dans un bureau au Maroc.",
        duration: "6 min",
        vocabulary: [
          { french: "réunion", phonetic: "l-jtima3", arabic: "الجْتِمَاع" },
          { french: "e-mail / courriel", phonetic: "l-mail / imayl", arabic: "المَيْل", notes: "On utilise le terme anglais" },
          { french: "ordinateur", phonetic: "l-ordinatur", arabic: "الأُورْدِينَاتُور" },
          { french: "téléphone", phonetic: "t-lifun", arabic: "التِّلِيفُون" },
          { french: "document", phonetic: "wariqa / wasiqa", arabic: "وَرِيقَة / وَثِيقَة" },
          { french: "salaire", phonetic: "l-mrtab", arabic: "المُرَتَّب", notes: "Le salaire mensuel (l-mrtab = vrai darija, pas l-mra7)" },
          { french: "congé", phonetic: "congé / r-ra7a", arabic: "الكُونْجِي / الرَّاحَة", notes: "'r-ra7a' = le repos/vacances" },
          { french: "chef de projet", phonetic: "masul l-mashru3", arabic: "مَسْؤُول المَشْرُوع" },
          { french: "délai / échéance", phonetic: "l-ajal", arabic: "الأَجَل" },
          { french: "collègue de travail", phonetic: "zamil l-khedma", arabic: "زَمِيل الخِدْمَة" },
        ],
        phrases: [
          { french: "Il y a une réunion à 10h", phonetic: "kayn jtima3 sa3a 3ashra", arabic: "كَايِن جْتِمَاع سَاعَة عَشَرَة", context: "Au bureau" },
          { french: "Envoie-moi un e-mail", phonetic: "rsel liyya email", arabic: "رْسِل لِيَّ مَيْل", context: "Demande de communication" },
          { french: "Le salaire est bon", phonetic: "l-mrtab mzyan", arabic: "المُرَتَّب مْزْيَان", context: "Parler de la rémunération" },
          { french: "Je veux un congé", phonetic: "bghit conge", arabic: "بَغِيت كُونْجِي", context: "Demander un congé" },
          { french: "Le délai est demain", phonetic: "l-ajal ghadda", arabic: "الأَجَل غَدَّا", context: "Date limite" },
        ],
        grammar: `**Le vocabulaire de bureau :**

Beaucoup de termes de bureau au Maroc sont empruntés au français :
- Email, conge, bureau, meeting, ordinateur, internet...

**Les expressions de travail :**
- **Kan-khedem f-l-maktab** = je travaille au bureau
- **Kan-rsal l-mail** = j'envoie un e-mail
- **Kan-shurik f-l-jtima3** = je participe à la réunion
- **L-mra7 dyali...** = mon salaire est...

Note : Le darija de bureau au Maroc mélange souvent darija et français.`,
        tips: [
          "Le français est très utilisé dans le monde professionnel marocain, surtout dans les grandes entreprises.",
          "Les réunions commencent souvent en retard au Maroc. Soyez patient !",
          "Le 'congé annuel' est généralement de 18 jours ouvrables par an.",
          "Le Maroc a une culture de travail relationnelle : les relations personnelles sont importantes.",
        ],
        quiz: [
          { question: "Comment dit-on 'réunion' en darija ?", options: ["l-khedma", "l-maktab", "l-jtima3", "l-ajal"], correctIndex: 2 },
          { question: "Que signifie 'l-mrtab' ?", options: ["Congé", "Salaire", "Réunion", "Document"], correctIndex: 1 },
          { question: "Comment dit-on 'ordinateur' en darija ?", options: ["t-lifun", "l-mail", "l-ordinatur", "l-jtima3"], correctIndex: 2 },
          { question: "Comment dit-on 'salaire' en darija ?", options: ["khedma", "mrtab", "conge", "wariqa"], correctIndex: 1 },
          { question: "Que signifie 'zamil l-khedma' ?", options: ["Chef", "Client", "Collègue", "Stagiaire"], correctIndex: 2 },
        ],
      },
      {
        id: "9-3",
        title: "Chercher un emploi",
        titleAr: "البَحْثُ عَنِ الشُّغْلِ",
        description: "Le vocabulaire et les expressions pour chercher un emploi au Maroc.",
        duration: "6 min",
        vocabulary: [
          { french: "trouver un travail", phonetic: "n-lqa khedma", arabic: "نَلْقَى خِدْمَة" },
          { french: "CV / curriculum vitae", phonetic: "s-siyada", arabic: "السِّيَادَة", notes: "Mot arabe pour CV" },
          { french: "entretien d'embauche", phonetic: "l-muqabala", arabic: "المُقَابَلَة" },
          { french: "expérience", phonetic: "l-tajriba", arabic: "التَّجْرِبَة" },
          { french: "diplôme", phonetic: "l-shahada", arabic: "الشَّهَادَة" },
          { french: "embaucher / recruter", phonetic: "kheddem", arabic: "خَدَّمَ", notes: "Employer quelqu'un" },
          { french: "stagiaire", phonetic: "stajyer / mutadrib", arabic: "سْتَاجْيَر / مُتَدَرِّب" },
          { french: "chômage", phonetic: "l-batala", arabic: "البَطَالَة" },
          { french: "annonce d'emploi", phonetic: "2lan khedma", arabic: "إِعْلَان خِدْمَة" },
          { french: "réseaux sociaux", phonetic: "l-mujtima3at", arabic: "المُجْتَمَعَات", notes: "LinkedIn est utilisé au Maroc" },
        ],
        phrases: [
          { french: "Je cherche du travail", phonetic: "kan-lqa khedma", arabic: "كَنْلْقَى خِدْمَة", context: "Dire qu'on cherche un emploi (litt. : je veux trouver)" },
          { french: "J'ai envoyé mon CV", phonetic: "rselt s-siyada dyali", arabic: "رْسَلْت السِّيَادَة دْيَالِي", context: "Après avoir postulé" },
          { french: "J'ai un entretien demain", phonetic: "3ndi muqabala ghadda", arabic: "عَنْدِي مُقَابَلَة غَدَّا", context: "Programme d'entretien" },
          { french: "Quelle est votre expérience ?", phonetic: "shnu t-tajriba dyalek ?", arabic: "شْنُو التَّجْرِبَة دْيَالَكْ ؟", context: "Question d'entretien" },
          { french: "Le salaire demandé est...", phonetic: "l-mrtab l-matlob...", arabic: "المُرَتَّب المَطْلُوب...", context: "Négocier le salaire" },
        ],
        grammar: `**Chercher un emploi :**

- **Kan-lqa khedma** = je cherche (de) du travail
- **Kan-lqa khedma f-...** = je cherche du travail dans...
- **3ndi shahada f-...** = j'ai un diplôme en...
- **3ndi tajriba f-...** = j'ai de l'expérience en...

**Les questions d'entretien :**
- **Kifash 3raft l-ma3lumat ?** = Comment avez-vous connu l'offre ?
- **3la shnu kat-khedem ?** = Dans quoi travaillez-vous ?
- **Sh7al t-bghi l-mrtab ?** = Combien de salaire souhaitez-vous ?

**Répondre :**
- **3ndi khams snin d-tajriba** = j'ai 5 ans d'expérience
- **Kan-khedem b-shi maghrib** = je travaille dans quelque chose (pour être discret)`,
        tips: [
          "LinkedIn et ReKrute sont les plateformes principales pour chercher un emploi au Maroc.",
          "Le networking (relations personnelles) est très important pour trouver un emploi au Maroc.",
          "Les diplômes français sont très valorisés sur le marché marocain.",
          "Il est courant de demander l'âge et la situation familiale lors d'un entretien au Maroc.",
        ],
        quiz: [
          { question: "Comment dit-on 'je cherche du travail' ?", options: ["bghit khedma", "kan-lqa khedma", "3ndi khedma", "kan-khedem"], correctIndex: 1 },
          { question: "Que signifie 's-siyada' ?", options: ["Diplôme", "CV", "Entretien", "Stage"], correctIndex: 1 },
          { question: "Comment dit-on 'entretien d'embauche' ?", options: ["s-siyada", "l-tajriba", "l-muqabala", "l-shahada"], correctIndex: 2 },
          { question: "Que signifie 'l-batala' ?", options: ["Travail", "Diplôme", "Chômage", "Salaire"], correctIndex: 2 },
          { question: "Comment dit-on 'expérience' en darija ?", options: ["shahada", "tajriba", "muqabala", "siyada"], correctIndex: 1 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 10: Culture et traditions (B1.1)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 10,
    title: "Culture et traditions",
    titleAr: "الثَّقَافَةُ وَالتَّقَالِيدُ",
    description: "Plongez dans la culture marocaine : fêtes, cuisine et artisanat.",
    cefrLevel: "B1.1",
    icon: "🕌",
    color: "from-teal-500 to-cyan-600",
    lessons: [
      {
        id: "10-1",
        title: "Les fêtes et célébrations marocaines",
        titleAr: "الأَعْيَادُ وَالحَفَلَاتُ المَغْرِبِيَّةُ",
        description: "Les fêtes religieuses et nationales les plus importantes au Maroc.",
        duration: "7 min",
        vocabulary: [
          { french: "fête / célébration", phonetic: "3id / l-3id", arabic: "العِيد / العِيد", notes: "Fête religieuse ou nationale" },
          { french: "Aid el-Fitr", phonetic: "3id l-fitr", arabic: "عِيد الفِطْر", notes: "Fin du Ramadan" },
          { french: "Aid el-Kebir", phonetic: "3id l-kbir", arabic: "عِيد الكَبِير", notes: "Fête du sacrifice" },
          { french: "Ramadan", phonetic: "ramdan", arabic: "رَمَضَانُ", notes: "Mois de jeûne" },
          { french: "jeûne / prière nocturne", phonetic: "s-siyam / l-qiyam", arabic: "الصِّيَام / القِيَام" },
          { french: "ftour (rupture du jeûne)", phonetic: "l-ftur", arabic: "الفُطُور", notes: "Repas de rupture du Ramadan" },
          { french: "Fête du Trône", phonetic: "3id l-3arch", arabic: "عِيد العَرْش", notes: "30 juillet, fête nationale" },
          { french: "moudawana (code de la famille)", phonetic: "l-moudawana", arabic: "المَدَوَنَة", notes: "Code de la famille marocain. '3id l-mra' = fête des femmes" },
          { french: "noce / mariage", phonetic: "l-3rsa", arabic: "العُرْسَة", notes: "Les mariages marocains durent plusieurs jours" },
          { french: "congratulations", phonetic: "bravou / mabrouk", arabic: "بْرَافُو / مَبْرُوك", notes: "Se dit pour toutes les bonnes nouvelles" },
        ],
        phrases: [
          { french: "Ramadan moubarak !", phonetic: "ramdan mubarak !", arabic: "رَمَضَان مُبَارَك !", context: "Salutation pendant le Ramadan" },
          { french: "3id moubarak !", phonetic: "3id mubarak !", arabic: "عِيد مُبَارَك !", context: "Salutation de fête" },
          { french: "Bonne année !", phonetic: "3am sa3id !", arabic: "عَام سَعِيد !", context: "Nouvel an (hégirien)" },
          { french: "Je vous félicite !", phonetic: "bravou likum !", arabic: "بْرَافُو لِكُم !", context: "Pour une bonne nouvelle" },
          { french: "Qu'est-ce qu'on mange pour le ftour ?", phonetic: "ash kayn f-l-ftur ?", arabic: "أَش كَايِن فِالفْطُور ؟", context: "Pendant le Ramadan" },
          { french: "C'est un grand jour", phonetic: "had nhar kbir", arabic: "هَاد نَهَار كَبِير", context: "Jour de fête" },
        ],
        grammar: `**Les fêtes marocaines :**

Fêtes religieuses :
- **Ramadan** : mois de jeûne, rythme de vie modifié
- **3id l-Fitr** : fin du Ramadan, 3 jours de fête
- **3id l-Kbir** : fête du sacrifice (mouton), 3 jours

Fêtes nationales :
- **3id l-3arch** (30 juillet) : Fête du Trône
- **1er mai** : Fête du Travail
- **3id l-Dustur** : Fête de la Constitution

Expressions :
- **Ramadan moubarak** = bon Ramadan
- **3id mubarak** = bonne fête
- **Mabrouk** = félicitations (utilisé pour TOUT : mariage, nouveau travail, nouvel enfant...)
- **Bravou** = bravo / félicitations`,
        tips: [
          "Pendant le Ramadan, les restaurants sont fermés le jour mais ouvrent le soir pour le ftour.",
          "Dire 'mabrouk' est la chose la plus poli à faire pour toute bonne nouvelle.",
          "Les mariages marocains durent 3 à 7 jours ! Ils sont de grandes célébrations familiales.",
          "Pendant le Ramadan, évitez de manger en public pendant la journée par respect.",
        ],
        quiz: [
          { question: "Quelle est la fête de fin du Ramadan ?", options: ["3id l-kbir", "3id l-fitr", "3id l-3arch", "ramdan"], correctIndex: 1 },
          { question: "Que signifie 'mabrouk' ?", options: ["Au revoir", "Merci", "Félicitations", "Pardon"], correctIndex: 2 },
          { question: "Comment dit-on 'bon Ramadan' ?", options: ["3id mubarak", "ramdan mubarak", "lila mbarka", "3am sa3id"], correctIndex: 1 },
          { question: "Que signifie 'l-ftur' pendant le Ramadan ?", options: ["Le repas du matin", "La rupture du jeûne", "La prière", "Le dîner"], correctIndex: 1 },
          { question: "La fête du Trône est le...", options: ["1er janvier", "30 juillet", "1er mai", "1er novembre"], correctIndex: 1 },
        ],
      },
      {
        id: "10-2",
        title: "La cuisine traditionnelle marocaine",
        titleAr: "المَطْبَخُ التَّقْلِيدِيُّ المَغْرِبِيُّ",
        description: "Découvrez les recettes et ingrédients de la cuisine marocaine.",
        duration: "7 min",
        vocabulary: [
          { french: "cuisine / cuisiner", phonetic: "l-makhla / t-khel3", arabic: "المَخْلَة / تَخْلَع", notes: "T-khel3 = tu cuisines" },
          { french: "couscous", phonetic: "ksksu", arabic: "الكُسْكُسُ", notes: "Patrimoine culturel immatériel UNESCO" },
          { french: "pastilla", phonetic: "b-stila", arabic: "البَسْتِيلَة" },
          { french: "méchoui", phonetic: "mshwi", arabic: "المَشْوِي" },
          { french: "harissa", phonetic: "l-harissa", arabic: "الهَرِيسَة", notes: "Pâte pimentée" },
          { french: "épices", phonetic: "t-tawabil", arabic: "التَّوَابِيل" },
          { french: "safran", phonetic: "z-za3fran", arabic: "الزَّعْفَرَان", notes: "L'or rouge, très cher" },
          { french: "cannelle", phonetic: "l-qarfa", arabic: "القَرْفَة" },
          { french: "cumin", phonetic: "l-kamun", arabic: "الكَمُّون" },
          { french: "menthe", phonetic: "n-na3na3", arabic: "النَّعْنَاع" },
        ],
        phrases: [
          { french: "Ta mère cuisine bien !", phonetic: "yemma dyalak t-khel3 mzyan !", arabic: "يَمَّة دْيَالَك تَخْلَع مْزْيَان !", context: "Compliment sur la cuisine" },
          { french: "Qu'est-ce qu'il y a à manger ?", phonetic: "ash kayn d-l-makla ?", arabic: "أَش كَايِن دِلْمَاكِلَة ؟", context: "Arriver à la maison" },
          { french: "Cette tajine est délicieuse", phonetic: "had tajin bnin bzzaf", arabic: "هَاد طَاجِين بَنِين بْزَاف", context: "Complimenter un plat (bnin = masculin, pas bnina)" },
          { french: "Je veux la recette", phonetic: "bghit tarika dyalha", arabic: "بَغِيت طَرِيقَة دْيَالْهَا", context: "Demander une recette" },
          { french: "On mange à la maison ce soir", phonetic: "ghadi n-koulu f-l-dar l-lela", arabic: "غَادِي نَكُولُو فِالدَّار اللَّيْلَة", context: "Planifier un repas" },
        ],
        grammar: `**La cuisine marocaine :**

La cuisine marocaine est l'une des plus riches au monde. Les ingrédients de base :
- Épices : cumin, cannelle, safran, gingembre, curcuma
- Huile d'olive
- Citron confit
- Olives
- Miel et amandes

**Les plats incontournables :**
- **Tajine** : ragoût en terre cuite (poulet, viande, poisson, légumes)
- **Couscous** : semoule vapeur, traditionnellement le vendredi
- **Harira** : soupe de Ramadan
- **Pastilla** : feuilleté sucré-salé
- **Méchoui** : agneau grillé au four
- **Tanjiya** : spécialité de Marrakech`,
        tips: [
          "Le couscous est préparé à la vapeur deux fois pour obtenir la texture parfaite.",
          "Chaque région du Maroc a ses spécialités : tanjiya (Marrakech), rfissa (Rabat), seffa (Fès)...",
          "Les épices sont le secret de la cuisine marocaine. Visitez un souk aux épices !",
          "Dire 'bismillah' avant de manger et 'bnin' après est la politesse de base.",
        ],
        quiz: [
          { question: "Quel est le plat national du Maroc ?", options: ["Couscous", "Tajine", "Pizza", "Riz"], correctIndex: 1 },
          { question: "Que signifie 't-khel3' ?", options: ["Manger", "Boire", "Cuisiner", "Dormir"], correctIndex: 2 },
          { question: "Quelle épice est très chère au Maroc ?", options: ["Cumin", "Safran", "Cannelle", "Poivre"], correctIndex: 1 },
          { question: "Le plat traditionnel du vendredi est...", options: ["Pastilla", "Harira", "Couscous", "Tajine"], correctIndex: 2 },
          { question: "Que signifie 'l-na3na3' ?", options: ["Cannelle", "Safran", "Menthe", "Cumin"], correctIndex: 2 },
        ],
      },
      {
        id: "10-3",
        title: "L'artisanat et les coutumes",
        titleAr: "الحِرْفَةُ وَالعَادَاتُ",
        description: "L'artisanat marocain et les coutumes du quotidien.",
        duration: "6 min",
        vocabulary: [
          { french: "artisanat", phonetic: "s-sna3a", arabic: "الصِّنَاعَة" },
          { french: "zellige (mosaïque)", phonetic: "z-llij", arabic: "الزَّلِيج", notes: "Mosaïque marocaine" },
          { french: "tapis", phonetic: "z-zarbiya", arabic: "الزَّرْبِيَّة", notes: "Tapis berbère marocain" },
          { french: "cuir", phonetic: "l-jld", arabic: "الجِلْد" },
          { french: "poterie", phonetic: "l-fakhkhar", arabic: "الفَخَّار", notes: "L'artisanat de la poterie" },
          { french: "bijoux", phonetic: "l-hwayj / l-mjawher", arabic: "الحُلِيّ / المَجْوْهَرَات", notes: "Bijoux en argent ou or" },
          { french: "argan (huile)", phonetic: "z-zit d-argan", arabic: "زَيْت الأَرْغَان" },
          { french: "henné", phonetic: "l-7anna", arabic: "الحِنَّاء", notes: "Utilisé pour les mariages et fêtes" },
          { french: "hammam", phonetic: "l-7ammam", arabic: "الحَمَّام", notes: "Bain traditionnel" },
          { french: "coutume / tradition", phonetic: "l-3ada", arabic: "العَادَة" },
        ],
        phrases: [
          { french: "Ce tapis est magnifique", phonetic: "had z-zarbiya 3ajiba !", arabic: "هَاد الزَّرْبِيَّة عَجِيبَة !", context: "Au souk" },
          { french: "C'est fait main ?", phonetic: "sna3a d-yadd ?", arabic: "صِنَاعَة دِيَّال يَد", context: "Demander si c'est artisanal" },
          { french: "Je vais au hammam", phonetic: "kan-mshi l-l-7ammam", arabic: "كَنْمْشِي لِلْحَمَّام", context: "Tradition hebdomadaire" },
          { french: "L'huile d'argan est bonne pour la peau", phonetic: "z-zit d-argan mzyan l-l-jld", arabic: "زَيْت الأَرْغَان مْزْيَان لِلْجِلْد", context: "Cosmétique marocaine" },
          { french: "C'est une tradition marocaine", phonetic: "hadchi 3ada maghribiya", arabic: "هَادَ الشِّيء عَادَة مَغْرِبِيَّة", context: "Expliquer une coutume" },
        ],
        grammar: `**L'artisanat marocain :**

Le Maroc est réputé pour son artisanat riche et varié :
- **Zellige** : mosaïque géométrique (Fès, Marrakech)
- **Zarbiya** : tapis berbères (Atlas, Marrakech)
- **Jld** : maroquinerie (Fès)
- **Fakhkhar** : poterie (Safi)
- **7waj** : bijoux (Tiznit, Essaouira)
- **Zit argan** : huile d'argan (Souss)

**Le hammam :**
Tradition hebdomadaire au Maroc. On y va pour :
- Se nettoyer profondément
- Se détendre
- Rencontrer des amis
- Préparer sa peau (gommage au savon noir)`,
        tips: [
          "Le hammam est une expérience culturelle à vivre absolument au Maroc. Allez-y le vendredi matin !",
          "Les tapis berbères sont un excellent investissement et souvenir. Marchandez toujours.",
          "L'huile d'argan est produite uniquement au Maroc. Elle est utilisée en cuisine et en cosmétique.",
          "Le henné est appliqué lors des mariages, fêtes et même pour les touristes dans la médina.",
        ],
        quiz: [
          { question: "Qu'est-ce que le 'zellige' ?", options: ["Tapis", "Mosaïque", "Bijoux", "Poterie"], correctIndex: 1 },
          { question: "Que signifie 'l-7ammam' ?", options: ["Mosquée", "Marché", "Bain traditionnel", "Restaurant"], correctIndex: 2 },
          { question: "L'huile d'argan vient de...", options: ["Fès", "Rabat", "Souss", "Tanger"], correctIndex: 2 },
          { question: "Que signifie 'sna3a d-yadd' ?", options: ["Fait en Chine", "Fait main", "Fait en série", "De mauvaise qualité"], correctIndex: 1 },
          { question: "Quelle ville est réputée pour ses tapis ?", options: ["Tanger", "Marrakech", "Casablanca", "Agadir"], correctIndex: 1 },
        ],
      },
      {
        id: "10-4",
        title: "La musique et les expressions artistiques",
        titleAr: "المُوسِيقَى وَالتَّعْبِيرَاتُ الفَنِّيَّة",
        description: "Découvrez la richesse musicale et artistique du Maroc : gnawa, chaâbi et traditions poétiques.",
        duration: "7 min",
        vocabulary: [
          { french: "musique", phonetic: "l-musiqa", arabic: "المُوسِيقَى" },
          { french: "chanson", phonetic: "l-ghina", arabic: "الغِنَاء", notes: "Pluriel : 3ghan" },
          { french: "gnawa (musique rituelle)", phonetic: "l-gnawa", arabic: "الغِنَاوَة", notes: "Genre musical d'origine subsaharienne, classé UNESCO" },
          { french: "chaâbi (populaire)", phonetic: "sh-sha3bi", arabic: "الشَّعْبِي", notes: "Musique populaire marocaine par excellence" },
          { french: "derbouka (tambourin)", phonetic: "d-darbuka", arabic: "الدَّرْبُوكَة", notes: "Instrument de percussion incontournable" },
          { french: "guembri (luth gnawa)", phonetic: "l-ganbri", arabic: "الگَنْبِري", notes: "Instrument à cordes des Gnawa, en peau de chameau" },
          { french: "poésie", phonetic: "sh-shi3r", arabic: "الشِّعْر", notes: "La poésie est profondément ancrée dans la culture marocaine" },
          { french: "artiste", phonetic: "fannan / fannana", arabic: "فَنَّان / فَنَّانَة" },
          { french: "danse", phonetic: "r-rqsa", arabic: "الرَّقْصَة", notes: "Chaque région a sa danse traditionnelle" },
          { french: "soirée musicale", phonetic: "l-lila", arabic: "اللَّيْلَة", notes: "En darija, 'lila' désigne une soirée festive avec musique" },
        ],
        phrases: [
          { french: "J'adore la musique gnawa", phonetic: "kanbghi l-musiqa d-gnawa bzzaf", arabic: "كَنْبْغِي المُوسِيقَى دِلْغِنَاوَة بْزَاف", context: "Exprimer un goût musical" },
          { french: "Tu joues d'un instrument ?", phonetic: "kat-l3b 3la shi aala ?", arabic: "كَتْلَعَب عَلَى شِي آلَة ؟", context: "Demander si quelqu'un est musicien" },
          { french: "Cette chanson me rappelle mon enfance", phonetic: "had l-ghina t-khyyelni b-s-sghira", arabic: "هَاد الغِنَاء تُخَيِّلنِي بِالصَّغِيرَة", context: "Exprimer de la nostalgie" },
          { french: "La musique chaâbi est la plus écoutée", phonetic: "sh-sha3bi ahsen l-musiqa f-l-maghrib", arabic: "الشَّعْبِي أَحْسَن المُوسِيقَى فِالمَغْرِب", context: "Exprimer une préférence culturelle" },
          { french: "On va à un festival à Essaouira", phonetic: "ghadi n-mshiu l-l-mawsim f suwira", arabic: "غَادِي نَمْشِيو لِلْمَوْسِم فِ سَوِيرَة", context: "Parler d'un événement culturel" },
          { french: "Qui est ton artiste préféré ?", phonetic: "chnu l-fannan l-mafaddel 3lik ?", arabic: "شْنُو الفَنَّان المُفَضَّل عَلِيكْ ؟", context: "Poser une question sur les goûts" },
        ],
        grammar: `**Les genres musicaux marocains :**

Le Maroc possède une scène musicale extrêmement riche et diversifiée :
- **Gnawa** (الغناوة) : musique rituelle d'origine subsaharienne, liée aux descendants d'esclaves. L'instrument principal est le ganbri (كَنْبِري). Le festival d'Essaouira lui est dédié.
- **Chaâbi** (الشعبي) : musique populaire urbaine, née dans les médinas. Chants festifs, souvent accompagnés de derbouka et de luth.
- **Malhun** (الملهون) : poésie chantée savante, très ancienne.
- **Raï** : musique moderne originaire d'Oran (Algérie), très populaire au Maroc aussi.
- **Amazigh** : musique berbère avec des instruments comme le lotar (لُوطَار).

**Instruments traditionnels :**
- **Ganbri** (گَنْبِري) : luth à 3 cordes des Gnawa
- **Darbuka** (دَرْبُوكَة) : tambourin en terre cuite
- **Lotar** (لُوطَار) : luth berbère à 4 cordes
- **Taarija** (طَارِيجَة) : petit tambourin en terre cuite

**Verbe « jouer d'un instrument » :**
- **Kat-l3b 3la...** = tu joues de... (litt. "tu joues sur...")
- **Kan-l3b 3la d-darbuka** = je joue de la derbouka`,
        tips: [
          "Le festival Gnawa d'Essaouira (juin) est l'un des plus grands festivals musicaux d'Afrique.",
          "Le malhun est considéré comme la poésie noble du Maroc. Les maîtres sont très respectés.",
          "Assister à une 'lila gnawa' (veillée gnawa) est une expérience spirituelle et musicale unique.",
          "La musique est omniprésente au Maroc : dans les cafés, les souks, les fêtes et même dans la rue.",
        ],
        quiz: [
          { question: "Qu'est-ce que le 'gnawa' ?", options: ["Un plat", "Un genre musical rituel", "Un instrument", "Une danse"], correctIndex: 1 },
          { question: "Quel est l'instrument principal des Gnawa ?", options: ["La derbouka", "Le piano", "Le ganbri", "Le violon"], correctIndex: 2 },
          { question: "Comment dit-on 'chanson' en darija ?", options: ["aala", "l-ghina", "l-musiqa", "l-rqsa"], correctIndex: 1 },
          { question: "Que signifie 'sh-sha3bi' ?", options: ["Musique classique", "Musique populaire", "Musique religieuse", "Musique moderne"], correctIndex: 1 },
          { question: "Que désigne 'l-lila' en darija ?", options: ["La nuit", "Une soirée festive", "Le matin", "Le soir"], correctIndex: 1 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 11: Conversations sociales (B1.1)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 11,
    title: "Conversations sociales",
    titleAr: "المُحَادَثَاتُ الاِجْتِمَاعِيَّة",
    description: "Exprimez votre opinion, racontez des histoires et parlez de vos projets.",
    cefrLevel: "B1.1",
    icon: "💬",
    color: "from-fuchsia-500 to-pink-600",
    lessons: [
      {
        id: "11-1",
        title: "Exprimer son opinion",
        titleAr: "التَّعْبِيرُ عَنِ الرَّأْيِ",
        description: "Apprenez à donner votre avis et à discuter en darija.",
        duration: "7 min",
        vocabulary: [
          { french: "je pense / mon avis", phonetic: "kandham", arabic: "كَنْدْهَم", notes: "Kandhdam = je pense (litt. je réfléchis)" },
          { french: "je crois / je pense", phonetic: "kan-shuf", arabic: "كَنْشُوف", notes: "Litt. 'je vois'" },
          { french: "peut-être", phonetic: "ybqash", arabic: "يِبْقَاش" },
          { french: "selon moi", phonetic: "3la 7sabi", arabic: "عَلَى حِسَابِي" },
          { french: "d'accord", phonetic: "mzyan / wa3i", arabic: "مْزْيَان / وَاعِي" },
          { french: "pas d'accord", phonetic: "ma-3ndish l-muwafiq", arabic: "مَا عَنْدِيش المُوَافَق" },
          { french: "c'est vrai", phonetic: "s-s7i / 7aqq", arabic: "الصَّحِي / الحَقّ" },
          { french: "c'est faux", phonetic: "ma-s-s7ich", arabic: "مَا الصَّحِيش" },
          { french: "je préfère", phonetic: "kan-faddel", arabic: "كَنْفَضَّل" },
          { french: "pourquoi", phonetic: "3lash", arabic: "عَلَاش", notes: "Question essentielle en darija" },
        ],
        phrases: [
          { french: "Je pense que c'est bien", phonetic: "kandham annu mzyan", arabic: "كَنْدْهَم أَنُّو مْزْيَان", context: "Donner son avis positif" },
          { french: "Tu es d'accord ?", phonetic: "nta m3aya ?", arabic: "نْتَا مَعَايَا ؟", context: "Demander l'avis" },
          { french: "Selon moi, c'est mieux", phonetic: "3la 7sabi, hadshi ahsen", arabic: "عَلَى حِسَابِي هَادَ الشِّيء أَحْسَن", context: "Exprimer une préférence" },
          { french: "Je ne suis pas d'accord", phonetic: "ma-kan-shi m3ak", arabic: "مَا كَنْشِي مَعَاك", context: "Désaccord poli" },
          { french: "Pourquoi tu dis ça ?", phonetic: "3lash kat-gul hadshi ?", arabic: "عَلَاش كَتْقُول هَادَ الشِّيء ؟", context: "Demander des explications" },
          { french: "C'est vrai, je suis d'accord", phonetic: "s-s7i, ana m3ak", arabic: "الصَّحِي أَنَا مَعَاك", context: "Valider un argument" },
        ],
        grammar: `**Exprimer son opinion :**

- **Kandhdam annu...** = je pense que...
- **Kan-shuf annu...** = je crois que...
- **3la 7sabi...** = selon moi...
- **Kan-faddel...** = je préfère...

**D'accord / Pas d'accord :**
- **Mzyan** / **Wa3i** = d'accord
- **S-s7i** = c'est vrai
- **7aqq** = c'est vrai / c'est juste
- **Ma-s-s7ich** = c'est faux
- **Ma-kan-shi m3ak** = je ne suis pas d'accord

**La question 'pourquoi' :**
- **3lash ?** = pourquoi ?
- **3lash kat-gul hadshi ?** = pourquoi tu dis ça ?
- **3lash ma-bghitish ?** = pourquoi tu ne veux pas ?`,
        tips: [
          "Les Marocains aiment débattre et discuter. Exprimer votre opinion est toujours bienvenu.",
          "Commencer par 'kandham annu...' est la façon la plus polie de donner son avis.",
          "Dire '3la 7sabi' (selon moi) est plus diplomate que de présenter son avis comme vérité.",
          "Le mot '3lash' (pourquoi) est l'un des mots les plus utilisés en darija !",
        ],
        quiz: [
          { question: "Comment dit-on 'je pense que...' ?", options: ["kan-shuf annu", "kandham annu", "kan-faddel", "3la 7sabi"], correctIndex: 1 },
          { question: "Que signifie '3lash' ?", options: ["Quand", "Comment", "Pourquoi", "Où"], correctIndex: 2 },
          { question: "Comment dit-on 'je ne suis pas d'accord' ?", options: ["s-s7i", "ma-kan-shi m3ak", "mzyan", "7aqq"], correctIndex: 1 },
          { question: "Que signifie 'ybqash' ?", options: ["Sûrement", "Jamais", "Peut-être", "Toujours"], correctIndex: 2 },
          { question: "Comment dit-on 'je préfère' en darija ?", options: ["kandham", "kan-shuf", "kan-faddel", "kan-bghi"], correctIndex: 2 },
        ],
      },
      {
        id: "11-2",
        title: "Raconter une histoire au passé",
        titleAr: "السَّرْدُ فِالْمَاضِي",
        description: "Apprenez à utiliser le passé pour raconter des événements.",
        duration: "7 min",
        vocabulary: [
          { french: "hier", phonetic: "imbarih", arabic: "إِمْبَارِيح" },
          { french: "avant-hier", phonetic: "juj imbarih", arabic: "جُوج إِمْبَارِيح" },
          { french: "la semaine dernière", phonetic: "s-semana li fatet", arabic: "السُّبُوع الَّتِي فَاتَتْ" },
          { french: "le mois dernier", phonetic: "sh-shher li fat", arabic: "الشَّهْر الَّذِي فَاتَ" },
          { french: "quand j'étais petit(e)", phonetic: "mlli knt sghir", arabic: "مَلِّي كُنْت صْغِير" },
          { french: "avant", phonetic: "qbal", arabic: "قَبْل" },
          { french: "après", phonetic: "b3ad", arabic: "بَعْد" },
          { french: "souvenir / se rappeler", phonetic: "t-dhakr", arabic: "تَذْكَر" },
          { french: "une fois / une journée", phonetic: "mara / nhar", arabic: "مَرَّة / نَهَار" },
          { french: "soudain / tout d'un coup", phonetic: "f-bla sa3a", arabic: "فِبَلَا سَاعَة" },
        ],
        phrases: [
          { french: "Hier je suis allé au marché", phonetic: "imbarih mshit l-s-suq", arabic: "إِمْبَارِيح مْشِيت لِلسُّوق", context: "Raconter au passé" },
          { french: "Qu'est-ce qui s'est passé ?", phonetic: "ash 7edra ?", arabic: "أَش حَدْرَا ؟", context: "Demander ce qui s'est passé" },
          { french: "Quand j'étais petit, je vivais à Fès", phonetic: "mlli knt sghir, knt knes f fas", arabic: "مَلِّي كُنْت صْغِير كُنْت كَنِيس فِ فَاس", context: "Parler de son enfance" },
          { french: "Tout d'un coup, il a commencé à pleuvoir", phonetic: "f-bla sa3a, bdal t-mtir", arabic: "فِبَلَا سَاعَة بَدَل يَمْطِر", context: "Raconter un événement inattendu" },
          { french: "Tu te souviens ?", phonetic: "t-dhakr ?", arabic: "تَذْكَر ؟", context: "Rappeler un souvenir" },
          { french: "C'était il y a longtemps", phonetic: "kan sna twila", arabic: "كَانَ سَنَة طَوِيلَة", context: "Situier dans le temps" },
        ],
        grammar: `**Le passé en darija :**

Le passé se forme de différentes façons :

1. **Verbe au passé (knt + verbe) :**
- **Knt mshit** = j'étais allé / je suis allé
- **Knt kelt** = j'étais dit / j'ai dit
- **Knt 3tini** = j'étais donné / j'ai donné

2. **Participe passé + « kan » :**
- **Kan mshi** = il est allé (passé composé)
- **Kan jehed** = il a travaillé

3. **Expressions temporelles passées :**
- **Imbarih** = hier
- **Juj imbarih** = avant-hier
- **Mlli knt sghir** = quand j'étais petit
- **S-semana li fatet** = la semaine dernière`,
        tips: [
          "Le darija n'a pas de temps composé strict comme en français. On utilise 'knt' + participe.",
          "'Mlli knt sghir' est l'expression parfaite pour raconter son enfance.",
          "Les Marocains adorent raconter des histoires. Soyez un bon auditeur !",
          "Pour dire 'c'était bien', utilisez 'kan mzyan'.",
        ],
        quiz: [
          { question: "Comment dit-on 'hier' en darija ?", options: ["ghadda", "be-daba", "imbarih", "imta"], correctIndex: 2 },
          { question: "Comment dit-on 'avant-hier' ?", options: ["imbarih", "juj imbarih", "ghadda", "l-yum"], correctIndex: 1 },
          { question: "Que signifie 'ash 7edra' ?", options: ["Qu'est-ce que tu veux ?", "Qu'est-ce qui s'est passé ?", "Quand ?", "Comment ?"], correctIndex: 1 },
          { question: "Comment dit-on 'quand j'étais petit' ?", options: ["mlli knt kbir", "mlli knt sghir", "mlli knt mzyan", "mlli knt mrid"], correctIndex: 1 },
          { question: "Comment forme-t-on le passé ?", options: ["kan + verbe", "ghadi + verbe", "bghit + verbe", "ma + verbe + sh"], correctIndex: 0 },
        ],
      },
      {
        id: "11-3",
        title: "Parler de ses projets futurs",
        titleAr: "الحَدِيثُ عَنِ المَشَارِيعِ المُسْتَقْبَلِيَّةِ",
        description: "Exprimer vos plans, souhaits et projets pour l'avenir.",
        duration: "6 min",
        vocabulary: [
          { french: "projet", phonetic: "mashru3", arabic: "مَشْرُوع" },
          { french: "avenir / futur", phonetic: "l-mostaqbl", arabic: "المُسْتَقْبَل" },
          { french: "souhait / désir", phonetic: "l-amal / r-rajaa", arabic: "الأَمَل / الرَّجَاء" },
          { french: "espérer", phonetic: "n-tmanna", arabic: "نَتَمَنَّى" },
          { french: "espérance (incha'Allah)", phonetic: "nchallah", arabic: "إِنْ شَاءَ اللّٰه", notes: "Très utilisé pour le futur" },
          { french: "objectif / but", phonetic: "l-hadaf", arabic: "الهَدَف" },
          { french: "réussir", phonetic: "n-najeh", arabic: "نَنْجَح" },
          { french: "essayer", phonetic: "n-jarreb", arabic: "نُجَرِّب" },
          { french: "décider", phonetic: "n-qarrer", arabic: "نَقَرِّر" },
          { french: "bientôt", phonetic: "qrib", arabic: "قَرِيب", notes: "Dans un avenir proche" },
        ],
        phrases: [
          { french: "Un jour, je visiterai Fès", phonetic: "nhar n-zur fas", arabic: "نَهَار نَزُور فَاس", context: "Exprimer un souhait" },
          { french: "Incha'Allah, tout ira bien", phonetic: "nchallah kullshi b-khayr", arabic: "إِنْ شَاءَ اللّٰه كُلُّ شَيْء بِالخَيْر", context: "Exprimer de l'espoir" },
          { french: "Mon projet est de...", phonetic: "l-mashru3 dyali howa...", arabic: "المَشْرُوع دْيَالِي هُوَ...", context: "Parler de ses projets" },
          { french: "J'espère réussir", phonetic: "kan-tmanna n-najeh", arabic: "كَنْتَمَنَّى نَنْجَح", context: "Exprimer un espoir" },
          { french: "Je vais essayer", phonetic: "ghadi n-jarreb", arabic: "غَادِي نُجَرِّب", context: "Promettre d'essayer" },
          { french: "J'ai décidé de...", phonetic: "qarart n...", arabic: "قَرَّرْت نَ...", context: "Annoncer une décision" },
        ],
        grammar: `**Parler du futur :**

1. **Ghadi + verbe** (futur certain) :
- **Ghadi n-mshi l-Fès** = je vais aller à Fès
- **Ghadi n-khedem bzzaf** = je vais beaucoup travailler

2. **Nchallah** (incha'Allah) :
Mot incontournable en darija pour parler du futur :
- **Ghadi n-jik nchallah** = il viendra, si Dieu veut
- **N-najeh nchallah** = je réussirai, si Dieu veut

3. **Kan-tmanna + verbe** (souhait) :
- **Kan-tmanna n-zur l-Maghrib** = j'espère visiter le Maroc`,
        tips: [
          "Le mot 'nchallah' est utilisé constamment au Maroc. Il ne faut pas l'oublier quand on parle du futur !",
          "Ne pas dire 'nchallah' peut être perçu comme de l'arrogance ou un manque de foi.",
          "Les Marocains disent souvent 'bima nchallah' (avec la volonté de Dieu) quand ils parlent de leurs plans.",
          "'Njarreb' (j'essaie) est une expression très utilisée et très optimiste.",
        ],
        quiz: [
          { question: "Comment dit-on 'incha'Allah' en darija ?", options: ["bismillah", "nchallah", "hamdullah", "mashallah"], correctIndex: 1 },
          { question: "Comment dit-on 'j'espère' ?", options: ["bghit", "nchallah", "kan-tmanna", "ghadi"], correctIndex: 2 },
          { question: "Comment forme-t-on le futur ?", options: ["kan- + verbe", "ghadi + verbe", "ma- + verbe", "bghit + verbe"], correctIndex: 1 },
          { question: "Que signifie 'l-mostaqbl' ?", options: ["Le passé", "Le présent", "L'avenir", "Le matin"], correctIndex: 2 },
          { question: "Comment dit-on 'je vais essayer' ?", options: ["kan-jarreb", "ghadi n-jarreb", "n-jarreb", "bghit n-jarreb"], correctIndex: 1 },
        ],
      },
      {
        id: "11-4",
        title: "Exprimer des émotions et sentiments complexes",
        titleAr: "التَّعْبِيرُ عَنِ المَشَاعِرِ المُعَقَّدَة",
        description: "Apprenez à nommer et exprimer des émotions nuancées en darija marocain.",
        duration: "7 min",
        vocabulary: [
          { french: "être déçu(e)", phonetic: "wqe3 / wqe3t mn...", arabic: "وَقَع / وَقَعْت مِن", notes: "Litt. 'tomber' — 'wqe3t mn l-7aja' = j'ai été déçu par la chose" },
          { french: "être soulagé(e)", phonetic: "tfarrajt", arabic: "تَفَرَّجْت", notes: "Litt. 'je me suis détendu', très courant pour exprimer le soulagement" },
          { french: "être fâché(e) / en colère", phonetic: "m3aqqb / m3aqqba", arabic: "مَعَقَّب / مَعَقَّبَة", notes: "Masculin et féminin. Très utilisé au quotidien" },
          { french: "être fier(ère) de", phonetic: "kan-fkher b-...", arabic: "كَنْفْخَر بِ", notes: "Litt. 'je me vante de' — pour exprimer la fierté" },
          { french: "être stressé(e) / nerveux(se)", phonetic: "mtewerreg / mtewerrega", arabic: "مُتَوَرِّج / مُتَوَرِّجَة", notes: "Très courant en darija moderne, souvent prononcé 'mterreg'" },
          { french: "être jaloux / envieux", phonetic: "7assed", arabic: "حَسَّد", notes: "La jalousie amoureuse se dit 'ghira' (غِيرَة)" },
          { french: "être ému(e)", phonetic: "t-l3ab 3liya", arabic: "تَلْعَب عَلِيَّ", notes: "Expression figurée : 'ça a joué sur moi'" },
          { french: "regretter", phonetic: "n-ndam 3la...", arabic: "نَنْدَم عَلَى", notes: "'n-ndam 3la li dert' = je regrette ce que j'ai fait" },
          { french: "ressentir / sentir", phonetic: "kan-7es b-...", arabic: "كَنْحِس بِ", notes: "'kan-7es b-l-harara' = je ressens la chaleur" },
          { french: "impatience", phonetic: "sh-shoq / mat-walish", arabic: "الشَّوْق / مَاتْوَالِيش", notes: "'mat-walish kan-stanna' = je n'arrive pas à attendre" },
        ],
        phrases: [
          { french: "Je suis déçu du résultat", phonetic: "wqe3t mn n-natija", arabic: "وَقَعْت مِنَ النَّتِيجَة", context: "Exprimer sa déception" },
          { french: "Je suis soulagé que ça soit fini", phonetic: "tfarrajt bli khelset", arabic: "تَفَرَّجْت بِلِي خَلَصَت", context: "Exprimer un soulagement" },
          { french: "Ne t'énerve pas !", phonetic: "ma-tbqash m3aqqb !", arabic: "مَا تْبَقَاش مَعَقَّب !", context: "Calmer quelqu'un" },
          { french: "Je suis fier de toi", phonetic: "kan-fkher b-ik", arabic: "كَنْفْخَر بِيك", context: "Encourager quelqu'un" },
          { french: "Ça m'a vraiment ému", phonetic: "t-l3ab 3liya bzzaf", arabic: "تَلْعَب عَلِيَّ بْزَاف", context: "Exprimer une émotion profonde" },
          { french: "Je regrette ce que j'ai fait", phonetic: "n-ndam 3la li dert", arabic: "نَنْدَم عَلَى الَّذِي دِرْت", context: "S'excuser sincèrement" },
          { french: "Je n'arrive pas à le croire", phonetic: "ma-nsawish n-tawweq hadchi", arabic: "مَا نْسَاوِيش نَتَوَقَّع هَادَ الشِّيء", context: "Exprimer l'incrédulité" },
        ],
        grammar: `**Exprimer les émotions en darija :**

Les émotions en darija s'expriment souvent de manière figurée, en utilisant des expressions physiques ou métaphoriques :

**La déception :**
- **Wqe3t mn...** (وَقَعْت مِن) = je suis tombé de (déçu par)
- **Qalbi t-khe33er** (قَلْبِي تَخَعَّر) = mon cœur s'est renversé (très déçu)

La colère :
- **M3aqqb** (مَعَقَّب) = fâché
- **D-dam y-ji f-rasi** (الدَّم يَجِي فِرَاسِي) = le sang monte à la tête
- **Mat-qaddesh** (مَاتْقَدَّش) = ça ne me supporte plus

Le soulagement :
- **Tfarrajt** (تَفَرَّجْت) = je me suis détendu / soulagé
- **Naffesni** (نَفَّسْنِي) = ça m'a fait respirer (soulagement)

La fierté :
- **Kan-fkher b-...** (كَنْفْخَر بِ) = je suis fier de...
- **Galbi m3ak** (قَلْبِي مَعَاك) = mon cœur est avec toi (solidarité)

**Les différences avec le français :**
En darija, on utilise souvent des expressions corporelles : 'wqe3' (tomber), 'l3ab 3liya' (ça a joué sur moi), 'nffesni' (ça m'a fait respirer).`,
        tips: [
          "Les Marocains expriment les émotions avec le corps : 'qalbi t-khe33er' (mon cœur s'est retourné).",
          "Dire 't-l3ab 3liya' (ça m'a touché) est un compliment sincère envers quelqu'un.",
          "L'expression 'ma-tbqash m3aqqb' est utilisée pour calmer quelqu'un mais aussi pour dire 'calme-toi'.",
          "En darija, 'kan-fkher' peut signifier 'je suis fier' ou 'je me vante' selon le contexte.",
        ],
        quiz: [
          { question: "Comment dit-on 'être déçu' en darija ?", options: ["farhan", "wqe3", "m3aqqb", "mtewerreg"], correctIndex: 1 },
          { question: "Que signifie l'expression 't-l3ab 3liya' ?", options: ["Ça m'a blessé", "Ça m'a ému", "Ça m'a surpris", "Ça m'a fait rire"], correctIndex: 1 },
          { question: "Comment dit-on 'je suis fier de toi' ?", options: ["kan-bghiik", "kan-fkher b-ik", "kan-shufik", "kan-dhdam 3lik"], correctIndex: 1 },
          { question: "Que signifie 'mtewerreg' ?", options: ["Heureux", "Stressé / nerveux", "Déçu", "Triste"], correctIndex: 1 },
          { question: "Comment dit-on 'je regrette' ?", options: ["n-3awd", "n-ndam 3la", "ma-bghitch", "smeh liyya"], correctIndex: 1 },
        ],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════
  // LEVEL 12: Situations avancées (B1.2)
  // ══════════════════════════════════════════════════════════════════════
  {
    id: 12,
    title: "Situations avancées",
    titleAr: "الوَضَعِيَّاتُ المُتَقَدِّمَةُ",
    description: "Maîtrisez les situations complexes : négociation, résolution de problèmes et nuances.",
    cefrLevel: "B1.2",
    icon: "🎓",
    color: "from-indigo-500 to-violet-600",
    lessons: [
      {
        id: "12-1",
        title: "Négocier au souk",
        titleAr: "المُسَاوَمَةُ فِالسُّوقِ",
        description: "Techniques avancées de négociation et marchandage au souk marocain.",
        duration: "7 min",
        vocabulary: [
          { french: "prix initial", phonetic: "thaman l-awwal", arabic: "ثَمَن الأَوَّل" },
          { french: "prix final", phonetic: "thaman l-akhir", arabic: "ثَمَن الأَخِير" },
          { french: "réduction", phonetic: "n-nqiss", arabic: "النُّقِيص", notes: "Le montant enlevé" },
          { french: "qualité", phonetic: "l-jawda", arabic: "الجَوْدَة" },
          { french: "authentique / vrai", phonetic: "s-7i / mashi mzawwer", arabic: "الصَّحِي / مَاشِي مُزَوَّر", notes: "mzawwer = enregistré/fabriqué en vrai darija (pas msajjal)" },
          { french: "fabriqué en série", phonetic: "s-sinwi", arabic: "الصِّنْوِيّ" },
          { french: "fait main", phonetic: "d-yadd", arabic: "دِيَّال يَد", notes: "Artisanal" },
          { french: "garantie", phonetic: "d-damana", arabic: "الدَّمَانَة" },
          { french: "paquet / lot", phonetic: "l-blassta / l-qitar", arabic: "البَلَسَّة / القِطَار" },
          { french: "cadeau / souvenir", phonetic: "l-hadiya / t-dhakar", arabic: "الهَدِيَّة / التَّذْكَار" },
        ],
        phrases: [
          { french: "C'est trop cher, divise par deux !", phonetic: "ghali bzzaf, nqiss nuss !", arabic: "غَالِي بْزَاف نَقِّص نُصّ !", context: "Négociation agressive" },
          { french: "C'est fait main ? Montrez-moi la qualité", phonetic: "d-yadd ? wurini l-jawda", arabic: "دِيَّال يَد ؟ وُرِينِي الجَوْدَة", context: "Vérifier la qualité" },
          { french: "Si tu me donnes ce prix, j'en prends deux", phonetic: "ila 3tini had thaman, ghirijoug", arabic: "إِلَا عْطِينِي هَاد الثَّمَن غِيرِي جُوج", context: "Technique de volume" },
          { french: "D'accord, c'est le dernier prix ?", phonetic: "wa3i, had l-akhir ?", arabic: "وَاعِي، هَاد الأَخِير ؟", context: "Confirmer le prix" },
          { french: "Je vais réfléchir et je reviens", phonetic: "ghadi n-dhdam w n-rje3", arabic: "غَادِي نَدْهَم وَنَرْجِع", context: "Prendre son temps" },
          { french: "C'est pour un cadeau", phonetic: "hadchi l-hadiya", arabic: "هَادَ الشِّيء لِلْهَدِيَّة", context: "Pour justifier un achat" },
        ],
        grammar: `**Techniques avancées de négociation :**

1. **Exprimer le choc** : « Ghali bzzaf ! Ta3jibtini ! »
2. **Proposer bas** : 30-50% du prix
3. **Argumenter** : qualité, comparaison, volume
4. **Le bluff** : « Ghadi n-shuf f-bla7d »
5. **Le compromis** : « Nqes shwiya w-khassni »
6. **Se lever** : la technique ultime

**Expressions de marchandage avancées :**
- **Kifash baghi t-3tini liya ?** = Combien veux-tu m'en laisser ?
- **Mat-walich, ana ghadi n-rje3** = Ne t'inquiète pas, je vais revenir
- **Daba w-la b3d, l-mohim l-jawda** = Maintenant ou après, l'important c'est la qualité`,
        tips: [
          "Ne montrez jamais trop d'enthousiasme pour un article, sinon le prix monte !",
          "Comparer avec d'autres vendeurs est une technique très efficace.",
          "Acheter plusieurs articles auprès du même vendeur permet de négocier mieux.",
          "Le marchandage est un jeu social : souriez, plaisantez, et soyez respectueux.",
          "Il est normal d'acheter quelque chose et de revenir le lendemain pour le même prix.",
        ],
        quiz: [
          { question: "Comment dit-on 'fait main' ?", options: ["s-sinwi", "d-yadd", "s-7i", "jawda"], correctIndex: 1 },
          { question: "Que signifie 'd-yadd' ?", options: ["En série", "Fait main", "De qualité", "Authentique"], correctIndex: 1 },
          { question: "Quelle est une bonne technique de négociation ?", options: ["Payer le premier prix", "Proposer 30-50% du prix", "Ne jamais marchander", "Acheter sans regarder"], correctIndex: 1 },
          { question: "Comment dit-on 'je vais réfléchir et revenir' ?", options: ["ghadi n-khriw", "ghadi n-dhdam w n-rje3", "ma-bghitch", "khassni"], correctIndex: 1 },
          { question: "Que signifie 'l-damana' ?", options: ["Qualité", "Garantie", "Réduction", "Authenticité"], correctIndex: 1 },
        ],
      },
      {
        id: "12-2",
        title: "Résoudre des problèmes du quotidien",
        titleAr: "حَلُّ مُشْكِلَاتِ اليَوْمِيَّةِ",
        description: "Gérer les situations difficiles : perte, plainte, urgence et plus.",
        duration: "7 min",
        vocabulary: [
          { french: "problème", phonetic: "mouchkil", arabic: "مُشْكِل" },
          { french: "solution", phonetic: "l-7all", arabic: "الحَلّ" },
          { french: "se plaindre", phonetic: "n-shki", arabic: "نَشْكِي" },
          { french: "excuse / justification", phonetic: "l-ma3dira", arabic: "المَعْذِرَة" },
          { french: "perdu / égaré", phonetic: "dall", arabic: "دَلّ", notes: "Perdu en vrai darija (Dawyi est incorrect)" },
          { french: "volé", phonetic: "msroq", arabic: "مَسْرُوق" },
          { french: "urgence", phonetic: "l-7ala t-tariya", arabic: "الحَالَة الطَّارِئَة", notes: "Ou simplement 'l-7ala' = la situation d'urgence" },
          { french: "police", phonetic: "l-bulees", arabic: "البُولِيس" },
          { french: "aide / secours", phonetic: "l-3awna", arabic: "العَوْنَة" },
          { french: "désolé / je regrette", phonetic: "smeh liyya / n-samh", arabic: "سْمَحْ لِيَّ / نَسْمَح" },
        ],
        phrases: [
          { french: "J'ai un problème", phonetic: "3ndi mouchkil", arabic: "عَنْدِي مُشْكِل", context: "Signaler un problème" },
          { french: "J'ai perdu mon sac", phonetic: "dallt s-sakra dyali", arabic: "دَلَّلْت السَّكْرَة دْيَالِي", context: "Objet perdu (sakra = sac en vrai darija, pas karita)" },
          { french: "Pouvez-vous m'aider ?", phonetic: "tqder t-3awnni ?", arabic: "تِقْدَر تَعَوَّنِي ؟", context: "Demander de l'aide" },
          { french: "Il faut appeler la police", phonetic: "khassna n-shemu l-bulees", arabic: "خَصْنَا نَشْمُو البُولِيس", context: "Situation grave" },
          { french: "Je veux me plaindre", phonetic: "bghit n-shki", arabic: "بَغِيت نَشْكِي", context: "Faire une réclamation" },
          { french: "Désolé, c'était une erreur", phonetic: "smeh liyya, kan ghalat", arabic: "سْمَحْ لِيَّ كَان غَلْطَة", context: "S'excuser pour une erreur" },
        ],
        grammar: `**Gérer les problèmes :**

Signaler un problème :
- **3ndi mouchkil** = j'ai un problème
- **Kayn ghalat** = il y a une erreur
- **Hadchi ma-shi mzyan** = ce n'est pas bien

Demander de l'aide :
- **Tqder t-3awnni ?** = peux-tu m'aider ?
- **Fadil 3awna** = aide s'il vous plaît
- **Ana f-mouchkil** = je suis dans le pétrin

S'excuser :
- **Smeh liyya** = pardonne-moi
- **Kan ghalat** = c'était une erreur
- **Ma-kansh qasd** = ce n'était pas intentionnel`,
        tips: [
          "En cas de perte, rendez-vous au commissariat le plus proche avec une description détaillée.",
          "Les numéros d'urgence au Maroc : 19 (police), 15 (SAMU), 17 (pompiers).",
          "Les Marocains sont généralement solidaires. N'hésitez pas à demander de l'aide dans la rue.",
          "S'il y a un problème avec un achat, retournez au vendeur : les retours sont possibles.",
        ],
        quiz: [
          { question: "Comment dit-on 'j'ai un problème' ?", options: ["ma-kansh khyr", "3ndi mouchkil", "ana mrid", "kandham"], correctIndex: 1 },
          { question: "Comment demande-t-on de l'aide ?", options: ["bghit khedma", "tqder t-3awnni ?", "fin ana ?", "3lash ?"], correctIndex: 1 },
          { question: "Que signifie 'mouchkil' ?", options: ["Aide", "Solution", "Problème", "Urgence"], correctIndex: 2 },
          { question: "Comment dit-on 'j'ai perdu' ?", options: ["msroq", "dall", "farhan", "mzyan"], correctIndex: 1 },
          { question: "Quel est le numéro de la police au Maroc ?", options: ["15", "17", "19", "16"], correctIndex: 2 },
        ],
      },
      {
        id: "12-3",
        title: "Conversations complexes et nuances",
        titleAr: "المُحَادَثَاتُ المُعَقَّدَةُ وَالدَّقَائِقُ",
        description: "Les expressions subtiles, l'ironie et les nuances de la langue darija.",
        duration: "7 min",
        vocabulary: [
          { french: "ironie / sarcastique", phonetic: "l-istihzaa", arabic: "الِاسْتِهْزَاء" },
          { french: "comprendre / saisir (nuance)", phonetic: "fhem l-haja", arabic: "فَهْم الحَاجَة", notes: "Saisir la nuance" },
          { french: "en tout cas", phonetic: "f-kill 7al", arabic: "فِكُلّ حَال" },
          { french: "de toute façon", phonetic: "f-kill 7al", arabic: "فِكُلّ حَال", notes: "Expression très courante" },
          { french: "ça dépend", phonetic: "kaytbaddel", arabic: "كَيْتَبَدَّل", notes: "Ou 'khass y-dwer 3la l-7al'" },
          { french: "peu importe", phonetic: "ma-3niytch", arabic: "مَا عْنِيتْش", notes: "Litt. 'ça n'a pas de sens'" },
          { french: "exactement / c'est ça", phonetic: "hadshi huwa / s-s7i", arabic: "هَادَ الشِّيء هُوَ / الصَّحِي" },
          { french: "tu exagères", phonetic: "kat-dawwer 3lih bzzaf", arabic: "كَتْدَوَّر عَلِيه بْزَاف", notes: "Litt. tu vas trop loin" },
          { french: "sérieusement", phonetic: "jiddan / b-jadd", arabic: "جِدّاً / بِجَدّ" },
          { french: "entre nous / en privé", phonetic: "bina 7derna", arabic: "بَيْنَا حَدْرَنَا" },
        ],
        phrases: [
          { french: "Tu plaisantes ? Sérieusement ?", phonetic: "kat-dhak ? b-jadd ?", arabic: "كَتْضَحَك ؟ بِجَدّ ؟", context: "Exprimer l'incrédulité" },
          { french: "Entre nous, je pense que c'est une erreur", phonetic: "bina 7derna, kandham annu ghalat", arabic: "بَيْنَا حَدْرَنَا كَنْدْهَم أَنُّو غَلْطَة", context: "Confidence" },
          { french: "En tout cas, on verra bien", phonetic: "f-kill 7al, ghadi n-shuf", arabic: "فِكُلّ حَال غَادِي نْشُوف", context: "Conclure une discussion" },
          { french: "Tu exagères un peu", phonetic: "kat-dawwer 3lih shwiya", arabic: "كَتْدَوَّر عَلِيه شْوِيَّة", context: "Modérer l'enthousiasme" },
          { french: "Ça dépend de la situation", phonetic: "khassu y-khaddem 3la l-waqe3", arabic: "خَاصُّو يَخَدَّم عَلَى الوَقِيعَة", context: "Nuancer sa réponse" },
          { french: "Peu importe, l'essentiel c'est...", phonetic: "ma-3niytch, l-mohim howa...", arabic: "مَا عْنِيتْش المُهِم هُوَ...", context: "Se concentrer sur l'essentiel" },
        ],
        grammar: `**Les nuances de la conversation :**

1. **L'ironie** : les Marocains utilisent beaucoup l'ironie
- **Mzyan, mzyan !** (en riant) = c'est du dernier cri ! (souvent sarcastique)
- **Bravou, shab !** = bravo mec ! (peut être ironique)

2. **Les expressions de transition :**
- **F-kill 7al** = en tout cas
- **Bina 7derna** = entre nous
- **Machi l-mohim** = ce n'est pas le plus important

3. **Les expressions de certitude/incertitude :**
- **S-s7i, s-s7i** = c'est vrai, c'est vrai
- **Ma-kansh mouta2akkid** = je ne suis pas sûr
- **Kaytbaddel** = ça dépend (litt. ça change)

4. **Le registre familier :**
- **Walakin** = mais / cependant
- **Bessa7** = assez / ça suffit
- **W-allah** = je jure (par Dieu)`,
        tips: [
          "L'ironie marocaine est subtile. Observez le ton de la voix et le contexte.",
          "Les expressions comme 'bina 7derna' indiquent une confidence et créent de la proximité.",
          "Dire 'wal-lah' (je jure) est très courant mais utilisez-le avec parcimonie.",
          "Le mot 'bessa7' peut être poli ou agacé selon le ton. Écoutez bien !",
          "En darija avancé, le contexte et le ton sont aussi importants que les mots.",
        ],
        quiz: [
          { question: "Que signifie 'f-kill 7al' ?", options: ["En tout cas", "En privé", "Peut-être", "Jamais"], correctIndex: 0 },
          { question: "Comment dit-on 'tu exagères' ?", options: ["kat-dhak", "kat-dawwer 3lih", "kan-fhem", "kan-shuf"], correctIndex: 1 },
          { question: "Que signifie 'bina 7derna' ?", options: ["En public", "En privé / entre nous", "Absolument", "Pas du tout"], correctIndex: 1 },
          { question: "Comment dit-on 'ça dépend' en darija ?", options: ["ma-3niytch", "kaytbaddel", "s-s7i", "f-kill 7al"], correctIndex: 1 },
          { question: "Que signifie 'ma-3niytch' ?", options: ["Absolument", "Peu importe", "C'est grave", "Je suis d'accord"], correctIndex: 1 },
          { question: "Que signifie 'wal-lah' ?", options: ["Merci", "Pardon", "Je jure", "Au revoir"], correctIndex: 2 },
        ],
      },
      {
        id: "12-4",
        title: "Expressions idiomatiques et proverbes marocains",
        titleAr: "التَّعْبِيرَاتُ الِاسْتِعَارِيَّةُ وَالأَمْثَالُ المَغْرِبِيَّة",
        description: "Maîtrisez les expressions figurées, les proverbes et le langage imagé du quotidien marocain.",
        duration: "8 min",
        vocabulary: [
          { french: "proverbe", phonetic: "mthal", arabic: "مَثَل", notes: "Pluriel : mthala (مَثَالَة) ou amtal" },
          { french: "chance / sort", phonetic: "n-nassib", arabic: "النَّصِيب", notes: "'jabbu n-nassib' = il a eu de la chance" },
          { french: "destin / ce qui est écrit", phonetic: "l-maktub", arabic: "المَكْتُوب", notes: "Litt. 'ce qui est écrit' par Dieu" },
          { french: "ça vaut le coup", phonetic: "y-stahel", arabic: "يِسْتَاهِل", notes: "Très courant : 'y-stahel, ddir hadchi'" },
          { french: "ça n'a pas de sens", phonetic: "ma-fihush ma3na", arabic: "مَا فِيهُوش مَعْنَى", notes: "Pour exprimer l'incompréhension" },
          { french: "c'est normal / logique", phonetic: "hadshi 3adi", arabic: "هَادَ الشِّيء عَادِي", notes: "Ou 'tabi3i' (طَبِيعِي)" },
          { french: "se donner du mal", phonetic: "y-qsa 3la ras-u", arabic: "يِقْصَى عَلَى رَاسُو", notes: "Litt. 'se casser la tête' — effort intense" },
          { french: "petit à petit", phonetic: "b-l-7abta", arabic: "بِالحَبَّة", notes: "Diminutif de '7abba' (graine). Très populaire" },
          { french: "du jour au lendemain", phonetic: "mn l-lel l-sba7", arabic: "مِنَ اللَّيْل الصُّبْح", notes: "Litt. 'de la nuit au matin'" },
          { french: "impatience / avoir hâte", phonetic: "sh-shoq", arabic: "الشَّوْق", notes: "'3ndi sh-shoq' = j'ai hâte de" },
          { french: "c'est impossible", phonetic: "ma-y-mkensh / sa3b bzzaf", arabic: "مَا يِمْكَنْش / صْعِيب بْزَاف", notes: "Pour exprimer l'impossibilité" },
          { french: "sans aucun doute", phonetic: "bla shak / mouta2akkid", arabic: "بِلَا شَكّ / مُتَأَكَّد", notes: "Exprimer la certitude" }
        ],
        phrases: [
          { french: "Ce qui est passé est mort", phonetic: "lli fat, mat", arabic: "الَّذِي فَات مَات", context: "Proverbe : accepter et tourner la page" },
          { french: "La patience est une vertu", phonetic: "s-sabr zina", arabic: "الصَّبْر زِينَة", context: "Proverbe : encourager la patience" },
          { french: "Petit à petit, la vie s'arrange", phonetic: "b-l-7abta b-l-7abta, t-3mmer l-3isha", arabic: "بِالحَبَّة بِالحَبَّة تَعْمُر العِيشَة", context: "Proverbe marocain célèbre pour encourager" },
          { french: "Avec le plus grand plaisir !", phonetic: "3la r-ras w-l-3in !", arabic: "عَلَى الرَّاس وَالعَيْن !", context: "Accueillir chaleureusement, exprimer la générosité" },
          { french: "Qui ne fait pas le bien ne le reçoit pas", phonetic: "lli ma-y-drish l-khayr, ma-y-laqish", arabic: "الَّذِي مَا يَدْرِيش الخَيْر مَا يِلَاقِيش", context: "Proverbe moral sur la réciprocité" },
          { french: "C'est le destin, il faut accepter", phonetic: "hadshi maktub, khassna n-qblu", arabic: "هَادَ الشِّيء مَكْتُوب خَصْنَا نَقْبَلُو", context: "Exprimer la résignation philosophique" },
          { french: "Il se donne beaucoup de mal pour sa famille", phonetic: "kay-qsa 3la ras-u bzzaf 3la 3ilat-u", arabic: "كَيْقَصَى عَلَى رَاسُو بْزَاف عَلَى عَائِلَتُو", context: "Reconnaître l'effort de quelqu'un" },
          { french: "Ça vaut le coup d'essayer", phonetic: "y-stahel n-jarrb", arabic: "يِسْتَاهِل نُجَرِّب", context: "Encourager à tenter quelque chose" },
        ],
        grammar: `**Les proverbes marocains (l-amthal) :**

Les proverbes occupent une place centrale dans la communication en darija. Les Marocains les utilisent constamment pour illustrer un propos, donner un conseil ou résumer une situation.

**Les proverbes les plus utilisés :**

1. **Lli fat, mat** (الَّذِي فَات مَات) — Le passé est révolu
   → Tourner la page, ne pas vivre dans le passé

2. **S-sabr zina** (الصَّبْر زِينَة) — La patience est un ornement
   → La patience est une qualité noble

3. **B-l-7abta b-l-7abta, t-3mmer l-3isha** (بِالحَبَّة بِالحَبَّة تَعْمُر العِيشَة) — Petit à petit, la vie s'enrichit
   → Les grandes choses se construisent lentement

4. **Lli ma-y-drish l-khayr, ma-y-laqish** (الَّذِي مَا يَدْرِيش الخَيْر مَا يِلَاقِيش) — Qui ne fait pas le bien ne le reçoit pas
   → La réciprocité morale

5. **3la r-ras w-l-3in** (عَلَى الرَّاس وَالعَيْن) — Sur la tête et l'œil
   → Avec le plus grand plaisir / sans aucune réticence

**Expressions figurées courantes :**
- **Y-qsa 3la ras-u** (يِقْصَى عَلَى رَاسُو) = se casser la tête = travailler dur
- **3tih l-blan** (عْطِيه البُلان) = donne-lui la note = le corriger / le réprimander
- **Fehmtek msalleh** (فِهْمْتَك مَصْلَح) = je t'ai compris parfaitement (compliment)`,
        tips: [
          "Les Marocains adorent utiliser des proverbes dans la conversation quotidienne. En apprendre quelques-uns impressionne beaucoup !",
          "Le proverbe 'b-l-7abta b-l-7abta' est sans doute le plus célèbre du Maroc.",
          "Dire '3la r-ras w-l-3in' est la marque d'une hospitalité sincère.",
          "Les proverbes marocains reflètent la sagesse populaire et la culture orale du pays.",
          "N'hésitez pas à demander 'chnu 3naha had l-mthal ?' (que signifie ce proverbe ?) quand vous en entendez un.",
        ],
        quiz: [
          { question: "Que signifie le proverbe 'lli fat, mat' ?", options: ["Le passé est révolu", "Il est mort hier", "Tout va bien", "Le futur est incertain"], correctIndex: 0 },
          { question: "Que veut dire 'b-l-7abta' ?", options: ["Très vite", "Petit à petit", "En même temps", "Pas du tout"], correctIndex: 1 },
          { question: "Comment dit-on 'avec plaisir' de façon emphatique ?", options: ["mzyan", "3la r-ras w-l-3in", "bla jmil", "shukran bzzaf"], correctIndex: 1 },
          { question: "Que signifie 'y-qsa 3la ras-u' ?", options: ["Il a mal à la tête", "Il se donne du mal", "Il est fatigué", "Il est confus"], correctIndex: 1 },
          { question: "Comment dit-on 'c'est le destin' ?", options: ["hadshi 3adi", "hadshi maktub", "kaytbaddel", "ma-y-mkensh"], correctIndex: 1 },
          { question: "Que signifie 's-sabr zina' ?", options: ["Le stress est beau", "La patience est une vertu", "Le silence est d'or", "La colère est mauvaise"], correctIndex: 1 },
        ],
      },
      {
        id: "12-5",
        title: "Le conditionnel et les situations hypothétiques",
        titleAr: "شَرْطُ الجُمْلَةِ وَالحَالَاتُ الِافْتِرَاضِيَّة",
        description: "Apprenez à exprimer des conditions, des souhaits et des scénarios hypothétiques en darija.",
        duration: "8 min",
        vocabulary: [
          { french: "si (conditionnel)", phonetic: "ila / law", arabic: "إِلَا / لَوْ", notes: "'ila' pour le futur possible, 'law' pour l'irréel" },
          { french: "j'aimerais bien / je voudrais", phonetic: "kan-bghi / bghit", arabic: "كَنْبْغِي / بَغِيت", notes: "En darija, 'bghit' suffit souvent pour exprimer un souhait" },
          { french: "à condition que", phonetic: "b-shart annu...", arabic: "بِشَرْط أَنُّو", notes: "Condition nécessaire pour réaliser quelque chose" },
          { french: "même si", phonetic: "w-la kan...", arabic: "وَلَا كَان", notes: "Exprimer une concession" },
          { french: "sinon / autrement", phonetic: "bla kda / w-la", arabic: "بِلَا كَدَا / وَلَا", notes: "'w-la' est très courant pour signifier 'sinon'" },
          { french: "dans ce cas", phonetic: "f-had l-7al", arabic: "فِهَاد الحَال", notes: "Pour introduire une conséquence" },
          { french: "supposer / imaginer", phonetic: "n-takhayyel", arabic: "نَتَخَيَّل", notes: "'t-khayyel law...' = imagine si..." },
          { french: "impossible", phonetic: "ma-y-mkensh", arabic: "مَا يِمْكَنْش", notes: "Litt. 'ça ne se peut pas'" },
          { french: "si seulement", phonetic: "law kankaddir...", arabic: "لَوْ كَانْكَنْدِير", notes: "Exprimer un regret ou un souhait profond" },
          { french: "de toute façon", phonetic: "f-kill 7al", arabic: "فِكُلّ حَال", notes: "Quoi qu'il arrive, de toute façon" },
        ],
        phrases: [
          { french: "Si j'avais de l'argent, je voyagerais", phonetic: "law kan 3ndi l-flus, kan-safer", arabic: "لَوْ كَانَ عَنْدِي الفْلُوس كَنْسَافِر", context: "Condition irréelle (irréel du présent)" },
          { french: "J'aimerais bien visiter Marrakech", phonetic: "kan-bghi n-zur marraksh", arabic: "كَنْبْغِي نَزُور مَرَّاكَش", context: "Exprimer un souhait poli" },
          { french: "À condition que tu viennes avec moi", phonetic: "b-shart annu nti tji m3aya", arabic: "بِشَرْط أَنُّو نْتِي تِجِي مَعَايَة", context: "Poser une condition" },
          { french: "Si tu veux, on peut y aller demain", phonetic: "ila bghiti, nqderu n-mshiu ghadda", arabic: "إِلَا بَغِيتِي نِقْدَرُو نَمْشِيو غَدَّا", context: "Proposer avec condition ouverte" },
          { french: "Même si c'est difficile, je vais essayer", phonetic: "w-la kan s3ib, ghadi n-jarreb", arabic: "وَلَا كَان صْعِيب غَادِي نُجَرِّب", context: "Exprimer la persévérance" },
          { french: "Sans toi, je n'aurais pas pu le faire", phonetic: "bla k, ma-kntch nqder n-dur hadchi", arabic: "بِلَا كَ مَا كُنْتْش نِقْدَر نْدُور هَادَ الشِّيء", context: "Exprimer la gratitude" },
          { french: "Imagine si ça arrivait ici !", phonetic: "t-khayyel law hadshi 7edra hna !", arabic: "تَخَيَّل لَوْ هَادَ الشِّيء حَدْرَا هُنَا !", context: "Poser une hypothèse amusante" },
          { french: "Si seulement j'avais su plus tôt", phonetic: "law kank3raf qbal", arabic: "لَوْ كَانْكَنْعَرَف قَبْل", context: "Exprimer un regret" },
        ],
        grammar: `**Les structures conditionnelles en darija :**

Le darija possède deux principales particules conditionnelles :

1. **Ila** (إِلَا) — condition possible / futur
   - **Ila jit l-yum, ghadi n3tik had l-7aja** = Si tu viens aujourd'hui, je te donne cette chose
   - **Ila kentar, n-shuf shi ghzal** = Si tu veux, je te montre quelque chose de beau
   → La condition est réaliste et possible.

2. **Law** (لَوْ) — condition irréelle / hypothétique
   - **Law kan 3ndi l-waqt, kan-njem n-mshi** = Si j'avais le temps, je pourrais y aller
   - **Law knt f-maghrib daba, kan-kul l-kusksu** = Si j'étais au Maroc maintenant, je mangerais le couscous
   → La condition est imaginaire ou irréelle.

3. **La structure « b-shart » (بشَرْط) — à condition que :**
   - **B-shart annu t-ji f-l-waqt** = À condition que tu arrives à l'heure
   - **B-shart l-jawda** = À condition que la qualité soit bonne

4. **La concession avec « w-la kan » (وَلَا كَان) :**
   - **W-la kan t-le3b, daba khassna n-rje3** = Même si tu joues, maintenant il faut rentrer
   - **W-la kan mashi mzyan, daba l-mohim annu nkunnu m3a ba3dna** = Même si ce n'est pas bien, l'important c'est qu'on soit ensemble

5. **Exprimer le regret avec « law kankaddir » (لَوْ كَانْكَنْدِير) :**
   - **Law kankaddir, ma-dertch had l-ghalat** = Si seulement je pouvais, je ne ferais pas cette erreur`,
        tips: [
          "La différence entre 'ila' et 'law' est cruciale : 'ila' = possible, 'law' = irréel. Confondre les deux change complètement le sens !",
          "Les Marocains utilisent souvent 'ila bghiti' (si tu veux) pour proposer quelque chose sans pression.",
          "Dire 'law kankaddir' (si seulement je pouvais) exprime un profond regret et suscite la sympathie.",
          "'B-shart' est très utilisé dans les négociations et les accords.",
          "La phrase 'w-la kan' (même si) est un excellent outil pour nuancer votre discours.",
        ],
        quiz: [
          { question: "Quelle particule utilise-t-on pour une condition irréelle ?", options: ["ila", "law", "b-shart", "w-la"], correctIndex: 1 },
          { question: "Que signifie 'b-shart annu...' ?", options: ["Même si", "À condition que", "Sinon", "Par contre"], correctIndex: 1 },
          { question: "Comment dit-on 'j'aimerais bien' en darija ?", options: ["ghadi n-jarreb", "kan-bghi", "n-ndam", "ma-y-mkensh"], correctIndex: 1 },
          { question: "Comment exprime-t-on un regret ?", options: ["ila bghiti", "law kankaddir", "b-shart", "f-kill 7al"], correctIndex: 1 },
          { question: "Que signifie 'w-la kan' ?", options: ["Sinon", "Par contre", "Même si", "À condition que"], correctIndex: 2 },
        ],
      },
      {
        id: "12-6",
        title: "Débattre et argumenter en darija",
        titleAr: "المُنَاقَشَةُ وَالتَّحْلِيلُ فِي الدَّارِجَة",
        description: "Apprenez les structures avancées pour débattre, comparer et nuancer vos arguments en darija.",
        duration: "8 min",
        vocabulary: [
          { french: "argument", phonetic: "l-hujja", arabic: "الحُجَّة", notes: "Pluriel : l-hujaj (الحُجَج)" },
          { french: "convaincre", phonetic: "y-qni3", arabic: "يِقْنَع", notes: "'y-qni3ni b-hujjtu' = il me convainc par son argument" },
          { french: "comparer", phonetic: "y-qaren bin...", arabic: "يِقَارِن بِين", notes: "'y-qaren bin sh-shi w sh-shi' = il compare entre les choses" },
          { french: "avantage / point fort", phonetic: "l-fayda", arabic: "الفَائِدَة", notes: "Pluriel : l-fawayid (الفَوَايِد)" },
          { french: "inconvénient / défaut", phonetic: "l-3ayb", arabic: "العَيْب", notes: "Pluriel : l-3uyub (العُيُوب)" },
          { french: "par contre / en revanche", phonetic: "mn jihat khra", arabic: "مِنْ جِهَة خْرَى", notes: "Litt. 'd'un autre côté' — très courant dans le débat" },
          { french: "de plus / et en plus", phonetic: "w-haja khra", arabic: "وَحَاجَة خْرَى", notes: "Litt. 'et une autre chose' — ajouter un argument" },
          { french: "en résumé / pour conclure", phonetic: "f-l-mjmal / l-mohim", arabic: "فِالمُجْمَل / المُهِم", notes: "Deux façons de conclure" },
          { french: "exemple / par exemple", phonetic: "mthal / ka-mthal", arabic: "مَثَال / كَمَثَال", notes: "'ka-mthal...' = par exemple..." },
          { french: "je ne suis pas convaincu(e)", phonetic: "ma-qni3tch", arabic: "مَا قْنَعْتْش", notes: "Pour exprimer un désaccord nuancé" },
        ],
        phrases: [
          { french: "Je ne suis pas d'accord avec toi sur ce point", phonetic: "ma-kan-shi m3ak f-had l-mawdu3", arabic: "مَا كَنْشِي مَعَاك فِهَاد المَوْضُوع", context: "Désaccord formel et poli" },
          { french: "Tu as raison, mais il faut aussi considérer...", phonetic: "s-s7i ghir khass n-shufu kaman...", arabic: "الصَّحِي غِير خَصْ نْشُوفُو كَمَان", context: "Accorder partiellement tout en nuançant" },
          { french: "L'avantage c'est que c'est proche", phonetic: "l-fayda fihha annu qrib", arabic: "الفَائِدَة فِيهَا أَنُّو قَرِيب", context: "Présenter un argument positif" },
          { french: "Par contre, l'inconvénient c'est que c'est cher", phonetic: "mn jihat khra, l-3ayb fih annu ghali", arabic: "مِنْ جِهَة خْرَى العَيْب فِيه أَنُّو غَالِي", context: "Présenter un contre-argument" },
          { french: "Donne-moi un exemple concret", phonetic: "3tini mthal s-s7i", arabic: "عْطِينِي مَثَال الصَّحِي", context: "Demander une illustration" },
          { french: "Pour résumer, je pense que c'est la meilleure option", phonetic: "f-l-mjmal, kandham annu hadchi ahsen", arabic: "فِالمُجْمَل كَنْدْهَم أَنُّو هَادَ الشِّيء أَحْسَن", context: "Conclure un débat" },
          { french: "C'est beaucoup mieux que l'autre option", phonetic: "hadshi ahsen bzzaf mn l-khra", arabic: "هَادَ الشِّيء أَحْسَن بْزَاف مِنَ الخْرَى", context: "Comparer en valorisant" },
          { french: "Les deux choix ont leurs qualités", phonetic: "juj d-l-khtiyyar fihum l-fayda", arabic: "جُوج دِلْخِتِّيَار فِيهُم الفَائِدَة", context: "Nuancer en reconnaissant les mérites" },
        ],
        grammar: `**Structures argumentatives en darija :**

1. **Présenter un argument :**
   - **L-fayda fihha annu...** (الفَائِدَة فِيهَا أَنُّو) = L'avantage c'est que...
   - **W-haja khra, ...** (وَحَاجَة خْرَى) = De plus, ...

2. **Présenter un contre-argument :**
   - **Mn jihat khra, l-3ayb fih annu...** (مِنْ جِهَة خْرَى العَيْب فِيه أَنُّو) = Par contre, l'inconvénient c'est que...
   - **Ghir ash nta druh...** = Mais que dis-tu de... (changer de perspective)

3. **Exprimer le désaccord avec nuance :**
   - **S-s7i, ghir...** = C'est vrai, mais... (poli)
   - **Ma-kan-shi m3ak f-had l-nqta** = Je ne suis pas d'accord sur ce point
   - **Ma-qni3tch b-hujjtek** = Ton argument ne me convainc pas

4. **Comparer :**
   - **Hadshi ahsen mn...** = C'est mieux que...
   - **Fih a3zam mn...** = Il y a plus de... que...
   - **L-khra fihla l-3ayb...** = L'autre a le défaut de...

5. **Conclure :**
   - **F-l-mjmal** (فِالمُجْمَل) = En résumé
   - **L-mohim** (المُهِم) = L'important (est que)
   - **L-akhir, ...** = Finalement, ...

6. **Nier avec insistance (négation forte) :**
   - **Ma-mashi haka !** = Ce n'est pas comme ça !
   - **W-la kaman !** = Pas du tout ! (renforcement négatif)
   - **Ma-hada ghal !** = Personne n'a tort ! (pour apaiser un débat)`,
        tips: [
          "Dans un débat, commencez toujours par accorder une partie de raison avant de nuancer. C'est la politesse marocaine.",
          "L'expression 's-s7i, ghir...' est la façon la plus diplomatique de présenter un désaccord.",
          "Les Marocains apprécient les débats animés mais respectueux. Le ton et le sourire sont essentiels.",
          "Dire 'ka-mthal' (par exemple) rend vos arguments plus concrets et plus convaincants.",
          "Pour conclure un débat, 'f-l-mjmal' est plus formel que 'l-mohim'.",
        ],
        quiz: [
          { question: "Comment dit-on 'argument' en darija ?", options: ["l-fayda", "l-hujja", "l-3ayb", "mthal"], correctIndex: 1 },
          { question: "Que signifie 'mn jihat khra' ?", options: ["De plus", "Par contre / d'un autre côté", "En résumé", "Par exemple"], correctIndex: 1 },
          { question: "Comment exprime-t-on un désaccord poli ?", options: ["ma-kan-shi m3ak", "s-s7i ghir...", "ma-mashi haka", "la"], correctIndex: 1 },
          { question: "Que signifie 'w-haja khra' ?", options: ["C'est pareil", "De plus / et en plus", "C'est fini", "C'est impossible"], correctIndex: 1 },
          { question: "Comment dit-on 'pour résumer' ?", options: ["ka-mthal", "f-l-mjmal", "mn jihat khra", "l-hujja"], correctIndex: 1 },
          { question: "Que signifie 'ma-qni3tch' ?", options: ["Je ne comprends pas", "Je ne suis pas convaincu", "Je ne veux pas", "Je ne sais pas"], correctIndex: 1 },
        ],
      },
    ],
  },
];

export default levels;
