document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-pill');
    const tabContents = document.querySelectorAll('.tab-content');
    const subTabButtons = document.querySelectorAll('.sub-tab-btn');
    const subContents = document.querySelectorAll('.sub-content');
    
    // Tab navigation
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            navigator.vibrate && navigator.vibrate(10);
        });
    });
    
    // Sub-tab navigation
    subTabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetSubTab = button.dataset.subtab;
            
            subTabButtons.forEach(btn => btn.classList.remove('active'));
            subContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetSubTab).classList.add('active');
            
            navigator.vibrate && navigator.vibrate(10);
        });
    });

    // Enhanced button press feedback
    function handleButtonPress(action, button) {
        navigator.vibrate && navigator.vibrate(15);
        
        // Enhanced visual feedback
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 150);
    }

    // Remote control buttons
    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            handleButtonPress(button.dataset.action, button);
        });
        
        // Enhanced touch feedback
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            button.classList.add('touch-down');
        }, { passive: false });
        
        button.addEventListener('touchend', (e) => {
            e.preventDefault();
            button.classList.remove('touch-down');
        }, { passive: false });
        
        button.addEventListener('touchcancel', (e) => {
            button.classList.remove('touch-down');
        });
    });

    // Content cards
    document.querySelectorAll('.content-card, .channel-tile, .app-tile').forEach(card => {
        card.addEventListener('click', () => {
            navigator.vibrate && navigator.vibrate(10);
            card.classList.add('selected');
            setTimeout(() => {
                card.classList.remove('selected');
            }, 200);
        });
    });

    // Touchpad swipe gestures (Apple TV style)
    const touchpad = document.getElementById('touchpad');
    if (touchpad) {
        let startX = 0;
        let startY = 0;
        let isSwiping = false;

        touchpad.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            startX = touch.clientX;
            startY = touch.clientY;
            isSwiping = true;
            
            // Visual feedback
            const rect = touchpad.getBoundingClientRect();
            const x = ((touch.clientX - rect.left) / rect.width) * 100;
            const y = ((touch.clientY - rect.top) / rect.height) * 100;
            touchpad.style.setProperty('--touch-x', `${x}%`);
            touchpad.style.setProperty('--touch-y', `${y}%`);
            touchpad.classList.add('swiping');
        }, { passive: false });

        touchpad.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const rect = touchpad.getBoundingClientRect();
            const x = ((touch.clientX - rect.left) / rect.width) * 100;
            const y = ((touch.clientY - rect.top) / rect.height) * 100;
            touchpad.style.setProperty('--touch-x', `${x}%`);
            touchpad.style.setProperty('--touch-y', `${y}%`);
        }, { passive: false });

        touchpad.addEventListener('touchend', (e) => {
            if (!isSwiping) return;
            
            const touch = e.changedTouches[0];
            const deltaX = touch.clientX - startX;
            const deltaY = touch.clientY - startY;
            const threshold = 50;

            // Determine swipe direction
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
                if (deltaX > threshold) {
                    console.log('Swipe Right');
                    navigator.vibrate && navigator.vibrate(10);
                } else if (deltaX < -threshold) {
                    console.log('Swipe Left');
                    navigator.vibrate && navigator.vibrate(10);
                }
            } else {
                if (deltaY > threshold) {
                    console.log('Swipe Down');
                    navigator.vibrate && navigator.vibrate(10);
                } else if (deltaY < -threshold) {
                    console.log('Swipe Up');
                    navigator.vibrate && navigator.vibrate(10);
                }
            }

            touchpad.classList.remove('swiping');
            isSwiping = false;
        });

        // Click on touchpad edge areas
        touchpad.addEventListener('click', (e) => {
            const rect = touchpad.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const edgeThreshold = 60;

            // Skip if clicking the center button
            if (e.target.classList.contains('touchpad-center')) return;

            if (x < edgeThreshold) {
                console.log('Navigate Left');
                navigator.vibrate && navigator.vibrate(10);
            } else if (x > rect.width - edgeThreshold) {
                console.log('Navigate Right');
                navigator.vibrate && navigator.vibrate(10);
            } else if (y < edgeThreshold) {
                console.log('Navigate Up');
                navigator.vibrate && navigator.vibrate(10);
            } else if (y > rect.height - edgeThreshold) {
                console.log('Navigate Down');
                navigator.vibrate && navigator.vibrate(10);
            }
        });
    }

    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => console.log('ServiceWorker registered'))
                .catch(err => console.log('ServiceWorker registration failed:', err));
        });
    }

    // PWA install prompt
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });

    // Prevent double-tap zoom
    const preventZoom = (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    };

    document.addEventListener('touchstart', preventZoom, { passive: false });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = new Date().getTime();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // Viewport height fix for mobile
    const appHeight = () => {
        const doc = document.documentElement;
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', appHeight);
    appHeight();
});