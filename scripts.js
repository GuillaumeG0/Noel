
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
    import { getDatabase, ref, onValue, update, increment }
      from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

$("document").ready(function() {
    cadeauxBerenice();
    cadeauxAdrien();
});
/*
function cadeauxBereniceCarrousel() {
    for (var i = 0; i < cadeaux.berenice.length; i++) {
        var cadeau = cadeaux.berenice[i];
    if(i === 0) {
        $("#section-berenice2").append(`
        <div class="carousel-item col-10 active">
          <img src="${cadeau.sourceImage}" class="d-block w-100">
        </div>`)
    } else {
        $("#section-berenice2").append(`
        <div class="carousel-item col-10 active">
          <img src="${cadeau.sourceImage}" class="d-block w-100">
        </div>`)
    }
    }
}
*/
function cadeauxBerenice() {
    for (var i = 0; i < cadeaux.berenice.length; i++) {
        var cadeau = cadeaux.berenice[i];
        $("#section-berenice").append(`
        <section class="card" style="max-width: 320px">
            <img src="${cadeau.sourceImage}" class="card-img-top image-max-height">
            <div class="card-body bg-success">
                <h4 class="card-title">${cadeau.titre}</h4>
                <p class="card-text">${cadeau.description}</p>
                <div class="d-flex>
                <a href="${cadeau.lien}" class="btn-solid btn-solid theme-danger">Lien vers le site</a>
                <button id="reservation-${cadeau.id}" class="bouton-reservation btn-solid theme-danger" data-id="${cadeau.id}">Je réserve</button>
           </div>
                </div>
        </section>`)

    }
};
function cadeauxAdrien() {
    for (var i = 0; i < cadeaux.adrien.length; i++) {
        var cadeau = cadeaux.adrien[i];
        $("#section-adrien").append(`
        <section class="card" style="max-width: 320px">
            <img src="${cadeau.sourceImage}" class="card-img-top image-max-height">
            <div class="card-body bg-success">
                <h4 class="card-title">${cadeau.titre}</h4>
                <p class="card-text">${cadeau.description}</p>
                <a href="${cadeau.lien}" class="btn-solid theme-danger">Lien vers le site</a>
                <button id="reservation-${cadeau.id}" class="bouton-reservation btn-solid theme-danger" data-id="${cadeau.id}">Je réserve</button>
            </div>
        </section>`)
    }
};

$("#section-adrien").on("click", ".bouton-reservation", function () {
    var idCadeau = $(this).data("id");
    gererBoutonReservation(idCadeau);
});

function gererBoutonReservation(idCadeau) {
    if (reservations.idCadeau) {
        annuler(idCadeau);
    } else {
        reserver(idCadeau);
    }
}

    // À remplacer par la config copiée depuis la console Firebase
    const app = initializeApp({
      apiKey: "AIzaSyDWg5ANzzzfyKdjIzURKwkdAkBH2TtqGDA",
      databaseURL: "https://cadeauxnoel-e0378-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "cadeauxnoel-e0378"
    });

    const db = getDatabase(app);
   // Identité de la personne (saisie une fois, gardée dans le navigateur)
const moi = localStorage.getItem("moi") || prompt("Ton prénom ?");
localStorage.setItem("moi", moi);

// 1. Écoute en temps réel de toutes les réservations
let reservations = {};
onValue(ref(db, "reservations"), (snap) => {
  reservations = snap.val() ?? {};

});

// 2. Réserver : la transaction évite que deux personnes réservent en même temps
async function reserver(idCadeau) {
  const res = await runTransaction(ref(db, `reservations/${idCadeau}`), (actuel) => {
    if (actuel?.reserve) return;              // déjà pris : on annule
    return { reserve: true, par: moi };
  });
  if (!res.committed) alert("Quelqu'un vient de réserver ce cadeau !");
}

// 3. Annuler : uniquement si c'est toi qui l'as réservé
async function annuler(idCadeau) {
  await runTransaction(ref(db, `reservations/${idCadeau}`), (actuel) => {
    if (actuel?.par !== moi) return;          // pas le tien : on annule
    return null;                              // null = suppression de l'entrée
  });
}

function etat(idCadeau) {
    const r = reservations[idCadeau];
    if (!r?.reserve) return "Disponible";
    return r.par === moi ? "Réservé par toi" : "Déjà réservé";
  }

const cadeaux = {
    "berenice" : [
        {
            "id": 1,
            "titre": "Une peluche Givrali",
            "description": "Une petite peluche givrali ou aquali",
            "sourceImage": "./resources/givrali.jpg",
            "lien": "https://www.amazon.fr/Pok%C3%A9mon-Peluche-Givrali-D%C3%A9tails-Authentiques/dp/B0BKT3PTNK?th=1"
        },
        {
            "id": 2,
            "titre": "Un lego lucario",
            "description": "Le lego du pokémon lucario",
            "sourceImage": "./resources/lucario.jpg",
            "lien": "https://www.amazon.fr/Pok%C3%A9mon-Peluche-Givrali-D%C3%A9tails-Authentiques/dp/B0BKT3PTNK?th=1"
        },
        {
            "id": 3,
            "titre": "Docteur maboul",
            "description": "Le jeu docteur maboul",
            "sourceImage": "./resources/docteur.jpg",
            "lien": "https://www.lagranderecre.fr/jeux-de-societe/grands-classiques/docteur-maboul-nouvelle-version.html"
        },
        {
            "id": 4,
            "titre": "Des BDs Lucky Luke",
            "description": "Elle a déjà \"un cow boy dans le coton\" et \"Billy the kid\". Elle aimerait surout \"Ma Dalton\" ou \"l'escorte\"",
            "sourceImage": "./resources/lucky_luke.png",
            "lien": "https://www.fnac.com/n17495/BD-et-Humour/BD-Classique/Lucky-Luke"
        },
        {
            "id": 5,
            "titre": "Concept",
            "description": "Le jeu de plateau",
            "sourceImage": "./resources/concept.png",
            "lien": "https://shop.asmodee.fr/concept-confr01"
        },
        {
            "id": 6,
            "titre": "Dobble",
            "description": "Le jeu de cartes",
            "sourceImage": "./resources/dobble.png",
            "lien": "https://shop.asmodee.fr/dobble-123-blister-eco-docf04fr"
        },
        {
            "id": 7,
            "titre": "Cartes pokémon",
            "description": "Pour débuter ma collection",
            "sourceImage": "./resources/carte_pokemon.jpg",
            "lien": "https://www.dracaugames.com/collections/jeux-de-carte-pokemon-lots-de-cartes"
        },
        {
            "id": 8,
            "titre": "Des stylos à paillettes",
            "description": "Le jeu de cartes",
            "sourceImage": "./resources/pens.png",
            "lien": "https://www.cultura.com/p-lot-de-12-stylos-roller-effet-paillete-pointe-moyenne-cultura-3700408425241.html"
        },
        {
            "id": 9,
            "titre": "Jenga (petit format)",
            "description": "Le jeu de cartes",
            "sourceImage": "./resources/jenga.png",
            "lien": "https://www.joueclub.fr/jeux-de-societes/pat-patrouille-tour-jenga-0778988461730.html"
        },
        {
            "id": 10,
            "titre": "Un lego bonsai",
            "description": "Mon papa ne pense pas que ce soit une bonne idée car il ca devoir tout monter tout seul",
            "sourceImage": "./resources/bonsai.jpg",
            "lien": "https://www.lego.com/fr-fr/product/japanese-red-maple-bonsai-tree-10348"
        },
        {
            "id": 11,
            "titre": "Des histoires lunii",
            "description": "Des histoires pour la radio lunii (c'est plus simple que papa et maman commandent)",
            "sourceImage": "./resources/lunii.jpg",
            "lien": "https://lunii.com/fr-fr/search?facet-ages=5-6+ans,7-8+ans&facet-languages=Fran%C3%A7ais,Anglais"
        }
    ],
    "adrien" : [
        {
            "id": 12,
            "titre": "Bookinou",
            "description": "Une liseuse pour que papa et maman me racontent des histoires et les chansons",
            "sourceImage": "./resources/bookinou.jpg",
            "lien": "https://www.mybookinou.com/"
        },
        {
            "id": 13,
            "titre": "Des duplos",
            "description": "Le kit avec les dinosaures ou avec la grue",
            "sourceImage": "./resources/duplo.png",
            "lien": "https://www.lego.com/fr-fr/product/3in1-dinosaurs-on-wheels-10451"
        },
        {
            "id": 14,
            "titre": "Des jouets pour jouer dans le sable",
            "description": "Un petit sceau, une pelle, un rateau pour jouer au parc",
            "sourceImage": "./resources/sable.png",
            "lien": "https://www.ikea.com/fr/fr/p/sandig-jouets-chateau-de-sable-7p-multicolore-00577676/"
        }
    ]
}