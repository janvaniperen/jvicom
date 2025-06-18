document.addEventListener('DOMContentLoaded', function() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/sw.js')
                .then(function(registration) {
                    console.log('ServiceWorker registration successful');
                })
                .catch(function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                });
        });
    }
    
    // Theme Toggle
    const themeSwitch = document.querySelector('.theme-switch');
    
    // Set initial state of theme switch
    if (themeSwitch && document.documentElement.getAttribute('data-theme') === 'dark') {
        themeSwitch.setAttribute('aria-checked', 'true');
    }
    
    // Listen for toggle changes
    if (themeSwitch) {
        themeSwitch.addEventListener('click', function(e) {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                this.setAttribute('aria-checked', 'false');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                this.setAttribute('aria-checked', 'true');
            }
        });
    }
    
    // Subscribe overlay functionality
    const subscribeToggle = document.querySelector('.floating-subscribe-toggle');
    const subscribeOverlay = document.getElementById('subscribe-overlay');
    const subscribeBackdrop = document.getElementById('subscribe-backdrop');
    const subscribeClose = document.querySelector('.subscribe-close');
    
    function showSubscribeOverlay() {
        if (subscribeOverlay && subscribeBackdrop) {
            subscribeOverlay.classList.add('visible');
            subscribeBackdrop.classList.add('visible');
            document.body.style.overflow = 'hidden';
            // Focus on email input
            const emailInput = subscribeOverlay.querySelector('.subscribe-input');
            if (emailInput) {
                setTimeout(() => emailInput.focus(), 100);
            }
        }
    }
    
    function hideSubscribeOverlay() {
        if (subscribeOverlay && subscribeBackdrop) {
            subscribeOverlay.classList.remove('visible');
            subscribeBackdrop.classList.remove('visible');
            document.body.style.overflow = '';
        }
    }
    
    // Event listeners for subscribe overlay
    if (subscribeToggle) {
        subscribeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            showSubscribeOverlay();
        });
    }
    
    if (subscribeClose) {
        subscribeClose.addEventListener('click', hideSubscribeOverlay);
    }
    
    if (subscribeBackdrop) {
        subscribeBackdrop.addEventListener('click', hideSubscribeOverlay);
    }
    
    // Simple keyboard event listener for subscription overlay
    document.addEventListener('keydown', function(e) {
        // Handle subscription overlay
        if (e.key === 'Escape' && subscribeOverlay && subscribeOverlay.classList.contains('visible')) {
            hideSubscribeOverlay();
            return;
        }
        
        // Open subscription overlay with 'S' key
        if (e.key.toLowerCase() === 's' && 
            e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' &&
            (!subscribeOverlay || !subscribeOverlay.classList.contains('visible')) && 
            (!document.querySelector('.keyboard-shortcuts') || !document.querySelector('.keyboard-shortcuts').classList.contains('visible'))) {
            e.preventDefault();
            showSubscribeOverlay();
            return;
        }
    });
    
    // Kit form integration
    const subscribeForm = document.querySelector('.subscribe-form');
    if (subscribeForm) {
        subscribeForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('.subscribe-input').value;
            const submitButton = this.querySelector('.subscribe-button');
            
            if (!email) return;
            
            // Show loading state
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            // Kit integration - you'll need to replace with actual Kit endpoint
            const kitFormId = this.getAttribute('data-kit-form');
            
            // Simulate Kit API call (replace with actual Kit integration)
            fetch(`https://api.kit.com/forms/${kitFormId}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email_address: email
                })
            })
            .then(response => response.json())
            .then(data => {
                // Success
                submitButton.textContent = 'Subscribed!';
                setTimeout(() => {
                    hideSubscribeOverlay();
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                    this.reset();
                }, 1500);
            })
            .catch(error => {
                // Error
                console.error('Subscription error:', error);
                submitButton.textContent = 'Try again';
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 2000);
            });
        });
    }
    
    // Add copy buttons to code blocks
    document.querySelectorAll('pre').forEach(function(codeBlock) {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-button';
        copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>`;
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        // Add copy button to code block
        codeBlock.appendChild(copyButton);
        
        // Add click event to copy button
        copyButton.addEventListener('click', function() {
            const code = codeBlock.querySelector('code').innerText;
            
            // Copy to clipboard
            navigator.clipboard.writeText(code).then(function() {
                // Success - change to checkmark
                copyButton.classList.add('copied');
                copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>`;
                
                // Reset after 2 seconds
                setTimeout(function() {
                    copyButton.classList.remove('copied');
                    copyButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>`;
                }, 2000);
            }).catch(function(error) {
                console.error('Could not copy text: ', error);
            });
        });
    });
    
    // Table of Contents - highlight active sections
    if (document.querySelector('.table-of-contents')) {
        const tocLinks = document.querySelectorAll('.table-of-contents a');
        const sections = document.querySelectorAll('article section[id]');
        
        // Intersection Observer for sections
        const observerOptions = {
            rootMargin: '-20% 0px -35% 0px',
            threshold: 0
        };
        
        const observer = new IntersectionObserver(function(entries) {
            // Remove active class from all links
            tocLinks.forEach(link => link.classList.remove('active'));
            
            // Add active class to all visible sections
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeLink = document.querySelector(`.table-of-contents a[href="#${entry.target.id}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
        });
    }
}); 