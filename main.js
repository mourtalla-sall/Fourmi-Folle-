"use strict";
// ============================================================
//  FOURMI-FOLLE (la fourmi de Langton)
//
//  Les règles :
//   - Case BLANCHE : la fourmi tourne à DROITE, la case devient noire
//   - Case NOIRE   : la fourmi tourne à GAUCHE, la case devient blanche
//   - Puis la fourmi avance d'une case.
// ============================================================
// ---------- 1. Réglages (tu peux les changer !) ----------
const NB_COLONNES = 21;
const NB_LIGNES = 21;
const TAILLE_CASE = 30; // taille d'une case en pixels
const VITESSE = 100; // millisecondes entre 2 pas (plus petit = plus rapide)
// ---------- 2. Récupérer les éléments de la page ----------
const canvas = document.getElementById("grille");
const ctx = canvas.getContext("2d");
const boutonPause = document.getElementById("bouton-pause");
const boutonReset = document.getElementById("bouton-reset");
canvas.width = NB_COLONNES * TAILLE_CASE;
canvas.height = NB_LIGNES * TAILLE_CASE;
// ---------- 3. Les variables du jeu ----------
// La grille : true = case noire, false = case blanche
let grille = [];
// Position de la fourmi (colonne et ligne)
let fourmiX = 0;
let fourmiY = 0;
// Direction : 0 = haut, 1 = droite, 2 = bas, 3 = gauche
let direction = 2;
// Compteur de pas (le nombre vert en haut à gauche)
let compteur = 0;
// Est-ce que le jeu est en pause ?
let enPause = false;
// ---------- 4. Préparer / recommencer une partie ----------
function initialiser() {
    grille = [];
    for (let y = 0; y < NB_LIGNES; y++) {
        const ligne = [];
        for (let x = 0; x < NB_COLONNES; x++) {
            ligne.push(false); // toutes les cases sont blanches au début
        }
        grille.push(ligne);
    }
    // La fourmi commence au milieu
    fourmiX = Math.floor(NB_COLONNES / 2);
    fourmiY = Math.floor(NB_LIGNES / 2);
    direction = 2; // elle regarde vers le bas, comme sur l'image
    compteur = 0;
}
// ---------- 5. Faire avancer la fourmi d'UN pas ----------
function faireUnPas() {
    const caseNoire = grille[fourmiY][fourmiX];
    // a) Tourner
    if (caseNoire) {
        direction = (direction + 3) % 4; // gauche (= -1)
    }
    else {
        direction = (direction + 1) % 4; // droite (+1)
    }
    // b) Changer la couleur de la case (noir <-> blanc)
    grille[fourmiY][fourmiX] = !caseNoire;
    // c) Avancer d'une case selon la direction
    if (direction === 0)
        fourmiY = fourmiY - 1; // haut
    if (direction === 1)
        fourmiX = fourmiX + 1; // droite
    if (direction === 2)
        fourmiY = fourmiY + 1; // bas
    if (direction === 3)
        fourmiX = fourmiX - 1; // gauche
    // d) Si la fourmi sort de la grille, elle réapparaît de l'autre côté
    if (fourmiX < 0)
        fourmiX = NB_COLONNES - 1;
    if (fourmiX >= NB_COLONNES)
        fourmiX = 0;
    if (fourmiY < 0)
        fourmiY = NB_LIGNES - 1;
    if (fourmiY >= NB_LIGNES)
        fourmiY = 0;
    compteur = compteur + 1;
}
// ---------- 6. Dessiner ----------
function dessinerGrille() {
    // Les cases
    for (let y = 0; y < NB_LIGNES; y++) {
        for (let x = 0; x < NB_COLONNES; x++) {
            ctx.fillStyle = grille[y][x] ? "black" : "white";
            ctx.fillRect(x * TAILLE_CASE, y * TAILLE_CASE, TAILLE_CASE, TAILLE_CASE);
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.strokeRect(x * TAILLE_CASE, y * TAILLE_CASE, TAILLE_CASE, TAILLE_CASE);
        }
    }
}
function dessinerFourmi() {
    // Centre de la case de la fourmi
    const centreX = fourmiX * TAILLE_CASE + TAILLE_CASE / 2;
    const centreY = fourmiY * TAILLE_CASE + TAILLE_CASE / 2;
    const r = TAILLE_CASE / 4; // "rayon" du triangle
    ctx.save(); // on sauvegarde l'état du dessin
    ctx.translate(centreX, centreY); // on se place au centre de la fourmi
    ctx.rotate(direction * Math.PI / 2); // on tourne (90° par direction)
    // Triangle rouge qui pointe vers le haut (avant rotation)
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.moveTo(0, -r); // pointe
    ctx.lineTo(r, r); // coin droit
    ctx.lineTo(-r, r); // coin gauche
    ctx.closePath();
    ctx.fill();
    ctx.restore(); // on remet le dessin comme avant
}
function dessinerCompteur() {
    // Petit rectangle vert avec le nombre en rouge
    ctx.fillStyle = "lightgreen";
    ctx.fillRect(0, 0, 80, 36);
    ctx.fillStyle = "red";
    ctx.font = "28px monospace";
    ctx.fillText(String(compteur), 6, 28);
}
function dessiner() {
    dessinerGrille();
    dessinerFourmi();
    dessinerCompteur();
}
// ---------- 7. La boucle du jeu ----------
function boucle() {
    if (!enPause) {
        faireUnPas();
        dessiner();
    }
}
// ---------- 8. Les boutons ----------
boutonPause.addEventListener("click", () => {
    enPause = !enPause;
    boutonPause.textContent = enPause ? "Reprendre" : "Pause";
});
boutonReset.addEventListener("click", () => {
    initialiser();
    dessiner();
});
// ---------- 9. Démarrage ----------
initialiser();
dessiner();
setInterval(boucle, VITESSE); // appelle "boucle" toutes les VITESSE millisecondes
