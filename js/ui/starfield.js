// Starfield анимация фона

/**
 * Инициализирует анимацию звездного фона
 */
function initStarfield() {
    const canvas = document.getElementById('starfield'); 
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d'); 
    let stars = []; 
    const numStars = 350; 
    const starSpeed = 0; // Статичный фон - скорость 0
    const repelRadius = 120; // Радиус отталкивания
    const repelStrength = 3; // Сила отталкивания
    
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    function resizeCanvas() { 
        canvas.width = window.innerWidth; 
        canvas.height = window.innerHeight; 
        stars = []; 
        for (let i = 0; i < numStars; i++) { 
            stars.push(new Star()); 
        } 
    }
    
    class Star { 
        constructor() { 
            this.x = Math.random() * canvas.width; 
            this.y = Math.random() * canvas.height; 
            this.originalX = this.x;
            this.originalY = this.y;
            this.radius = Math.random() * 1.5; 
            this.alpha = Math.random(); 
            this.velocity = { 
                x: (Math.random() - 0.5) * starSpeed, 
                y: (Math.random() - 0.5) * starSpeed 
            }; 
        } 
        
        draw() { 
            ctx.beginPath(); 
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2); 
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; 
            ctx.fill(); 
        } 
        
        update() { 
            // Отталкивание от курсора
            const dx = this.x - mouseX;
            const dy = this.y - mouseY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < repelRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (repelRadius - distance) / repelRadius * repelStrength;
                this.x += Math.cos(angle) * force;
                this.y += Math.sin(angle) * force;
            }
            
            // Плавное возвращение к исходной позиции
            this.x += (this.originalX - this.x) * 0.08;
            this.y += (this.originalY - this.y) * 0.08;
            
            this.alpha += (Math.random() - 0.5) * 0.01; 
            if (this.alpha > 1) this.alpha = 1; 
            if (this.alpha < 0.1) this.alpha = 0.1; 
        } 
    }
    
    function animate() { 
        requestAnimationFrame(animate); 
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        stars.forEach(star => { 
            star.update(); 
            star.draw(); 
        }); 
    }
    
    // Обработка движения мыши
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Обработка касаний для мобильных
    document.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mouseX = e.touches[0].clientX;
            mouseY = e.touches[0].clientY;
        }
    });
    
    resizeCanvas(); 
    animate(); 
    window.addEventListener('resize', resizeCanvas);
}
