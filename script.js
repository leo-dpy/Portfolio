// On attend que la page soit totalement chargée avant de lancer le script
document.addEventListener("DOMContentLoaded", function() {
    
    console.log("Script chargé ! Recherche du bouton...");

    // 1. On récupère le bouton par son ID exact
    var monBouton = document.getElementById("btn-groupie");

    // 2. On vérifie si on l'a trouvé
    if (monBouton) {
        console.log("Bouton trouvé ! ✅");

        // 3. On regarde si on est en Local ou sur Serveur
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            // MODE LOCAL
            monBouton.href = "http://localhost:8081";
            console.log("Lien modifié vers -> http://localhost:8081");
        } else {
            // MODE SERVEUR (Production)
            monBouton.href = "https://groupie-tracker.leodupuy.com";
            console.log("Lien modifié vers -> https://groupie-tracker.leodupuy.com");
        }

    } else {
        console.error("ERREUR ❌ : Le bouton avec l'ID 'btn-groupie' est introuvable.");
    }

});