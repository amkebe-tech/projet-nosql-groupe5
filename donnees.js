// donnees.js - Jeu d'exemple pour la marketplace artisanale
// Executer dans la meme base MongoDB que validation.js.
// Les 32 _id sont fixes: relancer le script met a jour ces exemples sans les dupliquer.
// Les autres documents de la base sont conserves.
(function () {
  "use strict";

  const O = (hex) => ObjectId(hex);
  const N = (value) => Number(value.valueOf());
  const key = (objectId) => objectId.toHexString();
  const check = (ok, message) => {
    if (!ok) throw new Error("Prevalidation echouee: " + message);
  };
  const mapById = (documents) => new Map(documents.map((d) => [key(d._id), d]));
  const article = (produit, artisan, titre, variante, prix, quantite) => ({
    produit_id: O(produit), artisan_id: O(artisan), titre,
    code_variante: variante, prix_unitaire: NumberInt(prix), quantite: NumberInt(quantite)
  });

  const artisans = [
    { _id: O("64f000000000000000000001"), nom: "Fatou Ndiaye", nom_boutique: "Atelier Niani",
      email: "fatou.ndiaye@example.com", telephone: "+221770000101",
      localisation: { ville: "Dakar", pays: "Senegal" }, categories: ["textile", "accessoires"],
      certifie: true, note_globale: Double(4.5), nb_avis: NumberInt(2) },
    { _id: O("64f000000000000000000002"), nom: "Amadou Sarr", nom_boutique: "Bois et Rythmes",
      email: "amadou.sarr@example.com", telephone: "+221770000102",
      localisation: { ville: "Thies", pays: "Senegal" }, categories: ["artisanat", "maison"],
      certifie: true, note_globale: Double(4.5), nb_avis: NumberInt(2) },
    { _id: O("64f000000000000000000003"), nom: "Mariama Sow", nom_boutique: "Cuir de la Petite Cote",
      email: "mariama.sow@example.com", telephone: "+221770000103",
      localisation: { ville: "Mbour", pays: "Senegal" }, categories: ["cuir", "bijoux"],
      certifie: false, note_globale: Double(5.0), nb_avis: NumberInt(1) },
    { _id: O("64f000000000000000000004"), nom: "Khady Diallo", nom_boutique: "Couleurs du Saloum",
      email: "khady.diallo@example.com", telephone: "+221770000104",
      localisation: { ville: "Kaolack", pays: "Senegal" }, categories: ["textile", "decoration"],
      certifie: true, note_globale: Double(3.0), nb_avis: NumberInt(1) }
  ];

  const produits = [
    { _id: O("64f000000000000000000101"), artisan_id: O("64f000000000000000000001"),
      titre: "Pochette bogolan Niani", description: "Pochette cousue a la main en tissu bogolan, format moyen.",
      prix: NumberInt(18000), categories: ["textile", "accessoires"],
      photos: ["https://example.com/images/pochette-bogolan.jpg"],
      variantes: [
        { code: "UNIQUE-BRUN", couleur: "brun", matiere: "coton", stock: NumberInt(8) },
        { code: "UNIQUE-INDIGO", couleur: "indigo", matiere: "coton", stock: NumberInt(5) }
      ] },
    { _id: O("64f000000000000000000102"), artisan_id: O("64f000000000000000000001"),
      titre: "Boucles d'oreilles en bronze", description: "Boucles legeres faconnees a la main, finition doree.",
      prix: NumberInt(9000), categories: ["bijoux", "cadeaux"],
      photos: ["https://example.com/images/boucles-bronze.jpg"],
      variantes: [{ code: "BRONZE-DORE", couleur: "dore", matiere: "bronze", stock: NumberInt(14) }] },
    { _id: O("64f000000000000000000103"), artisan_id: O("64f000000000000000000002"),
      titre: "Mini tambour decoratif", description: "Petit tambour decoratif en bois, fabrique a Thies.",
      prix: NumberInt(45000), categories: ["artisanat", "decoration"],
      photos: ["https://example.com/images/mini-tambour.jpg"],
      variantes: [{ code: "TAMBOUR-UNIQUE", matiere: "bois", stock: NumberInt(4) }] },
    { _id: O("64f000000000000000000104"), artisan_id: O("64f000000000000000000002"),
      titre: "Panier tresse du marche", description: "Panier moyen tresse avec des fibres locales.",
      prix: NumberInt(13000), categories: ["maison", "artisanat"],
      photos: ["https://example.com/images/panier-tresse.jpg"],
      variantes: [
        { code: "MOYEN-RAFIA", taille: "moyen", couleur: "naturel", matiere: "raphia", stock: NumberInt(5) },
        { code: "GRAND-RAFIA", taille: "grand", couleur: "naturel", matiere: "raphia", stock: NumberInt(3) }
      ] },
    { _id: O("64f000000000000000000105"), artisan_id: O("64f000000000000000000003"),
      titre: "Sandales en cuir de Mbour", description: "Sandales cousues a la main avec semelle renforcee.",
      prix: NumberInt(22000), categories: ["cuir", "mode"],
      photos: ["https://example.com/images/sandales-cuir.jpg"],
      variantes: [
        { code: "42-NOIR", taille: "42", couleur: "noir", matiere: "cuir", stock: NumberInt(6) },
        { code: "40-MARRON", taille: "40", couleur: "marron", matiere: "cuir", stock: NumberInt(4) }
      ] },
    { _id: O("64f000000000000000000106"), artisan_id: O("64f000000000000000000003"),
      titre: "Collier de perles et argent", description: "Collier artisanal assemble a la main, longueur ajustable.",
      prix: NumberInt(35000), categories: ["bijoux", "cadeaux"],
      photos: ["https://example.com/images/collier-perles.jpg"],
      variantes: [{ code: "COLLIER-ARGENT", couleur: "multicolore", matiere: "argent et verre", stock: NumberInt(9) }] },
    { _id: O("64f000000000000000000107"), artisan_id: O("64f000000000000000000004"),
      titre: "Pagne batik indigo", description: "Pagne en coton imprime au batik, deux metres.",
      prix: NumberInt(16000), categories: ["textile", "mode"],
      photos: ["https://example.com/images/pagne-batik.jpg"],
      variantes: [{ code: "2M-INDIGO", taille: "2 metres", couleur: "indigo", matiere: "coton", stock: NumberInt(10) }] },
    { _id: O("64f000000000000000000108"), artisan_id: O("64f000000000000000000004"),
      titre: "Boite decorative en bois", description: "Boite gravee pour ranger bijoux et petits objets.",
      prix: NumberInt(28000), categories: ["decoration", "cadeaux"],
      photos: ["https://example.com/images/boite-bois.jpg"],
      variantes: [{ code: "BOITE-UNIQUE", couleur: "brun", matiere: "bois", stock: NumberInt(3) }] }
  ];

  const historique_prix = [
    { _id: O("64f000000000000000000401"), produit_id: O("64f000000000000000000101"),
      ancien_prix: NumberInt(14000), nouveau_prix: NumberInt(18000),
      date_changement: ISODate("2026-03-01T09:00:00Z") },
    { _id: O("64f000000000000000000402"), produit_id: O("64f000000000000000000104"),
      ancien_prix: NumberInt(10000), nouveau_prix: NumberInt(13000),
      date_changement: ISODate("2026-08-01T10:30:00Z") },
    { _id: O("64f000000000000000000403"), produit_id: O("64f000000000000000000107"),
      ancien_prix: NumberInt(15000), nouveau_prix: NumberInt(16000),
      date_changement: ISODate("2026-08-15T14:00:00Z") }
  ];

  const acheteurs = [
    { _id: O("64f000000000000000000201"), nom: "Awa Diop", email: "awa.diop@example.com",
      telephone: "+221770000201", favoris: [O("64f000000000000000000101"), O("64f000000000000000000107")] },
    { _id: O("64f000000000000000000202"), nom: "Moussa Ba", email: "moussa.ba@example.com",
      telephone: "+221770000202", favoris: [O("64f000000000000000000102"), O("64f000000000000000000103")] },
    { _id: O("64f000000000000000000203"), nom: "Ndeye Fall", email: "ndeye.fall@example.com",
      telephone: "+221770000203", favoris: [O("64f000000000000000000104"), O("64f000000000000000000105")] },
    { _id: O("64f000000000000000000204"), nom: "Ibrahima Kane", email: "ibrahima.kane@example.com",
      telephone: "+221770000204", favoris: [O("64f000000000000000000106"), O("64f000000000000000000107")] },
    { _id: O("64f000000000000000000205"), nom: "Sokhna Gueye", email: "sokhna.gueye@example.com",
      telephone: "+221770000205", favoris: [O("64f000000000000000000102"), O("64f000000000000000000108")] }
  ];

  const commandes = [
    { _id: O("64f000000000000000000301"), acheteur_id: O("64f000000000000000000201"),
      date_commande: ISODate("2026-01-15T11:20:00Z"),
      articles: [
        article("64f000000000000000000101", "64f000000000000000000001", "Pochette bogolan Niani", "UNIQUE-BRUN", 14000, 2),
        article("64f000000000000000000103", "64f000000000000000000002", "Mini tambour decoratif", "TAMBOUR-UNIQUE", 45000, 1)
      ], montant_total: NumberInt(73000), statut: "livree",
      adresse_livraison: { rue: "12 rue de la Medina", ville: "Dakar", pays: "Senegal" } },
    { _id: O("64f000000000000000000302"), acheteur_id: O("64f000000000000000000202"),
      date_commande: ISODate("2026-02-10T15:10:00Z"),
      articles: [article("64f000000000000000000102", "64f000000000000000000001", "Boucles d'oreilles en bronze", "BRONZE-DORE", 9000, 1)],
      montant_total: NumberInt(9000), statut: "livree",
      adresse_livraison: { rue: "8 avenue Leopold Sedar Senghor", ville: "Thies", pays: "Senegal" } },
    { _id: O("64f000000000000000000303"), acheteur_id: O("64f000000000000000000203"),
      date_commande: ISODate("2026-07-12T09:40:00Z"),
      articles: [
        article("64f000000000000000000104", "64f000000000000000000002", "Panier tresse du marche", "MOYEN-RAFIA", 10000, 2),
        article("64f000000000000000000106", "64f000000000000000000003", "Collier de perles et argent", "COLLIER-ARGENT", 35000, 1)
      ], montant_total: NumberInt(55000), statut: "livree",
      adresse_livraison: { rue: "4 quartier Escale", ville: "Kaolack", pays: "Senegal" } },
    { _id: O("64f000000000000000000304"), acheteur_id: O("64f000000000000000000204"),
      date_commande: ISODate("2026-06-03T13:05:00Z"),
      articles: [article("64f000000000000000000105", "64f000000000000000000003", "Sandales en cuir de Mbour", "42-NOIR", 22000, 2)],
      montant_total: NumberInt(44000), statut: "livree",
      adresse_livraison: { rue: "21 route de Joal", ville: "Mbour", pays: "Senegal" } },
    { _id: O("64f000000000000000000305"), acheteur_id: O("64f000000000000000000205"),
      date_commande: ISODate("2026-09-25T10:25:00Z"),
      articles: [
        article("64f000000000000000000107", "64f000000000000000000004", "Pagne batik indigo", "2M-INDIGO", 16000, 1),
        article("64f000000000000000000108", "64f000000000000000000004", "Boite decorative en bois", "BOITE-UNIQUE", 28000, 1)
      ], montant_total: NumberInt(44000), statut: "livree",
      adresse_livraison: { rue: "6 cite Sonatel", ville: "Dakar", pays: "Senegal" } },
    { _id: O("64f000000000000000000306"), acheteur_id: O("64f000000000000000000203"),
      date_commande: ISODate("2026-10-04T16:45:00Z"),
      articles: [article("64f000000000000000000102", "64f000000000000000000001", "Boucles d'oreilles en bronze", "BRONZE-DORE", 9000, 1)],
      montant_total: NumberInt(9000), statut: "annulee",
      adresse_livraison: { rue: "4 quartier Escale", ville: "Kaolack", pays: "Senegal" } }
  ];

  const avis = [
    { _id: O("64f000000000000000000501"), produit_id: O("64f000000000000000000101"), artisan_id: O("64f000000000000000000001"), acheteur_id: O("64f000000000000000000201"), commande_id: O("64f000000000000000000301"), note: NumberInt(5), commentaire: "Belle finition et tissu de qualite.", date_avis: ISODate("2026-01-18T12:00:00Z"), achat_verifie: true },
    { _id: O("64f000000000000000000502"), produit_id: O("64f000000000000000000102"), artisan_id: O("64f000000000000000000001"), acheteur_id: O("64f000000000000000000202"), commande_id: O("64f000000000000000000302"), note: NumberInt(4), commentaire: "Legeres et conformes a la description.", date_avis: ISODate("2026-02-13T10:00:00Z"), achat_verifie: true },
    { _id: O("64f000000000000000000503"), produit_id: O("64f000000000000000000103"), artisan_id: O("64f000000000000000000002"), acheteur_id: O("64f000000000000000000201"), commande_id: O("64f000000000000000000301"), note: NumberInt(4), commentaire: "Objet solide, livraison soignee.", date_avis: ISODate("2026-01-20T08:30:00Z"), achat_verifie: true },
    { _id: O("64f000000000000000000504"), produit_id: O("64f000000000000000000104"), artisan_id: O("64f000000000000000000002"), acheteur_id: O("64f000000000000000000203"), commande_id: O("64f000000000000000000303"), note: NumberInt(5), commentaire: "Tres beau tressage et bonne capacite.", date_avis: ISODate("2026-07-20T09:00:00Z"), achat_verifie: true },
    { _id: O("64f000000000000000000505"), produit_id: O("64f000000000000000000105"), artisan_id: O("64f000000000000000000003"), acheteur_id: O("64f000000000000000000204"), commande_id: O("64f000000000000000000304"), note: NumberInt(5), commentaire: "Cuir confortable et coutures solides.", date_avis: ISODate("2026-06-10T14:15:00Z"), achat_verifie: true },
    { _id: O("64f000000000000000000506"), produit_id: O("64f000000000000000000107"), artisan_id: O("64f000000000000000000004"), acheteur_id: O("64f000000000000000000205"), commande_id: O("64f000000000000000000305"), note: NumberInt(3), commentaire: "Motif original, tissu un peu leger.", date_avis: ISODate("2026-09-29T11:00:00Z"), achat_verifie: true }
  ];

  const all = [
    ["artisans", artisans], ["produits", produits], ["historique_prix", historique_prix],
    ["acheteurs", acheteurs], ["commandes", commandes], ["avis", avis]
  ];
  check(all.reduce((sum, entry) => sum + entry[1].length, 0) === 32, "il faut 32 documents");
  for (const [name, docs] of all) {
    check(new Set(docs.map((d) => key(d._id))).size === docs.length, "_id duplique dans " + name);
  }

  const artisanById = mapById(artisans);
  const produitById = mapById(produits);
  const acheteurById = mapById(acheteurs);
  const commandeById = mapById(commandes);

  for (const p of produits) {
    check(artisanById.has(key(p.artisan_id)), "artisan manquant pour " + p.titre);
    check(p.variantes.length >= 1 && p.variantes.length <= 50 && N(p.prix) > 0,
      "prix ou variantes invalides pour " + p.titre);
    const codes = p.variantes.map((v) => v.code);
    check(new Set(codes).size === codes.length, "code de variante duplique pour " + p.titre);
    for (const v of p.variantes) check(typeof v.code === "string" && N(v.stock) >= 0, "variante invalide");
  }
  for (const h of historique_prix) {
    check(produitById.has(key(h.produit_id)) && N(h.ancien_prix) > 0 && N(h.nouveau_prix) > 0,
      "entree historique invalide");
  }
  for (const a of acheteurs) {
    for (const favori of a.favoris) check(produitById.has(key(favori)), "favori sans produit");
  }

  const statuts = new Set(["en_attente", "payee", "expediee", "livree", "annulee"]);
  for (const c of commandes) {
    check(acheteurById.has(key(c.acheteur_id)) && statuts.has(c.statut), "acheteur ou statut invalide");
    let total = 0;
    for (const a of c.articles) {
      const p = produitById.get(key(a.produit_id));
      check(Boolean(p), "produit manquant dans une commande");
      check(key(a.artisan_id) === key(p.artisan_id), "artisan_id incoherent dans un article");
      check(a.titre === p.titre && p.variantes.some((v) => v.code === a.code_variante),
        "copie de produit ou variante incoherente");
      check(N(a.prix_unitaire) > 0 && N(a.quantite) > 0, "prix ou quantite invalide");
      total += N(a.prix_unitaire) * N(a.quantite);
    }
    check(total === N(c.montant_total), "montant_total incorrect pour une commande");
  }

  const stats = new Map();
  for (const r of avis) {
    const p = produitById.get(key(r.produit_id));
    const c = commandeById.get(key(r.commande_id));
    check(Boolean(p) && Boolean(c), "produit ou commande manquant pour un avis");
    check(key(r.artisan_id) === key(p.artisan_id) && key(r.acheteur_id) === key(c.acheteur_id),
      "references incoherentes dans un avis");
    check(c.statut !== "annulee" && c.articles.some((a) => key(a.produit_id) === key(r.produit_id)),
      "avis sans achat correspondant valide");
    check(r.achat_verifie === true && N(r.note) >= 1 && N(r.note) <= 5 && Number.isInteger(N(r.note)),
      "achat ou note d'avis invalide");
    const k = key(r.artisan_id);
    const s = stats.get(k) || { somme: 0, nombre: 0 };
    s.somme += N(r.note);
    s.nombre += 1;
    stats.set(k, s);
  }
  for (const a of artisans) {
    const s = stats.get(key(a._id)) || { somme: 0, nombre: 0 };
    check(s.nombre === N(a.nb_avis), "nb_avis incoherent pour " + a.nom);
    check(Math.abs((s.nombre ? s.somme / s.nombre : 0) - N(a.note_globale)) < 1e-10,
      "note_globale incoherente pour " + a.nom);
  }

  // Exemple: la commande precede la hausse de prix et conserve 14 000 FCFA.
  const ancienneLigne = commandes[0].articles.find((a) => key(a.produit_id) === "64f000000000000000000101");
  check(Boolean(ancienneLigne) && N(ancienneLigne.prix_unitaire) === 14000 &&
    commandes[0].date_commande < historique_prix[0].date_changement,
    "exemple de prix historique incoherent");

  // Controle termine avant les ecritures. Les validators de validation.js s'appliquent aux upserts.
  for (const [name, docs] of all) {
    const ops = docs.map((document) => ({
      replaceOne: { filter: { _id: document._id }, replacement: document, upsert: true }
    }));
    const result = db.getCollection(name).bulkWrite(ops, { ordered: true });
    print(name + ": " + result.upsertedCount + " ajoute(s), " + result.modifiedCount + " mis a jour.");
  }
  print("Termine: 32 documents coherents dans 6 collections.");
})();
