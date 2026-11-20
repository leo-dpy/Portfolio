document.addEventListener("DOMContentLoaded", function () {

    /* ==========================================================================
       SYSTÈME ZÉRO-SCROLL & COMMUTATEUR DE VUES DESKTOP (STYLE GNOME LINUX)
       ========================================================================== */
    const viewsList = ['about', 'skills', 'projets', 'participations', 'certifications', 'exp'];
    // Vues accessibles par lien ou par hash, mais absentes du dock et des raccourcis clavier
    const extraViews = { homelab: 'projets', vps: 'projets' }; // vue -> entrée du dock à mettre en surbrillance
    const isKnownView = (id) => viewsList.includes(id) || Object.prototype.hasOwnProperty.call(extraViews, id);
    const dockLinks = document.querySelectorAll('.nav-links a[data-view]');
    const desktopViews = document.querySelectorAll('.desktop-view');
    let currentViewIndex = 0;

    function switchView(targetViewId, pushToHistory = true) {
        if (!targetViewId) return;

        const cleanId = targetViewId.replace('#', '');
        const targetView = document.getElementById(`view-${cleanId}`);
        const dockId = extraViews[cleanId] || cleanId;
        const targetDockLink = document.querySelector(`.nav-links a[data-view="${dockId}"]`);

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
        if (hash && isKnownView(hash)) {
            switchView(hash, false);
        } else {
            switchView('about', false);
        }
    });

    // Charger la vue demandée par le hash initial ou par défaut 'about'
    const initialHash = window.location.hash.slice(1);
    if (initialHash && isKnownView(initialHash)) {
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

    // Liens internes vers une autre vue (ex. carte Home Lab -> page Home Lab)
    function followViewLink(link) {
        const filterTarget = link.getAttribute('data-filter-target');
        if (filterTarget) {
            const filterBtn = document.querySelector(`.filter-btn[data-filter="${filterTarget}"]`);
            if (filterBtn) filterBtn.click();
        }
        switchView(link.getAttribute('data-view-link'));
    }

    document.querySelectorAll('a[data-view-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            followViewLink(link);
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
            if (projectBtn && projectBtn.hasAttribute('data-view-link')) {
                followViewLink(projectBtn);
            } else if (projectBtn && projectBtn.hasAttribute('href')) {
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

    // Onglets de la page Home Lab
    const labTabBtns = document.querySelectorAll('.lab-tab-btn');
    const labPanels = document.querySelectorAll('.lab-panel');

    labTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-lab-tab');

            labTabBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            labPanels.forEach(panel => {
                panel.classList.toggle('active', panel.id === `lab-panel-${targetTab}`);
            });
        });
    });

    // Participations : défilement latéral (flèches, glisser à la souris, swipe tactile)
    const partTrack = document.getElementById('part-track');
    const partNav = document.querySelector('.part-nav');
    if (partTrack && partNav) {
        const partArrows = partNav.querySelectorAll('.part-arrow[data-dir]');
        const cards = () => partTrack.querySelectorAll('.project-card');

        // Nombre de cartes visibles : 3 (bureau), 2 (tablette), 1 (mobile), comme dans le CSS
        const visibleCount = () => (window.innerWidth > 1024 ? 3 : window.innerWidth > 720 ? 2 : 1);

        function cardStep() {
            const list = cards();
            if (list.length < 2) return partTrack.clientWidth;
            return list[1].offsetLeft - list[0].offsetLeft;
        }

        function updatePart() {
            const total = cards().length;
            const visible = visibleCount();
            partTrack.classList.toggle('has-overflow', total > visible);
            const maxScroll = partTrack.scrollWidth - partTrack.clientWidth;
            partNav.classList.toggle('is-hidden', !(total > visible && maxScroll > 2));
            partArrows[0].disabled = partTrack.scrollLeft <= 2;
            partArrows[1].disabled = partTrack.scrollLeft >= maxScroll - 2;
        }

        partArrows.forEach(btn => {
            btn.addEventListener('click', () => {
                partTrack.scrollBy({ left: cardStep() * parseInt(btn.dataset.dir, 10), behavior: 'smooth' });
            });
        });

        // Glisser-déposer à la souris (le tactile et le trackpad défilent déjà nativement)
        let drag = null;
        partTrack.addEventListener('pointerdown', (e) => {
            if (e.pointerType !== 'mouse' || e.button !== 0) return;
            drag = { x: e.clientX, left: partTrack.scrollLeft };
            partTrack.classList.add('is-dragging');
        });
        window.addEventListener('pointermove', (e) => {
            if (!drag) return;
            partTrack.scrollLeft = drag.left - (e.clientX - drag.x);
        });
        window.addEventListener('pointerup', () => {
            if (!drag) return;
            drag = null;
            partTrack.classList.remove('is-dragging');
            const step = cardStep();
            partTrack.scrollTo({ left: Math.round(partTrack.scrollLeft / step) * step, behavior: 'smooth' });
        });
        partTrack.addEventListener('dragstart', (e) => e.preventDefault());

        partTrack.addEventListener('scroll', updatePart, { passive: true });
        window.addEventListener('resize', updatePart);
        updatePart();
        // Recalcul quand la vue Participations devient visible
        document.querySelectorAll('.nav-links a[data-view="participations"]').forEach(a =>
            a.addEventListener('click', () => setTimeout(updatePart, 350)));
    }

});
