document.addEventListener('DOMContentLoaded', () => {
    const animatedItems = document.querySelectorAll('.images, .page-title, h2, h3, h4, h5, h6');
    const colorTargets = document.querySelectorAll('h1, h2, h3, h4, h5, h6, .images p');
    const colors = ['#d46f9c', '#4f7ecd', '#7f3c9e', '#1f1f1f'];
    let colorIndex = 0;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    animatedItems.forEach((item, index) => {
        item.classList.add('fade-in');
        item.style.transitionDelay = `${index * 120}ms`;
        revealObserver.observe(item);
    });

    function updateTextColors() {
        const nextColor = colors[colorIndex];
        colorTargets.forEach(element => {
            element.style.color = nextColor;
        });
        colorIndex = (colorIndex + 1) % colors.length;
    }

    updateTextColors();
    setInterval(updateTextColors, 5000);

    function createFloatingHeart(x, y) {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = '❤';
        heart.style.left = `${x - 12}px`;
        heart.style.top = `${y - 12}px`;
        document.body.appendChild(heart);

        setTimeout(() => heart.remove(), 2600);
    }

    document.body.addEventListener('click', (event) => {
        if (event.target.tagName !== 'A' && event.target.closest('video') === null) {
            createFloatingHeart(event.clientX, event.clientY);
        }
    });
});
