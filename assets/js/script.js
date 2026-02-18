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


    const btnContact = document.getElementById('btn-contact');
    const emailPopup = document.getElementById('email-popup');
    const popupClose = document.querySelector('.email-popup-close');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');
    const copyText = document.getElementById('copy-text');

    if (btnContact && emailPopup) {

        btnContact.addEventListener('click', (e) => {
            e.preventDefault();
            emailPopup.classList.add('show');
        });


        if (popupClose) {
            popupClose.addEventListener('click', () => {
                emailPopup.classList.remove('show');
            });
        }


        emailPopup.addEventListener('click', (e) => {
            if (e.target === emailPopup) {
                emailPopup.classList.remove('show');
            }
        });


        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && emailPopup.classList.contains('show')) {
                emailPopup.classList.remove('show');
            }
        });


        if (copyEmailBtn && emailText) {
            copyEmailBtn.addEventListener('click', () => {
                const email = emailText.textContent;
                navigator.clipboard.writeText(email).then(() => {
                    copyText.textContent = '✓ COPIÉ';
                    copyEmailBtn.style.borderColor = '#fff';
                    copyEmailBtn.style.color = '#fff';
                    copyEmailBtn.style.background = '#111';

                    setTimeout(() => {
                        copyText.textContent = 'COPIER L\'EMAIL';
                        copyEmailBtn.style.background = '';
                        copyEmailBtn.style.borderColor = '';
                        copyEmailBtn.style.color = '';
                    }, 2000);
                }).catch(err => {
                    console.error('Erreur lors de la copie:', err);
                });
            });
        }
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
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {

                filterBtns.forEach(b => b.classList.remove('active'));

                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                gridItems.forEach(card => {
                    const category = card.getAttribute('data-category');

                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';

                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

});