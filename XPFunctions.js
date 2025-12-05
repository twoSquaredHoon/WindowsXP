document.addEventListener("dragstart", e => e.preventDefault());

// Disable dragging but allow clicking & typing
document.addEventListener("mousedown", e => {
    const tag = e.target.tagName.toLowerCase();
    if (tag !== "input" && tag !== "textarea" && tag !== "button") {
        e.preventDefault();
    }
});

window.addEventListener("load", () => {
    const boot = document.getElementById("xp-boot-screen");
    const welcome = document.getElementById("xp-welcome-screen");

    // 1. Boot screen stays for realism
    setTimeout(() => {

        // INSTANT CUT (NO FADE)
        boot.remove();

        // Show welcome screen immediately
        welcome.style.opacity = "1";
        welcome.style.pointerEvents = "auto";

        // 2. After welcome shows, fade OUT to desktop
        setTimeout(() => {
            welcome.style.opacity = "0";

            setTimeout(() => {
                welcome.remove();
            }, 900);

        }, 1600); // duration of welcome screen

    }, 2000); // duration of boot screen
});


let virtualScroll = 0;

window.addEventListener('wheel', (e) => {
    const openTabs = document.querySelectorAll('.tab-container[style*="display: block"]');
    const startMenu = document.getElementById('xp-start-menu');

    // Stop scrolling when tabs OR start menu are open
    if (openTabs.length > 0 || !startMenu.classList.contains('hidden')) {
        return;
    }

    const ieIcon = document.querySelector('.aboutMeApp');
    const bestWorkIcon = document.querySelector('.myBestWorksApp');
    const contactMeIcon = document.querySelector('.contactMeApp');

    virtualScroll += e.deltaY;
    virtualScroll = Math.max(0, Math.min(virtualScroll, 400));

    if (virtualScroll > 150) {
        document.body.classList.add('scrolled');
        ieIcon?.classList.add('scrolled');
        bestWorkIcon?.classList.add('scrolled');
        contactMeIcon?.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
        ieIcon?.classList.remove('scrolled');
        bestWorkIcon?.classList.remove('scrolled');
        contactMeIcon?.classList.remove('scrolled');
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

const containers = document.querySelectorAll('.tab-container');

const MIN_WIDTH = 200;
const MIN_HEIGHT = 150;

let isDragging = false;
let isResizing = false;
let currentHandle = null;
let currentContainer = null;
let startX, startY;
let startLeft, startTop, startWidth, startHeight;
let zIndexCounter = 1000; // Start at 1, will increment with each interaction

// Function to bring container to front
function bringToFront(container) {
    zIndexCounter++;
    container.style.zIndex = zIndexCounter;
}

// Initialize drag and resize for all containers
containers.forEach(container => {
    const tabHeader = container.querySelector('.tab-header');
    const handles = container.querySelectorAll('.resize-handle');
    const closeBtn = container.querySelector('.close-btn');

    // Bring to front when clicking anywhere on the container
    container.addEventListener('mousedown', () => {
        bringToFront(container);
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.style.opacity = '0';
            setTimeout(() => {
                container.style.display = 'none';
            }, 300);
        });
    }

    // Drag functionality
    container.addEventListener('mousedown', (e) => dragStart(e, container));
    container.addEventListener('touchstart', (e) => handleTouchStart(e, container));

    // Resize functionality
    handles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => resizeStart(e, container));
        handle.addEventListener('touchstart', (e) => resizeTouchStart(e, container));
    });
});

// Global mouse/touch listeners
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', dragEnd);
document.addEventListener('touchmove', handleTouchMove);
document.addEventListener('touchend', dragEnd);

function dragStart(e, container) {
    if (e.target.classList.contains('resize-handle')) return;
    
    // Only allow dragging if clicking on the tab-header or tab-title
    const isHeaderClick = e.target.classList.contains('tab-header') || 
                          e.target.classList.contains('tab-title') ||
                          e.target.closest('.tab-header');
    
    if (!isHeaderClick) return;

    isDragging = true;
    currentContainer = container;
    container.classList.add('dragging');

    startX = e.clientX;
    startY = e.clientY;

    const rect = container.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
}

function drag(e) {
    if (isDragging && currentContainer) {
        e.preventDefault();
        currentContainer.style.left = `${startLeft + (e.clientX - startX)}px`;
        currentContainer.style.top = `${startTop + (e.clientY - startY)}px`;
    }

    if (isResizing && currentContainer) {
        e.preventDefault();
        handleResize(e);
    }
}

function dragEnd() {
    isDragging = false;
    isResizing = false;
    currentHandle = null;
    if (currentContainer) {
        currentContainer.classList.remove('dragging');
        currentContainer = null;
    }
}

function handleTouchStart(e, container) {
    if (e.target.classList.contains('resize-handle')) return;
    const touch = e.touches[0];
    dragStart({ clientX: touch.clientX, clientY: touch.clientY, target: e.target }, container);
}

function handleTouchMove(e) {
    if (isDragging || isResizing) {
        const t = e.touches[0];
        drag({ clientX: t.clientX, clientY: t.clientY, preventDefault: () => { } });
    }
}

function resizeStart(e, container) {
    e.stopPropagation();
    isResizing = true;
    currentContainer = container;
    currentHandle = e.target;

    startX = e.clientX;
    startY = e.clientY;

    const rect = container.getBoundingClientRect();
    startLeft = rect.left;
    startTop = rect.top;
    startWidth = rect.width;
    startHeight = rect.height;
}

function resizeTouchStart(e, container) {
    e.stopPropagation();
    const t = e.touches[0];
    resizeStart({ clientX: t.clientX, clientY: t.clientY, target: e.target, stopPropagation: () => { } }, container);
}

function handleResize(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;
    let newLeft = startLeft;
    let newTop = startTop;

    if (currentHandle.classList.contains('se')) {
        newWidth = Math.max(MIN_WIDTH, startWidth + dx);
        newHeight = Math.max(MIN_HEIGHT, startHeight + dy);
    } else if (currentHandle.classList.contains('sw')) {
        newWidth = Math.max(MIN_WIDTH, startWidth - dx);
        newHeight = Math.max(MIN_HEIGHT, startHeight + dy);
        if (newWidth > MIN_WIDTH) newLeft = startLeft + dx;
    } else if (currentHandle.classList.contains('ne')) {
        newWidth = Math.max(MIN_WIDTH, startWidth + dx);
        newHeight = Math.max(MIN_HEIGHT, startHeight - dy);
        if (newHeight > MIN_HEIGHT) newTop = startTop + dy;
    } else if (currentHandle.classList.contains('nw')) {
        newWidth = Math.max(MIN_WIDTH, startWidth - dx);
        newHeight = Math.max(MIN_HEIGHT, startHeight - dy);
        if (newWidth > MIN_WIDTH) newLeft = startLeft + dx;
        if (newHeight > MIN_HEIGHT) newTop = startTop + dy;
    } else if (currentHandle.classList.contains('n')) {
        newHeight = Math.max(MIN_HEIGHT, startHeight - dy);
        if (newHeight > MIN_HEIGHT) newTop = startTop + dy;
    } else if (currentHandle.classList.contains('s')) {
        newHeight = Math.max(MIN_HEIGHT, startHeight + dy);
    } else if (currentHandle.classList.contains('e')) {
        newWidth = Math.max(MIN_WIDTH, startWidth + dx);
    } else if (currentHandle.classList.contains('w')) {
        newWidth = Math.max(MIN_WIDTH, startWidth - dx);
        if (newWidth > MIN_WIDTH) newLeft = startLeft + dx;
    }

    currentContainer.style.width = `${newWidth}px`;
    currentContainer.style.height = `${newHeight}px`;
    currentContainer.style.left = `${newLeft}px`;
    currentContainer.style.top = `${newTop}px`;

    updateSizeDisplay();
}

function updateSizeDisplay() {
    if (currentContainer) {
        const rect = currentContainer.getBoundingClientRect();
        document.getElementById('width').textContent = Math.round(rect.width);
        document.getElementById('height').textContent = Math.round(rect.height);
    }
}

/* ============================
   START MENU FUNCTIONALITY
============================ */

const startBtn = document.querySelector('.startButton');
const startMenu = document.getElementById('xp-start-menu');

startBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    const isOpen = !startMenu.classList.contains('hidden');
    startMenu.classList.toggle('hidden');

    // Disable scroll when start menu is open
    if (!isOpen) {
        document.body.classList.add('no-scroll');
    } else {
        const visibleTabs = document.querySelectorAll('.tab-container[style*="display: block"]');
        if (visibleTabs.length === 0) document.body.classList.remove('no-scroll');
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
        startMenu.classList.add('hidden');

        const visibleTabs = document.querySelectorAll('.tab-container[style*="display: block"]');
        if (visibleTabs.length === 0) document.body.classList.remove('no-scroll');
    }
});


// Open tab functions - updated to bring to front
function openTab(tabClass) {
    const tab = document.querySelector(`.${tabClass}`);
    if (tab) {
        tab.style.display = 'block';
        tab.style.opacity = '0';
        bringToFront(tab);
        setTimeout(() => {
            tab.style.opacity = '1';
        }, 10);
        
        // Disable background scrolling
        document.body.classList.add('no-scroll');
    }
}

containers.forEach(container => {
    const tabHeader = container.querySelector('.tab-header');
    const handles = container.querySelectorAll('.resize-handle');
    const closeBtn = container.querySelector('.close-btn');

    // ... existing code ...

    // Close button - updated to re-enable scrolling if all tabs are closed
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            container.style.opacity = '0';
            setTimeout(() => {
                container.style.display = 'none';
                
                // Re-enable scrolling only if all tabs are closed
                const visibleTabs = document.querySelectorAll('.tab-container[style*="display: block"]');
                if (visibleTabs.length === 0) {
                    document.body.classList.remove('no-scroll');
                }
            }, 300);
        });
    }
});

// Add event listeners after DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Get the SVG elements (the actual clickable icons)
    const aboutMeIcon = document.querySelector('.aboutMeApp');
    const bestWorksIcon = document.querySelector('.myBestWorksApp');
    const contactMeIcon = document.querySelector('.contactMeApp');

    if (aboutMeIcon) aboutMeIcon.addEventListener('click', () => openTab('tab1'));
    if (bestWorksIcon) bestWorksIcon.addEventListener('click', () => openTab('tab2'));
    if (contactMeIcon) contactMeIcon.addEventListener('click', () => openTab('tab3'));

});

updateSizeDisplay();