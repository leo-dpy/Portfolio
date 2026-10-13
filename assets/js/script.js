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
        // Ignorer si l'utilisateur tape dans un champ de saisie
        if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

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

    /* ==========================================================================
       ACTIONS COPIE DIRECTE BANDEAU SUPÉRIEUR (SANS POP-UP)
       ========================================================================== */
    const btnTopbarEmail = document.getElementById('btn-topbar-email');
    if (btnTopbarEmail) {
        btnTopbarEmail.addEventListener('click', () => {
            const email = "leo.dupuy@ynov.com";
            navigator.clipboard.writeText(email).catch(() => {});
            const textSpan = document.getElementById('topbar-email-text');
            if (textSpan) {
                const original = textSpan.textContent;
                textSpan.textContent = "COPIÉ !";
                textSpan.style.color = "#38bdf8";
                setTimeout(() => {
                    textSpan.textContent = original;
                    textSpan.style.color = "";
                }, 1500);
            }
        });
    }

    // Gestion de la modale de contact
    const btnOpenContact = document.getElementById('btn-open-contact');
    const dockBtnContact = document.getElementById('dock-btn-contact');
    const btnTopbarOpp = document.getElementById('btn-topbar-opp');
    const modalContact = document.getElementById('contact-modal');
    const btnCloseContact = document.getElementById('btn-close-contact');
    const btnCopyEmailModal = document.getElementById('btn-copy-email-modal');
    const btnCopyPhoneModal = document.getElementById('btn-copy-phone-modal');

    const openContactModal = () => {
        if (modalContact) {
            modalContact.classList.add('active');
        }
    };

    const closeContactModal = () => {
        if (modalContact) {
            modalContact.classList.remove('active');
        }
    };

    if (btnOpenContact) btnOpenContact.addEventListener('click', openContactModal);
    if (dockBtnContact) dockBtnContact.addEventListener('click', openContactModal);
    if (btnTopbarOpp) btnTopbarOpp.addEventListener('click', openContactModal);

    if (btnCloseContact && modalContact) {
        btnCloseContact.addEventListener('click', closeContactModal);
        modalContact.addEventListener('click', (e) => {
            if (e.target === modalContact) closeContactModal();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContact.classList.contains('active')) closeContactModal();
        });
    }

    if (btnCopyEmailModal) {
        btnCopyEmailModal.addEventListener('click', () => {
            const email = "leo.dupuy@ynov.com";
            navigator.clipboard.writeText(email).then(() => {
                const strongTag = btnCopyEmailModal.querySelector('strong');
                const originalText = strongTag.textContent;
                strongTag.textContent = '✓ EMAIL COPIÉ !';
                strongTag.style.color = '#27c93f'; // Vert succès
                setTimeout(() => {
                    strongTag.textContent = originalText;
                    strongTag.style.color = '';
                }, 2000);
            });
        });
    }

    if (btnCopyPhoneModal) {
        btnCopyPhoneModal.addEventListener('click', () => {
            const phone = "07 71 59 90 71";
            navigator.clipboard.writeText(phone).then(() => {
                const strongTag = btnCopyPhoneModal.querySelector('strong');
                const originalText = strongTag.textContent;
                strongTag.textContent = '✓ NUMÉRO COPIÉ !';
                strongTag.style.color = '#27c93f'; // Vert succès
                setTimeout(() => {
                    strongTag.textContent = originalText;
                    strongTag.style.color = '';
                }, 2000);
            });
        });
    }

    // Les onglets de compétences ont été remplacés par des carrousels infinis purs CSS

    // Redirection au clic sur les cartes de projets
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

    // Système de filtrage des projets
    const filterBtns = document.querySelectorAll('.filter-btn');
    const gridItems = document.querySelectorAll('#projets .projects-grid .project-card');
    const toggleProjetsContainer = document.getElementById('projets-btn-container');
    const toggleProjetsBtn = document.getElementById('toggle-projets');

    const projectsGrid = document.querySelector('#projets .projects-grid');

    let currentFilter = 'ynov-b1';
    let isProjetsExpanded = false;

    function applyFilter(filterValue) {
        currentFilter = filterValue;
        isProjetsExpanded = false;
        if (toggleProjetsBtn) toggleProjetsBtn.textContent = 'VOIR PLUS';



        let visibleCount = 0;
        const maxVisible = 6;
        let totalMatched = 0;

        gridItems.forEach(card => {
            const category = card.getAttribute('data-category');
            const isFeatured = card.classList.contains('featured-project');
            let matchesFilter = false;

            if (filterValue === 'featured') {
                if (isFeatured) matchesFilter = true;
            } else if (filterValue === 'all') {
                matchesFilter = true;

            } else {
                if (category === filterValue) matchesFilter = true;
            }

            if (matchesFilter) {
                totalMatched++;
                if (totalMatched <= maxVisible || isProjetsExpanded) {
                    card.style.display = 'flex';
                    card.style.animation = 'none';
                    card.offsetHeight; // Relance l'animation d'apparition
                    card.style.animation = 'fadeIn 0.5s ease';

                } else {
                    card.style.display = 'none';
                }
            } else {
                card.style.display = 'none';
            }
        });

        if (toggleProjetsContainer) {
            if (totalMatched > maxVisible) {
                toggleProjetsContainer.style.display = 'block';
            } else {
                toggleProjetsContainer.style.display = 'none';
            }
        }
    }

    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                applyFilter(btn.getAttribute('data-filter'));
            });
        });

        // Appliquer le filtre actif par défaut au chargement
        const activeBtn = document.querySelector('.filter-btn.active');
        if (activeBtn) {
            applyFilter(activeBtn.getAttribute('data-filter'));
        }
    }

    if (toggleProjetsBtn) {
        toggleProjetsBtn.addEventListener('click', () => {
            isProjetsExpanded = !isProjetsExpanded;
            toggleProjetsBtn.textContent = isProjetsExpanded ? 'VOIR MOINS' : 'VOIR PLUS';

            let totalMatched = 0;
            const maxVisible = 6;

            gridItems.forEach(card => {
                const category = card.getAttribute('data-category');
                const isFeatured = card.classList.contains('featured-project');
                let matchesFilter = false;

                if (currentFilter === 'featured') {
                    if (isFeatured) matchesFilter = true;
                } else if (currentFilter === 'all') {
                    matchesFilter = true;

                } else {
                    if (category === currentFilter) matchesFilter = true;
                }

                if (matchesFilter) {
                    totalMatched++;
                    if (totalMatched > maxVisible) {
                        card.style.display = isProjetsExpanded ? 'flex' : 'none';
                        if (isProjetsExpanded) {
                            card.style.animation = 'none';
                            card.offsetHeight;
                            card.style.animation = 'fadeIn 0.5s ease';

                        }
                    }
                }
            });
        });
    }

    // Gestion du bouton "Voir plus" pour les participations
    const participationsGrid = document.querySelector('#participations .projects-grid');
    const toggleParticipationsBtn = document.getElementById('toggle-participations');
    if (participationsGrid && toggleParticipationsBtn) {
        const participationCards = participationsGrid.querySelectorAll('.project-card');
        if (participationCards.length > 3) {
            for (let i = 3; i < participationCards.length; i++) {
                participationCards[i].style.display = 'none';
            }

            let isExpanded = false;
            toggleParticipationsBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                for (let i = 3; i < participationCards.length; i++) {
                    participationCards[i].style.display = isExpanded ? 'flex' : 'none';
                    if (isExpanded) {
                        participationCards[i].style.animation = 'none';
                        participationCards[i].offsetHeight;
                        participationCards[i].style.animation = 'fadeIn 0.5s ease';

                    }
                }
                toggleParticipationsBtn.textContent = isExpanded ? 'VOIR MOINS' : 'VOIR PLUS';
            });
        } else {
            toggleParticipationsBtn.style.display = 'none';
        }
    }

    // Gestion des onglets de Parcours (Formations / Stages / Autres)
    const expTabBtns = document.querySelectorAll('.exp-tab-btn');
    const expPanels = document.querySelectorAll('.exp-panel');

    if (expTabBtns.length && expPanels.length) {
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
                    if (panel.id === `panel-${targetTab}`) {
                        panel.classList.add('active');
                    } else {
                        panel.classList.remove('active');
                    }
                });
            });
        });
    }

});