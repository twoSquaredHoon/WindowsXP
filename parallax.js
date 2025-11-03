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