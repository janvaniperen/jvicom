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
    const themeSwitch = document.getElementById('theme-switch');
    
    // Set initial state of theme switch
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
        themeSwitch.checked = true;
    }
    
    // Listen for toggle changes
    themeSwitch.addEventListener('change', function(e) {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });
    
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