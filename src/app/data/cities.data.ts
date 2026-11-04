/**
 * Content contract for the Tunisia Explorer experience.
 * geoName MUST match `properties.shapeName` in
 * /public/data/tunisia-governorates.geojson (24 governorates).
 */

export type Region = 'Nord' | 'Centre' | 'Sud';

export type SectionId = 'history' | 'origin' | 'places' | 'food';

export interface CityHighlight {
  title: string;
  description: string;
}

export interface CitySection {
  id: SectionId;
  body: string;
  highlights: CityHighlight[];
}

export interface TunisianCity {
  id: string;
  geoName: string;
  name: string;
  nameAr: string;
  tagline: string;
  region: Region;
  isCapital: boolean;
  coastal: boolean;
  population: number;
  areaKm2: number;
  elevation?: number;
  knownFor: string[];
  sections: CitySection[];
}

export const CITIES: TunisianCity[] = [
  {
    id: 'tunis',
    geoName: 'Tunis',
    name: 'Tunis',
    nameAr: 'تونس',
    tagline: "Mille ans de pouvoir, une médina qui respire encore.",
    region: 'Nord',
    isCapital: true,
    coastal: true,
    population: 1100000,
    areaKm2: 346,
    knownFor: ['Médina UNESCO', 'Musée du Bardo', 'Zitouna', 'Sidi Bou Saïd'],
    sections: [
      {
        id: 'history',
        body: "Tunis existe avant Carthage : comptoir libyco-berbère, puis ville romaine de Thunes, elle reste longtemps dans l'ombre de sa voisine punique. Après la conquête arabe de 698, elle grandit autour de la mosquée Zitouna et devient capitale sous les Hafsides, avant de l'être définitivement à partir de 1705 avec la dynastie husseinite.",
        highlights: [
          { title: '698', description: "La conquête arabe intègre Tunis à l'Ifriqiya." },
          { title: 'XIIe siècle', description: 'Capitale hafside, la médina se densifie.' },
          { title: '1979', description: 'La médina est inscrite au patrimoine mondial.' },
        ],
      },
      {
        id: 'origin',
        body: "Le nom viendrait du berbère Tunes, souvent rapproché de la racine évoquant un campement ou un lieu de halte — une escale naturelle au fond du lac. La légende locale y ajoute la princesse Tounès, dont le nom aurait été donné à la ville.",
        highlights: [
          { title: 'Tunes', description: 'Toponyme berbère antérieur à Carthage.' },
          { title: 'Thunes / Tuniza', description: 'Formes latines reprises par les géographes antiques.' },
        ],
      },
      {
        id: 'places',
        body: "La médina se traverse à pied, du souk El Attarine aux parfums de fleur d'oranger jusqu'aux souks de la soie et des chéchias. Autour d'elle, la ville moderne s'étire vers la mer et vers les collines.",
        highlights: [
          { title: 'Mosquée Zitouna', description: "Cœur spirituel et universitaire de la ville depuis le VIIIe siècle." },
          { title: 'Médina & souks', description: 'Un dédale de ruelles classé par l\'UNESCO.' },
          { title: 'Musée du Bardo', description: "La plus grande collection de mosaïques romaines au monde." },
          { title: 'Sidi Bou Saïd', description: 'Village bleu et blanc accroché à la falaise.' },
          { title: 'Site de Carthage', description: 'Les thermes d\'Antonin et le port punique à deux pas.' },
        ],
      },
      {
        id: 'food',
        body: "La cuisine de la capitale mélange les influences andalouses, turques et italiennes. On y mange tôt, debout, dans la rue, et longtemps autour d'une table le vendredi.",
        highlights: [
          { title: 'Lablabi', description: "Soupe de pois chiches, harissa et pain rassis : le petit-déjeuner des habitués." },
          { title: 'Brik à l\'œuf', description: 'Feuille de malsouka croustillante, thon et câpre.' },
          { title: 'Makroudh', description: 'Semoule, dattes, miel — la pâtisserie du Ramadan.' },
          { title: 'Bambalouni', description: 'Beignet de Sidi Bou Saïd, mangé brûlant sur le pas de la porte.' },
        ],
      },
    ],
  },
  {
    id: 'ariana',
    geoName: 'Ariana',
    name: 'Ariana',
    nameAr: 'أريانة',
    tagline: 'Les jardins maraîchers aux portes de la capitale.',
    region: 'Nord',
    isCapital: false,
    coastal: true,
    population: 700000,
    areaKm2: 482,
    knownFor: ['Maraîchage', 'Rose de l\'Ariana', 'Côtes de Raoued'],
    sections: [
      {
        id: 'history',
        body: "Longtemps grenier de Tunis, l'Ariana est restée une plaine agricole irriguée, parsemée de domaines et de jardins. Elle se détache administrativement de Tunis en 1983 et devient l'une des zones résidentielles les plus denses du Grand Tunis.",
        highlights: [
          { title: '1983', description: 'L\'Ariana devient un gouvernorat à part entière.' },
          { title: 'Ceinture verte', description: 'Les jardins nourrissent la capitale pendant des siècles.' },
        ],
      },
      {
        id: 'origin',
        body: "Le nom est ancien et discuté : plusieurs hypothèses le rattachent à l'Ariana antique, région d'Asie centrale reprise dans la géographie médiévale, d'autres à un toponyme local. Aucune ne fait consensus, ce qui en dit long sur l'ancienneté du lieu.",
        highlights: [
          { title: 'Ariana / Ariane', description: 'Toponyme savant repris à la géographie gréco-latine.' },
        ],
      },
      {
        id: 'places',
        body: "Le littoral de Raoued et de Gammarth offre des plages urbaines, tandis que les quartiers anciens gardent des maisons basses et des potagers résiduels.",
        highlights: [
          { title: 'Gammarth', description: 'Plages et pinède, adresse des hôtels de la baie.' },
          { title: 'Raoued', description: 'Zone humide et côte sauvage au nord-est.' },
          { title: 'Soukra', description: 'Marché aux fruits et légumes, mémoire maraîchère de la ville.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine de jardins : tout ce qui pousse autour de la ville arrive assaisonné, frit ou confit sur les tables du Grand Tunis.",
        highlights: [
          { title: 'Salade méchouia', description: 'Poivrons et tomates grillés, thon, œuf dur.' },
          { title: 'Artichauts à l\'huile', description: 'Le légume emblématique des jardins du nord.' },
          { title: 'Eau de rose', description: 'Distillée localement, elle parfume pâtisseries et cafés.' },
        ],
      },
    ],
  },
  {
    id: 'ben-arous',
    geoName: 'Ben Arous',
    name: 'Ben Arous',
    nameAr: 'بن عروس',
    tagline: 'Le sud de la baie, entre vignes, ports et mémoire ouvrière.',
    region: 'Nord',
    isCapital: false,
    coastal: true,
    population: 750000,
    areaKm2: 761,
    knownFor: ['Vignobles de Mornag', 'Radès', 'Hammam Lif'],
    sections: [
      {
        id: 'history',
        body: "Le gouvernorat recouvre le flanc sud de la baie de Tunis, où se succèdent les cités antiques de Maxula (Radès) et les villas romaines de la côte. Il devient au XXe siècle la banlieue industrielle et ouvrière de la capitale.",
        highlights: [
          { title: 'Maxula', description: 'Nom antique de Radès, étape sur la route de Carthage.' },
          { title: 'XXe siècle', description: 'Industrialisation rapide le long de la côte.' },
        ],
      },
      {
        id: 'origin',
        body: "La ville porte le nom d'un saint homme, Sidi Ben Arous, dont le mausolée est un repère de la région. Le toponyme s'est étendu du village au gouvernorat entier.",
        highlights: [
          { title: 'Sidi Ben Arous', description: 'Figure soufie locale, ancrage du nom.' },
        ],
      },
      {
        id: 'places',
        body: "Entre les vignes de Mornag et les plages populaires de Hammam Lif, le gouvernorat garde un caractère de bord de mer habitée toute l'année.",
        highlights: [
          { title: 'Mornag', description: 'Le vignoble historique de Tunisie, appellations et caves.' },
          { title: 'Hammam Lif', description: 'Station thermale antique devenue plage familiale.' },
          { title: 'Radès', description: 'Port commercial et plage urbaine.' },
          { title: 'Jebel Boukornine', description: 'Le mont rose qui ferme la baie au sud.' },
        ],
      },
      {
        id: 'food',
        body: "Le vin structure la table locale, ce qui est rare dans le pays : les caves de Mornag accompagnent poissons grillés et cuisine de ménage.",
        highlights: [
          { title: 'Vins de Mornag', description: 'Rouges et rosés issus des coteaux de la baie.' },
          { title: 'Poisson grillé', description: 'Dorade et loup, à la braise, citron et tabil.' },
          { title: 'Ojja merguez', description: 'Œufs, tomates, merguez : le plat de midi.' },
        ],
      },
    ],
  },
  {
    id: 'manouba',
    geoName: 'Manouba',
    name: 'Manouba',
    nameAr: 'منوبة',
    tagline: 'La plaine du Medjerda et ses palais oubliés.',
    region: 'Nord',
    isCapital: false,
    coastal: false,
    population: 420000,
    areaKm2: 1137,
    knownFor: ['Palais de la rose', 'Plaine agricole', 'Douar Hicher'],
    sections: [
      {
        id: 'history',
        body: "Plaine agricole à l'ouest de Tunis, Manouba a accueilli des résidences de notables et de souverains husseinites, dont le palais de la rose. Le gouvernorat est créé en 2000 par détachement de la capitale.",
        highlights: [
          { title: 'Palais de la rose', description: 'Résidence husseinite du XIXe siècle, aujourd\'hui musée militaire.' },
          { title: '2000', description: 'Création du gouvernorat.' },
        ],
      },
      {
        id: 'origin',
        body: "Le toponyme est berbère, probablement lié au relief ou à un point d'eau de la plaine. Il désignait d'abord un douar avant de nommer la ville puis le gouvernorat.",
        highlights: [
          { title: 'Manouba', description: 'Toponyme berbère antérieur à l\'arabisation.' },
        ],
      },
      {
        id: 'places',
        body: "On y vient pour le patrimoine plutôt que pour la mer : palais, fermes modèles et zones humides de la Medjerda.",
        highlights: [
          { title: 'Musée national militaire', description: 'Installé dans le palais de la rose.' },
          { title: 'Borj El Amri', description: 'Village agricole et base aérienne historique.' },
          { title: 'Oued Medjerda', description: 'Le seul fleuve permanent du pays traverse la plaine.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine de ferme, généreuse et peu épicée : la plaine fournit blé, lait et légumes de saison.",
        highlights: [
          { title: 'Mloukhia', description: 'Corète mijotée des heures avec de l\'agneau.' },
          { title: 'Fromages frais', description: 'Jben et rigouta des fermes de la plaine.' },
          { title: 'Pain tabouna', description: 'Cuit dans le four en argile du village.' },
        ],
      },
    ],
  },
  {
    id: 'nabeul',
    geoName: 'Nabeul',
    name: 'Nabeul',
    nameAr: 'نابل',
    tagline: 'Le Cap Bon : terre de harissa, de potiers et de parfums.',
    region: 'Nord',
    isCapital: false,
    coastal: true,
    population: 830000,
    areaKm2: 2788,
    knownFor: ['Harissa', 'Poterie', 'Hammamet', 'Kerkouane'],
    sections: [
      {
        id: 'history',
        body: "Nabeul est l'antique Neapolis, comptoir fondé au Ve siècle avant notre ère. Le Cap Bon a vu passer Phéniciens, Grecs, Carthaginois et Romains, comme en témoigne Kerkouane, cité punique abandonnée et inscrite à l'UNESCO.",
        highlights: [
          { title: 'Ve siècle av. J.-C.', description: 'Fondation de Neapolis.' },
          { title: 'Kerkouane', description: 'Seule cité punique parvenue presque intacte.' },
        ],
      },
      {
        id: 'origin',
        body: "Nabeul vient du grec Neapolis, « ville nouvelle » — nom que portaient des dizaines de comptoirs méditerranéens. L'arabe l'a conservé presque tel quel.",
        highlights: [
          { title: 'Neapolis', description: '« Ville nouvelle » en grec ancien.' },
        ],
      },
      {
        id: 'places',
        body: "Le Cap Bon se parcourt en boucle : plages de Hammamet, ruines de Kerkouane, villages de potiers et collines plantées d'orangers.",
        highlights: [
          { title: 'Hammamet', description: 'La station balnéaire historique, médina et remparts.' },
          { title: 'Kerkouane', description: 'Ville punique UNESCO, avec ses baignoires taillées.' },
          { title: 'Nabeul médina', description: 'Poterie émaillée et ateliers de tissage.' },
          { title: 'Kélibia', description: 'Fort byzantin et plage de sable blanc.' },
          { title: 'El Haouaria', description: 'Carrières romaines et vols de faucons au cap.' },
        ],
      },
      {
        id: 'food',
        body: "Le Cap Bon est le garde-manger du pays, et la harissa y est un artisanat à part entière : piments séchés au soleil, ail, carvi, coriandre.",
        highlights: [
          { title: 'Harissa du Cap Bon', description: 'Patrimoine immatériel de l\'UNESCO depuis 2022.' },
          { title: 'Oranges maltaises', description: 'Agrumes cueillis en hiver dans les vergers du cap.' },
          { title: 'Poisson du cap', description: 'Poulpe, mérou et sardines grillées.' },
          { title: 'Muscat de Kélibia', description: 'Vin doux, héritage des colons du XIXe siècle.' },
        ],
      },
    ],
  },
  {
    id: 'bizerte',
    geoName: 'Bizerte',
    name: 'Bizerte',
    nameAr: 'بنزرت',
    tagline: 'Le bout du continent, entre vieux port et cap Angela.',
    region: 'Nord',
    isCapital: false,
    coastal: true,
    population: 620000,
    areaKm2: 3750,
    knownFor: ['Vieux port', 'Cap Angela', 'Ichkeul', 'Ain Draham'],
    sections: [
      {
        id: 'history',
        body: "Fondée par les Phéniciens sous le nom d'Hippo Diarrhytus, la ville fut un port militaire convoité : romaine, byzantine, espagnole, puis base navale française jusqu'en 1963. Le vieux port canal reste le cœur de la ville.",
        highlights: [
          { title: 'Hippo Diarrhytus', description: 'Comptoir phénicien puis cité romaine.' },
          { title: '1963', description: 'Évacuation de la base navale française après crise.' },
        ],
      },
      {
        id: 'origin',
        body: "Le nom actuel dérive du punique et du berbère, par une longue série de transcriptions : Hippo, Benzert, Bizerte. Le sens probable renvoie à un « cap » ou à un « passage ».",
        highlights: [
          { title: 'Benzert', description: 'Forme arabe médiévale du toponyme.' },
        ],
      },
      {
        id: 'places',
        body: "Bizerte mêle un port italianisé, des plages du nord et une montagne boisée qui descend vers la mer. Le lac Ichkeul, étape majeure pour les oiseaux migrateurs, est classé par l'UNESCO.",
        highlights: [
          { title: 'Vieux port', description: 'Le canal, les barques et les façades colorées.' },
          { title: 'Cap Angela', description: 'Point le plus septentrional d\'Afrique.' },
          { title: 'Lac Ichkeul', description: 'Zone humide UNESCO, étape des migrateurs.' },
          { title: 'Ain Draham', description: 'Villages de montagne et forêts de chênes-lièges.' },
          { title: 'Ghar El Melh', description: 'Lagune et jardins flottants de la RAMSAR.' },
        ],
      },
      {
        id: 'food',
        body: "Ici, la mer commande : le port débarque chaque matin ce qui finira sur les braises. La cuisine est simple, salée, relevée de citron.",
        highlights: [
          { title: 'Poulpe grillé', description: 'Spécialité des restaurants du vieux port.' },
          { title: 'Sardines farcies', description: 'Chair hachée, persil, câpres, puis friture.' },
          { title: 'Loup de mer', description: 'Cuit entier au four, pommes de terre et safran.' },
        ],
      },
    ],
  },
  {
    id: 'beja',
    geoName: 'Béja',
    name: 'Béja',
    nameAr: 'باجة',
    tagline: 'Le grenier à blé de la Tunisie, sur la Medjerda.',
    region: 'Nord',
    isCapital: false,
    coastal: false,
    population: 300000,
    areaKm2: 3558,
    knownFor: ['Vaga antique', 'Blé dur', 'Testour', 'Montagnes'],
    sections: [
      {
        id: 'history',
        body: "Béja est l'antique Vaga, cité numide puis romaine, prospère grâce aux céréales de la vallée de la Medjerda. La région a longtemps alimenté Rome en blé et reste aujourd'hui le cœur céréalier du pays.",
        highlights: [
          { title: 'Vaga', description: 'Cité numide puis municipium romain.' },
          { title: 'Époque andalouse', description: 'Testour accueille des réfugiés d\'Espagne au XVIIe siècle.' },
        ],
      },
      {
        id: 'origin',
        body: "Le nom Béja est la forme arabe de Vaga, toponyme libyque conservé sans rupture depuis l'Antiquité — un cas rare de continuité sur plus de deux millénaires.",
        highlights: [
          { title: 'Vaga → Béja', description: 'Continuité phonétique sur vingt siècles.' },
        ],
      },
      {
        id: 'places',
        body: "La ville est un point de départ vers les montagnes du nord-ouest et les villages andalous de la plaine.",
        highlights: [
          { title: 'Testour', description: 'Minaret à horloge et architecture andalouse.' },
          { title: 'Dougga', description: 'À la limite du gouvernorat : la cité romaine la mieux conservée d\'Afrique.' },
          { title: 'Ain Tounga', description: 'Forteresse byzantine et sources.' },
          { title: 'Djebel Zouara', description: 'Randonnées et forêts de chêne-liège.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine de blé et de huile d'olive : couscous roulu à la main, pains de campagne, et le fameux poisson de la Medjerda.",
        highlights: [
          { title: 'Couscous au blé vert', description: 'Épis grillés puis égrainés, spécialité de la région.' },
          { title: 'Mloukhia', description: 'Version du nord-ouest, plus épaisse.' },
          { title: 'Huile d\'olive', description: 'Vergers de la plaine, pressage à froid.' },
        ],
      },
    ],
  },
  {
    id: 'jendouba',
    geoName: 'Jendouba',
    name: 'Jendouba',
    nameAr: 'جندوبة',
    tagline: 'Forêts de liège, ruines romaines et corail de Tabarka.',
    region: 'Nord',
    isCapital: false,
    coastal: true,
    population: 400000,
    areaKm2: 3102,
    knownFor: ['Bulla Regia', 'Tabarka', 'Forêts', 'Chemtou'],
    sections: [
      {
        id: 'history',
        body: "La région concentre des sites parmi les plus spectaculaires du pays : Bulla Regia et ses maisons souterraines, Chemtou et son marbre jaune exporté dans tout l'Empire. Tabarka, comptoir génois, a longtemps vécu du corail.",
        highlights: [
          { title: 'Bulla Regia', description: 'Villas romaines enterrées pour fuir la chaleur.' },
          { title: 'Chemtou', description: 'Carrières de marbre numidique, exploitées par Rome.' },
          { title: 'Tabarka', description: 'Comptoir génois du XVIe siècle, pêche au corail.' },
        ],
      },
      {
        id: 'origin',
        body: "Jendouba viendrait du berbère, avec le sens de « corbeille » ou de « terrain bas » — une référence au bassin fertile où la ville s'est construite.",
        highlights: [
          { title: 'Souk El Khemis', description: 'Bourg marchand qui précède la ville actuelle.' },
        ],
      },
      {
        id: 'places',
        body: "Entre la mer et les montagnes de la Kroumirie, le gouvernorat est le plus vert du pays : forêts, cascades et aiguilles de grès.",
        highlights: [
          { title: 'Tabarka', description: 'Aiguille de grès, port et festival de jazz.' },
          { title: 'Bulla Regia', description: 'Mosaïques et maisons à étage souterrain.' },
          { title: 'Ain Draham', description: 'Fraîcheur de montagne, à la lisière des forêts.' },
          { title: 'Les Aiguilles', description: 'Formations rocheuses au-dessus de la mer.' },
          { title: 'Fernana', description: 'Cascades et sources dans la Kroumirie.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine forestière et marine : gibier, champignons, fromages de montagne, et poisson du port de Tabarka.",
        highlights: [
          { title: 'Fromage de chèvre', description: 'Fermes de la Kroumirie, affiné au village.' },
          { title: 'Sanglier', description: 'Mijoté aux aromates, plat d\'hiver.' },
          { title: 'Corail', description: 'Longtemps travaillé à Tabarka, aujourd\'hui protégé.' },
        ],
      },
    ],
  },
  {
    id: 'le-kef',
    geoName: 'El Kef',
    name: 'Le Kef',
    nameAr: 'الكاف',
    tagline: 'La ville haute, posée sur son rocher, face à Jugurtha.',
    region: 'Nord',
    isCapital: false,
    coastal: false,
    population: 250000,
    areaKm2: 4965,
    knownFor: ['Kasbah', 'Table de Jugurtha', 'Sicca Veneria', 'Festival'],
    sections: [
      {
        id: 'history',
        body: "Antique Sicca Veneria, cité numide célèbre pour son temple de Vénus, Le Kef a été un verrou militaire successif : romain, byzantin, arabe, ottoman. Sa kasbah domine encore la vieille ville de ses murs crénelés.",
        highlights: [
          { title: 'Sicca Veneria', description: 'Cité numide et romaine, sanctuaire de Vénus.' },
          { title: 'Kasbah', description: 'Forteresse ottomane restaurée, panorama sur la ville.' },
        ],
      },
      {
        id: 'origin',
        body: "Le Kef vient de l'arabe al-kaf, « le rocher » ou « la falaise » : la ville s'est construite contre une butte calcaire qui lui donne sa silhouette.",
        highlights: [
          { title: 'Al-kaf', description: '« Le rocher », en arabe.' },
        ],
      },
      {
        id: 'places',
        body: "Le Kef est une ville de pierre et de vent, traversée de bassins romains et de ruelles qui montent vers la citadelle.",
        highlights: [
          { title: 'Table de Jugurtha', description: 'Mesa spectaculaire où le roi numide aurait trouvé refuge.' },
          { title: 'Basilique Dar El Kous', description: 'Édifice byzantin à trois nefs.' },
          { title: 'Bassins romains', description: 'Grands bassins alimentés par une source.' },
          { title: 'Musée du Kef', description: 'Collections romaines et stèles funéraires.' },
        ],
      },
      {
        id: 'food',
        body: "La table du Kef est montagnarde : couscous aux légumes secs, viandes mijotées, et un usage généreux du poivre.",
        highlights: [
          { title: 'Couscous barboucha', description: 'Semoule aux fèves et aux herbes.' },
          { title: 'Kamounia', description: 'Ragoût de foie et viande au cumin.' },
          { title: 'Mloukhia du Kef', description: 'Version sombre, longuement réduite.' },
        ],
      },
    ],
  },
  {
    id: 'siliana',
    geoName: 'Siliana',
    name: 'Siliana',
    nameAr: 'سليانة',
    tagline: 'Zama et les oliviers, au pied du Haut Tell.',
    region: 'Nord',
    isCapital: false,
    coastal: false,
    population: 220000,
    areaKm2: 4642,
    knownFor: ['Zama Regia', 'Oliviers', 'Kesra', 'Montagnes'],
    sections: [
      {
        id: 'history',
        body: "Le gouvernorat abrite Zama Regia, où Scipion l'Africain bat Hannibal en 202 avant notre ère, scellant le destin de Carthage. La région est ensuite restée agricole, faite de villages accrochés aux pentes.",
        highlights: [
          { title: '202 av. J.-C.', description: 'Bataille de Zama, défaite définitive de Carthage.' },
          { title: 'Kesra', description: 'Village de montagne, huile d\'olive réputée.' },
        ],
      },
      {
        id: 'origin',
        body: "Siliana dérive du nom antique de la région, transmis par les géographes arabes. Le toponyme a d'abord désigné l'oued avant la ville.",
        highlights: [
          { title: 'Oued Siliana', description: 'Cours d\'eau qui structure la plaine.' },
        ],
      },
      {
        id: 'places',
        body: "Paysages de collines, de blés et d'oliviers : le tourisme y est rural, lent, presque confidentiel.",
        highlights: [
          { title: 'Zama Regia', description: 'Vestiges romains et musée de site.' },
          { title: 'Kesra', description: 'Panorama sur le Haut Tell, huileries traditionnelles.' },
          { title: 'Makthar', description: 'Cité antique de Mactaris, arcs et thermes.' },
          { title: 'Djebel Serj', description: 'Crêtes calcaires et grottes.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine de montagne, parfumée à l'huile nouvelle et aux herbes sauvages cueillies sur les pentes.",
        highlights: [
          { title: 'Huile de Kesra', description: 'Récolte tardive, goût fruité et poivré.' },
          { title: 'Berkoukesh', description: 'Semoule roulée aux légumes secs.' },
          { title: 'Miel de montagne', description: 'Romarin et thym, récoltes familiales.' },
        ],
      },
    ],
  },
  {
    id: 'zaghouan',
    geoName: 'Zaghouan',
    name: 'Zaghouan',
    nameAr: 'زغوان',
    tagline: 'Le temple des eaux qui alimentait Carthage.',
    region: 'Nord',
    isCapital: false,
    coastal: false,
    population: 190000,
    areaKm2: 2768,
    knownFor: ['Temple des Eaux', 'Aqueduc', 'Thuburbo Majus', 'Djebel'],
    sections: [
      {
        id: 'history',
        body: "Zaghouan est l'antique Ziqua, célèbre pour son sanctuaire des eaux d'où partait un aqueduc de plus de 130 kilomètres vers Carthage. Les Romains y venaient en pèlerinage pour la source, encore visible aujourd'hui.",
        highlights: [
          { title: 'Temple des Eaux', description: 'Sanctuaire nymphéen du IIe siècle.' },
          { title: 'Aqueduc de Carthage', description: 'Ouvrage de 132 km, en partie debout.' },
        ],
      },
      {
        id: 'origin',
        body: "Le nom vient du berbère et évoque une source ou un lieu humide. L'eau est ici l'identité de la ville depuis l'Antiquité.",
        highlights: [
          { title: 'Ziqua', description: 'Forme latine du toponyme.' },
        ],
      },
      {
        id: 'places',
        body: "Le djebel Zaghouan domine la plaine et ses oliveraies ; au pied, les ruines romaines de Thuburbo Majus complètent la visite.",
        highlights: [
          { title: 'Djebel Zaghouan', description: 'Réserve naturelle, 1295 mètres, randonnée.' },
          { title: 'Thuburbo Majus', description: 'Capitole, thermes et maisons à mosaïques.' },
          { title: 'Ain El Atrous', description: 'Source et bassins dans la montagne.' },
        ],
      },
      {
        id: 'food',
        body: "Eau de source, huile d'olive et cuisine de campagne : on mange ce que la montagne et la plaine donnent.",
        highlights: [
          { title: 'Huile de Zaghouan', description: 'Une des appellations les plus réputées du pays.' },
          { title: 'Eau de rose', description: 'Distilleries familiales au printemps.' },
          { title: 'Couscous aux herbes', description: 'Aux sept légumes, parfumé au laurier.' },
        ],
      },
    ],
  },
  {
    id: 'sousse',
    geoName: 'Sousse',
    name: 'Sousse',
    nameAr: 'سوسة',
    tagline: 'La perle du Sahel, ribat et médina face à la mer.',
    region: 'Centre',
    isCapital: false,
    coastal: true,
    population: 750000,
    areaKm2: 2669,
    knownFor: ['Ribat', 'Médina UNESCO', 'Port El Kantaoui', 'Monastir'],
    sections: [
      {
        id: 'history',
        body: "Antique Hadrumetum, comptoir phénicien devenu capitale de la Byzacène romaine, Sousse fut surtout un grand port aghlabide, base de la flotte qui lança la conquête de la Sicile au IXe siècle. Sa médina fortifiée en garde la trace.",
        highlights: [
          { title: 'Hadrumetum', description: 'Comptoir phénicien, puis cité romaine.' },
          { title: 'IXe siècle', description: 'Port aghlabide, départ des expéditions vers la Sicile.' },
          { title: '1988', description: 'Médina inscrite au patrimoine mondial.' },
        ],
      },
      {
        id: 'origin',
        body: "Le nom Sousse vient du berbère et signifie probablement « la ville » ou « le campement », sens que l'on retrouve dans plusieurs toponymes du Maghreb.",
        highlights: [
          { title: 'Susa', description: 'Transcription latine du nom local.' },
        ],
      },
      {
        id: 'places',
        body: "Sousse se visite à pied : ribat, grande mosquée sans minaret, borj et souks, puis les plages qui s'étirent vers Port El Kantaoui.",
        highlights: [
          { title: 'Ribat de Sousse', description: 'Monastère-forteresse du VIIIe siècle, vue sur la baie.' },
          { title: 'Médina', description: 'Souks, remparts et grande mosquée.' },
          { title: 'Musée archéologique', description: 'Mosaïques et collections puniques.' },
          { title: 'Port El Kantaoui', description: 'Marina et golf, construits dans les années 1970.' },
        ],
      },
      {
        id: 'food',
        body: "Le Sahel cuisine la mer et la semoule. C'est aussi la patrie de la harissa domestique et des pâtisseries au miel.",
        highlights: [
          { title: 'Poisson du jour', description: 'Grillé au charbon, servi avec slata méchouia.' },
          { title: 'Samsa', description: 'Feuilleté aux amandes et sésame, très sucré.' },
          { title: 'Chakchouka', description: 'Légumes confits, œufs, piment doux.' },
        ],
      },
    ],
  },
  {
    id: 'monastir',
    geoName: 'Monastir',
    name: 'Monastir',
    nameAr: 'المنستير',
    tagline: 'La ville ribat, entre pierre fortifiée et mausolée.',
    region: 'Centre',
    isCapital: false,
    coastal: true,
    population: 600000,
    areaKm2: 1019,
    knownFor: ['Ribat', 'Mausolée Bourguiba', 'Marina', 'Ruspina'],
    sections: [
      {
        id: 'history',
        body: "Monastir est l'antique Ruspina, place forte punique puis romaine. Son ribat du VIIIe siècle, l'un des plus anciens du Maghreb, en fait un lieu de mémoire militaire et spirituelle. C'est aussi la ville natale de Habib Bourguiba.",
        highlights: [
          { title: 'Ruspina', description: 'Cité punique et romaine, base de César en 46 av. J.-C.' },
          { title: 'Ribat', description: 'Forteresse-monastère du VIIIe siècle.' },
        ],
      },
      {
        id: 'origin',
        body: "Monastir vient du latin monasterium, « monastère » : le nom rappelle les moines-soldats qui tenaient le ribat et veillaient sur la côte.",
        highlights: [
          { title: 'Monasterium', description: 'Du latin au toponyme arabe actuel.' },
        ],
      },
      {
        id: 'places',
        body: "Tout est à quelques minutes : le ribat, le mausolée, la marina et l'aéroport. Monastir est une ville compacte, très dense en patrimoine.",
        highlights: [
          { title: 'Ribat', description: 'Tours, cellules et musée islamique.' },
          { title: 'Mausolée Bourguiba', description: 'Marbre, coupole dorée, tombeau du premier président.' },
          { title: 'Marina', description: 'Port de plaisance et promenade.' },
          { title: 'Skanes', description: 'Longue plage et zone hôtelière.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine côtière du Sahel : poissons grillés, poulpe en salade, et pâtisseries au miel de romarin.",
        highlights: [
          { title: 'Poulpe à l\'huile', description: 'Salade froide, citron et coriandre.' },
          { title: 'Brik au thon', description: 'Version côtière, croustillante.' },
          { title: 'Makroudh de Monastir', description: 'Petit, dense, très parfumé.' },
        ],
      },
    ],
  },
  {
    id: 'mahdia',
    geoName: 'Mahdia',
    name: 'Mahdia',
    nameAr: 'المهدية',
    tagline: 'L\'ancienne capitale fatimide, doigt de pierre sur la mer.',
    region: 'Centre',
    isCapital: false,
    coastal: true,
    population: 450000,
    areaKm2: 2966,
    knownFor: ['Capitale fatimide', 'Cimetière marin', 'Sardines', 'Soieries'],
    sections: [
      {
        id: 'history',
        body: "Fondée en 916 par le calife fatimide Ubayd Allah al-Mahdi, Mahdia fut la première capitale de l'Empire fatimide avant son départ pour l'Égypte. Ville-port fortifiée, elle a longtemps vécu de la pêche et du tissage de la soie.",
        highlights: [
          { title: '916', description: 'Fondation de la capitale fatimide.' },
          { title: 'Xe siècle', description: 'Départ des Fatimides vers Le Caire.' },
        ],
      },
      {
        id: 'origin',
        body: "Mahdia porte le nom du calife al-Mahdi, « le bien guidé ». Le toponyme est donc une profession de foi politique autant qu'un nom de ville.",
        highlights: [
          { title: 'Al-Mahdi', description: 'Titre du fondateur fatimide.' },
        ],
      },
      {
        id: 'places',
        body: "La presqu'île se termine sur un cimetière marin blanc face au large, l'un des paysages les plus photographiés de Tunisie.",
        highlights: [
          { title: 'Cimetière marin', description: 'Stèles blanches entre mer et remparts.' },
          { title: 'Skifa Kahla', description: 'Porte noire, entrée fortifiée de la médina.' },
          { title: 'Borj El Kebir', description: 'Forteresse ottomane en bord de falaise.' },
          { title: 'El Jem', description: 'À 60 km : amphithéâtre romain UNESCO, le plus grand d\'Afrique.' },
        ],
      },
      {
        id: 'food',
        body: "Mahdia est la capitale tunisienne de la sardine, et son huile d'olive est l'une des plus réputées du Sahel.",
        highlights: [
          { title: 'Sardines grillées', description: 'Pêche du matin, braise, citron.' },
          { title: 'Charmoula', description: 'Poisson séché et épicé, spécialité locale.' },
          { title: 'Huile d\'olive', description: 'Vergers de la côte, récolte précoce.' },
        ],
      },
    ],
  },
  {
    id: 'sfax',
    geoName: 'Sfax',
    name: 'Sfax',
    nameAr: 'صفاقس',
    tagline: 'La capitale du Sud, olive et commerce depuis mille ans.',
    region: 'Centre',
    isCapital: false,
    coastal: true,
    population: 1050000,
    areaKm2: 7545,
    knownFor: ['Médina UNESCO', 'Huile d\'olive', 'Kerkennah', 'Chaal'],
    sections: [
      {
        id: 'history',
        body: "Sfax succède aux cités antiques de Taparura et Thaenae. Reconstruite par les Aghlabides, elle devient une république marchande quasi autonome, vivant du commerce transsaharien et de la course, avant de se spécialiser dans l'huile d'olive.",
        highlights: [
          { title: 'IXe siècle', description: 'Refondation aghlabide derrière ses remparts.' },
          { title: 'XVIIe siècle', description: 'Grande place marchande, consuls européens.' },
          { title: '1988', description: 'Médina inscrite au patrimoine mondial.' },
        ],
      },
      {
        id: 'origin',
        body: "Le nom Sfax dérive du toponyme antique de la région, probablement berbère, transmis par les géographes arabes. Son sens d'origine reste discuté.",
        highlights: [
          { title: 'Taparura', description: 'Cité antique à l\'emplacement du port actuel.' },
        ],
      },
      {
        id: 'places',
        body: "La médina de Sfax est une des mieux préservées du pays, et les îles Kerkennah, à une heure de bateau, offrent un temps suspendu.",
        highlights: [
          { title: 'Médina', description: 'Bab Diwan, souk El Haddadine, grande mosquée.' },
          { title: 'Dar Jellouli', description: 'Maison de notable devenue musée des arts et traditions.' },
          { title: 'Kerkennah', description: 'Îles plates, palmeraies et pêche à la charfia.' },
          { title: 'Chott El Jerid', description: 'Porte du désert, à la lisière sud du gouvernorat.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine de commerce et de mer : le chaal (poulpe séché) parfume les plats, et l'huile d'olive est omniprésente.",
        highlights: [
          { title: 'Chaal', description: 'Poulpe séché, mijoté avec tomate et piment.' },
          { title: 'Couscous au poisson', description: 'Semoule, mérou, légumes du marché.' },
          { title: 'Huile d\'olive de Sfax', description: 'La plus exportée du pays.' },
          { title: 'Makroudh de Sfax', description: 'Version fine, aux dattes.' },
        ],
      },
    ],
  },
  {
    id: 'kairouan',
    geoName: 'Kairouan',
    name: 'Kairouan',
    nameAr: 'القيروان',
    tagline: 'La quatrième ville sainte de l\'Islam.',
    region: 'Centre',
    isCapital: false,
    coastal: false,
    population: 620000,
    areaKm2: 6712,
    knownFor: ['Grande Mosquée', 'UNESCO', 'Tapis', 'Makroudh'],
    sections: [
      {
        id: 'history',
        body: "Fondée en 670 par Uqba ibn Nafi, Kairouan est la première capitale musulmane du Maghreb et le point de départ de l'islamisation de l'Afrique du Nord. Sa Grande Mosquée, plusieurs fois reconstruite, a servi de modèle à tout l'Occident musulman.",
        highlights: [
          { title: '670', description: 'Fondation par Uqba ibn Nafi.' },
          { title: 'IXe siècle', description: 'Grande Mosquée dans sa forme actuelle, sous les Aghlabides.' },
          { title: '1988', description: 'Inscription au patrimoine mondial.' },
        ],
      },
      {
        id: 'origin',
        body: "Kairouan vient du persan kārvān, « caravane » ou « campement militaire ». Le nom rappelle que la ville est née d'un camp de conquête devenu cité.",
        highlights: [
          { title: 'Kārvān', description: '« Caravane », en persan.' },
        ],
      },
      {
        id: 'places',
        body: "La médina est un lacis de ruelles blanchies à la chaux, ponctué de bassins, de zaouïas et d'ateliers de tissage.",
        highlights: [
          { title: 'Grande Mosquée', description: 'Minaret massif, cour de marbre, forêt de colonnes antiques.' },
          { title: 'Bassins des Aghlabides', description: 'Réservoirs du IXe siècle, toujours en eau.' },
          { title: 'Zaouïa Sidi Sahbi', description: 'Sanctuaire du compagnon du Prophète, céramiques.' },
          { title: 'Souks de tapis', description: 'Tapis noués main, classés par origine.' },
        ],
      },
      {
        id: 'food',
        body: "Kairouan est la capitale du makroudh, et sa cuisine est plus douce, moins pimentée que celle de la côte.",
        highlights: [
          { title: 'Makroudh', description: 'Semoule, dattes, miel : la référence nationale.' },
          { title: 'Couscous aux légumes', description: 'Version du Centre, généreuse et parfumée.' },
          { title: 'Mechoui', description: 'Agneau rôti lentement, pour les grandes occasions.' },
        ],
      },
    ],
  },
  {
    id: 'kasserine',
    geoName: 'Kasserine',
    name: 'Kasserine',
    nameAr: 'القصرين',
    tagline: 'Sufetula, le Djebel Chambi et les hauts plateaux.',
    region: 'Centre',
    isCapital: false,
    coastal: false,
    population: 450000,
    areaKm2: 8066,
    knownFor: ['Sbeitla', 'Djebel Chambi', 'Cillium', 'Hauts plateaux'],
    sections: [
      {
        id: 'history',
        body: "Le gouvernorat abrite Cillium (Kasserine) et Sufetula (Sbeitla), l'une des cités romaines les mieux conservées du pays, prise par les armées arabes en 647. La région est aussi le point culminant de Tunisie.",
        highlights: [
          { title: 'Sufetula', description: 'Ville romaine de Sbeitla, temples et arcs.' },
          { title: '647', description: 'Bataille de Sufetula, défaite byzantine.' },
        ],
      },
      {
        id: 'origin',
        body: "Kasserine dérive de Cillium, nom antique de la cité, arabisé au fil des siècles. Le toponyme a d'abord désigné le site romain avant la ville moderne.",
        highlights: [
          { title: 'Cillium → Kasserine', description: 'Continuité du toponyme antique.' },
        ],
      },
      {
        id: 'places',
        body: "Hauts plateaux, pins d'Alep et steppes : le gouvernorat est le plus montagneux du Centre et le moins fréquenté.",
        highlights: [
          { title: 'Sbeitla', description: 'Sufetula, son capitole à trois temples et ses thermes.' },
          { title: 'Djebel Chambi', description: '1 544 m, toit de la Tunisie, parc national.' },
          { title: 'Thala', description: 'Village de montagne et sources.' },
          { title: 'Haïdra', description: 'Forteresse byzantine d\'Ammaedara.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine de steppe, à base de blé, d'agneau et de légumes secs, relevée de piment séché.",
        highlights: [
          { title: 'Berkoukesh', description: 'Gros couscous aux légumes secs.' },
          { title: 'Agneau des hauts plateaux', description: 'Grillé ou en ragoût, viande ferme et parfumée.' },
          { title: 'Piment séché', description: 'Séchoirs à ciel ouvert, base de la harissa familiale.' },
        ],
      },
    ],
  },
  {
    id: 'sidi-bouzid',
    geoName: 'Sidi Bouzid',
    name: 'Sidi Bouzid',
    nameAr: 'سيدي بوزيد',
    tagline: 'Le pays de l\'olivier, point de départ de 2010.',
    region: 'Centre',
    isCapital: false,
    coastal: false,
    population: 460000,
    areaKm2: 6994,
    knownFor: ['Révolution 2010', 'Oliviers', 'Maraîchage', 'Steppe'],
    sections: [
      {
        id: 'history',
        body: "Zone agricole de la steppe, Sidi Bouzid est entrée dans l'histoire contemporaine le 17 décembre 2010, quand Mohamed Bouazizi s'immole à Sidi Bouzid, déclenchant la révolution tunisienne puis les printemps arabes.",
        highlights: [
          { title: '17 décembre 2010', description: 'Début de la révolution tunisienne.' },
          { title: '2011', description: 'Chute du régime, premières élections libres.' },
        ],
      },
      {
        id: 'origin',
        body: "La ville porte le nom d'un saint local, Sidi Bouzid, dont la zaouïa a fixé le village au milieu de la steppe.",
        highlights: [
          { title: 'Sidi Bouzid', description: 'Saint patron, ancrage du toponyme.' },
        ],
      },
      {
        id: 'places',
        body: "Le gouvernorat est rural et discret : marchés agricoles, oliveraies et villages de la steppe.",
        highlights: [
          { title: 'Sidi Bouzid ville', description: 'Place Mohamed Bouazizi, mémoire de 2010.' },
          { title: 'Regueb', description: 'Marché agricole et oliveraies.' },
          { title: 'Jelma', description: 'Village de la steppe, artisanat du tissage.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine de l'huile d'olive et du blé : plats simples, longs à cuire, faits pour nourrir après les moissons.",
        highlights: [
          { title: 'Mloukhia', description: 'Servie avec du pain de semoule.' },
          { title: 'Huile d\'olive', description: 'Oliveraies en extension depuis les années 1980.' },
          { title: 'Bricks et msemen', description: 'Feuilletés du petit-déjeuner.' },
        ],
      },
    ],
  },
  {
    id: 'gabes',
    geoName: 'Gabès',
    name: 'Gabès',
    nameAr: 'قابس',
    tagline: 'L\'oasis au bord de la mer, entre henné et palmiers.',
    region: 'Sud',
    isCapital: false,
    coastal: true,
    population: 420000,
    areaKm2: 7175,
    knownFor: ['Oasis maritime', 'Matmata', 'Henné', 'Grenades'],
    sections: [
      {
        id: 'history',
        body: "Antique Tacapes, Gabès a toujours vécu de son oasis : c'est l'un des rares endroits au monde où une palmeraie touche la mer. La ville a ensuite été un grand port commercial et un centre chimique, aujourd'hui en reconversion.",
        highlights: [
          { title: 'Tacapes', description: 'Cité antique, étape caravanière.' },
          { title: 'Oasis', description: 'Palmeraie littorale, unique en Méditerranée.' },
        ],
      },
      {
        id: 'origin',
        body: "Gabès vient du nom antique Tacapes, transmis par les géographes arabes sous la forme Qābis. Le sens d'origine du toponyme libyque reste incertain.",
        highlights: [
          { title: 'Qābis', description: 'Forme arabe médiévale.' },
        ],
      },
      {
        id: 'places',
        body: "Autour de la ville, les villages berbères de Matmata creusent leurs maisons dans la roche, et les oasis de montagne changent de couleur à chaque saison.",
        highlights: [
          { title: 'Matmata', description: 'Maisons troglodytes, décor de Star Wars.' },
          { title: 'Oasis de Gabès', description: 'Souks, jardins et canaux d\'irrigation.' },
          { title: 'Chenini Gabès', description: 'Village berbère perché.' },
          { title: 'El Hamma', description: 'Sources chaudes et palmeraie.' },
        ],
      },
      {
        id: 'food',
        body: "Le Sud cuisine avec les dattes, le henné et les épices de caravane. La mer reste toute proche.",
        highlights: [
          { title: 'Grenades de Gabès', description: 'Les meilleures du pays, sucrées et acidulées.' },
          { title: 'Couscous aux dattes', description: 'Version sucrée-salée des oasis.' },
          { title: 'Poisson grillé', description: 'Port de Gabès, pêche du jour.' },
        ],
      },
    ],
  },
  {
    id: 'medenine',
    geoName: 'Médenine',
    name: 'Médenine',
    nameAr: 'مدنين',
    tagline: 'Djerba, Zarzis et les portes du désert.',
    region: 'Sud',
    isCapital: false,
    coastal: true,
    population: 520000,
    areaKm2: 8588,
    knownFor: ['Djerba UNESCO', 'Zarzis', 'Gigthis', 'Ksour'],
    sections: [
      {
        id: 'history',
        body: "Le gouvernorat abrite l'île de Djerba, carrefour de Méditerranée où se côtoient musulmans, juifs et chrétiens depuis l'Antiquité, ainsi que les comptoirs antiques de Gigthis et de Zita. Médenine elle-même est un gros bourg marchand.",
        highlights: [
          { title: 'Djerba', description: 'Inscrite à l\'UNESCO en 2023.' },
          { title: 'Gigthis', description: 'Cité romaine au bord de la lagune de Bou Grara.' },
          { title: 'XVIe siècle', description: 'Fort espagnol de Houmt Souk.' },
        ],
      },
      {
        id: 'origin',
        body: "Médenine viendrait du berbère, avec un sens lié à un lieu habité ou à un point d'eau. Le toponyme a d'abord désigné un village avant de couvrir tout le Sud-Est.",
        highlights: [
          { title: 'Medenine', description: 'Toponyme berbère, antérieur à l\'arabe.' },
        ],
      },
      {
        id: 'places',
        body: "Entre mer et désert, le gouvernorat offre des paysages très contrastés : plages de Djerba, oliveraies de Zarzis, ksour de montagne et chotts.",
        highlights: [
          { title: 'Djerba', description: 'Houmt Souk, synagogue de la Ghriba, plages de Sidi Mahrez.' },
          { title: 'Zarzis', description: 'Longue plage et port de pêche.' },
          { title: 'Ksar Medenine', description: 'Greniers collectifs berbères à étages.' },
          { title: 'Gigthis', description: 'Ruines romaines face à la lagune.' },
          { title: 'Bou Grara', description: 'Village de potiers et port vers les îles.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine insulaire et saharienne : poulpe, dattes, huile d'olive et pain cuit dans le four du village.",
        highlights: [
          { title: 'Poulpe de Djerba', description: 'Séché puis mijoté, ou grillé frais.' },
          { title: 'Bazin', description: 'Galette d\'orge et sauce épicée, plat du Sud.' },
          { title: 'Dattes Deglet Nour', description: 'Récolte des palmeraies de la région.' },
        ],
      },
    ],
  },
  {
    id: 'tataouine',
    geoName: 'Tataouine',
    name: 'Tataouine',
    nameAr: 'تطاوين',
    tagline: 'Les ksour, les montagnes et une autre planète.',
    region: 'Sud',
    isCapital: false,
    coastal: false,
    population: 160000,
    areaKm2: 38889,
    knownFor: ['Ksour', 'Chenini', 'Star Wars', 'Douiret'],
    sections: [
      {
        id: 'history',
        body: "Le gouvernorat le plus vaste du pays est aussi le moins peuplé. Les Amazighs y ont bâti des ksour, greniers collectifs fortifiés, pour stocker les récoltes face aux razzias. Les villages de crête comme Chenini et Douiret témoignent de cette architecture défensive.",
        highlights: [
          { title: 'Ksour', description: 'Greniers collectifs à cellules, patrimoine amazigh.' },
          { title: 'XVe siècle', description: 'Apogée des villages de crête.' },
        ],
      },
      {
        id: 'origin',
        body: "Tataouine viendrait du berbère Tittawin, parfois traduit par « les sources » ou « les yeux ». Le nom a inspiré George Lucas pour la planète Tatooine.",
        highlights: [
          { title: 'Tittawin', description: 'Toponyme berbère à l\'origine du nom.' },
          { title: 'Tatooine', description: 'Repris par Star Wars après un tournage dans la région.' },
        ],
      },
      {
        id: 'places',
        body: "Ici, le voyage est minéral : villages de terre perchés, pistes de sable et silence total la nuit.",
        highlights: [
          { title: 'Chenini', description: 'Village amazigh accroché à la falaise, mosquée du XIe siècle.' },
          { title: 'Douiret', description: ' Village abandonné, ruelles taillées dans la roche.' },
          { title: 'Ksar Ghilane', description: 'Oasis au bord du Grand Erg Oriental, sources chaudes.' },
          { title: 'Ksar Hadada', description: 'Décor du tournage de Star Wars.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine de pasteurs et d'oasis : pain d'orge, huile d'olive, dattes et viande séchée.",
        highlights: [
          { title: 'Pain d\'orge', description: 'Cuit sous le sable, croustillant.' },
          { title: 'Viande séchée', description: 'Conservée au sel et à l\'huile, pour les longs déplacements.' },
          { title: 'Thé aux pignons', description: 'Servi très sucré, à la menthe.' },
        ],
      },
    ],
  },
  {
    id: 'gafsa',
    geoName: 'Gafsa',
    name: 'Gafsa',
    nameAr: 'قفصة',
    tagline: 'Capsa antique, phosphates et piscines romaines.',
    region: 'Sud',
    isCapital: false,
    coastal: false,
    population: 350000,
    areaKm2: 7807,
    knownFor: ['Capsa', 'Piscines romaines', 'Phosphates', 'Oasis'],
    sections: [
      {
        id: 'history',
        body: "Antique Capsa, oasis et verrou sur la route du désert, Gafsa fut une place forte romaine puis byzantine. Au XXe siècle, l'exploitation des phosphates en a fait un bassin industriel, avec ses villes minières de Metlaoui et Redeyef.",
        highlights: [
          { title: 'Capsa', description: 'Cité antique et forteresse byzantine.' },
          { title: '1899', description: 'Début de l\'exploitation des phosphates.' },
        ],
      },
      {
        id: 'origin',
        body: "Gafsa est la forme arabe de Capsa, nom antique transmis presque intact. Le toponyme a plus de deux mille ans.",
        highlights: [
          { title: 'Capsa → Gafsa', description: 'Continuité du nom antique.' },
        ],
      },
      {
        id: 'places',
        body: "Le gouvernorat mêle oasis, montagnes et patrimoine industriel, avec le célèbre train minier qui traverse les paysages de Metlaoui.",
        highlights: [
          { title: 'Piscines romaines', description: 'Bassins antiques alimentés par une source, en pleine ville.' },
          { title: 'Seldja', description: 'Gorges spectaculaires traversées par la voie ferrée.' },
          { title: 'Metlaoui', description: 'Départ du Lézard Rouge, train touristique.' },
          { title: 'Sened', description: 'Village berbère et sources.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine d'oasis : dattes, blé, agneau et huile d'olive, avec des plats cuits longtemps dans le sable.",
        highlights: [
          { title: 'Couscous aux dattes', description: 'Sucré-salé, spécialité du Sud-Ouest.' },
          { title: 'Agneau de Gafsa', description: 'Élevé en steppe, viande très parfumée.' },
          { title: 'Dattes', description: 'Palmeraies de la région, variétés locales.' },
        ],
      },
    ],
  },
  {
    id: 'tozeur',
    geoName: 'Tozeur',
    name: 'Tozeur',
    nameAr: 'توزر',
    tagline: 'Briques ocre, palmeraies et portes du désert.',
    region: 'Sud',
    isCapital: false,
    coastal: false,
    population: 115000,
    areaKm2: 4719,
    knownFor: ['Oasis', 'Deglet Nour', 'Chott El Jerid', 'Briques'],
    sections: [
      {
        id: 'history',
        body: "Antique Thuzuros, Tozeur a prospéré grâce à l'eau et aux dattes, sur la route caravanière du Sahara. Sa médina de briques jaunes, aux motifs géométriques, est l'une des plus singulières du pays.",
        highlights: [
          { title: 'Thuzuros', description: 'Cité antique, étape saharienne.' },
          { title: 'Route caravanière', description: 'Passage vers le Chott et le Grand Erg.' },
        ],
      },
      {
        id: 'origin',
        body: "Tozeur vient du nom antique Thuzuros, transmis par les géographes arabes sous la forme Tūzar. L'origine libyque du toponyme reste obscure.",
        highlights: [
          { title: 'Tūzar', description: 'Forme arabe médiévale.' },
        ],
      },
      {
        id: 'places',
        body: "La palette est totale : ocre des murs, vert des palmeraies, blanc du sel du Chott. Le désert commence à la sortie de la ville.",
        highlights: [
          { title: 'Médina de Tozeur', description: 'Briques en relief, souk et ruelles ombragées.' },
          { title: 'Chott El Jerid', description: 'Lac salé, mirages et couleurs changeantes.' },
          { title: 'Ong Jmel', description: 'Dunes et décors de Star Wars.' },
          { title: 'Chebika & Tamerza', description: 'Oasis de montagne et cascades.' },
          { title: 'Palmeraie', description: '250 000 palmiers, irrigation traditionnelle.' },
        ],
      },
      {
        id: 'food',
        body: "Ici, la datte est un plat à part entière, et le pain cuit dans le four de terre accompagne tout.",
        highlights: [
          { title: 'Deglet Nour', description: 'La datte « doigt de lumière », exportée dans le monde entier.' },
          { title: 'Pain dans le sable', description: 'Cuit sous les braises, une tradition saharienne.' },
          { title: 'Chakhchoukha', description: 'Galette émiettée, sauce tomate et viande.' },
        ],
      },
    ],
  },
  {
    id: 'kebili',
    geoName: 'Kébili',
    name: 'Kébili',
    nameAr: 'قبلي',
    tagline: 'Douz, porte du Sahara, et la mer de sable.',
    region: 'Sud',
    isCapital: false,
    coastal: false,
    population: 165000,
    areaKm2: 22084,
    knownFor: ['Douz', 'Sahara', 'Dattes', 'Festival'],
    sections: [
      {
        id: 'history',
        body: "Le Nefzaoua, région de Kébili, vit depuis des millénaires de ses oasis et du commerce caravanier. Douz, à la lisière du Grand Erg Oriental, était la dernière étape avant le désert et le marché aux dattes du Sud.",
        highlights: [
          { title: 'Nefzaoua', description: 'Chapelet d\'oasis autour de la ville.' },
          { title: 'Caravanes', description: 'Douz, point de départ vers le Grand Erg.' },
        ],
      },
      {
        id: 'origin',
        body: "Kébili viendrait du berbère, avec un sens lié à un lieu bas ou à une cuvette — ce que la géographie confirme : la ville est posée dans une dépression du Nefzaoua.",
        highlights: [
          { title: 'Nefzaoua', description: 'Nom historique de la région.' },
        ],
      },
      {
        id: 'places',
        body: "Le gouvernorat est presque entièrement désertique, ponctué d'oasis et de villages de terre.",
        highlights: [
          { title: 'Douz', description: 'Porte du Sahara, marché aux dattes et Festival des dattes.' },
          { title: 'Grand Erg Oriental', description: 'Dunes à perte de vue, méharées.' },
          { title: 'Ksar Ghilane', description: 'Oasis et source chaude au milieu des dunes.' },
          { title: 'Souk Lahad', description: 'Village oasis, poterie et palmiers.' },
        ],
      },
      {
        id: 'food',
        body: "Cuisine saharienne : dattes, lait fermenté, pain cuit dans le sable et viande séchée pour les voyages.",
        highlights: [
          { title: 'Lait de chamelle', description: 'Servi frais ou fermenté, à Douz.' },
          { title: 'Dattes du Nefzaoua', description: 'Variétés locales, séchées au soleil.' },
          { title: 'Mechoui', description: 'Agneau entier rôti dans le sable, plat de fête.' },
        ],
      },
    ],
  },
];

export const CITY_BY_GEO: ReadonlyMap<string, TunisianCity> = new Map(
  CITIES.map((city) => [city.geoName, city]),
);

export const CITY_BY_ID: ReadonlyMap<string, TunisianCity> = new Map(
  CITIES.map((city) => [city.id, city]),
);

export const REGIONS: Region[] = ['Nord', 'Centre', 'Sud'];

export const SECTION_LABELS: Record<SectionId, string> = {
  history: 'Histoire',
  origin: 'Origine du nom',
  places: 'À visiter',
  food: 'Gastronomie',
};
