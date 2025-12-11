document.addEventListener("DOMContentLoaded", function() {
    
    console.log("Script chargé ! Recherche du bouton...");

    // --- PROJET 3 : POWER 4 ---
    var btnPower4 = document.getElementById("btn-power4");

    if (btnPower4) {
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;

        // Si on est en local
        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "" || protocol === "file:") {
            
            // ⚠️ ATTENTION : Port 8082 (Le 8081 est déjà pris par Groupie)
            console.log("Power4 (Local) -> Port 8082");
            btnPower4.href = "http://localhost:8082";
            
        } else {
            
            // Si on est en ligne
            console.log("Power4 (Serveur) -> power4.leodupuy.com");
            btnPower4.href = "https://power4.leodupuy.com";
        }
    }

    // --- PROJET 2 : POKEMON BATTLE ---
    var btnPokemon = document.getElementById("btn-pokemon");

    if (btnPokemon) {
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;

        // Détection du mode Local
        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "" || protocol === "file:") {
            
            console.log("Pokemon (Local) -> Port 5501");
            // C'est ici qu'on met l'adresse que tu viens de me donner
            btnPokemon.href = "http://127.0.0.1:5501/"; 
            
        } else {
            
            // Détection du mode Serveur (pour le 20 décembre)
            console.log("Pokemon (Serveur) -> pokemon-battle.leodupuy.com");
            btnPokemon.href = "https://pokemon-battle.leodupuy.com";
        }
    }


    // --- PROJET 1 : GROUPIE TRACKER ---
    var monBouton = document.getElementById("btn-groupie");

    if (monBouton) {
        console.log("Bouton trouvé ! ✅");

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