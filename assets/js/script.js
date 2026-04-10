document.addEventListener("DOMContentLoaded", function () {

    // Défilement fluide pour les ancres
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

    // Fermeture du menu mobile lors du clic sur un lien
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navToggle) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.checked = false;
            });
        });
    }

    // Gestion du menu actif au défilement
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

    // Copie de l'adresse email au clic
    const btnCopyEmail = document.getElementById('btn-copy-email');
    if (btnCopyEmail) {
        btnCopyEmail.addEventListener('click', () => {
            const email = "leo.dupuy@ynov.com";
            navigator.clipboard.writeText(email).then(() => {
                const originalText = btnCopyEmail.textContent;
                btnCopyEmail.textContent = '✓ COPIÉ';
                btnCopyEmail.style.borderColor = '#fff';
                btnCopyEmail.style.color = '#fff';
                btnCopyEmail.style.background = 'rgba(255, 255, 255, 0.1)';
                setTimeout(() => {
                    btnCopyEmail.textContent = originalText;
                    btnCopyEmail.style.background = '';
                    btnCopyEmail.style.borderColor = '';
                    btnCopyEmail.style.color = '';
                }, 2000);
            }).catch(err => {
                console.error('Erreur lors de la copie:', err);
            });
        });
    }

    // Gestion des onglets de compétences
    const skillTabs = document.querySelectorAll('.skill-tab');
    const skillContents = document.querySelectorAll('.skills-content');
    if (skillTabs.length && skillContents.length) {
        skillTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                skillTabs.forEach(t => t.classList.remove('active'));
                skillContents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const targetId = tab.getAttribute('data-tab');
                const targetContent = document.getElementById(targetId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }

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
    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            const filterValue = btn.getAttribute('data-filter');

            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                gridItems.forEach(card => {
                    const category = card.getAttribute('data-category');
                    const isFeatured = card.classList.contains('featured-project');
                    let shouldShow = false;

                    if (filterValue === 'featured') {
                        if (isFeatured) shouldShow = true;
                    } else if (filterValue === 'all') {
                        shouldShow = true;
                    } else {
                        if (category === filterValue) shouldShow = true;
                    }

                    if (shouldShow) {
                        card.style.display = 'flex';
                        card.style.animation = 'none';
                        card.offsetHeight; // Relance l'animation d'apparition
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Appliquer le filtre actif par défaut au chargement
        const activeBtn = document.querySelector('.filter-btn.active');
        if (activeBtn) {
            const filterValue = activeBtn.getAttribute('data-filter');
            gridItems.forEach(card => {
                const category = card.getAttribute('data-category');
                const isFeatured = card.classList.contains('featured-project');
                let shouldShow = false;

                if (filterValue === 'featured') {
                    if (isFeatured) shouldShow = true;
                } else if (filterValue === 'all') {
                    shouldShow = true;
                } else {
                    if (category === filterValue) shouldShow = true;
                }

                card.style.display = shouldShow ? 'flex' : 'none';
            });
        }
    }

    // Gestion du bouton "Voir plus" pour les participations
    const participationsGrid = document.querySelector('#participations .projects-grid');
    const toggleParticipationsBtn = document.getElementById('toggle-participations');
    if (participationsGrid && toggleParticipationsBtn) {
        const participationCards = participationsGrid.querySelectorAll('.project-card');
        if (participationCards.length > 2) {
            for (let i = 2; i < participationCards.length; i++) {
                participationCards[i].style.display = 'none';
            }

            let isExpanded = false;
            toggleParticipationsBtn.addEventListener('click', () => {
                isExpanded = !isExpanded;
                for (let i = 2; i < participationCards.length; i++) {
                    participationCards[i].style.display = isExpanded ? 'flex' : 'none';
                    if (isExpanded) {
                        participationCards[i].style.animation = 'none';
                        participationCards[i].offsetHeight;
                        participationCards[i].style.animation = 'fadeIn 0.5s ease forwards';
                    }
                }
                toggleParticipationsBtn.textContent = isExpanded ? 'VOIR MOINS' : 'VOIR PLUS';
            });
        } else {
            toggleParticipationsBtn.style.display = 'none';
        }
    }

});