document.addEventListener("DOMContentLoaded", function() {
    
    console.log("Script chargé ! Recherche du bouton...");

    var btnPower4 = document.getElementById("btn-power4");

    if (btnPower4) {
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;

        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "" || protocol === "file:") {
            console.log("Power4 (Local) -> Port 8082");
            btnPower4.href = "http://localhost:8082";
        } else {
            console.log("Power4 (Serveur) -> power4.leodupuy.fr");
            btnPower4.href = "https://power4.leodupuy.fr";
        }
    }

    var btnPokemon = document.getElementById("btn-pokemon");

    if (btnPokemon) {
        var hostname = window.location.hostname;
        var protocol = window.location.protocol;

        if (hostname === "localhost" || hostname === "127.0.0.1" || hostname === "" || protocol === "file:") {
            console.log("Pokemon (Local) -> Port 5501");
            btnPokemon.href = "http://127.0.0.1:5501/"; 
        } else {
            console.log("Pokemon (Serveur) -> pokemon-battle.leodupuy.fr");
            btnPokemon.href = "https://pokemon-battle.leodupuy.fr";
        }
    }

    var monBouton = document.getElementById("btn-groupie");

    if (monBouton) {
        console.log("Bouton trouvé ! ✅");

        if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
            monBouton.href = "http://localhost:8081";
            console.log("Lien modifié vers -> http://localhost:8081");
        } else {
            monBouton.href = "https://groupie-tracker.leodupuy.fr";
            console.log("Lien modifié vers -> https://groupie-tracker.leodupuy.fr");
        }
    } else {
        console.error("ERREUR ❌ : Le bouton avec l'ID 'btn-groupie' est introuvable.");
    }

    const canvas = document.getElementById('networkCanvas');
    
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        const particleCount = 60; 
        const connectionDistance = 150; 
        
        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }
        
        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }
            
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(0, 81, 255, 0.7)';
                ctx.fill();
            }
        }
        
        function init() {
            resize();
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let i = 0; i < particles.length; i++) {
                let p = particles[i];
                p.update();
                p.draw();
                
                for (let j = i; j < particles.length; j++) {
                    let p2 = particles[j];
                    let dx = p.x - p2.x;
                    let dy = p.y - p2.y;
                    let distance = Math.sqrt(dx*dx + dy*dy);
                    
                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(0, 81, 255, ${1 - distance/connectionDistance})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }
        
        window.addEventListener('resize', () => {
            resize();
            particles = [];
            init();
        });
        
        init();
        animate();
    }

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

});