document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const subTabButtons = document.querySelectorAll('.sub-tab-btn');
    const subContents = document.querySelectorAll('.sub-content');
    const toast = document.getElementById('toast');
    let toastTimeout;

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


    function handleButtonPress(action, button) {
        navigator.vibrate && navigator.vibrate(15);
        
        // Enhanced visual feedback
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 150);
    }

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

    document.querySelectorAll('.content-card').forEach(card => {
        card.addEventListener('click', () => {
            navigator.vibrate && navigator.vibrate(10);
            // Enhanced visual feedback for content cards
            card.classList.add('selected');
            setTimeout(() => {
                card.classList.remove('selected');
            }, 200);
        });
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => console.log('ServiceWorker registered'))
                .catch(err => console.log('ServiceWorker registration failed:', err));
        });
    }

    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
    });


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

    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Running as PWA');
    }

    const appHeight = () => {
        const doc = document.documentElement;
        doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };
    window.addEventListener('resize', appHeight);
    appHeight();
});