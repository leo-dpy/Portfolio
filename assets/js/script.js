document.addEventListener("DOMContentLoaded", function () {


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


    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (navToggle) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.checked = false;
            });
        });
    }


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




    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {

            if (e.target.closest('a') || e.target.closest('button')) {
                return;
            }

            const projectBtn = card.querySelector('.btn-project');


            if (projectBtn && projectBtn.hasAttribute('href')) {
                const targetUrl = projectBtn.getAttribute('href');

                window.location.href = targetUrl;
            }
        });
    });



    const filterBtns = document.querySelectorAll('.filter-btn');
    const gridItems = document.querySelectorAll('.projects-grid .project-card');

    if (filterBtns.length) {
        // Initialisation des compteurs
        filterBtns.forEach(btn => {
            const filterValue = btn.getAttribute('data-filter');
            let count = 0;

            if (filterValue === 'featured') {
                count = document.querySelectorAll('.projects-grid .project-card.featured-project').length;
            } else if (filterValue === 'all') {
                count = gridItems.length;
            } else {
                count = document.querySelectorAll(`.projects-grid .project-card[data-category="${filterValue}"]`).length;
            }

            const countSpan = document.createElement('span');
            countSpan.classList.add('project-count');
            countSpan.textContent = count;
            btn.appendChild(countSpan);

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
                        card.offsetHeight; /* Déclenchement du reflow */
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Initialisation de la vue
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

                if (shouldShow) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        }
    }

});