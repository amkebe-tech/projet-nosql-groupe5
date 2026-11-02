// ============================================================================
//  Projet NoSQL — Domaine 3 : Marketplace de produits artisanaux
//  Livrable 3 — Règles de validation $jsonSchema
//  Fichier : validation.js  (exécutable dans mongosh)
//  Auteur  : Ibrahima Pouye
//
//  Ce fichier crée les collections et pose des règles $jsonSchema afin que
//  MongoDB refuse toute donnée incorrecte (mauvais type, champ absent,
//  valeur hors bornes, statut inconnu, etc.).
//
//  Exécution :
//     1) lancer mongosh
//     2) se placer sur la base voulue :   use marketplace
//     3) charger ce fichier :              load("validation.js")
//     ou directement :   mongosh marketplace --file validation.js
//
//  Noms de champs : ceux du modèle de données décrit dans le dossier.
// ============================================================================

print("============================================================");
print(" validation.js — création des collections et règles $jsonSchema");
print("============================================================");

// ---------------------------------------------------------------------------
// 0. Nettoyage : on repart d'une base propre pour que le fichier soit
//    ré-exécutable sans conflit.
// ---------------------------------------------------------------------------
db.artisans.drop();
db.produits.drop();
db.historique_prix.drop();
db.acheteurs.drop();
db.commandes.drop();
db.avis.drop();
print("Collections existantes supprimées (re-run propre).\n");

// ---------------------------------------------------------------------------
// 1. Schémas $jsonSchema, collection par collection
//    Rappels du modèle :
//      * ..._id         -> type objectId (référence vers un autre document)
//      * prix/quantités -> int, strictement supérieurs à 0  => minimum: 1
//      * stock          -> int, supérieur ou égal à 0        => minimum: 0
//      * note d'un avis -> int, de 1 à 5
//      * statut         -> enum parmi 5 valeurs
//      * note_globale   -> accepter int ET double (une valeur ronde comme
//                          0 ou 4 s'enregistre comme entier)
// ---------------------------------------------------------------------------

// --- artisans ---------------------------------------------------------------
const schemaArtisans = {
  bsonType: "object",
  required: [
    "nom",
    "nom_boutique",
    "email",
    "telephone",
    "localisation",
    "categories",
    "certifie",
    "note_globale",
    "nb_avis"
  ],
  additionalProperties: false,
  properties: {
    _id: { bsonType: "objectId" },
    nom: { bsonType: "string" },
    nom_boutique: { bsonType: "string" },
    email: { bsonType: "string" },
    telephone: { bsonType: "string" },
    localisation: {
      bsonType: "object",
      required: ["ville", "pays"],
      additionalProperties: false,
      properties: {
        ville: { bsonType: "string" },
        pays: { bsonType: "string" }
      }
    },
    categories: {
      bsonType: "array",
      items: { bsonType: "string" }
    },
    certifie: { bsonType: "bool" },
    // NB : note_globale accepte int ET double (voir remarque du modèle).
    note_globale: { bsonType: ["int", "double"], minimum: 0, maximum: 5 },
    nb_avis: { bsonType: "int", minimum: 0 }
  }
};

// --- produits ---------------------------------------------------------------
const schemaProduits = {
  bsonType: "object",
  required: [
    "artisan_id",
    "titre",
    "description",
    "prix",
    "categories",
    "photos",
    "variantes"
  ],
  additionalProperties: false,
  properties: {
    _id: { bsonType: "objectId" },
    artisan_id: { bsonType: "objectId" },
    titre: { bsonType: "string" },
    description: { bsonType: "string" },
    prix: { bsonType: "int", minimum: 1 },          // > 0
    categories: {
      bsonType: "array",
      items: { bsonType: "string" }
    },
    photos: {
      bsonType: "array",
      items: { bsonType: "string" }
    },
    variantes: {
      bsonType: "array",
      minItems: 1,          // au moins une variante
      maxItems: 50,         // au plus 50 variantes (contrainte du sujet)
      items: {
        bsonType: "object",
        required: ["code", "stock"],
        additionalProperties: false,
        properties: {
          code: { bsonType: "string" },
          // taille, couleur, matiere : facultatifs, seulement quand ils
          // s'appliquent (un collier n'a pas de taille).
          taille: { bsonType: "string" },
          couleur: { bsonType: "string" },
          matiere: { bsonType: "string" },
          stock: { bsonType: "int", minimum: 0 }    // >= 0
        }
      }
    }
  }
};

// --- historique_prix --------------------------------------------------------
const schemaHistoriquePrix = {
  bsonType: "object",
  required: ["produit_id", "ancien_prix", "nouveau_prix", "date_changement"],
  additionalProperties: false,
  properties: {
    _id: { bsonType: "objectId" },
    produit_id: { bsonType: "objectId" },
    ancien_prix: { bsonType: "int", minimum: 1 },    // prix > 0
    nouveau_prix: { bsonType: "int", minimum: 1 },   // prix > 0
    date_changement: { bsonType: "date" }
  }
};

// --- acheteurs --------------------------------------------------------------
const schemaAcheteurs = {
  bsonType: "object",
  required: ["nom", "email", "telephone", "favoris"],
  additionalProperties: false,
  properties: {
    _id: { bsonType: "objectId" },
    nom: { bsonType: "string" },
    email: { bsonType: "string" },
    telephone: { bsonType: "string" },
    // Les favoris ne forment pas une collection : simple liste d'ObjectId
    // vers des produits.
    favoris: {
      bsonType: "array",
      items: { bsonType: "objectId" }
    }
  }
};

// --- commandes --------------------------------------------------------------
const schemaCommandes = {
  bsonType: "object",
  required: [
    "acheteur_id",
    "date_commande",
    "articles",
    "montant_total",
    "statut",
    "adresse_livraison"
  ],
  additionalProperties: false,
  properties: {
    _id: { bsonType: "objectId" },
    acheteur_id: { bsonType: "objectId" },
    date_commande: { bsonType: "date" },
    articles: {
      bsonType: "array",
      minItems: 1,          // une commande contient au moins un article
      items: {
        bsonType: "object",
        required: [
          "produit_id",
          "artisan_id",
          "titre",
          "code_variante",
          "prix_unitaire",
          "quantite"
        ],
        additionalProperties: false,
        properties: {
          produit_id: { bsonType: "objectId" },     // référence
          artisan_id: { bsonType: "objectId" },     // copie (Extended Reference)
          titre: { bsonType: "string" },            // copie
          code_variante: { bsonType: "string" },    // copie
          prix_unitaire: { bsonType: "int", minimum: 1 }, // prix du jour > 0
          quantite: { bsonType: "int", minimum: 1 }       // quantité > 0
        }
      }
    },
    montant_total: { bsonType: "int", minimum: 1 }, // > 0
    statut: {
      bsonType: "string",
      enum: ["en_attente", "payee", "expediee", "livree", "annulee"]
    },
    adresse_livraison: {
      bsonType: "object",
      required: ["rue", "ville", "pays"],
      additionalProperties: false,
      properties: {
        rue: { bsonType: "string" },
        ville: { bsonType: "string" },
        pays: { bsonType: "string" }
      }
    }
  }
};

// --- avis -------------------------------------------------------------------
const schemaAvis = {
  bsonType: "object",
  required: [
    "produit_id",
    "artisan_id",
    "acheteur_id",
    "commande_id",
    "note",
    "commentaire",
    "date_avis",
    "achat_verifie"
  ],
  additionalProperties: false,
  properties: {
    _id: { bsonType: "objectId" },
    produit_id: { bsonType: "objectId" },
    artisan_id: { bsonType: "objectId" },    // copie, pour la note de l'artisan
    acheteur_id: { bsonType: "objectId" },
    commande_id: { bsonType: "objectId" },   // preuve d'achat
    note: { bsonType: "int", minimum: 1, maximum: 5 }, // entier de 1 à 5
    commentaire: { bsonType: "string" },
    date_avis: { bsonType: "date" },
    achat_verifie: { bsonType: "bool" }
  }
};

// ---------------------------------------------------------------------------
// 2. Création des collections avec validation STRICTE
//    validationLevel: "strict" => tout document (nouveau ou modifié) doit
//    respecter le schéma.
// ---------------------------------------------------------------------------
db.createCollection("artisans", {
  validator: { $jsonSchema: schemaArtisans },
  validationLevel: "strict",
  validationAction: "error"
});
print("Collection 'artisans' créée avec validation $jsonSchema.");

db.createCollection("produits", {
  validator: { $jsonSchema: schemaProduits },
  validationLevel: "strict",
  validationAction: "error"
});
print("Collection 'produits' créée avec validation $jsonSchema (variantes 1 à 50, stock >= 0).");

db.createCollection("historique_prix", {
  validator: { $jsonSchema: schemaHistoriquePrix },
  validationLevel: "strict",
  validationAction: "error"
});
print("Collection 'historique_prix' créée avec validation $jsonSchema (prix > 0).");

db.createCollection("acheteurs", {
  validator: { $jsonSchema: schemaAcheteurs },
  validationLevel: "strict",
  validationAction: "error"
});
print("Collection 'acheteurs' créée avec validation $jsonSchema.");

db.createCollection("commandes", {
  validator: { $jsonSchema: schemaCommandes },
  validationLevel: "strict",
  validationAction: "error"
});
print("Collection 'commandes' créée avec validation $jsonSchema (statut = enum, prix/quantités > 0).");

db.createCollection("avis", {
  validator: { $jsonSchema: schemaAvis },
  validationLevel: "strict",
  validationAction: "error"
});
print("Collection 'avis' créée avec validation $jsonSchema (note entière de 1 à 5).");

print("");

// ---------------------------------------------------------------------------
// 3. Modifier la validation d'une collection existante (exemple, non exécuté)
//    Le niveau "moderate" contrôle les insertions et les modifications des
//    documents déjà valides, sans re-contrôler les anciens documents
//    invalides. Commande à utiliser si besoin :
//
//    db.runCommand({
//      collMod: "commandes",
//      validator: { $jsonSchema: schemaCommandes },
//      validationLevel: "moderate"
//    });
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// 4. Tests : documents invalides qui DOIVENT être refusés
//    Un document refusé prouve que la règle fonctionne.
// ---------------------------------------------------------------------------
print("============================================================");
print(" TESTS DE VALIDATION (les refus sont attendus et normaux)");
print("============================================================");

function doitEtreRefuse(nomCollection, doc, raison) {
  try {
    db.getCollection(nomCollection).insertOne(doc);
    // Si on arrive ici, la validation a accepté un document invalide :
    // on le supprime pour ne pas laisser de document invalide en base.
    // (on supprime avec le _id réel du document inséré)
    db.getCollection(nomCollection).deleteOne({ _id: doc._id });
    print("[ECHEC]  " + raison + " : document accepté à tort !");
  } catch (e) {
    print("[OK]     " + raison + " : document correctement refusé.");
  }
}

const idArtisan = new ObjectId();
const idProduit = new ObjectId();
const idAcheteur = new ObjectId();
const idCommande = new ObjectId();

// 4.1 Avis : note = 7 (hors de 1..5)
doitEtreRefuse(
  "avis",
  {
    _id: new ObjectId(),
    produit_id: idProduit,
    artisan_id: idArtisan,
    acheteur_id: idAcheteur,
    commande_id: idCommande,
    note: 7,                                  // invalide : > 5
    commentaire: "Très bien",
    date_avis: new Date("2026-05-12"),
    achat_verifie: true
  },
  "avis avec note = 7"
);

// 4.2 Avis : note = 0 (hors de 1..5)
doitEtreRefuse(
  "avis",
  {
    _id: new ObjectId(),
    produit_id: idProduit,
    artisan_id: idArtisan,
    acheteur_id: idAcheteur,
    commande_id: idCommande,
    note: 0,                                  // invalide : < 1
    commentaire: "Bof",
    date_avis: new Date("2026-05-12"),
    achat_verifie: true
  },
  "avis avec note = 0"
);

// 4.3 Commande : statut inconnu
doitEtreRefuse(
  "commandes",
  {
    _id: new ObjectId(),
    acheteur_id: idAcheteur,
    date_commande: new Date("2026-05-10"),
    articles: [
      {
        produit_id: idProduit,
        artisan_id: idArtisan,
        titre: "Collier en perles",
        code_variante: "M-BLEU-COTON",
        prix_unitaire: 5000,
        quantite: 1
      }
    ],
    montant_total: 5000,
    statut: "en_cours",                       // invalide : hors enum
    adresse_livraison: { rue: "Rue 10", ville: "Dakar", pays: "Sénégal" }
  },
  "commande avec statut = 'en_cours'"
);

// 4.4 Commande : montant_total négatif
doitEtreRefuse(
  "commandes",
  {
    _id: new ObjectId(),
    acheteur_id: idAcheteur,
    date_commande: new Date("2026-05-10"),
    articles: [
      {
        produit_id: idProduit,
        artisan_id: idArtisan,
        titre: "Collier en perles",
        code_variante: "M-BLEU-COTON",
        prix_unitaire: 5000,
        quantite: 1
      }
    ],
    montant_total: -100,                      // invalide : négatif
    statut: "payee",
    adresse_livraison: { rue: "Rue 10", ville: "Dakar", pays: "Sénégal" }
  },
  "commande avec montant_total négatif"
);

// 4.5 Produit : variante avec stock négatif
doitEtreRefuse(
  "produits",
  {
    _id: new ObjectId(),
    artisan_id: idArtisan,
    titre: "Pagne tissé",
    description: "Pagne en coton tissé main",
    prix: 8000,
    categories: ["textile"],
    photos: ["http://exemple.com/pagne.jpg"],
    variantes: [
      {
        code: "M-BLEU-COTON",
        taille: "M",
        couleur: "Bleu",
        matiere: "Coton",
        stock: -3                             // invalide : < 0
      }
    ]
  },
  "produit avec stock = -3"
);

// 4.6 Produit : 0 variante (il en faut de 1 à 50)
doitEtreRefuse(
  "produits",
  {
    _id: new ObjectId(),
    artisan_id: idArtisan,
    titre: "Collier",
    description: "Collier en perles",
    prix: 5000,
    categories: ["bijoux"],
    photos: ["http://exemple.com/collier.jpg"],
    variantes: []                             // invalide : < 1
  },
  "produit sans variante"
);

// 4.7 Produit : champ obligatoire manquant (artisan_id)
doitEtreRefuse(
  "produits",
  {
    _id: new ObjectId(),
    titre: "Bracelet",
    description: "Bracelet en cuir",
    prix: 3000,
    categories: ["bijoux"],
    photos: ["http://exemple.com/bracelet.jpg"],
    variantes: [
      { code: "M-NOIR-CUIR", stock: 10 }
    ]
  },
  "produit sans artisan_id (champ obligatoire manquant)"
);

// 4.8 Artisan : note_globale en chaîne de caractères (type invalide)
doitEtreRefuse(
  "artisans",
  {
    _id: new ObjectId(),
    nom: "Awa Diop",
    nom_boutique: "Awa Créations",
    email: "awa@exemple.sn",
    telephone: "+221 77 000 00 00",
    localisation: { ville: "Dakar", pays: "Sénégal" },
    categories: ["bijoux"],
    certifie: true,
    note_globale: "bon",                      // invalide : doit être int/double
    nb_avis: 1
  },
  "artisan avec note_globale en string"
);

// 4.9 Artisan : note_globale hors bornes (> 5)
doitEtreRefuse(
  "artisans",
  {
    _id: new ObjectId(),
    nom: "Moussa Ba",
    nom_boutique: "Ba Textile",
    email: "moussa@exemple.sn",
    telephone: "+221 76 111 11 11",
    localisation: { ville: "Saint-Louis", pays: "Sénégal" },
    categories: ["textile"],
    certifie: false,
    note_globale: 6,                          // invalide : > 5
    nb_avis: 2
  },
  "artisan avec note_globale = 6"
);

print("");
print("============================================================");
print(" validation.js — FIN. Les règles sont actives sur les collections.");
print("============================================================");