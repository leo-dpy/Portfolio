document.addEventListener("DOMContentLoaded", function () {

    /* Scroll fluide */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                const headerHeight = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerHeight;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    /* Menu mobile */
    const navToggle = document.getElementById('nav-toggle');

    const navLinks = document.querySelectorAll('.nav-links a');
    if (navToggle) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.checked = false;
            });
        });
    }

    /* Menu actif au scroll */
    const linkSections = Array.from(navLinks).map(link => {

        const hash = link.getAttribute('href');
        if (!hash || !hash.startsWith('#')) return null;
        const id = hash.slice(1);
        const section = document.getElementById(id);
        return section ? { section, link } : null;
    }).filter(Boolean);

    if (linkSections.length) {
        const clearActive = () => linkSections.forEach(({ link }) => link.classList.remove('active'));
        const setActive = (target) => {
            clearActive();
            const match = linkSections.find(({ section }) => section === target);
            if (match) match.link.classList.add('active');
        };

        let ticking = false;
        const updateActive = () => {
            const viewportMid = window.scrollY + window.innerHeight * 0.4;
            const firstTop = linkSections[0].section.getBoundingClientRect().top + window.scrollY;

            if (viewportMid < firstTop - 10) {
                clearActive();
            } else {
                let current = linkSections[0];
                for (const entry of linkSections) {
                    const rect = entry.section.getBoundingClientRect();
                    const top = rect.top + window.scrollY;
                    const bottom = top + rect.height;
                    if (viewportMid >= top && viewportMid < bottom) {
                        current = entry;
                        break;
                    }
                }
                setActive(current.section);
            }
            ticking = false;
        };

        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(updateActive);
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        updateActive();
    }

    // Gestion de la modale de contact
    const btnOpenContact = document.getElementById('btn-open-contact');
    const modalContact = document.getElementById('contact-modal');
    const btnCloseContact = document.getElementById('btn-close-contact');
    const btnCopyEmailModal = document.getElementById('btn-copy-email-modal');

    if (btnOpenContact && modalContact && btnCloseContact) {
        btnOpenContact.addEventListener('click', () => {
            modalContact.classList.add('active');
            document.body.style.overflow = 'hidden'; // Empêche de scroller la page derrière
        });

        const closeModal = () => {
            modalContact.classList.remove('active');
            document.body.style.overflow = '';
        };

        btnCloseContact.addEventListener('click', closeModal);
        modalContact.addEventListener('click', (e) => {
            if (e.target === modalContact) closeModal(); // Clic à côté de la modale
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalContact.classList.contains('active')) closeModal();
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

});