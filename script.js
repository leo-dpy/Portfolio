document.addEventListener("DOMContentLoaded", function() {
    
    var btnPower4 = document.getElementById("btn-power4");

    if (btnPower4) {
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;

        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "" || protocol === "file:") {
            btnPower4.href = "http://localhost:8082";
        } else {
            btnPower4.href = "https://power4.leodupuy.fr";
        }
    }

    var btnPokemon = document.getElementById("btn-pokemon");

    if (btnPokemon) {
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;

        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "" || protocol === "file:") {
            btnPokemon.href = "http://127.0.0.1:5501/"; 
        } else {
            btnPokemon.href = "https://pokemon-battle.leodupuy.fr";
        }
    }

    var monBouton = document.getElementById("btn-groupie");

    if (monBouton) {
        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            monBouton.href = "http://localhost:8081";
        } else {
            monBouton.href = "https://groupie-tracker.leodupuy.fr";
        }
    } else {
        // Bouton absent : rien à faire, on garde la page intacte.
    }

    // Liens projets : sélection locale/production sans modifier le rendu visuel.

    // Ancre douce : garde les sections stables sans changer la mise en page.
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

    // Mobile Menu Logic
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (navToggle) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.checked = false;
            });
        });
    }

    // Scroll spy : active le lien correspondant à la zone visible.
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

    // Email Pop-up Logic
    const btnContact = document.getElementById('btn-contact');
    const emailPopup = document.getElementById('email-popup');
    const popupClose = document.querySelector('.email-popup-close');
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailText = document.getElementById('email-text');
    const copyText = document.getElementById('copy-text');

    if (btnContact && emailPopup) {
        // Ouvrir le pop-up
        btnContact.addEventListener('click', (e) => {
            e.preventDefault();
            emailPopup.classList.add('show');
        });

        // Fermer le pop-up avec le bouton X
        if (popupClose) {
            popupClose.addEventListener('click', () => {
                emailPopup.classList.remove('show');
            });
        }

        // Fermer le pop-up en cliquant en dehors
        emailPopup.addEventListener('click', (e) => {
            if (e.target === emailPopup) {
                emailPopup.classList.remove('show');
            }
        });

        // Fermer le pop-up avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && emailPopup.classList.contains('show')) {
                emailPopup.classList.remove('show');
            }
        });

        // Copier l'email
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

});