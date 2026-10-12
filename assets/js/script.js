/**
 * LÉO DUPUY - SOC DASHBOARD & CYBERSECURITY PORTFOLIO
 * Architecture : Single-Viewport Dashboard avec routage d'onglets sans scroll global
 */

document.addEventListener("DOMContentLoaded", () => {
    // --- 1. GESTION DES ONGLETS DU DASHBOARD (ROUTAGE ZÉRO-SCROLL) ---
    const navTabs = document.querySelectorAll(".nav-tab");
    const panels = document.querySelectorAll(".dashboard-panel");

    const switchTab = (targetId) => {
        if (!targetId) return;

        // Désactive tous les onglets
        navTabs.forEach(tab => {
            const matches = tab.getAttribute("data-target") === targetId;
            tab.classList.toggle("active", matches);
            tab.setAttribute("aria-selected", matches ? "true" : "false");
        });

        // Affiche le panneau correspondant
        panels.forEach(panel => {
            const isTarget = panel.id === `panel-${targetId}`;
            panel.classList.toggle("active", isTarget);

            if (isTarget) {
                // Réinitialise le scroll interne du panneau pour un affichage propre
                const scrollContainer = panel.querySelector(".panel-scroll-container");
                if (scrollContainer) {
                    scrollContainer.scrollTop = 0;
                }
            }
        });

        // Met à jour le hash de l'URL sans saut d'ancre
        if (history.replaceState) {
            history.replaceState(null, "", `#${targetId}`);
        }
    };

    // Écouteur de clic sur les onglets du bandeau
    navTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            const target = tab.getAttribute("data-target");
            switchTab(target);
        });
    });

    // Boutons de raccourcis internes (ex: "Explorer les compétences" depuis la vue d'ensemble)
    const jumpButtons = document.querySelectorAll("[data-jump]");
    jumpButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-jump");
            switchTab(target);
        });
    });

    // Restauration de l'onglet actif via l'URL (ex: #labs)
    const initialHash = window.location.hash.replace("#", "");
    const validTabs = ["overview", "skills", "labs", "ctf", "parcours"];
    if (initialHash === "projects") {
        switchTab("labs");
    } else if (initialHash && validTabs.includes(initialHash)) {
        switchTab(initialHash);
    }


    // --- 2. TOAST FLOTTANT DE NOTIFICATION ---
    const toast = document.getElementById("toast-notify");
    const toastMsg = document.getElementById("toast-message");
    let toastTimeout = null;

    const showToast = (message) => {
        if (!toast) return;
        if (toastMsg) toastMsg.textContent = message;

        toast.classList.add("visible");
        toast.setAttribute("aria-hidden", "false");

        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove("visible");
            toast.setAttribute("aria-hidden", "true");
        }, 2600);
    };


    // --- 3. COPIE RAPIDE DANS LE PRESSE-PAPIERS (EMAIL / TÉLÉPHONE) ---
    const copyToClipboard = (text, successMsg) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(successMsg);
            }).catch(() => {
                fallbackCopy(text, successMsg);
            });
        } else {
            fallbackCopy(text, successMsg);
        }
    };

    const fallbackCopy = (text, successMsg) => {
        const tempInput = document.createElement("input");
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
            document.execCommand("copy");
            showToast(successMsg);
        } catch (err) {
            showToast(`Valeur : ${text}`);
        }
        document.body.removeChild(tempInput);
    };

    // Bouton rapide email (Bandeau 1)
    const btnQuickEmail = document.getElementById("btn-quick-email");
    if (btnQuickEmail) {
        btnQuickEmail.addEventListener("click", () => {
            copyToClipboard("leo.dupuy@ynov.com", "Email copié : leo.dupuy@ynov.com");
        });
    }

    // Bouton rapide téléphone (Bandeau 1)
    const btnQuickPhone = document.getElementById("btn-quick-phone");
    if (btnQuickPhone) {
        btnQuickPhone.addEventListener("click", () => {
            copyToClipboard("07 71 59 90 71", "Téléphone copié : 07 71 59 90 71");
        });
    }

});