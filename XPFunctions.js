let virtualScroll = 0;

window.addEventListener('wheel', (e) => {
    virtualScroll += e.deltaY;
    
    // Smaller max value = reaches target faster
    virtualScroll = Math.max(0, Math.min(virtualScroll, 400));
    
    // Lower threshold since max is now 400
    if (virtualScroll > 150) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
});

function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? '오후' : '오전';
    hours = hours % 12 || 12;
    
    document.getElementById('clock').textContent = `${hours} : ${minutes}`;
    document.getElementById('ampm').textContent = `${ampm}`;
}

updateClock();
setInterval(updateClock, 1000);