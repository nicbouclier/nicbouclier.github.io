document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
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

    function showToast(message) {
        clearTimeout(toastTimeout);
        toast.textContent = message;
        toast.classList.add('show');
        
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    function handleButtonPress(action) {
        navigator.vibrate && navigator.vibrate(15);
        
        const messages = {
            'power': 'Power button pressed',
            'netflix': 'Opening Netflix',
            'prime': 'Opening Prime Video',
            'disney': 'Opening Disney+',
            'peacock': 'Opening Peacock',
            'up': 'Navigate Up',
            'down': 'Navigate Down',
            'left': 'Navigate Left',
            'right': 'Navigate Right',
            'ok': 'OK / Select',
            'back': 'Going Back',
            'home': 'Going Home',
            'vol-up': 'Volume Up',
            'vol-down': 'Volume Down',
            'mute': 'Mute Toggle',
            'ch-up': 'Channel Up',
            'ch-down': 'Channel Down'
        };
        
        showToast(messages[action] || `${action} pressed`);
    }

    document.querySelectorAll('[data-action]').forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            handleButtonPress(button.dataset.action);
        });
    });

    document.querySelectorAll('.content-card').forEach(card => {
        card.addEventListener('click', () => {
            const itemName = card.dataset.item || card.querySelector('span').textContent;
            showToast(`${itemName} selected`);
            navigator.vibrate && navigator.vibrate(10);
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

    document.addEventListener('touchstart', (e) => {
        if (e.target.closest('button') || e.target.closest('.content-card')) {
            e.target.style.transform = 'scale(0.95)';
        }
    });

    document.addEventListener('touchend', (e) => {
        if (e.target.closest('button') || e.target.closest('.content-card')) {
            setTimeout(() => {
                e.target.style.transform = '';
            }, 100);
        }
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