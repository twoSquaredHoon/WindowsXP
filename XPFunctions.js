let virtualScroll = 0;
const ieIcon = document.querySelector('.ie-icon');
const bestWorkIcon = document.querySelector('.bestWork-icon');
const contactMeIcon = document.querySelector('.contactMe-icon');

window.addEventListener('wheel', (e) => {
    virtualScroll += e.deltaY;

    // Smaller max value = reaches target faster
    virtualScroll = Math.max(0, Math.min(virtualScroll, 400));

    // Lower threshold since max is now 400
    if (virtualScroll > 150) {
        document.body.classList.add('scrolled');
        ieIcon.classList.add('scrolled');
        bestWorkIcon.classList.add('scrolled');
        contactMeIcon.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
        ieIcon.classList.remove('scrolled');
        bestWorkIcon.classList.remove('scrolled');
        contactMeIcon.classList.remove('scrolled');
    }
});

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12 || 12;

    if (hours < 10) {
        document.getElementById('clock').textContent = `0${hours} : ${minutes}`;
    } else {
        document.getElementById('clock').textContent = `${hours} : ${minutes}`;
    }
    document.getElementById('ampm').textContent = `${ampm}`;
}

updateClock();
setInterval(updateClock, 1000);