export interface GalleryItem {
  title: string;
  images: readonly string[];
}

export interface CityGallery {
  cityId: string;
  cityName: string;
  places: readonly GalleryItem[];
  food: readonly GalleryItem[];
}

export const CITY_GALLERIES: readonly CityGallery[] = 
[
    {
        "cityId":  "ariana",
        "cityName":  "Ariana",
        "places":  [
                       {
                           "title":  "Parc Ennahli",
                           "images":  [
                                          "/gouvernorats/Ariana/Lieux-a-visiter/01-parc-ennahli-1.jpg",
                                          "/gouvernorats/Ariana/Lieux-a-visiter/01-parc-ennahli-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Paysages Agricoles",
                           "images":  [
                                          "/gouvernorats/Ariana/Lieux-a-visiter/03-paysages-agricoles-1.jpg",
                                          "/gouvernorats/Ariana/Lieux-a-visiter/03-paysages-agricoles-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Raoued",
                           "images":  [
                                          "/gouvernorats/Ariana/Lieux-a-visiter/02-raoued-1.jpg",
                                          "/gouvernorats/Ariana/Lieux-a-visiter/02-raoued-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Patisseries Tunisiennes",
                         "images":  [
                                        "/gouvernorats/Ariana/Gastronomie/01-patisseries-tunisiennes-1.jpg",
                                        "/gouvernorats/Ariana/Gastronomie/01-patisseries-tunisiennes-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Produits Agricoles",
                         "images":  [
                                        "/gouvernorats/Ariana/Gastronomie/02-produits-agricoles-1.jpg",
                                        "/gouvernorats/Ariana/Gastronomie/02-produits-agricoles-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "ben-arous",
        "cityName":  "Ben Arous",
        "places":  [
                       {
                           "title":  "Foret De Rades",
                           "images":  [
                                          "/gouvernorats/Ben Arous/Lieux-a-visiter/02-foret-de-rades-1.jpg",
                                          "/gouvernorats/Ben Arous/Lieux-a-visiter/02-foret-de-rades-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Hammam Lif",
                           "images":  [
                                          "/gouvernorats/Ben Arous/Lieux-a-visiter/03-hammam-lif-1.jpg",
                                          "/gouvernorats/Ben Arous/Lieux-a-visiter/03-hammam-lif-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Rades",
                           "images":  [
                                          "/gouvernorats/Ben Arous/Lieux-a-visiter/01-rades-1.jpg",
                                          "/gouvernorats/Ben Arous/Lieux-a-visiter/01-rades-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Plats Traditionnels",
                         "images":  [
                                        "/gouvernorats/Ben Arous/Gastronomie/01-plats-traditionnels-1.jpg",
                                        "/gouvernorats/Ben Arous/Gastronomie/01-plats-traditionnels-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Produits Locaux",
                         "images":  [
                                        "/gouvernorats/Ben Arous/Gastronomie/02-produits-locaux-1.jpg",
                                        "/gouvernorats/Ben Arous/Gastronomie/02-produits-locaux-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "bizerte",
        "cityName":  "Bizerte",
        "places":  [
                       {
                           "title":  "Cap Angela",
                           "images":  [
                                          "/gouvernorats/Bizerte/Lieux-a-visiter/02-cap-angela-1.jpg",
                                          "/gouvernorats/Bizerte/Lieux-a-visiter/02-cap-angela-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Lac Ichkeul",
                           "images":  [
                                          "/gouvernorats/Bizerte/Lieux-a-visiter/03-lac-ichkeul-1.jpg",
                                          "/gouvernorats/Bizerte/Lieux-a-visiter/03-lac-ichkeul-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Vieux Port",
                           "images":  [
                                          "/gouvernorats/Bizerte/Lieux-a-visiter/01-vieux-port-1.jpg",
                                          "/gouvernorats/Bizerte/Lieux-a-visiter/01-vieux-port-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Couscous Au Poisson",
                         "images":  [
                                        "/gouvernorats/Bizerte/Gastronomie/03-couscous-au-poisson-1.jpg",
                                        "/gouvernorats/Bizerte/Gastronomie/03-couscous-au-poisson-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Fruits De Mer",
                         "images":  [
                                        "/gouvernorats/Bizerte/Gastronomie/02-fruits-de-mer-1.jpg",
                                        "/gouvernorats/Bizerte/Gastronomie/02-fruits-de-mer-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Poissons",
                         "images":  [
                                        "/gouvernorats/Bizerte/Gastronomie/01-poissons-1.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "beja",
        "cityName":  "Béja",
        "places":  [
                       {
                           "title":  "Dougga",
                           "images":  [
                                          "/gouvernorats/Béja/Lieux-a-visiter/02-dougga-1.jpg",
                                          "/gouvernorats/Béja/Lieux-a-visiter/02-dougga-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Paysages Agricoles",
                           "images":  [
                                          "/gouvernorats/Béja/Lieux-a-visiter/03-paysages-agricoles-1.jpg",
                                          "/gouvernorats/Béja/Lieux-a-visiter/03-paysages-agricoles-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Testour",
                           "images":  [
                                          "/gouvernorats/Béja/Lieux-a-visiter/01-testour-1.jpg",
                                          "/gouvernorats/Béja/Lieux-a-visiter/01-testour-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Fromages",
                         "images":  [
                                        "/gouvernorats/Béja/Gastronomie/01-fromages-1.jpg"
                                    ]
                     },
                     {
                         "title":  "Pain Traditionnel",
                         "images":  [
                                        "/gouvernorats/Béja/Gastronomie/02-pain-traditionnel-1.jpg",
                                        "/gouvernorats/Béja/Gastronomie/02-pain-traditionnel-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Produits Cerealiers",
                         "images":  [
                                        "/gouvernorats/Béja/Gastronomie/03-produits-cerealiers-1.jpg",
                                        "/gouvernorats/Béja/Gastronomie/03-produits-cerealiers-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "gabes",
        "cityName":  "Gabès",
        "places":  [
                       {
                           "title":  "Chenini Gabes",
                           "images":  [
                                          "/gouvernorats/Gabès/Lieux-a-visiter/02-chenini-gabes-1.jpg",
                                          "/gouvernorats/Gabès/Lieux-a-visiter/02-chenini-gabes-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Oasis Maritime",
                           "images":  [
                                          "/gouvernorats/Gabès/Lieux-a-visiter/01-oasis-maritime-1.jpg",
                                          "/gouvernorats/Gabès/Lieux-a-visiter/01-oasis-maritime-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Plages",
                           "images":  [
                                          "/gouvernorats/Gabès/Lieux-a-visiter/03-plages-1.jpg",
                                          "/gouvernorats/Gabès/Lieux-a-visiter/03-plages-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Fruits De Mer",
                         "images":  [
                                        "/gouvernorats/Gabès/Gastronomie/03-fruits-de-mer-1.jpg",
                                        "/gouvernorats/Gabès/Gastronomie/03-fruits-de-mer-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Henne",
                         "images":  [
                                        "/gouvernorats/Gabès/Gastronomie/01-henne-1.jpg",
                                        "/gouvernorats/Gabès/Gastronomie/01-henne-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Poissons",
                         "images":  [
                                        "/gouvernorats/Gabès/Gastronomie/02-poissons-1.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "gafsa",
        "cityName":  "Gafsa",
        "places":  [
                       {
                           "title":  "Oasis De Gafsa",
                           "images":  [
                                          "/gouvernorats/Gafsa/Lieux-a-visiter/01-oasis-de-gafsa-1.jpg"
                                      ]
                       },
                       {
                           "title":  "Piscine Romaine",
                           "images":  [
                                          "/gouvernorats/Gafsa/Lieux-a-visiter/02-piscine-romaine-1.jpg",
                                          "/gouvernorats/Gafsa/Lieux-a-visiter/02-piscine-romaine-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Vieille Medina",
                           "images":  [
                                          "/gouvernorats/Gafsa/Lieux-a-visiter/03-vieille-medina-1.jpg",
                                          "/gouvernorats/Gafsa/Lieux-a-visiter/03-vieille-medina-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Couscous",
                         "images":  [
                                        "/gouvernorats/Gafsa/Gastronomie/01-couscous-1.jpg",
                                        "/gouvernorats/Gafsa/Gastronomie/01-couscous-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Produits Des Oasis",
                         "images":  [
                                        "/gouvernorats/Gafsa/Gastronomie/02-produits-des-oasis-1.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "jendouba",
        "cityName":  "Jendouba",
        "places":  [
                       {
                           "title":  "Ain Draham",
                           "images":  [
                                          "/gouvernorats/Jendouba/Lieux-a-visiter/01-ain-draham-1.jpg",
                                          "/gouvernorats/Jendouba/Lieux-a-visiter/01-ain-draham-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Bulla Regia",
                           "images":  [
                                          "/gouvernorats/Jendouba/Lieux-a-visiter/02-bulla-regia-1.jpg",
                                          "/gouvernorats/Jendouba/Lieux-a-visiter/02-bulla-regia-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Forets De Tabarka",
                           "images":  [
                                          "/gouvernorats/Jendouba/Lieux-a-visiter/03-forets-de-tabarka-1.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Champignons",
                         "images":  [
                                        "/gouvernorats/Jendouba/Gastronomie/01-champignons-1.jpg"
                                    ]
                     },
                     {
                         "title":  "Miel",
                         "images":  [
                                        "/gouvernorats/Jendouba/Gastronomie/02-miel-1.jpg"
                                    ]
                     },
                     {
                         "title":  "Produits Forestiers",
                         "images":  [
                                        "/gouvernorats/Jendouba/Gastronomie/03-produits-forestiers-1.jpg",
                                        "/gouvernorats/Jendouba/Gastronomie/03-produits-forestiers-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "kairouan",
        "cityName":  "Kairouan",
        "places":  [
                       {
                           "title":  "Bassins Des Aghlabides",
                           "images":  [
                                          "/gouvernorats/Kairouan/Lieux-a-visiter/03-bassins-des-aghlabides-1.jpg",
                                          "/gouvernorats/Kairouan/Lieux-a-visiter/03-bassins-des-aghlabides-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Grande Mosquee",
                           "images":  [
                                          "/gouvernorats/Kairouan/Lieux-a-visiter/01-grande-mosquee-1.jpg",
                                          "/gouvernorats/Kairouan/Lieux-a-visiter/01-grande-mosquee-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Medina De Kairouan",
                           "images":  [
                                          "/gouvernorats/Kairouan/Lieux-a-visiter/02-medina-de-kairouan-1.jpg",
                                          "/gouvernorats/Kairouan/Lieux-a-visiter/02-medina-de-kairouan-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Assida Zgougou",
                         "images":  [
                                        "/gouvernorats/Kairouan/Gastronomie/02-assida-zgougou-1.jpg",
                                        "/gouvernorats/Kairouan/Gastronomie/02-assida-zgougou-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Makroudh",
                         "images":  [
                                        "/gouvernorats/Kairouan/Gastronomie/01-makroudh-1.jpg",
                                        "/gouvernorats/Kairouan/Gastronomie/01-makroudh-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "kasserine",
        "cityName":  "Kasserine",
        "places":  [
                       {
                           "title":  "Montagnes De Chaambi",
                           "images":  [
                                          "/gouvernorats/Kasserine/Lieux-a-visiter/02-montagnes-de-chaambi-1.jpg",
                                          "/gouvernorats/Kasserine/Lieux-a-visiter/02-montagnes-de-chaambi-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Sbeitla",
                           "images":  [
                                          "/gouvernorats/Kasserine/Lieux-a-visiter/01-sbeitla-1.jpg",
                                          "/gouvernorats/Kasserine/Lieux-a-visiter/01-sbeitla-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Couscous",
                         "images":  [
                                        "/gouvernorats/Kasserine/Gastronomie/01-couscous-1.jpg",
                                        "/gouvernorats/Kasserine/Gastronomie/01-couscous-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Huile D Olive",
                         "images":  [
                                        "/gouvernorats/Kasserine/Gastronomie/03-huile-d-olive-1.jpg",
                                        "/gouvernorats/Kasserine/Gastronomie/03-huile-d-olive-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Produits Agricoles",
                         "images":  [
                                        "/gouvernorats/Kasserine/Gastronomie/02-produits-agricoles-1.jpg",
                                        "/gouvernorats/Kasserine/Gastronomie/02-produits-agricoles-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "kebili",
        "cityName":  "Kébili",
        "places":  [
                       {
                           "title":  "Chott El Jerid",
                           "images":  [
                                          "/gouvernorats/Kébili/Lieux-a-visiter/03-chott-el-jerid-1.jpg",
                                          "/gouvernorats/Kébili/Lieux-a-visiter/03-chott-el-jerid-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Desert",
                           "images":  [
                                          "/gouvernorats/Kébili/Lieux-a-visiter/02-desert-1.jpg",
                                          "/gouvernorats/Kébili/Lieux-a-visiter/02-desert-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Douz",
                           "images":  [
                                          "/gouvernorats/Kébili/Lieux-a-visiter/01-douz-1.jpg",
                                          "/gouvernorats/Kébili/Lieux-a-visiter/01-douz-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Dattes",
                         "images":  [
                                        "/gouvernorats/Kébili/Gastronomie/01-dattes-1.jpg",
                                        "/gouvernorats/Kébili/Gastronomie/01-dattes-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "le-kef",
        "cityName":  "Le Kef",
        "places":  [
                       {
                           "title":  "Kasbah Du Kef",
                           "images":  [
                                          "/gouvernorats/Le Kef/Lieux-a-visiter/01-kasbah-du-kef-1.jpg",
                                          "/gouvernorats/Le Kef/Lieux-a-visiter/01-kasbah-du-kef-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Medina Du Kef",
                           "images":  [
                                          "/gouvernorats/Le Kef/Lieux-a-visiter/02-medina-du-kef-1.jpg",
                                          "/gouvernorats/Le Kef/Lieux-a-visiter/02-medina-du-kef-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Table De Jugurtha",
                           "images":  [
                                          "/gouvernorats/Le Kef/Lieux-a-visiter/03-table-de-jugurtha-1.jpg",
                                          "/gouvernorats/Le Kef/Lieux-a-visiter/03-table-de-jugurtha-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Borzguen",
                         "images":  [
                                        "/gouvernorats/Le Kef/Gastronomie/01-borzguen-1.jpg"
                                    ]
                     },
                     {
                         "title":  "Couscous Traditionnel",
                         "images":  [
                                        "/gouvernorats/Le Kef/Gastronomie/02-couscous-traditionnel-1.jpg",
                                        "/gouvernorats/Le Kef/Gastronomie/02-couscous-traditionnel-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Huile D Olive",
                         "images":  [
                                        "/gouvernorats/Le Kef/Gastronomie/03-huile-d-olive-1.jpg",
                                        "/gouvernorats/Le Kef/Gastronomie/03-huile-d-olive-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "mahdia",
        "cityName":  "Mahdia",
        "places":  [
                       {
                           "title":  "Grande Mosquee",
                           "images":  [
                                          "/gouvernorats/Mahdia/Lieux-a-visiter/03-grande-mosquee-1.jpg",
                                          "/gouvernorats/Mahdia/Lieux-a-visiter/03-grande-mosquee-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Port De Peche",
                           "images":  [
                                          "/gouvernorats/Mahdia/Lieux-a-visiter/01-port-de-peche-1.jpg",
                                          "/gouvernorats/Mahdia/Lieux-a-visiter/01-port-de-peche-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Skifa Kahla",
                           "images":  [
                                          "/gouvernorats/Mahdia/Lieux-a-visiter/02-skifa-kahla-1.jpg",
                                          "/gouvernorats/Mahdia/Lieux-a-visiter/02-skifa-kahla-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Couscous Au Poisson",
                         "images":  [
                                        "/gouvernorats/Mahdia/Gastronomie/02-couscous-au-poisson-1.jpg",
                                        "/gouvernorats/Mahdia/Gastronomie/02-couscous-au-poisson-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Poisson",
                         "images":  [
                                        "/gouvernorats/Mahdia/Gastronomie/01-poisson-1.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "manouba",
        "cityName":  "Manouba",
        "places":  [
                       {
                           "title":  "Palais De Kobbet Ennhas",
                           "images":  [
                                          "/gouvernorats/Manouba/Lieux-a-visiter/01-palais-de-kobbet-ennhas-1.jpg",
                                          "/gouvernorats/Manouba/Lieux-a-visiter/01-palais-de-kobbet-ennhas-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Palais De La Manouba",
                           "images":  [
                                          "/gouvernorats/Manouba/Lieux-a-visiter/02-palais-de-la-manouba-1.jpg",
                                          "/gouvernorats/Manouba/Lieux-a-visiter/02-palais-de-la-manouba-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Paysages Agricoles",
                           "images":  [
                                          "/gouvernorats/Manouba/Lieux-a-visiter/03-paysages-agricoles-1.jpg",
                                          "/gouvernorats/Manouba/Lieux-a-visiter/03-paysages-agricoles-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Fruits Et Legumes",
                         "images":  [
                                        "/gouvernorats/Manouba/Gastronomie/01-fruits-et-legumes-1.jpg",
                                        "/gouvernorats/Manouba/Gastronomie/01-fruits-et-legumes-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Produits Du Terroir",
                         "images":  [
                                        "/gouvernorats/Manouba/Gastronomie/02-produits-du-terroir-1.jpg",
                                        "/gouvernorats/Manouba/Gastronomie/02-produits-du-terroir-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "monastir",
        "cityName":  "Monastir",
        "places":  [
                       {
                           "title":  "Marina",
                           "images":  [
                                          "/gouvernorats/Monastir/Lieux-a-visiter/02-marina-1.jpg",
                                          "/gouvernorats/Monastir/Lieux-a-visiter/02-marina-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Mausolee Bourguiba",
                           "images":  [
                                          "/gouvernorats/Monastir/Lieux-a-visiter/03-mausolee-bourguiba-1.jpg",
                                          "/gouvernorats/Monastir/Lieux-a-visiter/03-mausolee-bourguiba-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Plages",
                           "images":  [
                                          "/gouvernorats/Monastir/Lieux-a-visiter/04-plages-1.jpg",
                                          "/gouvernorats/Monastir/Lieux-a-visiter/04-plages-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Ribat De Monastir",
                           "images":  [
                                          "/gouvernorats/Monastir/Lieux-a-visiter/01-ribat-de-monastir-1.jpg",
                                          "/gouvernorats/Monastir/Lieux-a-visiter/01-ribat-de-monastir-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Fruits De Mer",
                         "images":  [
                                        "/gouvernorats/Monastir/Gastronomie/02-fruits-de-mer-1.jpg",
                                        "/gouvernorats/Monastir/Gastronomie/02-fruits-de-mer-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Poissons",
                         "images":  [
                                        "/gouvernorats/Monastir/Gastronomie/01-poissons-1.jpg"
                                    ]
                     },
                     {
                         "title":  "Specialites Locales",
                         "images":  [
                                        "/gouvernorats/Monastir/Gastronomie/03-specialites-locales-1.jpg",
                                        "/gouvernorats/Monastir/Gastronomie/03-specialites-locales-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "medenine",
        "cityName":  "Médenine",
        "places":  [
                       {
                           "title":  "Djerba",
                           "images":  [
                                          "/gouvernorats/Médenine/Lieux-a-visiter/01-djerba-1.jpg",
                                          "/gouvernorats/Médenine/Lieux-a-visiter/01-djerba-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Ksour",
                           "images":  [
                                          "/gouvernorats/Médenine/Lieux-a-visiter/03-ksour-1.jpg",
                                          "/gouvernorats/Médenine/Lieux-a-visiter/03-ksour-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Maisons Traditionnelles",
                           "images":  [
                                          "/gouvernorats/Médenine/Lieux-a-visiter/02-maisons-traditionnelles-1.jpg",
                                          "/gouvernorats/Médenine/Lieux-a-visiter/02-maisons-traditionnelles-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Fruits De Mer",
                         "images":  [
                                        "/gouvernorats/Médenine/Gastronomie/02-fruits-de-mer-1.jpg",
                                        "/gouvernorats/Médenine/Gastronomie/02-fruits-de-mer-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Pain Tabouna",
                         "images":  [
                                        "/gouvernorats/Médenine/Gastronomie/03-pain-tabouna-1.jpg",
                                        "/gouvernorats/Médenine/Gastronomie/03-pain-tabouna-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Poisson",
                         "images":  [
                                        "/gouvernorats/Médenine/Gastronomie/01-poisson-1.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "nabeul",
        "cityName":  "Nabeul",
        "places":  [
                       {
                           "title":  "Medina De Nabeul",
                           "images":  [
                                          "/gouvernorats/Nabeul/Lieux-a-visiter/03-medina-de-nabeul-1.jpg",
                                          "/gouvernorats/Nabeul/Lieux-a-visiter/03-medina-de-nabeul-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Plages De Hammamet",
                           "images":  [
                                          "/gouvernorats/Nabeul/Lieux-a-visiter/02-plages-de-hammamet-1.jpg",
                                          "/gouvernorats/Nabeul/Lieux-a-visiter/02-plages-de-hammamet-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Poteries De Nabeul",
                           "images":  [
                                          "/gouvernorats/Nabeul/Lieux-a-visiter/01-poteries-de-nabeul-1.jpg",
                                          "/gouvernorats/Nabeul/Lieux-a-visiter/01-poteries-de-nabeul-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Agrumes",
                         "images":  [
                                        "/gouvernorats/Nabeul/Gastronomie/02-agrumes-1.jpg",
                                        "/gouvernorats/Nabeul/Gastronomie/02-agrumes-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Harissa",
                         "images":  [
                                        "/gouvernorats/Nabeul/Gastronomie/01-harissa-1.jpg",
                                        "/gouvernorats/Nabeul/Gastronomie/01-harissa-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Salade Mechouia",
                         "images":  [
                                        "/gouvernorats/Nabeul/Gastronomie/03-salade-mechouia-1.jpg",
                                        "/gouvernorats/Nabeul/Gastronomie/03-salade-mechouia-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "sfax",
        "cityName":  "Sfax",
        "places":  [
                       {
                           "title":  "Iles Kerkennah",
                           "images":  [
                                          "/gouvernorats/Sfax/Lieux-a-visiter/02-iles-kerkennah-1.jpg",
                                          "/gouvernorats/Sfax/Lieux-a-visiter/02-iles-kerkennah-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Medina De Sfax",
                           "images":  [
                                          "/gouvernorats/Sfax/Lieux-a-visiter/01-medina-de-sfax-1.jpg",
                                          "/gouvernorats/Sfax/Lieux-a-visiter/01-medina-de-sfax-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Skhira",
                           "images":  [
                                          "/gouvernorats/Sfax/Lieux-a-visiter/03-skhira-1.jpg",
                                          "/gouvernorats/Sfax/Lieux-a-visiter/03-skhira-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Charmoula",
                         "images":  [
                                        "/gouvernorats/Sfax/Gastronomie/03-charmoula-1.jpg",
                                        "/gouvernorats/Sfax/Gastronomie/03-charmoula-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Fruits De Mer",
                         "images":  [
                                        "/gouvernorats/Sfax/Gastronomie/01-fruits-de-mer-1.jpg",
                                        "/gouvernorats/Sfax/Gastronomie/01-fruits-de-mer-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Poisson",
                         "images":  [
                                        "/gouvernorats/Sfax/Gastronomie/02-poisson-1.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "sidi-bouzid",
        "cityName":  "Sidi Bouzid",
        "places":  [
                       {
                           "title":  "Oliveraies",
                           "images":  [
                                          "/gouvernorats/Sidi Bouzid/Lieux-a-visiter/02-oliveraies-1.jpg",
                                          "/gouvernorats/Sidi Bouzid/Lieux-a-visiter/02-oliveraies-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Paysages Agricoles",
                           "images":  [
                                          "/gouvernorats/Sidi Bouzid/Lieux-a-visiter/01-paysages-agricoles-1.jpg",
                                          "/gouvernorats/Sidi Bouzid/Lieux-a-visiter/01-paysages-agricoles-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Villages Traditionnels",
                           "images":  [
                                          "/gouvernorats/Sidi Bouzid/Lieux-a-visiter/03-villages-traditionnels-1.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Couscous",
                         "images":  [
                                        "/gouvernorats/Sidi Bouzid/Gastronomie/03-couscous-1.jpg",
                                        "/gouvernorats/Sidi Bouzid/Gastronomie/03-couscous-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Huile D Olive",
                         "images":  [
                                        "/gouvernorats/Sidi Bouzid/Gastronomie/01-huile-d-olive-1.jpg",
                                        "/gouvernorats/Sidi Bouzid/Gastronomie/01-huile-d-olive-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Produits Agricoles",
                         "images":  [
                                        "/gouvernorats/Sidi Bouzid/Gastronomie/02-produits-agricoles-1.jpg",
                                        "/gouvernorats/Sidi Bouzid/Gastronomie/02-produits-agricoles-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "siliana",
        "cityName":  "Siliana",
        "places":  [
                       {
                           "title":  "Makthar",
                           "images":  [
                                          "/gouvernorats/Siliana/Lieux-a-visiter/01-makthar-1.jpg",
                                          "/gouvernorats/Siliana/Lieux-a-visiter/01-makthar-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Paysages Montagneux",
                           "images":  [
                                          "/gouvernorats/Siliana/Lieux-a-visiter/02-paysages-montagneux-1.jpg",
                                          "/gouvernorats/Siliana/Lieux-a-visiter/02-paysages-montagneux-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Cereales",
                         "images":  [
                                        "/gouvernorats/Siliana/Gastronomie/01-cereales-1.jpg",
                                        "/gouvernorats/Siliana/Gastronomie/01-cereales-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Huile D Olive",
                         "images":  [
                                        "/gouvernorats/Siliana/Gastronomie/02-huile-d-olive-1.jpg",
                                        "/gouvernorats/Siliana/Gastronomie/02-huile-d-olive-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Produits Du Terroir",
                         "images":  [
                                        "/gouvernorats/Siliana/Gastronomie/03-produits-du-terroir-1.jpg",
                                        "/gouvernorats/Siliana/Gastronomie/03-produits-du-terroir-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "sousse",
        "cityName":  "Sousse",
        "places":  [
                       {
                           "title":  "Medina De Sousse",
                           "images":  [
                                          "/gouvernorats/Sousse/Lieux-a-visiter/02-medina-de-sousse-1.jpg",
                                          "/gouvernorats/Sousse/Lieux-a-visiter/02-medina-de-sousse-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Port El Kantaoui",
                           "images":  [
                                          "/gouvernorats/Sousse/Lieux-a-visiter/03-port-el-kantaoui-1.jpg",
                                          "/gouvernorats/Sousse/Lieux-a-visiter/03-port-el-kantaoui-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Ribat De Sousse",
                           "images":  [
                                          "/gouvernorats/Sousse/Lieux-a-visiter/01-ribat-de-sousse-1.jpg",
                                          "/gouvernorats/Sousse/Lieux-a-visiter/01-ribat-de-sousse-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Couscous",
                         "images":  [
                                        "/gouvernorats/Sousse/Gastronomie/03-couscous-1.jpg",
                                        "/gouvernorats/Sousse/Gastronomie/03-couscous-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Patisseries",
                         "images":  [
                                        "/gouvernorats/Sousse/Gastronomie/01-patisseries-1.jpg",
                                        "/gouvernorats/Sousse/Gastronomie/01-patisseries-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Poissons",
                         "images":  [
                                        "/gouvernorats/Sousse/Gastronomie/02-poissons-1.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "tataouine",
        "cityName":  "Tataouine",
        "places":  [
                       {
                           "title":  "Chenini",
                           "images":  [
                                          "/gouvernorats/Tataouine/Lieux-a-visiter/02-chenini-1.jpg",
                                          "/gouvernorats/Tataouine/Lieux-a-visiter/02-chenini-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Ksour",
                           "images":  [
                                          "/gouvernorats/Tataouine/Lieux-a-visiter/01-ksour-1.jpg",
                                          "/gouvernorats/Tataouine/Lieux-a-visiter/01-ksour-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Paysages Desertiques",
                           "images":  [
                                          "/gouvernorats/Tataouine/Lieux-a-visiter/03-paysages-desertiques-1.jpg",
                                          "/gouvernorats/Tataouine/Lieux-a-visiter/03-paysages-desertiques-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Gateau De Tataouine",
                         "images":  [
                                        "/gouvernorats/Tataouine/Gastronomie/01-gateau-de-tataouine-1.jpg",
                                        "/gouvernorats/Tataouine/Gastronomie/01-gateau-de-tataouine-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Pain Tabouna",
                         "images":  [
                                        "/gouvernorats/Tataouine/Gastronomie/02-pain-tabouna-1.jpg",
                                        "/gouvernorats/Tataouine/Gastronomie/02-pain-tabouna-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Produits Locaux",
                         "images":  [
                                        "/gouvernorats/Tataouine/Gastronomie/03-produits-locaux-1.jpg",
                                        "/gouvernorats/Tataouine/Gastronomie/03-produits-locaux-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "tozeur",
        "cityName":  "Tozeur",
        "places":  [
                       {
                           "title":  "Architecture Traditionnelle",
                           "images":  [
                                          "/gouvernorats/Tozeur/Lieux-a-visiter/02-architecture-traditionnelle-1.jpg",
                                          "/gouvernorats/Tozeur/Lieux-a-visiter/02-architecture-traditionnelle-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Oasis",
                           "images":  [
                                          "/gouvernorats/Tozeur/Lieux-a-visiter/03-oasis-1.jpg",
                                          "/gouvernorats/Tozeur/Lieux-a-visiter/03-oasis-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Palmeraies",
                           "images":  [
                                          "/gouvernorats/Tozeur/Lieux-a-visiter/01-palmeraies-1.jpg",
                                          "/gouvernorats/Tozeur/Lieux-a-visiter/01-palmeraies-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Dattes Deglet Nour",
                         "images":  [
                                        "/gouvernorats/Tozeur/Gastronomie/01-dattes-deglet-nour-1.jpg",
                                        "/gouvernorats/Tozeur/Gastronomie/01-dattes-deglet-nour-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Patisseries Aux Dattes",
                         "images":  [
                                        "/gouvernorats/Tozeur/Gastronomie/02-patisseries-aux-dattes-1.jpg",
                                        "/gouvernorats/Tozeur/Gastronomie/02-patisseries-aux-dattes-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "tunis",
        "cityName":  "Tunis",
        "places":  [
                       {
                           "title":  "Medina De Tunis",
                           "images":  [
                                          "/gouvernorats/Tunis/Lieux-a-visiter/01-medina-de-tunis-1.jpg",
                                          "/gouvernorats/Tunis/Lieux-a-visiter/01-medina-de-tunis-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Mosquee Zitouna",
                           "images":  [
                                          "/gouvernorats/Tunis/Lieux-a-visiter/03-mosquee-zitouna-1.jpg",
                                          "/gouvernorats/Tunis/Lieux-a-visiter/03-mosquee-zitouna-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Sidi Bou Said",
                           "images":  [
                                          "/gouvernorats/Tunis/Lieux-a-visiter/02-sidi-bou-said-1.jpg",
                                          "/gouvernorats/Tunis/Lieux-a-visiter/02-sidi-bou-said-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Bambalouni",
                         "images":  [
                                        "/gouvernorats/Tunis/Gastronomie/01-bambalouni-1.jpg",
                                        "/gouvernorats/Tunis/Gastronomie/01-bambalouni-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Brik Tunisien",
                         "images":  [
                                        "/gouvernorats/Tunis/Gastronomie/02-brik-tunisien-1.jpg",
                                        "/gouvernorats/Tunis/Gastronomie/02-brik-tunisien-2.jpg"
                                    ]
                     },
                     {
                         "title":  "Patisseries Traditionnelles",
                         "images":  [
                                        "/gouvernorats/Tunis/Gastronomie/03-patisseries-traditionnelles-1.jpg",
                                        "/gouvernorats/Tunis/Gastronomie/03-patisseries-traditionnelles-2.jpg"
                                    ]
                     }
                 ]
    },
    {
        "cityId":  "zaghouan",
        "cityName":  "Zaghouan",
        "places":  [
                       {
                           "title":  "Djebel Zaghouan",
                           "images":  [
                                          "/gouvernorats/Zaghouan/Lieux-a-visiter/02-djebel-zaghouan-1.jpg",
                                          "/gouvernorats/Zaghouan/Lieux-a-visiter/02-djebel-zaghouan-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Medina De Zaghouan",
                           "images":  [
                                          "/gouvernorats/Zaghouan/Lieux-a-visiter/03-medina-de-zaghouan-1.jpg",
                                          "/gouvernorats/Zaghouan/Lieux-a-visiter/03-medina-de-zaghouan-2.jpg"
                                      ]
                       },
                       {
                           "title":  "Temple Des Eaux",
                           "images":  [
                                          "/gouvernorats/Zaghouan/Lieux-a-visiter/01-temple-des-eaux-1.jpg",
                                          "/gouvernorats/Zaghouan/Lieux-a-visiter/01-temple-des-eaux-2.jpg"
                                      ]
                       }
                   ],
        "food":  [
                     {
                         "title":  "Eau De Rose",
                         "images":  [
                                        "/gouvernorats/Zaghouan/Gastronomie/01-eau-de-rose-1.jpg"
                                    ]
                     },
                     {
                         "title":  "Patisseries Traditionnelles",
                         "images":  [
                                        "/gouvernorats/Zaghouan/Gastronomie/02-patisseries-traditionnelles-1.jpg",
                                        "/gouvernorats/Zaghouan/Gastronomie/02-patisseries-traditionnelles-2.jpg"
                                    ]
                     }
                 ]
    }
];

export const CITY_GALLERY_BY_ID: ReadonlyMap<string, CityGallery> = new Map(
  CITY_GALLERIES.map((gallery) => [gallery.cityId, gallery]),
);

