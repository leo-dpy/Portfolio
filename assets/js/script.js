document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================================================
       SYSTÈME ZÉRO-SCROLL & COMMUTATEUR DE VUES DESKTOP (STYLE GNOME LINUX)
       ========================================================================== */
    const viewsList = ['about', 'skills', 'projets', 'participations', 'certifications', 'exp'];
    const dockLinks = document.querySelectorAll('.nav-links a[data-view]');
    const desktopViews = document.querySelectorAll('.desktop-view');
    let currentViewIndex = 0;

    function switchView(targetViewId, pushToHistory = true) {
        if (!targetViewId) return;

        const cleanId = targetViewId.replace('#', '');
        const targetView = document.getElementById(`view-${cleanId}`);
        const targetDockLink = document.querySelector(`.nav-links a[data-view="${cleanId}"]`);

        if (!targetView) return;

        // Désactiver toutes les vues et liens du dock
        desktopViews.forEach(v => v.classList.remove('active'));
        dockLinks.forEach(b => b.classList.remove('active'));

        // Activer la vue et le lien du dock cibles
        targetView.classList.add('active');
        if (targetDockLink) {
            targetDockLink.classList.add('active');
        }

        // Remettre le scroll interne de la vue à zéro
        targetView.scrollTop = 0;

        // Mettre à jour l'index courant
        const idx = viewsList.indexOf(cleanId);
        if (idx !== -1) {
            currentViewIndex = idx;
        }

        // Synchroniser le hash dans l'URL sans saut de scroll
        if (pushToHistory) {
            try {
                history.pushState(null, '', `#${cleanId}`);
            } catch (e) {
                location.hash = cleanId;
            }
        }
    }

    // Gestion du clic sur les liens du dock
    dockLinks.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const viewId = this.getAttribute('data-view');
            switchView(viewId);
        });
    });

    // Navigation par l'historique du navigateur (Précédent / Suivant)
    window.addEventListener('popstate', function () {
        const hash = window.location.hash.slice(1);
        if (hash && viewsList.includes(hash)) {
            switchView(hash, false);
        } else {
            switchView('about', false);
        }
    });

    // Charger la vue demandée par le hash initial ou par défaut 'about'
    const initialHash = window.location.hash.slice(1);
    if (initialHash && viewsList.includes(initialHash)) {
        switchView(initialHash, false);
    } else {
        switchView('about', false);
    }

    // Raccourcis clavier style Espaces de travail GNOME (Flèches Gauche/Droite ou Chiffres 1 à 6)
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') {
            const nextIndex = (currentViewIndex + 1) % viewsList.length;
            switchView(viewsList[nextIndex]);
        } else if (e.key === 'ArrowLeft') {
            const prevIndex = (currentViewIndex - 1 + viewsList.length) % viewsList.length;
            switchView(viewsList[prevIndex]);
        } else if (e.key >= '1' && e.key <= '6') {
            const numIndex = parseInt(e.key, 10) - 1;
            if (numIndex >= 0 && numIndex < viewsList.length) {
                switchView(viewsList[numIndex]);
            }
        }
    });

    // Onglets de Compétences
    const skillsTabBtns = document.querySelectorAll('.skills-tab-btn');
    const skillTiles = document.querySelectorAll('.skill-tile');

    skillsTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            skillsTabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            skillTiles.forEach(tile => {
                if (tile.getAttribute('data-category') === targetTab) {
                    tile.style.display = 'flex';
                    tile.style.animation = 'fadeIn 0.25s ease';
                } else {
                    tile.style.display = 'none';
                }
            });
        });
    });

    // Ouverture du projet au clic sur sa carte
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            if (e.target.closest('a') || e.target.closest('button')) {
                return;
            }
            const projectBtn = card.querySelector('.btn-project');
            if (projectBtn && projectBtn.hasAttribute('href')) {
                window.open(projectBtn.getAttribute('href'), '_blank');
            }
        });
    });

    // Filtrage des projets
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectsGrid = document.querySelector('#projets .projects-grid');
    const gridItems = document.querySelectorAll('#projets .projects-grid .project-card');

    function applyFilter(filterValue) {
        projectsGrid.setAttribute('data-active-filter', filterValue);

        gridItems.forEach(card => {
            if (card.getAttribute('data-category') === filterValue) {
                card.style.display = 'flex';
                card.style.animation = 'none';
                card.offsetHeight; // Relance l'animation d'apparition
                card.style.animation = 'fadeIn 0.5s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyFilter(btn.getAttribute('data-filter'));
        });
    });

    const activeFilterBtn = document.querySelector('.filter-btn.active');
    if (activeFilterBtn) {
        applyFilter(activeFilterBtn.getAttribute('data-filter'));
    }

    // Onglets de Parcours (Formations / Stages / Autres)
    const expTabBtns = document.querySelectorAll('.exp-tab-btn');
    const expPanels = document.querySelectorAll('.exp-panel');

    expTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            expTabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            expPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === `panel-${targetTab}`);
            });
        });
    });

});
